import { createClient } from "@/lib/supabase/server";
import { UploadProofForm } from "@/components/dashboard/upload-proof";

export default async function WinningsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: winnings } = await supabase
        .from('winners')
        .select(`
            *,
            draws ( draw_month )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h2 className="text-3xl font-heading mb-8">Your Winnings</h2>
            
            {(!winnings || winnings.length === 0) ? (
                <div className="card-glass p-8 text-center text-zinc-400">
                    No winnings yet. Keep playing and supporting charities!
                </div>
            ) : (
                <div className="space-y-6">
                    {winnings.map((win) => (
                        <div key={win.id} className="card-glass p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-2xl capitalize text-white">{win.match_type?.replace('_', ' ')}</h3>
                                    <p className="text-zinc-500 mt-1">Draw Month: {win.draws?.draw_month}</p>
                                    <div className="mt-4 flex gap-2">
                                        <span className={`text-xs px-2 py-1 rounded border ${
                                            win.verification_status === 'approved' ? 'bg-green-500/10 text-[#00FF87] border-[#00FF87]/20' : 
                                            win.verification_status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                            Verification: {win.verification_status?.toUpperCase()}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded border ${
                                            win.payment_status === 'paid' ? 'bg-green-500/10 text-[#00FF87] border-[#00FF87]/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                        }`}>
                                            Payment: {win.payment_status?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-4xl font-bold text-[#00FF87]">
                                        £{win.prize_amount?.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            
                            <UploadProofForm winnerId={win.id} existingProof={win.proof_url} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
