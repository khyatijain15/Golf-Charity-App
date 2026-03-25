import Link from 'next/link';

export default function HowItWorks() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
             <h1 className="text-4xl font-bold text-center mb-12 text-[var(--text-primary)]">How It Works</h1>

             <div className="space-y-8">
                 <section className="card-glass p-8 rounded-xl">
                     <div className="flex-1">
                         <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">1. Subscribe & Select a Charity</h2>
                         <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                            Sign up for a monthly or yearly subscription. During registration or in your dashboard, select the charity you wish to support. A minimum of 10% of your subscription goes directly to your chosen cause.
                         </p>
                     </div>
                 </section>

                 <section className="card-glass p-8 rounded-xl">
                     <div className="flex-1">
                         <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">2. Submit Your Golf Scores (1-45)</h2>
                         <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                            Every time you play a round of golf, submit your Stableford score (1-45 points). We track your last 5 scores. These scores are your entry tickets into our monthly prize draw.
                         </p>
                     </div>
                 </section>

                 <section className="card-glass p-8 rounded-xl">
                     <div className="flex-1">
                         <h2 className="text-2xl font-semibold mb-4 text-[var(--accent)]">3. Monthly Prize Draw</h2>
                         <div className="text-[var(--text-secondary)] leading-relaxed text-lg">
                            At the end of each month, we run a draw. If your scores match the winning numbers, you win!
                            <ul className="mt-4 space-y-3 list-disc pl-5">
                                <li><strong className="text-[var(--text-primary)]">5 Matches:</strong> Jackpot (40% of pool)</li>
                                <li><strong className="text-[var(--text-primary)]">4 Matches:</strong> Share of 35% pool</li>
                                <li><strong className="text-[var(--text-primary)]">3 Matches:</strong> Share of 25% pool</li>
                            </ul>
                         </div>
                     </div>
                 </section>
             </div>

             <div className="text-center mt-16">
                 <Link 
                    href="/signup" 
                    className="btn-cta text-lg inline-block"
                 >
                    Get Started Today
                 </Link>
             </div>
        </div>
    );
}
