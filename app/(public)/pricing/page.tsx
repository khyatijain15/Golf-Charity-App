"use client";

import { PLANS } from '@/lib/stripe/config';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PricingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    const subscribe = async (priceId: string) => {
        setLoading(priceId);
        try {
            const res = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                body: JSON.stringify({ priceId }),
                headers: { 'Content-Type': 'application/json' }
            });

             if(res.status === 401) {
                 router.push('/login?next=/pricing');
                 return;
             }
             
             if (res.ok) {
                 const { url } = await res.json();
                 window.location.href = url;
             } else {
                 const text = await res.text();
                 throw new Error(text || 'Failed to create checkout session');
             }
        } catch(e) {
            console.error(e);
            alert('Something went wrong');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
             <h1 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h1>
             <p className="text-center text-zinc-400 mb-12 text-lg">
                Join our community to play golf, support charities, and win prizes.
             </p>

             <div className="grid md:grid-cols-2 gap-8">
                 {PLANS.map((plan) => (
                     <div key={plan.id} className="card-glass p-8 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-[#00FF87] opacity-60"></div>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2 text-zinc-100">{plan.name}</h3>
                            <div className="text-3xl font-bold text-[#00FF87]">
                                £{((plan.amount || 0) / 100).toFixed(2)}
                                <span className="text-sm font-normal text-zinc-500 ml-1">
                                    /{plan.interval}
                                </span>
                            </div>
                        </div>
                        
                        <ul className="space-y-3 mb-8 flex-1 text-zinc-300">
                            <li className="flex items-center gap-2">
                                <span className="text-[#00FF87]">✓</span> Monthly Prize Draws
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-[#00FF87]">✓</span> Support Your Chosen Charity
                            </li>
                             <li className="flex items-center gap-2">
                                <span className="text-[#00FF87]">✓</span> Track Your Scores
                            </li>
                             <li className="flex items-center gap-2">
                                <span className="text-[#00FF87]">✓</span> Exclusive Community Events
                            </li>
                        </ul>

                         <button 
                            onClick={() => subscribe(plan.id)}
                            disabled={loading === plan.id}
                            className={`w-full py-3 rounded-xl font-semibold transition-all
                                ${loading === plan.id ? 'bg-zinc-700 text-zinc-400' : 'btn-accent text-black'}
                            `}
                         >
                            {loading === plan.id ? 'Processing...' : `Subscribe ${plan.interval === 'year' ? 'Yearly' : 'Monthly'}`}
                         </button>
                         {plan.interval === 'year' && (
                             <p className="text-center text-sm text-[#00CC6A] mt-4 font-medium">Save money with yearly billing!</p>
                         )}
                     </div>
                 ))}
             </div>
        </div>
    );
}
