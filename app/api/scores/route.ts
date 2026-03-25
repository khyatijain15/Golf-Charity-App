import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scoreSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = scoreSchema.safeParse(json);
  
  if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { score, played_date } = parsed.data;

  // Manual enforcement of 5-score limit to avoid RLS trigger issues
  const { count, data: existingScores } = await supabase
    .from('golf_scores')
    .select('id, played_date, created_at', { count: 'exact' })
    .eq('user_id', user.id)
    .order('played_date', { ascending: true })
    .order('created_at', { ascending: true });

  if (count && count >= 5 && existingScores) {
     // We need to delete enough scores so that adding 1 new one results in 5 total.
     // So we aim for 4 existing scores.
     // Delete (count - 4) oldest scores.
     const numToDelete = count - 4;
     if (numToDelete > 0) {
       const scoresToDelete = existingScores.slice(0, numToDelete).map(s => s.id);
       const { error: deleteError } = await supabase
        .from('golf_scores')
        .delete()
        .in('id', scoresToDelete);
        
       if (deleteError) {
         console.error("Error cleaning up old scores:", deleteError);
         // Continue anyway, worst case we have 6 scores
       }
     }
  }

  const { error } = await supabase
    .from('golf_scores')
    .insert({
        user_id: user.id,
        score,
        played_date
    });

  if (error) {
      console.error("Error inserting score:", error);
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }
  
  return NextResponse.json({ ok: true });
}

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('golf_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('played_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ scores: data });
}

export async function DELETE(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: "Score ID required" }, { status: 400 });
    }

    const { error } = await supabase
        .from('golf_scores')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}

