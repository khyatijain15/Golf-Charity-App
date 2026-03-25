import { createClient } from "@/lib/supabase/server";
import DrawManager from "@/components/admin/draw-runner";

export default async function AdminDrawsPage() {
  const supabase = await createClient();
  const { data: draws } = await supabase
    .from('draws')
    .select('*')
    .order('draw_month', { ascending: false });

  // Ensure current month draw exists for simplicity
  if (!draws || draws.length === 0 || draws[0].draw_month !== new Date().toISOString().substring(0, 7) + '-01') {
    // Usually this is handled by a cron, but we mock it simply in the UI for ease of use
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Draw Management</h1>
        <form action={async () => {
          "use server";
          const sup = await createClient();
          const p = new Date();
          p.setDate(1);
          await sup.from('draws').insert({ draw_month: p.toISOString().split('T')[0] });
        }}>
          <button type="submit" className="btn-accent px-4 py-2 text-sm">Create New Draw</button>
        </form>
      </div>

      <div className="space-y-6">
        {draws?.map(draw => (
          <div key={draw.id} className="card-glass p-6">
            <div className="flex justify-between items-start mb-6 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Draw: {new Date(draw.draw_month).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <p className="text-sm text-zinc-400">Winning Numbers: {draw.winning_numbers?.length ? draw.winning_numbers.join(', ') : 'Not Drawn'}</p>
                <div className="flex gap-4 mt-3 text-sm text-zinc-300">
                  <span>Jackpot: £{draw.jackpot_amount || 0}</span>
                  <span>4-Match: £{draw.pool_4match || 0}</span>
                  <span>3-Match: £{draw.pool_3match || 0}</span>
                </div>
              </div>
            </div>
            <DrawManager drawId={draw.id} currentStatus={draw.status} />
          </div>
        ))}
      </div>
    </main>
  );
}
