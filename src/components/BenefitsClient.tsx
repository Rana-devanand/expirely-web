'use client';

import { motion } from 'framer-motion';
import { TrendingDown, DollarSign, Box } from 'lucide-react';

const iconMap: Record<string, any> = {
  TrendingDown,
  DollarSign,
  Box,
};

interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

interface BenefitsClientProps {
  badge: string;
  title: string;
  items: BenefitItem[];
}

export default function BenefitsClient({ badge, title, items }: BenefitsClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-emerald-400 font-bold tracking-widest text-[10px] mb-3 uppercase"
        >
          {badge}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-4xl font-extrabold text-slate-50"
        >
          {title}
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const Icon = iconMap[item.icon] || Box;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -3 }}
              className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-emerald-500/30 hover:shadow-emerald-500/5 transition-all duration-300 group text-center"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-50 mb-3">{item.title}</h3>
              <p className="text-slate-400 text-[13px] leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
