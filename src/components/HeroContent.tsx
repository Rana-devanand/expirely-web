'use client';

import { motion } from 'framer-motion';
import { Smartphone, ArrowRight } from 'lucide-react';

interface HeroContentProps {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  primaryButton: { text: string; link: string };
  secondaryButton: { text: string; link: string };
}

export default function HeroContent({
  badge,
  title,
  highlight,
  description,
  primaryButton,
  secondaryButton,
}: HeroContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 text-emerald-400 text-sm font-semibold mb-6 border border-emerald-500/20">
        <Smartphone className="w-4 h-4" />
        {badge}
      </div>

      <h1 className="text-2xl md:text-4xl font-extrabold text-slate-50 leading-[1.2] mb-6">
        {title} <br />
        <span className="text-emerald-400">{highlight}</span>
      </h1>

      <p className="text-base md:text-lg text-slate-400 max-w-lg mb-10 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start transition-all duration-300">
        <button className="w-full sm:w-auto bg-[#10b981] text-white px-7 py-3.5 rounded-xl font-bold text-base hover:bg-[#059669] transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20 hover:-translate-y-1 active:scale-95 group">
          {primaryButton.text}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <button className="w-full sm:w-auto bg-transparent text-slate-300 border-2 border-slate-800 px-7 py-3.5 rounded-xl font-bold text-base hover:bg-slate-800/50 hover:text-slate-50 transition-all flex items-center justify-center shadow-lg hover:-translate-y-1 active:scale-95">
          {secondaryButton.text}
        </button>
      </div>
    </motion.div>
  );
}
