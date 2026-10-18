'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, Crown, Loader2, Search, Users, Wallet } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/services/api';
import { formatMinor } from '@/services/billing.service';

type PaymentRow = {
  id: string;
  userId: string | null;
  status: string;
  amountMinor: number | null;
  currency: string | null;
  interval: 'monthly' | 'yearly' | null;
  createdAt: string;
};

type PayingUser = {
  userId: string;
  email: string | null;
  username: string | null;
  plan: 'free' | 'premium';
  interval: 'monthly' | 'yearly' | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  totalPaid: Record<string, number>;
  paymentsCount: number;
  lastPaymentAt: string | null;
  payments: PaymentRow[];
};

type AdminPayments = {
  summary: {
    payingUsers: number;
    premiumUsers: number;
    successfulPayments: number;
    failedPayments: number;
    totals: Record<string, number>;
  };
  users: PayingUser[];
};

const day = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

const moneyMap = (m: Record<string, number>) => {
  const parts = Object.entries(m).map(([c, v]) => formatMinor(v, c));
  return parts.length ? parts.join(' · ') : '-';
};

const planLabel = (i: string | null) => (i === 'yearly' ? 'Yearly' : i === 'monthly' ? 'Monthly' : '-');

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    succeeded: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    refunded: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  const label = status === 'succeeded' ? 'Paid' : status === 'refunded' ? 'Refunded' : 'Failed';
  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${map[status] ?? map.failed}`}>{label}</span>
  );
}

export default function AdminPaymentsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [data, setData] = useState<AdminPayments | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await api.get('/subscription/admin/payments');
      setData(res.data as AdminPayments);
    } catch (e: any) {
      setError(e?.message || 'Could not load payments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const users = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = data?.users ?? [];
    if (!q) return all;
    return all.filter((u) => `${u.email ?? ''} ${u.username ?? ''}`.toLowerCase().includes(q));
  }, [data, query]);

  const th = 'px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider';

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-16">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-50">Payments</h1>
            <p className="text-slate-400 text-xs mt-1">Every payment, with the user who made it</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-8 text-center">
              <p className="text-sm text-slate-400">{error}</p>
              <button onClick={() => void load()} className="mt-4 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white">
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: 'Total received', value: moneyMap(data?.summary.totals ?? {}), icon: Wallet, tone: 'text-emerald-400' },
                  { label: 'Premium users', value: String(data?.summary.premiumUsers ?? 0), icon: Crown, tone: 'text-amber-300' },
                  { label: 'Paying users', value: String(data?.summary.payingUsers ?? 0), icon: Users, tone: 'text-sky-300' },
                  {
                    label: 'Paid / failed',
                    value: `${data?.summary.successfulPayments ?? 0} / ${data?.summary.failedPayments ?? 0}`,
                    icon: Wallet,
                    tone: 'text-indigo-300',
                  },
                ].map((c) => (
                  <div key={c.label} className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5">
                    <c.icon className={`h-5 w-5 ${c.tone}`} />
                    <p className="mt-3 text-xl font-extrabold text-slate-50">{c.value}</p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{c.label}</p>
                  </div>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-slate-900/40 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600 text-slate-50"
                />
              </div>

              <div className="bg-slate-900/20 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/40">
                        <th className={th}>User</th>
                        <th className={th}>Plan</th>
                        <th className={th}>Total paid</th>
                        <th className={th}>Payments</th>
                        <th className={th}>Last payment</th>
                        <th className={th}>Renews / ends</th>
                        <th className={th} />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                            No payments yet.
                          </td>
                        </tr>
                      )}
                      {users.map((u) => {
                        const isOpen = open === u.userId;
                        return (
                          <React.Fragment key={u.userId}>
                            <tr
                              className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                              onClick={() => setOpen(isOpen ? null : u.userId)}
                            >
                              <td className="px-6 py-4">
                                <p className="text-[13px] font-bold text-slate-50">{u.username || 'Unknown'}</p>
                                <p className="text-[11px] text-slate-500">{u.email}</p>
                              </td>
                              <td className="px-6 py-4">
                                {u.plan === 'premium' ? (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                                    <Crown className="h-3 w-3" /> Premium · {planLabel(u.interval)}
                                  </span>
                                ) : (
                                  <span className="text-[12px] font-semibold text-slate-500">Free</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-[13px] font-extrabold text-slate-50">{moneyMap(u.totalPaid)}</td>
                              <td className="px-6 py-4 text-[13px] text-slate-300">{u.paymentsCount}</td>
                              <td className="px-6 py-4 text-[13px] text-slate-300">{day(u.lastPaymentAt)}</td>
                              <td className="px-6 py-4 text-[12px] text-slate-400">
                                {u.plan === 'premium'
                                  ? `${u.cancelAtPeriodEnd ? 'Ends' : 'Renews'} ${day(u.currentPeriodEnd)}`
                                  : '-'}
                              </td>
                              <td className="px-6 py-4 text-slate-500">
                                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                              </td>
                            </tr>
                            {isOpen && (
                              <tr className="bg-slate-950/60">
                                <td colSpan={7} className="px-6 py-4">
                                  {u.payments.length === 0 ? (
                                    <p className="text-xs text-slate-500">No payment records for this user.</p>
                                  ) : (
                                    <table className="w-full text-left">
                                      <tbody className="divide-y divide-slate-800/70">
                                        {u.payments.map((p) => (
                                          <tr key={p.id}>
                                            <td className="py-2 text-[12px] font-semibold text-slate-300">{day(p.createdAt)}</td>
                                            <td className="py-2 text-[12px] text-slate-400">{planLabel(p.interval)}</td>
                                            <td className="py-2 text-[13px] font-extrabold text-slate-50">
                                              {formatMinor(p.amountMinor, p.currency) || '-'}
                                            </td>
                                            <td className="py-2 text-right">
                                              <StatusPill status={p.status} />
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  )}
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
