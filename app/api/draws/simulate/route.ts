import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DrawEngine } from "@/lib/draw-engine";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  // Check admin role
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { drawId } = await req.json();
  
  if (!drawId) return NextResponse.json({ error: "Draw ID required" }, { status: 400 });

  const engine = new DrawEngine(supabase);

  try {
      const result = await engine.runSimulation(drawId);
      return NextResponse.json(result);
  } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return NextResponse.json({ error: message }, { status: 500 });
  }
}

