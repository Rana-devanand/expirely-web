'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface Step { number: string; title: string; description: string; }
interface HowItWorksClientProps { badge: string; title: string; steps: Step[]; }

export default function HowItWorksClient({ badge, title, steps }: HowItWorksClientProps) {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95, y: 15 }} whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }}
            className="glass-card glass-card-hover relative z-10 flex flex-col items-center rounded-2xl p-6 text-center"
          >
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full text-sm font-black border"
              style={{
                borderColor: 'rgba(168,85,247,0.3)',
                background: 'rgba(168,85,247,0.12)',
                color: 'var(--brand-400)',
                boxShadow: '0 4px 14px rgba(168,85,247,0.2)',
              }}>
              {step.number}
            </div>
            <h3 className="mb-3 text-base font-bold" style={{ color: 'var(--color-text)' }}>
              {step.title}
            </h3>
            <p className="max-w-[200px] text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {step.description}
            </p>
            {index < steps.length - 1 && (
              <div className="absolute top-[44%] -right-3.5 z-20 hidden lg:block" style={{ color: 'rgba(168,85,247,0.4)' }}>
                <ChevronRight className="h-5 w-5" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
