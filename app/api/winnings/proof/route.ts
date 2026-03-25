import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { winnerId, proofUrl } = await req.json();

  if (!winnerId || !proofUrl) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  const { error } = await supabase
    .from("winners")
    .update({ proof_url: proofUrl, verification_status: 'pending' })
    .eq("id", winnerId)
    .eq("user_id", user.id); // Ensure they only update their own

  if (error) {
    console.error(error);
    return new NextResponse("Database error", { status: 500 });
  }

  return NextResponse.json({ success: true });
}
