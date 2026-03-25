import { SupabaseClient } from "@supabase/supabase-js";
import type { DrawType, MatchType } from "@/lib/types";

export class DrawEngine {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Generates unique random numbers between 1 and 45
   */
  async generateNumbers(count: number = 5): Promise<number[]> {
    const numbers = new Set<number>();
    while (numbers.size < count) {
      // Create better randomness for a draw engine
      // In production, consider a cryptographically secure source or external API
      const num = Math.floor(Math.random() * 45) + 1;
      numbers.add(num);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  }

  /**
   * Fetches eligible users and creates draw entries based on their latest scores
   */
  async prepareDraw(drawId: string) {
    // 1. Fetch active subscribers
    const { data: subscribers, error: subError } = await this.supabase
      .from('profiles')
      .select('id')
      .eq('subscription_status', 'active');
      
    if (subError) throw subError;
    if (!subscribers || subscribers.length === 0) return 0;
    
    // 2. For each subscriber, get their last 5 scores
    let entriesCount = 0;
    
    // In a real production system, this would be a queued job or batch process
    // For simplicity, we iterate (careful with timeout on serverless functions)
    for (const sub of subscribers) {
        const { data: scores } = await this.supabase
            .from('golf_scores')
            .select('score')
            .eq('user_id', sub.id)
            .order('played_date', { ascending: false })
            .limit(5);

        if (scores && scores.length > 0) {
            // Flatten scores to array
            const scoreValues = scores.map(s => s.score);

            // Create entry
            await this.supabase.from('draw_entries').insert({
                draw_id: drawId,
                user_id: sub.id,
                scores_snapshot: scoreValues
            });
            entriesCount++;
        }
    }
    return entriesCount;
  }

  /**
   * Runs the simulation for a draw
   */
  async runSimulation(drawId: string) {
      // 1. Generate Winning Numbers
      const winningNumbers = await this.generateNumbers(5);
      
      // 2. Update Draw with Winning Numbers
      await this.supabase
        .from('draws')
        .update({ 
            winning_numbers: winningNumbers,
            status: 'simulated'
        })
        .eq('id', drawId);

      // 3. Calculate Matches for all entries
      // Fetch all entries for this draw
      const { data: entries } = await this.supabase
        .from('draw_entries')
        .select('*')
        .eq('draw_id', drawId);

      if (!entries) return { winningNumbers, winnerCount: 0 };

      let winnerCount = 0;
      
      for (const entry of entries) {
        if (!entry.scores_snapshot) continue;
        
        const userScores = new Set(entry.scores_snapshot as number[]);
        let matches = 0;
        
        winningNumbers.forEach(num => {
            if (userScores.has(num)) matches++;
        });

        // Update entry with match count regardless
        await this.supabase
            .from('draw_entries')
            .update({ match_count: matches })
            .eq('id', entry.id);

        if (matches >= 3) {
            winnerCount++;
        }
      }
      
      return { winningNumbers, winnerCount };
  }

  /**
   * Finalizes the draw: Calculates prizes and distributes winnings
   */
  async publishResults(drawId: string) {
      // Fetch draw details
      const { data: draw } = await this.supabase
        .from('draws')
        .select('*')
        .eq('id', drawId)
        .single();
        
     if (!draw) throw new Error("Draw not found");

     // Count winners per tier
     // Using raw SQL or separate queries as count is needed
     const { count: count5 } = await this.supabase.from('draw_entries').select('*', { count: 'exact', head: true }).eq('draw_id', drawId).eq('match_count', 5);
     const { count: count4 } = await this.supabase.from('draw_entries').select('*', { count: 'exact', head: true }).eq('draw_id', drawId).eq('match_count', 4);
     const { count: count3 } = await this.supabase.from('draw_entries').select('*', { count: 'exact', head: true }).eq('draw_id', drawId).eq('match_count', 3);

     // Calculate Prize Splits based on pool amounts
     // These pools should have been populated before running draw (e.g. from subscription revenue)
     const prize5 = (count5 && count5 > 0) ? (draw.jackpot_amount / count5) : 0;
     const prize4 = (count4 && count4 > 0) ? (draw.pool_4match / count4) : 0;
     const prize3 = (count3 && count3 > 0) ? (draw.pool_3match / count3) : 0;

     // Create Winner Records
     const { data: winningEntries } = await this.supabase
        .from('draw_entries')
        .select('*')
        .eq('draw_id', drawId)
        .gte('match_count', 3);

     if (winningEntries) {
         for (const entry of winningEntries) {
             let amount = 0;
             let matchType = '';
             
             if (entry.match_count === 5) { amount = prize5; matchType = '5_match'; }
             else if (entry.match_count === 4) { amount = prize4; matchType = '4_match'; }
             else if (entry.match_count === 3) { amount = prize3; matchType = '3_match'; }

             // Upsert winner record
             await this.supabase.from('winners').upsert({
                 draw_id: drawId,
                 user_id: entry.user_id,
                 match_type: matchType,
                 prize_amount: amount,
                 verification_status: 'pending',
                 payment_status: 'pending'
             }, { onConflict: 'draw_id, user_id' });
             
             // Update entry with prize amount
             await this.supabase.from('draw_entries').update({ prize_amount: amount }).eq('id', entry.id);
         }
     }

     // Mark published
     await this.supabase.from('draws').update({ status: 'published' }).eq('id', drawId);
     
     // Handle Rollover if no 5-match winner
     if (!count5 || count5 === 0) {
         await this.supabase.from('draws').update({ jackpot_rolled_over: true }).eq('id', drawId);
     }
     
     return { count5, count4, count3, prize5, prize4, prize3 };
  }
}

export function calculatePrizePools(totalSubscribers: number, planRevenue: number) {
  const prizePoolTotal = totalSubscribers * planRevenue * 0.5;
  return {
    jackpot: prizePoolTotal * 0.4,
    fourMatch: prizePoolTotal * 0.35,
    threeMatch: prizePoolTotal * 0.25,
  };
}

export function runDraw(type: DrawType, allUserScores: number[] = []) {
  if (type === "random") {
    const nums = new Set<number>();
    while (nums.size < 5) nums.add(Math.floor(Math.random() * 45) + 1);
    return Array.from(nums);
  }

  const frequency = new Map<number, number>();
  for (let i = 1; i <= 45; i += 1) frequency.set(i, 0);
  allUserScores.forEach((score) => {
    frequency.set(score, (frequency.get(score) ?? 0) + 1);
  });

  const weighted = Array.from(frequency.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([score]) => score);

  return weighted.slice(0, 5);
}

export function checkMatch(userScores: number[], winningNumbers: number[]): MatchType {
  const matches = userScores.filter((s) => winningNumbers.includes(s)).length;
  if (matches >= 5) return "5_match";
  if (matches >= 4) return "4_match";
  if (matches >= 3) return "3_match";
  return null;
}
