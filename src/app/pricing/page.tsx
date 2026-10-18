import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';
import Reveal from '@/components/Reveal';
import { PREMIUM_ENABLED } from '@/lib/flags';
import footerData from '../../../data/landing/footer.json';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Start free and upgrade to Expirely Premium when you are ready. One simple price, billed in USD.',
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 pb-8 pt-32 sm:px-6 md:pt-40">
        {PREMIUM_ENABLED ? (
          <>
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">
                <Sparkles className="h-3.5 w-3.5" /> Pricing
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                Start free. <span className="text-gradient-brand">Upgrade when you are ready.</span>
              </h1>
              <p className="mt-5 text-base font-medium text-white/70 sm:text-lg">
                One simple price, billed in US dollars. Cancel anytime.
              </p>
            </Reveal>
            <PricingSection showHeader={false} />
          </>
        ) : (
          <Reveal className="mx-auto max-w-xl text-center">
            <div className="glass-card rounded-3xl px-6 py-14">
              <span className="eyebrow">Pricing</span>
              <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Expirely is free to use
              </h1>
              <p className="mt-4 text-base font-medium text-white/70">
                Track your products and get expiry reminders at no cost. Premium plans are coming soon.
              </p>
              <Link href="/onboarding" className="btn-primary mt-8 !px-8 !py-4">
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        )}
      </main>

      <Footer data={footerData} hideCta />
    </div>
  );
}
