"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Trophy, Target, ArrowRight, ShieldCheck, Banknote } from "lucide-react";

const steps = [
  { title: "Subscribe & Pick Charity", icon: Heart, desc: "Join our community and choose a charity to receive your direct support." },
  { title: "Enter 5 Stableford Scores", icon: Target, desc: "No handicaps, no fluff. Just log your latest raw scores securely." },
  { title: "Win Monthly Cash Prizes", icon: Trophy, desc: "Get matched with massive rolling jackpots in algorithmic daily draws." },
];

export function HomePage() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-12">
        {/* Abstract Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#00FF87] opacity-[0.05] blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#00CC6A] opacity-[0.05] blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse" />
            <span className="text-zinc-300">Next draw in <strong className="text-white">12 days</strong></span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
             Play Golf.<br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF87] to-teal-400">
               Change Lives.
             </span><br />
             Win Big.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed mb-10"
          >
            A premium digital membership where your on-course performance fuels global charity impact, while unlocking exclusive cash prize pools.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/pricing" className="btn-accent flex items-center gap-2 text-lg">
              Start Your Subscription <ArrowRight size={20} />
            </Link>
            <Link href="/charities" className="px-8 py-3 rounded-xl border border-zinc-700 hover:bg-zinc-900 transition-colors text-lg flex items-center">
              Explore Charities
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats/Proof Section */}
      <section className="border-y border-zinc-800 bg-black/50 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-4xl font-bold text-white mb-1">£2.4M+</div>
            <div className="text-zinc-500 text-sm uppercase tracking-wider">Charity Donated</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">12k</div>
            <div className="text-zinc-500 text-sm uppercase tracking-wider">Active Members</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#00FF87] mb-1">£85k</div>
            <div className="text-zinc-500 text-sm uppercase tracking-wider">Current Jackpot</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">100%</div>
            <div className="text-zinc-500 text-sm uppercase tracking-wider">Verified Draws</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How GolfGives Works</h2>
          <p className="text-zinc-400 text-lg">Zero traditional jargon. Just pure impact and massive rewards.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ title, icon: Icon, desc }, idx) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="card-glass p-8 relative overflow-hidden group"
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-900/50 flex items-center justify-center mb-6 border border-zinc-800">
                 <Icon className="text-[#00FF87]" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{title}</h3>
              <p className="text-zinc-400 leading-relaxed">{desc}</p>
            </motion.article>
          ))}
        </div>
      </section>
      
      {/* Ready to join */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <div className="card-glass p-12 relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF87] opacity-10 rounded-full blur-3xl"></div>
           <h2 className="text-4xl font-bold mb-6 relative z-10">Make Your Next Round Count.</h2>
           <p className="text-xl text-zinc-400 mb-8 relative z-10">Join thousands of players transforming the game into a global force for good.</p>
           <Link href="/pricing" className="btn-accent text-lg inline-flex items-center gap-2 relative z-10">
              Transform Your Game Today
           </Link>
        </div>
      </section>
    </main>
  );
}
