'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { billingService, type SubscriptionStatus } from '@/services/billing.service';

// Where Dodo sends the customer after paying. The URL query is NOT trusted:
// we only show "success" once our own server says the plan is Premium (that
// state is set by the signed webhook).
const APP_SCHEME = 'mobileapp';
const POLL_EVERY_MS = 2000;
const MAX_TRIES = 10; // ~20 seconds, then show "still processing"

type Phase = 'checking' | 'success' | 'pending' | 'login';

function ReturnComponent() {
  const [phase, setPhase] = useState<Phase>('checking');
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const tries = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Dodo adds ?subscription_id=... to the return URL. It is only a hint: the
    // backend re-checks it with Dodo and verifies it belongs to this user.
    const query = new URLSearchParams(window.location.search);
    const subscriptionId = query.get('subscription_id');
    const paymentId = query.get('payment_id');
    let synced = false;

    const check = async () => {
      if (!localStorage.getItem('accessToken')) {
        setPhase('login');
        return;
      }
      if (subscriptionId && !synced) {
        synced = true;
        try {
          const s = await billingService.syncSubscription(subscriptionId, paymentId);
          if (cancelled) return;
          setStatus(s);
          if (s.isPremium) {
            setPhase('success');
            return;
          }
        } catch (err: any) {
          if (err?.status === 401) {
            setPhase('login');
            return;
          }
          // Any other problem: fall back to waiting for the webhook below.
        }
      }
      try {
        const s = await billingService.getStatus();
        if (cancelled) return;
        setStatus(s);
        if (s.isPremium) {
          setPhase('success');
          return;
        }
      } catch (err: any) {
        if (err?.status === 401) {
          setPhase('login');
          return;
        }
      }
      tries.current += 1;
      if (tries.current >= MAX_TRIES) {
        setPhase('pending');
        return;
      }
      timer = setTimeout(check, POLL_EVERY_MS);
    };

    void check();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  // On a phone, go back to the app by itself once the payment is confirmed.
  // (The button below is the fallback if the browser blocks the automatic jump.)
  useEffect(() => {
    if (phase !== 'success') return;
    if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;
    const timer = setTimeout(() => {
      window.location.href = `${APP_SCHEME}://payment-result?status=success`;
    }, 1200);
    return () => clearTimeout(timer);
  }, [phase]);

  const openApp = (result: 'success' | 'pending') => {
    window.location.href = `${APP_SCHEME}://payment-result?status=${result}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md p-7 text-center shadow-sm">
        {phase === 'checking' && (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#7FB0FF]" />
            <h1 className="mt-4 text-xl font-black text-white">Confirming your payment…</h1>
            <p className="mt-2 text-sm font-medium text-white/70">
              This usually takes a few seconds. Please do not close this page.
            </p>
          </>
        )}

        {phase === 'success' && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-[#7FB0FF]" />
            <h1 className="mt-4 text-2xl font-black text-white">You are Premium</h1>
            <p className="mt-2 text-sm font-medium text-white/70">
              Thank you! Everything is unlocked
              {status?.currentPeriodEnd
                ? `. Your plan renews on ${new Date(status.currentPeriodEnd).toLocaleDateString()}`
                : ''}
              .
            </p>
            <button
              onClick={() => openApp('success')}
              className="mt-6 w-full rounded-2xl bg-[#1E50A2] py-3.5 text-sm font-extrabold text-white"
            >
              Open Expirely app
            </button>
            <Link href="/dashboard" className="mt-3 block text-sm font-bold text-white/70">
              Continue on the web
            </Link>
          </>
        )}

        {phase === 'pending' && (
          <>
            <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
            <h1 className="mt-4 text-xl font-black text-white">Still processing</h1>
            <p className="mt-2 text-sm font-medium text-white/70">
              We have not received the confirmation yet. If you completed the payment, Premium will
              turn on automatically within a few minutes. If you cancelled, nothing was charged.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full rounded-2xl bg-[#1E50A2] py-3.5 text-sm font-extrabold text-white"
            >
              Check again
            </button>
            <button
              onClick={() => openApp('pending')}
              className="mt-3 block w-full text-sm font-bold text-white/70"
            >
              Back to the app
            </button>
          </>
        )}

        {phase === 'login' && (
          <>
            <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
            <h1 className="mt-4 text-xl font-black text-white">Log in to see your status</h1>
            <p className="mt-2 text-sm font-medium text-white/70">
              Your payment is safe. Open the Expirely app, or log in here to check your plan.
            </p>
            <button
              onClick={() => openApp('pending')}
              className="mt-6 w-full rounded-2xl bg-[#1E50A2] py-3.5 text-sm font-extrabold text-white"
            >
              Open Expirely app
            </button>
            <Link href="/login" className="mt-3 block text-sm font-bold text-white/70">
              Log in on the web
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PayReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#7FB0FF]" />
        </div>
      }
    >
      <ReturnComponent />
    </Suspense>
  );
}
