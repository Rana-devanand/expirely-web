'use client';

import { motion } from 'framer-motion';
import { Box, DollarSign, TrendingDown } from 'lucide-react';

const iconMap: Record<string, any> = { TrendingDown, DollarSign, Box };

interface BenefitItem { icon: string; title: string; description: string; }
interface BenefitsClientProps { badge: string; title: string; items: BenefitItem[]; }

export default function BenefitsClient({ badge, title, items }: BenefitsClientProps) {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mb-3 text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--brand-400)' }}
        >
          {badge}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="text-3xl font-black tracking-tight md:text-5xl"
          style={{ color: 'var(--color-text)' }}
        >
          {title}
        </motion.h2>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item, index) => {
          const Icon = iconMap[item.icon] || Box;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass-card glass-card-hover group flex flex-col items-center rounded-3xl p-8 text-center"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300"
                style={{ background: 'rgba(168,85,247,0.12)' }}
              >
                <Icon className="h-5 w-5" style={{ color: 'var(--brand-400)' }} />
              </div>
              <h3 className="mb-3 text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
