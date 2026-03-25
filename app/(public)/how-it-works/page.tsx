import Link from 'next/link';

export default function HowItWorks() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
             <h1 className="text-4xl font-bold text-center mb-12">How It Works</h1>

             <div className="space-y-12">
                 <section className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                     <div className="flex-1">
                         <h2 className="text-2xl font-semibold mb-4 text-green-700">1. Subscribe & Select a Charity</h2>
                         <p className="text-gray-600 leading-relaxed">
                            Sign up for a monthly or yearly subscription. During registration or in your dashboard, select the charity you wish to support. A minimum of 10% of your subscription goes directly to your chosen cause.
                         </p>
                     </div>
                 </section>

                 <section className="flex flex-col md:flex-row-reverse gap-8 items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                     <div className="flex-1">
                         <h2 className="text-2xl font-semibold mb-4 text-green-700">2. Submit Your Golf Scores (1-45)</h2>
                         <p className="text-gray-600 leading-relaxed">
                            Every time you play a round of golf, submit your Stableford score (1-45 points). We track your last 5 scores. These scores are your entry tickets into our monthly prize draw.
                         </p>
                     </div>
                 </section>

                 <section className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                     <div className="flex-1">
                         <h2 className="text-2xl font-semibold mb-4 text-green-700">3. Monthly Prize Draw</h2>
                         <div className="text-gray-600 leading-relaxed">
                            At the end of each month, we run a draw. If your scores match the winning numbers, you win!
                            <ul className="mt-4 space-y-2 list-disc pl-5">
                                <li><strong>5 Matches:</strong> Jackpot (40% of pool)</li>
                                <li><strong>4 Matches:</strong> Share of 35% pool</li>
                                <li><strong>3 Matches:</strong> Share of 25% pool</li>
                            </ul>
                         </div>
                     </div>
                 </section>
             </div>

             <div className="text-center mt-16">
                 <Link 
                    href="/signup" 
                    className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    Get Started Today
                 </Link>
             </div>
        </div>
    );
}
