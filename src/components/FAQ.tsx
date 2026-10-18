'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Reveal from './Reveal';

interface FAQProps {
  data: {
    faq: {
      badge?: string;
      title: string;
      questions: { question: string; answer: string }[];
    };
  };
}

export default function FAQ({ data }: FAQProps) {
  const { faq } = data;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <span className="eyebrow">{faq.badge ?? 'FAQ'}</span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {faq.title}
          </h2>
        </Reveal>

        <div className="mt-10 space-y-3">
          {faq.questions.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.question} delay={i * 0.04}>
                <div className="glass-card rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[15px] font-extrabold text-white">{item.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#7FB0FF] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-5 text-sm font-medium leading-relaxed text-white/70">
                      {item.answer}
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
