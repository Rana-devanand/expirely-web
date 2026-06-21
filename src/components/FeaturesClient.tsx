'use client';

import { motion } from 'framer-motion';
import { Bell, Clock, History, Package, Scan, Shield } from 'lucide-react';

const iconMap: Record<string, any> = { Clock, Bell, Scan, History, Shield, Package };

interface FeatureItem { icon: string; title: string; description: string; }
interface FeaturesClientProps { badge: string; title: string; description: string; items: FeatureItem[]; }

export default function FeaturesClient({ badge, title, description, items }: FeaturesClientProps) {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Purple glow center */}
      <div className="glow-blob top-1/2 left-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'rgba(168,85,247,0.08)' }} />

      <div className="relative z-10 mb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--brand-400)' }}
        >
          {badge}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 text-3xl font-black tracking-tight md:text-5xl"
          style={{ color: 'var(--color-text)' }}
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl text-sm leading-relaxed md:text-base"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {description}
        </motion.p>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const IconComponent = iconMap[item.icon] || Package;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass-card glass-card-hover group flex flex-col items-start rounded-[22px] p-6 text-left"
            >
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:shadow-[0_0_18px_rgba(168,85,247,0.4)]"
                style={{ background: 'rgba(168,85,247,0.12)' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--gradient-brand)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(168,85,247,0.12)'}
              >
                <IconComponent className="h-5 w-5 transition-colors duration-300"
                  style={{ color: 'var(--brand-400)' }} />
              </div>
              <h3 className="mb-3 text-lg font-bold transition-colors duration-300"
                style={{ color: 'var(--color-text)' }}>
                {item.title}
              </h3>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
