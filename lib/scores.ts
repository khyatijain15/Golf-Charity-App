import { createClient } from "@/lib/supabase/client";

export async function addScore(userId: string, score: number, date: string) {
  const supabase = createClient();
  const { data: scores } = await supabase
    .from("golf_scores")
    .select("id")
    .eq("user_id", userId)
    .order("played_date", { ascending: true });

  if (scores && scores.length >= 5) {
    await supabase.from("golf_scores").delete().eq("id", scores[0].id);
  }

  return supabase
    .from("golf_scores")
    .insert({ user_id: userId, score, played_date: date });
}
