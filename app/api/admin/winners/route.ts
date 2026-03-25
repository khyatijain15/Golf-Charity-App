import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  // Admin Check
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) return new NextResponse("Forbidden", { status: 403 });

  const { winnerId, verification_status, payment_status } = await req.json();

  if (!winnerId) return new NextResponse("Missing winnerId", { status: 400 });

  const updates: any = {};
  if (verification_status) updates.verification_status = verification_status;
  if (payment_status) updates.payment_status = payment_status;

  const { error } = await supabase
    .from("winners")
    .update(updates)
    .eq("id", winnerId);

  if (error) {
    console.error(error);
    return new NextResponse("Database error", { status: 500 });
  }

  return NextResponse.json({ success: true });
}
