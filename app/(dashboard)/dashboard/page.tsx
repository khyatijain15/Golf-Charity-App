import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ScoreEntryForm from '@/components/dashboard/score-entry';
import CharityWidget from '@/components/dashboard/charity-widget';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  let scores = [];
  let charities: any[] = [];

  if (user) {
    const { data: p } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = p;

    const { data: s } = await supabase
      .from('golf_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('played_date', { ascending: false })
      .limit(5);
    scores = s || [];

    const { data: c } = await supabase
      .from('charities')
      .select('id, name')
      .eq('is_active', true)
      .order('name');
    charities = c || [];
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Hello, {profile?.full_name || 'Golfer'}</h1>
        <span className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-zinc-400 border border-zinc-700">
          {(profile?.role || 'subscriber').toUpperCase()}
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Subscription Status Card */}
        <section className="card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-heading mb-4 text-accent">Subscription</h2>
            <div className="space-y-2 text-zinc-300">
              <p>Status: <span className={profile?.subscription_status === 'active' ? 'text-green-400' : 'text-zinc-400'}>{profile?.subscription_status || 'Inactive'}</span></p>
              <p>Plan: {profile?.subscription_plan ? profile.subscription_plan.toUpperCase() : 'None'}</p>
              {profile?.subscription_renewal_date && (
                <p className="text-sm text-zinc-500">Renews: {new Date(profile.subscription_renewal_date).toLocaleDateString()}</p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <Link href="/pricing" className="btn-accent text-sm block text-center w-full md:w-auto">
              {profile?.subscription_status === 'active' ? 'Manage Plan' : 'Upgrade Now'}
            </Link>
          </div>
        </section>

        {/* Charity Selection Widget */}
        <CharityWidget 
          currentPercentage={profile?.charity_percentage || 10} 
          currentCharityId={profile?.selected_charity_id} 
          charities={charities} 
        />

        {/* Winnings Card */}
        <section className="card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-heading mb-4 text-accent">Subscription</h2>
            <div className="space-y-2 text-zinc-300">
              <p>Status: <span className={profile?.subscription_status === 'active' ? 'text-green-400' : 'text-zinc-400'}>{profile?.subscription_status || 'Inactive'}</span></p>
              <p>Plan: {profile?.subscription_plan ? profile.subscription_plan.toUpperCase() : 'None'}</p>
              {profile?.subscription_renewal_date && (
                <p className="text-sm text-zinc-500">Renews: {new Date(profile.subscription_renewal_date).toLocaleDateString()}</p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <Link href="/pricing" className="btn-accent text-sm block text-center w-full md:w-auto">
              {profile?.subscription_status === 'active' ? 'Manage Plan' : 'Upgrade Now'}
            </Link>
          </div>
        </section>

        {/* Winnings Card */}
        <section className="card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-heading mb-4 text-accent">Winnings</h2>
            <div className="text-4xl font-bold text-white mb-2">
              ${(0).toFixed(2)}
            </div>
            <p className="text-zinc-400 text-sm">Total earnings to date</p>
          </div>
          <div className="mt-6">
            <Link href="/dashboard/draws" className="text-accent hover:text-white transition-colors text-sm flex items-center gap-2">
              View Draw History →
            </Link>
          </div>
        </section>
      </div>

      {/* Score Entry Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <section className="card p-6">
          <h2 className="text-xl font-heading mb-4">Submit Score</h2>
          <ScoreEntryForm />
        </section>

        {/* Recent Scores List */}
        <section className="card p-6">
          <h2 className="text-xl font-heading mb-4">Recent Scores</h2>
          {scores.length > 0 ? (
            <div className="space-y-3">
              {scores.map((score: { id: string; played_date: string; score: number }) => (
                <div key={score.id} className="flex justify-between items-center p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                  <span className="text-zinc-300">{new Date(score.played_date).toLocaleDateString()}</span>
                  <span className="font-bold text-white text-lg">{score.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-zinc-500 text-center py-8">
              No scores recorded yet.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
