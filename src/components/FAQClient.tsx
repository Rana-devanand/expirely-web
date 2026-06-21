'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem { question: string; answer: string; }
interface FAQClientProps { title: string; questions: FAQItem[]; }

export default function FAQClient({ title, questions }: FAQClientProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-black tracking-tight md:text-5xl"
          style={{ color: 'var(--color-text)' }}
        >
          {title}
        </motion.h2>
      </div>

      <div className="space-y-4">
        {questions.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: index * 0.04 }}
              className="overflow-hidden rounded-2xl border transition-all duration-300"
              style={isOpen
                ? { borderColor: 'rgba(168,85,247,0.5)', background: 'rgba(168,85,247,0.08)', boxShadow: '0 8px 24px rgba(168,85,247,0.12)' }
                : { borderColor: 'rgba(168,85,247,0.15)', background: 'rgba(255,255,255,0.03)' }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group flex w-full cursor-pointer items-center justify-between p-6 text-left transition-colors"
              >
                <span className="text-sm font-bold transition-colors"
                  style={{ color: isOpen ? 'var(--brand-300)' : 'var(--color-text)' }}>
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  style={{ color: isOpen ? 'var(--brand-400)' : 'var(--color-text-subtle)' }}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="border-t px-6 pt-4 pb-6 text-[13px] leading-relaxed"
                      style={{ borderColor: 'rgba(168,85,247,0.15)', color: 'var(--color-text-muted)' }}>
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
