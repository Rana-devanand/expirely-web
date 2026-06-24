'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Smartphone } from 'lucide-react';

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
}: HeroContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold badge-shine"
        style={{ borderColor: 'rgba(168,85,247,0.30)', color: 'var(--brand-300)' }}>
        <Smartphone className="h-3.5 w-3.5" />
        {badge}
      </div>

      {/* Heading */}
      <h1 className="mb-6 text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-5xl"
        style={{ color: 'var(--color-text)' }}>
        {title} {" "}
        <span className="text-gradient-brand">{highlight}</span>
      </h1>

      {/* Description */}
      <p className="mb-8 max-w-lg text-sm leading-relaxed md:text-base"
        style={{ color: 'var(--color-text-muted)' }}>
        {description}
      </p>

      {/* Buttons */}
      <div className="flex w-full flex-col items-center gap-4 transition-all duration-300 sm:w-auto sm:flex-row sm:items-start">
        <Link
          href="https://play.google.com/store/apps/details?id=com.expirely.mobile"
          className="group flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white transition-all active:scale-95 sm:w-auto"
          style={{ background: 'var(--gradient-brand)', boxShadow: 'var(--shadow-brand)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(168,85,247,0.5)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-brand)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          {primaryButton.text}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <Link
          href="/features"
          className="flex w-full items-center justify-center rounded-full border px-8 py-3.5 text-sm font-bold transition-all active:scale-95 sm:w-auto"
          style={{
            borderColor: 'rgba(168,85,247,0.35)',
            color: 'var(--color-text)',
            background: 'rgba(168,85,247,0.06)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.6)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(168,85,247,0.12)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.35)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(168,85,247,0.06)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          Explore Features
        </Link>
      </div>
    </motion.div>
  );
}
