'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUnsubscribeMutation } from '@/store/api/userApi';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [unsubscribe, { isLoading, isSuccess, isError, error }] = useUnsubscribeMutation();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (email) {
      unsubscribe({ email }).catch((err) => {
        setErrorMessage(err?.data?.message || 'Failed to complete unsubscribe request');
      });
    } else {
      setErrorMessage('No email address was provided in the link.');
    }
  }, [email, unsubscribe]);

  return (
    <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center z-10">
      {/* App Logo */}
      <div className="inline-flex items-center gap-2 text-white font-bold text-xl mb-2">
        <span className="text-2xl">⏳</span>
        <span>Expirely</span>
      </div>

      {isLoading && (
        <div className="space-y-4 py-8">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto" />
          <p className="text-slate-300 text-sm font-semibold tracking-wide animate-pulse">
            Processing your opt-out request...
          </p>
        </div>
      )}

      {!isLoading && (isSuccess || (email && !isError)) && (
        <div className="space-y-4 py-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-50">Unsubscribed Successfully</h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">
            You have been successfully unsubscribed. You will not get any update messages from the Expirely team anymore.
          </p>
          <div className="text-[10px] text-slate-650 font-bold tracking-wide">
            {email}
          </div>
        </div>
      )}

      {(!email || (isError && !isLoading)) && (
        <div className="space-y-4 py-4">
          <AlertCircle className="w-16 h-16 text-red-455 mx-auto" />
          <h2 className="text-xl font-bold text-slate-50">Unsubscribe Failed</h2>
          <p className="text-slate-405 text-xs leading-relaxed max-w-sm mx-auto">
            {errorMessage || (error as any)?.data?.message || 'Could not complete your opt-out. Please contact support.'}
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-slate-800/60">
        <Link 
          href="/" 
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 px-6 rounded-full transition-all active:scale-[0.98] shadow-md shadow-purple-950/20"
        >
          Return to Expirely Home
        </Link>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] text-slate-100 p-6 relative font-sans overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      <Suspense fallback={
        <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center flex flex-col items-center py-20 z-10">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-slate-400 text-xs">Loading page context...</p>
        </div>
      }>
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
