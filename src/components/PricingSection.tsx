'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import { CONFIG } from '@/services/config';
import { formatMoney, type Pricing, type PlanInterval } from '@/services/billing.service';

// Used only if the pricing API cannot be reached (same fixed USD prices).
const FALLBACK: Pricing = {
  country: null,
  billedCurrency: 'USD',
  displayCurrency: 'USD',
  approximate: false,
  rateSource: 'fallback',
  plans: [
    { interval: 'monthly', baseAmountUsd: 2.99, localAmount: 2.99, savingsPercent: null },
    { interval: 'yearly', baseAmountUsd: 24.99, localAmount: 24.99, savingsPercent: 30 },
  ],
};

const FREE_FEATURES = [
  'Track products and expiry dates',
  'Expiry reminders and barcode scanning',
  'Recipes, meal planner and storage tips',
  'Zones and categories',
  'A few free AI scans every month',
];

const PREMIUM_FEATURES = [
  'Everything in Free',
  'Unlimited AI product scan: one photo fills in name, expiry date and more',
  'No ads and no daily video',
];

function countryFromLocale(): string | null {
  if (typeof navigator === 'undefined') return null;
  const match = /-([A-Za-z]{2})$/.exec(navigator.language || '');
  return match ? match[1].toUpperCase() : null;
}

export default function PricingSection({ showHeader = true }: { showHeader?: boolean }) {
  const [pricing, setPricing] = useState<Pricing>(FALLBACK);
  const [interval, setInterval] = useState<PlanInterval>('yearly');

  useEffect(() => {
    let cancelled = false;
    const country = countryFromLocale();
    const query = country ? `?country=${encodeURIComponent(country)}` : '';
    fetch(`${CONFIG.API_URL}/pricing${query}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled && json?.data?.plans?.length) setPricing(json.data as Pricing);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const plan = pricing.plans.find((p) => p.interval === interval) ?? pricing.plans[0];

  return (
    <section id="pricing" className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-4xl">
        {showHeader && (
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Pricing</span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Start free. Upgrade when you are ready.
            </h2>
            <p className="mt-4 text-base font-medium text-white/70">
              One simple price, billed in US dollars. Cancel anytime.
            </p>
          </Reveal>
        )}

        <div className="mt-8 flex justify-center">
          <div className="glass-card inline-flex rounded-full p-1">
            {(['monthly', 'yearly'] as PlanInterval[]).map((value) => {
              const p = pricing.plans.find((x) => x.interval === value);
              const active = interval === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setInterval(value)}
                  className={`rounded-full px-5 py-2 text-sm font-extrabold transition ${
                    active ? 'bg-[#1E50A2] text-white shadow-md' : 'text-white/70'
                  }`}
                >
                  {value === 'monthly' ? 'Monthly' : 'Yearly'}
                  {value === 'yearly' && p?.savingsPercent ? (
                    <span className={`ml-2 text-[11px] ${active ? 'text-white/85' : 'text-[#F7A8AE]'}`}>
                      Save {p.savingsPercent}%
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="glass-card h-full rounded-3xl p-7">
              <h3 className="text-lg font-extrabold text-white">Free</h3>
              <p className="mt-1 text-sm font-medium text-white/70">For keeping track of your home.</p>
              <div className="mt-5 text-4xl font-black text-white">
                {formatMoney(0, pricing.billedCurrency)}
              </div>
              <ul className="mt-6 space-y-3">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm font-semibold text-white">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7FB0FF]" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding" className="btn-outline mt-8 w-full">
                Get started free
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-[#2A62BE] via-[#1E50A2] to-[#123270] p-7 text-white shadow-[0_30px_70px_-20px_rgba(30,80,162,0.6)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#F09199]/40 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold">Premium</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold">
                    <Sparkles className="h-3 w-3" /> Popular
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-white/80">Unlock everything.</p>
                <div className="mt-5 flex items-end gap-1.5">
                  <span className="text-4xl font-black">
                    {formatMoney(plan.baseAmountUsd, pricing.billedCurrency)}
                  </span>
                  <span className="pb-1.5 text-sm font-bold text-white/75">
                    / {interval === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
                <p className="mt-1 h-5 text-xs font-bold text-white/75">
                  {pricing.approximate
                    ? `≈ ${formatMoney(plan.localAmount, pricing.displayCurrency)} · billed in USD`
                    : ''}
                </p>
                <ul className="mt-5 space-y-3">
                  {PREMIUM_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm font-semibold">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F7B6BB]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/pay?interval=${interval}`}
                  className="mt-8 flex w-full items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-[#123270] transition hover:-translate-y-0.5 active:scale-95"
                >
                  Go Premium
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
