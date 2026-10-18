'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Smartphone } from 'lucide-react';

interface HeroProps {
  data: {
    hero: {
      badge: string;
      title: string;
      highlight: string;
      description: string;
      buttons: {
        primary: { text: string; link: string };
        secondary: { text: string; link: string };
      };
      image: string;
    };
  };
}

// Centered hero. Content fades in once; nothing floats or loops. No phone mockup.
export default function Hero({ data }: HeroProps) {
  const { hero } = data;

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 md:pb-20 md:pt-44">
      {/* Static soft glow behind the content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(ellipse at center, rgba(42,98,190,0.35) 0%, rgba(0,0,0,0) 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <span className="eyebrow">
          <Smartphone className="h-3.5 w-3.5" />
          {hero.badge}
        </span>

        <h1 className="mt-7 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-7xl">
          {hero.title} <span className="text-gradient-brand">{hero.highlight}</span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-base font-medium leading-relaxed text-white/70 sm:text-lg md:text-xl">
          {hero.description}
        </p>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link href={hero.buttons.primary.link} className="btn-primary w-full !px-8 !py-4 sm:w-auto">
            {hero.buttons.primary.text}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a href={hero.buttons.secondary.link} className="btn-outline w-full !px-8 !py-4 sm:w-auto">
            {hero.buttons.secondary.text}
          </a>
        </div>

        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] font-bold text-white/65">
          {['Free to start', 'Barcode scanning', 'Smart reminders'].map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#7FB0FF]" />
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
