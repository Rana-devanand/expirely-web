'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CalendarClock, Crown, Loader2, Receipt, RotateCcw, Sparkles } from 'lucide-react';
import {
  billingService,
  formatMinor,
  type PaymentRecord,
  type SubscriptionStatus,
} from '@/services/billing.service';

// The signed-in user's plan, what they paid and when. Used inside the user
// dashboard (light) and on the standalone page (dark).
type Tone = 'light' | 'dark';

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

function statusText(s: SubscriptionStatus) {
  if (s.isPremium) return s.cancelAtPeriodEnd ? 'Cancelled, active until the end of the period' : 'Active';
  switch (s.status) {
    case 'past_due':
      return 'Payment issue';
    case 'cancelled':
      return 'Cancelled';
    case 'expired':
      return 'Expired';
    default:
      return 'Free plan';
  }
}

export default function SubscriptionPanel({ tone = 'light' }: { tone?: Tone }) {
  const light = tone === 'light';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [working, setWorking] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const changeRenewal = async (resume: boolean) => {
    setWorking(true);
    setActionError(null);
    setNotice(null);
    try {
      const next = resume ? await billingService.resumeSubscription() : await billingService.cancelSubscription();
      setStatus((cur) => (cur ? { ...cur, ...next } : next));
      setConfirmCancel(false);
      setNotice(
        resume
          ? 'Your subscription will renew as usual.'
          : `Your subscription is cancelled. Premium stays active until ${formatDate(next.currentPeriodEnd)}.`,
      );
    } catch (err: any) {
      setActionError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setWorking(false);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, p] = await Promise.all([billingService.getStatus(), billingService.getPayments()]);
      setStatus(s);
      setPayments(p);
    } catch (err: any) {
      setError(err?.message || 'Could not load your subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Theme classes
  const card = light ? 'bg-white border border-slate-200 shadow-sm' : 'glass-card';
  const title = light ? 'text-slate-900' : 'text-white';
  const muted = light ? 'text-slate-500' : 'text-white/60';
  const divider = light ? 'border-slate-100' : 'border-white/10';
  const label = light ? 'text-slate-400' : 'text-white/55';

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className={`h-8 w-8 animate-spin ${light ? 'text-emerald-500' : 'text-[#7FB0FF]'}`} />
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className={`rounded-2xl p-6 text-center ${card}`}>
        <p className={`text-sm font-semibold ${muted}`}>{error || 'Subscription details are not available right now.'}</p>
        <button
          onClick={() => void load()}
          className="mt-3 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  const paid = payments.filter((p) => p.status === 'succeeded' && p.amountMinor !== null);
  const lastPayment = paid[0];
  const totals = paid.reduce<Record<string, number>>((acc, p) => {
    const c = (p.currency || 'USD').toUpperCase();
    acc[c] = (acc[c] || 0) + (p.amountMinor as number);
    return acc;
  }, {});
  const planLabel = status.interval === 'yearly' ? 'Yearly' : status.interval === 'monthly' ? 'Monthly' : '—';

  const details: { label: string; value: string }[] = [
    { label: 'Plan', value: status.isPremium ? `Premium · ${planLabel}` : 'Free' },
    { label: 'Status', value: statusText(status) },
    { label: 'Last payment', value: lastPayment ? formatMinor(lastPayment.amountMinor, lastPayment.currency) : '—' },
    { label: 'Paid on', value: lastPayment ? formatDate(lastPayment.createdAt) : '—' },
    {
      label: status.cancelAtPeriodEnd ? 'Access until' : 'Renews on',
      value: status.isPremium ? formatDate(status.currentPeriodEnd) : '—',
    },
    {
      label: 'Total paid',
      value: Object.keys(totals).length ? Object.entries(totals).map(([c, v]) => formatMinor(v, c)).join(' · ') : '—',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Plan summary */}
      <div
        className={`overflow-hidden rounded-2xl ${
          status.isPremium
            ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white shadow-lg shadow-emerald-900/10'
            : card
        }`}
      >
        <div className="flex items-center gap-4 p-6">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              status.isPremium ? 'bg-white/20 text-white' : light ? 'bg-slate-100 text-slate-500' : 'bg-white/10 text-white'
            }`}
          >
            {status.isPremium ? <Crown className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
          </span>
          <div className="flex-1">
            <h3 className={`text-xl font-black ${status.isPremium ? 'text-white' : title}`}>
              {status.isPremium ? 'Expirely Premium' : 'Free plan'}
            </h3>
            <p className={`text-sm font-semibold ${status.isPremium ? 'text-white/80' : muted}`}>{statusText(status)}</p>
          </div>
          {!status.isPremium && (
            <Link
              href="/pay"
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-emerald-600"
            >
              Upgrade to Premium
            </Link>
          )}
        </div>

        <dl
          className={`grid grid-cols-2 gap-px border-t sm:grid-cols-3 ${
            status.isPremium ? 'border-white/15 bg-white/10' : `${divider} ${light ? 'bg-slate-100' : 'bg-white/10'}`
          }`}
        >
          {details.map((d) => (
            <div
              key={d.label}
              className={`p-4 ${status.isPremium ? 'bg-emerald-800/60' : light ? 'bg-white' : 'bg-black/30'}`}
            >
              <dt className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide ${status.isPremium ? 'text-white/60' : label}`}>
                {d.label === 'Renews on' || d.label === 'Access until' ? <CalendarClock className="h-3 w-3" /> : null}
                {d.label}
              </dt>
              <dd className={`mt-1 text-sm font-extrabold ${status.isPremium ? 'text-white' : title}`}>{d.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Manage plan */}
      {status.isPremium && (
        <div className={`rounded-2xl p-6 ${card}`}>
          <h3 className={`text-sm font-extrabold ${title}`}>Manage subscription</h3>
          {notice && (
            <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</p>
          )}
          {actionError && (
            <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{actionError}</p>
          )}

          {status.cancelAtPeriodEnd ? (
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className={`text-sm font-medium ${muted}`}>
                Your plan will not renew. You can use Premium until {formatDate(status.currentPeriodEnd)}.
              </p>
              <button
                onClick={() => void changeRenewal(true)}
                disabled={working}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-emerald-600 disabled:opacity-60"
              >
                {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                Keep my subscription
              </button>
            </div>
          ) : confirmCancel ? (
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50/70 p-4">
              <p className="flex items-start gap-2 text-sm font-semibold text-rose-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                Cancel your subscription? You keep Premium until {formatDate(status.currentPeriodEnd)}, then your account
                moves to the Free plan and will not be charged again.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => void changeRenewal(false)}
                  disabled={working}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-rose-700 disabled:opacity-60"
                >
                  {working && <Loader2 className="h-4 w-4 animate-spin" />}
                  Yes, cancel
                </button>
                <button
                  onClick={() => setConfirmCancel(false)}
                  disabled={working}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-extrabold text-slate-700 transition hover:bg-slate-50"
                >
                  Keep Premium
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className={`text-sm font-medium ${muted}`}>
                Renews on {formatDate(status.currentPeriodEnd)}. You can cancel any time.
              </p>
              <button
                onClick={() => {
                  setNotice(null);
                  setActionError(null);
                  setConfirmCancel(true);
                }}
                className="rounded-xl border border-rose-200 px-5 py-2.5 text-xs font-extrabold text-rose-600 transition hover:bg-rose-50"
              >
                Cancel subscription
              </button>
            </div>
          )}
        </div>
      )}

      {/* History */}
      <div>
        <h3 className={`mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider ${muted}`}>
          <Receipt className="h-4 w-4" /> Payment history
        </h3>
        {payments.length === 0 ? (
          <div className={`rounded-2xl p-6 text-center text-sm font-medium ${card} ${muted}`}>No payments yet.</div>
        ) : (
          <div className={`overflow-hidden rounded-2xl ${card}`}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className={`border-b text-[11px] font-bold uppercase tracking-wide ${divider} ${label}`}>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Plan</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={`${p.createdAt}-${i}`} className={i > 0 ? `border-t ${divider}` : ''}>
                    <td className={`px-5 py-3.5 font-semibold ${title}`}>{formatDate(p.createdAt)}</td>
                    <td className={`px-5 py-3.5 font-semibold ${muted}`}>
                      {p.interval === 'yearly' ? 'Yearly' : p.interval === 'monthly' ? 'Monthly' : '—'}
                    </td>
                    <td className={`px-5 py-3.5 text-right font-extrabold ${title}`}>
                      {formatMinor(p.amountMinor, p.currency) || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                          p.status === 'succeeded'
                            ? light ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-400/15 text-emerald-300'
                            : p.status === 'refunded'
                              ? light ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-400/15 text-indigo-300'
                              : light ? 'bg-rose-50 text-rose-600' : 'bg-red-400/15 text-red-300'
                        }`}
                      >
                        {p.status === 'succeeded' ? 'Paid' : p.status === 'refunded' ? 'Refunded' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
