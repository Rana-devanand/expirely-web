import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, HeartHandshake, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import footerData from '../../../data/landing/footer.json';

export const metadata: Metadata = {
  title: 'About',
  description: 'Expirely helps households track expiry dates, waste less and save money.',
};

const VALUES = [
  {
    icon: Leaf,
    title: 'Less waste',
    description: 'Food and medicine that goes unused is money and resources lost. We help you use things in time.',
  },
  {
    icon: Sparkles,
    title: 'Simple by design',
    description: 'Adding a product should take seconds. We keep the app clear and quick so you actually use it.',
  },
  {
    icon: ShieldCheck,
    title: 'Respect for your data',
    description: 'Your inventory is yours. You can delete your account and data whenever you want.',
  },
  {
    icon: HeartHandshake,
    title: 'Built with feedback',
    description: 'We listen to the people who use Expirely and shape the app around what helps them most.',
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 pb-8 pt-32 sm:px-6 md:pt-40">
        <div className="mx-auto max-w-4xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">About Expirely</span>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              Helping every home <span className="text-gradient-brand">waste less</span>
            </h1>
            <p className="mt-5 text-base font-medium leading-relaxed text-white/70 sm:text-lg">
              Expirely is an expiry date tracker for groceries, medicines, cosmetics and household items. It
              reminds you before things expire, so you can use them in time and save money.
            </p>
          </Reveal>

          <Reveal className="mt-14">
            <div className="glass-card rounded-3xl p-7 sm:p-10">
              <h2 className="text-2xl font-black text-white">Why we built it</h2>
              <p className="mt-4 text-base font-medium leading-relaxed text-white/70">
                Almost everyone has found something at the back of the fridge or the medicine box that expired
                weeks ago. Remembering every date is hard, and throwing things away is wasteful. Expirely keeps
                track for you: you add a product once, and it tells you when it needs attention.
              </p>
              <p className="mt-4 text-base font-medium leading-relaxed text-white/70">
                It works on your phone and on the web, and you can share one inventory with your family so
                everyone sees the same thing.
              </p>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {VALUES.map((value, i) => {
              const Icon = value.icon;
              return (
                <Reveal key={value.title} delay={(i % 2) * 0.07}>
                  <div className="glass-card h-full rounded-3xl p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.07] text-[#7FB0FF]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-extrabold text-white">{value.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">{value.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-12 text-center">
            <Link href="/contact" className="btn-outline !px-7">
              Get in touch
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </main>

      <Footer data={footerData} />
    </div>
  );
}
