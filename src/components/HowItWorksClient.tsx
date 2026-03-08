'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface Step {
  number: string;
  title: string;
  description: string;
}

interface HowItWorksClientProps {
  badge: string;
  title: string;
  steps: Step[];
}

export default function HowItWorksClient({ badge, title, steps }: HowItWorksClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col items-center text-center relative"
          >
            <div className="text-4xl font-extrabold text-emerald-500 mb-4 opacity-30">
              {step.number}
            </div>
            <h3 className="text-lg font-bold text-slate-50 mb-3">{step.title}</h3>
            <p className="text-slate-400 text-[13px] leading-relaxed max-w-[180px]">
              {step.description}
            </p>
            
            {/* Arrow for desktop */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-10 -right-3 text-slate-800">
                <ChevronRight className="w-6 h-6" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
