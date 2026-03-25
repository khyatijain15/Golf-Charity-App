import { createClient } from "@/lib/supabase/server";
import { AdminWinnerControls } from "@/components/admin/winner-controls";

export default async function AdminWinnersPage() {
  const supabase = await createClient();
  const { data: winners } = await supabase
    .from('winners')
    .select(`
      *,
      profiles ( full_name, email ),
      draws ( draw_month )
    `)
    .order('created_at', { ascending: false });

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-white">Winner Verification</h1>
      
      <div className="card bg-zinc-900 border-zinc-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/50 text-zinc-400">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Draw</th>
              <th className="px-6 py-4">Prize</th>
              <th className="px-6 py-4">Proof</th>
              <th className="px-6 py-4">Verification</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {(!winners || winners.length === 0) && (
              <tr><td colSpan={7} className="p-8 text-center text-zinc-500">No winners found.</td></tr>
            )}
            {winners?.map((w) => (
              <tr key={w.id} className="text-zinc-300">
                <td className="px-6 py-4">
                  <div className="font-semibold text-white">{w.profiles?.full_name || 'Unknown'}</div>
                  <div className="text-xs text-zinc-500">{w.profiles?.email}</div>
                </td>
                <td className="px-6 py-4 text-sm">{w.draws?.draw_month} <br/><span className="text-zinc-500 text-xs">{w.match_type.replace('_',' ')}</span></td>
                <td className="px-6 py-4 font-bold text-[#00FF87]">£{w.prize_amount}</td>
                <td className="px-6 py-4 min-w-[200px]">
                  {w.proof_url ? (
                    <a href={w.proof_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline break-all text-xs">
                      View Proof
                    </a>
                  ) : <span className="text-zinc-600 text-xs">Pending Upload</span>}
                </td>
                <td className="px-6 py-4 text-xs font-semibold uppercase">
                  {w.verification_status === 'approved' ? <span className="text-green-400">Approved</span> :
                   w.verification_status === 'rejected' ? <span className="text-red-400">Rejected</span> :
                   <span className="text-yellow-400">Pending</span>}
                </td>
                <td className="px-6 py-4 text-xs font-semibold uppercase">
                   {w.payment_status === 'paid' ? <span className="text-green-400">Paid</span> : <span className="text-yellow-400">Pending</span>}
                </td>
                <td className="px-6 py-4">
                  <AdminWinnerControls winnerId={w.id} status={w.verification_status} paymentStatus={w.payment_status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
