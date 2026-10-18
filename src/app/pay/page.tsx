'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import {
  billingService,
  formatMoney,
  type PlanInterval,
  type Pricing,
  type SubscriptionStatus,
} from '@/services/billing.service';

const FEATURES = [
  'Unlimited AI product scan: one photo fills in name, expiry date and more',
  'No ads and no daily video',
  'Everything in the free plan',
];

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
        searchParams.get('country') ||
        (await billingService.getSavedCountry()) ||
        countryFromLocale();
      const [p, s] = await Promise.all([
        billingService.getPricing(country),
        billingService.getStatus(),
      ]);
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

  return (
    <div className="min-h-screen text-white px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-md px-3 py-1 text-xs font-bold text-white">
            <Sparkles className="h-3.5 w-3.5" /> Expirely Premium
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white">
            Never waste what you buy
          </h1>
          <p className="mt-2 text-sm font-medium text-white/70">
            Unlock everything and stay ahead of every expiry date.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#7FB0FF]" />
          </div>
        )}

        {!loading && needsLogin && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md p-6 text-center shadow-sm">
            <p className="text-sm font-semibold text-white/70">
              Please log in to continue to payment.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block rounded-xl bg-[#1E50A2] px-5 py-3 text-sm font-extrabold text-white"
            >
              Log in
            </Link>
            <p className="mt-3 text-xs text-slate-400">
              After logging in, open this page again.
            </p>
          </div>
        )}

        {!loading && !needsLogin && error && !pricing && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-sm font-semibold text-red-700">
            {error}
            <button
              onClick={() => void load()}
              className="mt-3 block w-full rounded-xl bg-red-600 py-2.5 text-white"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && pricing && status && (
          <>
            {status.isPremium && (
              <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm font-semibold text-white">
                You are on Premium
                {status.interval ? ` (${status.interval})` : ''}.
                {status.currentPeriodEnd && (
                  <>
                    {' '}
                    {status.cancelAtPeriodEnd ? 'Access ends' : 'Renews'} on{' '}
                    {new Date(status.currentPeriodEnd).toLocaleDateString()}.
                  </>
                )}
              </div>
            )}

            <div className="mb-4 grid grid-cols-2 gap-3">
              {([monthly, yearly] as const).map((p) =>
                p ? (
                  <button
                    key={p.interval}
                    type="button"
                    onClick={() => setInterval(p.interval)}
                    className={`relative rounded-2xl border-2 bg-white/[0.06] backdrop-blur-md p-4 text-left transition ${
 interval === p.interval
 ? 'border-[#1E50A2] shadow-[0_8px_24px_rgba(30,80,162,0.2)]'
 : 'border-white/10'
 }`}
                  >
                    {p.savingsPercent ? (
                      <span className="absolute -top-2.5 right-3 rounded-full bg-[#1E50A2] px-2 py-0.5 text-[10px] font-extrabold text-white">
                        Save {p.savingsPercent}%
                      </span>
                    ) : null}
                    <div className="text-xs font-bold uppercase tracking-wide text-white/70">
                      {p.interval === 'yearly' ? 'Yearly' : 'Monthly'}
                    </div>
                    <div className="mt-1 text-2xl font-black text-white">
                      {formatMoney(p.baseAmountUsd, pricing.billedCurrency)}
                    </div>
                    {pricing.approximate && (
                      <div className="text-xs font-semibold text-white/70">
                        ≈ {formatMoney(p.localAmount, pricing.displayCurrency)}
                      </div>
                    )}
                  </button>
                ) : null,
              )}
            </div>

            <ul className="mb-5 space-y-2 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md p-4">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm font-medium text-white/70">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7FB0FF]" />
                  {f}
                </li>
              ))}
            </ul>

            {error && (
              <p className="mb-3 text-center text-sm font-semibold text-red-600">{error}</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={starting || status.isPremium}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1E50A2] py-4 text-base font-extrabold text-white shadow-lg shadow-[#1E50A2]/25 disabled:opacity-60"
            >
              {starting ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              {status.isPremium
                ? 'Already subscribed'
                : `Continue to secure payment${plan ? ` · ${formatMoney(plan.baseAmountUsd, pricing.billedCurrency)}` : ''}`}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-white/70">
              <ShieldCheck className="h-3.5 w-3.5" />
              Billed in USD. {pricing.approximate ? 'The local price shown is approximate. ' : ''}
              Cancel anytime.
            </p>

            <details className="mt-8 rounded-xl border border-dashed border-white/10 p-3 text-xs text-white/70">
              <summary className="cursor-pointer font-bold">Debug info (for testing)</summary>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify({ pricing, status }, null, 2)}
              </pre>
            </details>
          </>
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
