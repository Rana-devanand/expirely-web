'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Ban,
  BellRing,
  Camera,
  Check,
  FileDown,
  Languages,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  Wand2,
} from 'lucide-react';
import {
  billingService,
  formatMoney,
  type PlanInterval,
  type Pricing,
  type SubscriptionStatus,
} from '@/services/billing.service';

// What the customer gets. Only things the app really does.
const BENEFITS = [
  {
    icon: Camera,
    title: 'Unlimited AI product scan',
    text: 'One photo fills in the name, brand, category, size, price and more.',
  },
  {
    icon: Wand2,
    title: 'Estimated expiry dates',
    text: 'Only a manufacturing date on the pack? AI suggests the expiry and you confirm it.',
  },
  {
    icon: Sparkles,
    title: 'Ingredients and allergens',
    text: 'Read straight from the label, so you know what is in every product.',
  },
  {
    icon: Languages,
    title: 'English, Arabic and Hindi labels',
    text: 'Scan packs from anywhere. The AI reads all three.',
  },
  {
    icon: FileDown,
    title: 'PDF reports',
    text: 'Download your whole inventory, one category, or a single product.',
  },
  {
    icon: Ban,
    title: 'No ads, no daily add limit',
    text: 'Add as many items as you like without interruptions.',
  },
];

const STEPS = ['Choose your plan', 'Pay securely', 'Premium turns on'];

// Guess a country from the browser language (e.g. "ar-SA" -> "SA").
function countryFromLocale(): string | null {
  if (typeof navigator === 'undefined') return null;
  const match = /-([A-Za-z]{2})$/.exec(navigator.language || '');
  return match ? match[1].toUpperCase() : null;
}

function PayComponent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [interval, setInterval] = useState<PlanInterval>(
    searchParams.get('interval') === 'monthly' ? 'monthly' : 'yearly',
  );
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setNeedsLogin(true);
      setLoading(false);
      return;
    }
    try {
      const country =
        searchParams.get('country') || (await billingService.getSavedCountry()) || countryFromLocale();
      const [p, s] = await Promise.all([billingService.getPricing(country), billingService.getStatus()]);
      setPricing(p);
      setStatus(s);
    } catch (err: any) {
      if (err?.status === 401) {
        localStorage.removeItem('accessToken');
        setNeedsLogin(true);
      } else {
        setError(err?.message || 'Could not load pricing. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCheckout = async () => {
    setStarting(true);
    setError(null);
    try {
      const url = await billingService.startCheckout(interval);
      window.location.href = url;
    } catch (err: any) {
      setError(err?.message || 'Could not start checkout. Please try again.');
      setStarting(false);
    }
  };

  const plan = pricing?.plans.find((p) => p.interval === interval);
  const yearly = pricing?.plans.find((p) => p.interval === 'yearly');
  const monthly = pricing?.plans.find((p) => p.interval === 'monthly');
  const currency = pricing?.billedCurrency ?? 'USD';
  const perMonthOnYearly = yearly ? yearly.baseAmountUsd / 12 : null;

  return (
    <div className="min-h-screen px-4 pb-16 pt-6 text-white sm:px-6">
      {/* Top bar */}
      <header className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative h-8 w-8 overflow-hidden rounded-lg">
            <Image src="/logo1.png" alt="Expirely" fill className="object-cover" priority />
          </span>
          <span className="text-base font-extrabold tracking-tight">Expirely</span>
        </Link>
        <span className="flex items-center gap-1.5 text-xs font-bold text-white/60">
          <Lock className="h-3.5 w-3.5 text-emerald-300" /> Secure checkout
        </span>
      </header>

      {/* Steps */}
      <ol className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-2 text-[11px] font-bold sm:gap-4 sm:text-xs">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${
                i === 0 ? 'bg-emerald-400 text-black' : 'bg-white/10 text-white/60'
              }`}
            >
              {i + 1}
            </span>
            <span className={i === 0 ? 'text-white' : 'text-white/50'}>{label}</span>
            {i < STEPS.length - 1 && <span className="hidden h-px w-6 bg-white/15 sm:block" />}
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-10 max-w-5xl">
        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-[#7FB0FF]" />
          </div>
        )}

        {!loading && needsLogin && (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-8 text-center">
            <h1 className="text-2xl font-black tracking-tight">Sign in to continue</h1>
            <p className="mt-2 text-sm font-medium text-white/70">
              Log in to your Expirely account so we can add Premium to it.
            </p>
            <Link href="/login" className="btn-primary mt-6 w-full !rounded-lg !py-3.5 !text-sm">
              Log in
            </Link>
            <p className="mt-3 text-xs font-medium text-white/50">After logging in, open this page again.</p>
          </div>
        )}

        {!loading && !needsLogin && error && !pricing && (
          <div className="mx-auto max-w-md rounded-2xl border border-rose-400/30 bg-rose-400/10 p-6 text-center">
            <p className="text-sm font-semibold text-rose-200">{error}</p>
            <button
              onClick={() => void load()}
              className="mt-4 w-full rounded-lg bg-rose-500 py-2.5 text-sm font-extrabold text-white"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && pricing && status && (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            {/* Left: what you get */}
            <section>
              <span className="eyebrow">
                <Sparkles className="h-3.5 w-3.5" /> Expirely Premium
              </span>
              <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                Add products from <span className="text-gradient-brand">a single photo</span>
              </h1>
              <p className="mt-4 max-w-xl text-base font-medium text-white/70">
                Everything you use today stays free. Premium removes the limits on the AI scan and adds PDF reports.
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {BENEFITS.map((b) => (
                  <li key={b.title} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
                      <b.icon className="h-4 w-4" />
                    </span>
                    <p className="mt-3 text-sm font-extrabold text-white">{b.title}</p>
                    <p className="mt-1 text-[13px] font-medium leading-relaxed text-white/65">{b.text}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-white/55">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Payments by Dodo Payments</span>
                <span className="flex items-center gap-1.5"><BellRing className="h-4 w-4 text-emerald-300" /> Cancel any time</span>
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-300" /> We never see your card</span>
              </div>
            </section>

            {/* Right: checkout card */}
            <aside className="lg:sticky lg:top-6">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.10] to-white/[0.04]">
                <div className="bg-emerald-400/15 px-6 py-3 text-center text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                  7-day free trial for first-time subscribers
                </div>

                <div className="p-6">
                  {status.isPremium && (
                    <div className="mb-5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3.5 text-sm font-semibold text-emerald-100">
                      You are on Premium{status.interval ? ` (${status.interval})` : ''}.
                      {status.currentPeriodEnd && (
                        <>
                          {' '}
                          {status.cancelAtPeriodEnd ? 'Access ends' : 'Renews'} on{' '}
                          {new Date(status.currentPeriodEnd).toLocaleDateString()}.
                        </>
                      )}
                    </div>
                  )}

                  {/* Plan switch */}
                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-black/30 p-1">
                    {([monthly, yearly] as const).map((p) =>
                      p ? (
                        <button
                          key={p.interval}
                          type="button"
                          onClick={() => setInterval(p.interval)}
                          className={`rounded-md px-3 py-2.5 text-sm font-extrabold transition ${
                            interval === p.interval ? 'bg-white text-slate-900' : 'text-white/65 hover:text-white'
                          }`}
                        >
                          {p.interval === 'yearly' ? 'Yearly' : 'Monthly'}
                          {p.interval === 'yearly' && p.savingsPercent ? (
                            <span className={`ml-1.5 text-[10px] ${interval === 'yearly' ? 'text-emerald-600' : 'text-emerald-300'}`}>
                              Save {p.savingsPercent}%
                            </span>
                          ) : null}
                        </button>
                      ) : null,
                    )}
                  </div>

                  {/* Price */}
                  {plan && (
                    <div className="mt-6">
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-black tracking-tight">{formatMoney(plan.baseAmountUsd, currency)}</span>
                        <span className="pb-2 text-sm font-bold text-white/60">/ {interval === 'yearly' ? 'year' : 'month'}</span>
                      </div>
                      {interval === 'yearly' && perMonthOnYearly !== null && (
                        <p className="mt-1 text-sm font-semibold text-emerald-300">
                          Just {formatMoney(Math.round(perMonthOnYearly * 100) / 100, currency)} a month
                        </p>
                      )}
                      {pricing.approximate && (
                        <p className="mt-1 text-xs font-semibold text-white/55">
                          ≈ {formatMoney(plan.localAmount, pricing.displayCurrency)} · billed in {currency}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Summary */}
                  <dl className="mt-6 space-y-2.5 border-t border-white/10 pt-5 text-sm">
                    <div className="flex justify-between">
                      <dt className="font-medium text-white/60">Plan</dt>
                      <dd className="font-bold">Premium {interval === 'yearly' ? 'Yearly' : 'Monthly'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-white/60">Free trial</dt>
                      <dd className="font-bold">7 days, first-time subscribers</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-white/60">Renews</dt>
                      <dd className="font-bold">Every {interval === 'yearly' ? 'year' : 'month'}</dd>
                    </div>
                  </dl>

                  {error && <p className="mt-4 text-center text-sm font-semibold text-rose-300">{error}</p>}

                  <button
                    onClick={handleCheckout}
                    disabled={starting || status.isPremium}
                    className="btn-primary mt-6 w-full !rounded-lg !py-4 !text-base disabled:opacity-60"
                  >
                    {starting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
                    {status.isPremium ? 'Already subscribed' : 'Continue to secure payment'}
                  </button>

                  <p className="mt-4 text-center text-xs font-medium leading-relaxed text-white/55">
                    You will not be charged until any free trial ends, and the checkout shows the exact date before you pay.
                    Billed in {currency}.{pricing.approximate ? ' The local price shown is approximate.' : ''} Cancel any time
                    from your account.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-center text-xs font-medium text-white/45">
                By continuing you agree to our{' '}
                <Link href="/terms-conditions" className="underline hover:text-white/70">Terms</Link>,{' '}
                <Link href="/privacy-policy" className="underline hover:text-white/70">Privacy Policy</Link> and{' '}
                <Link href="/cancellation-policy" className="underline hover:text-white/70">Cancellation and Refund Policy</Link>.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#7FB0FF]" />
        </div>
      }
    >
      <PayComponent />
    </Suspense>
  );
}
