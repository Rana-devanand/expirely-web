'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

type AdSenseUnitProps = {
  slot: string;
  className?: string;
};

export default function AdSenseUnit({ slot, className = '' }: AdSenseUnitProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const isConfigured = Boolean(client && slot);
  const hasRequestedAd = useRef(false);

  useEffect(() => {
    if (!isConfigured || hasRequestedAd.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      hasRequestedAd.current = true;
    } catch (error) {
      console.warn('AdSense could not render this ad unit.', error);
    }
  }, [isConfigured, slot]);

  if (!isConfigured) {
    if (process.env.NODE_ENV !== 'development') return null;

    return (
      <div className={`flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 ${className}`}>
        Ad preview
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block min-h-28 overflow-hidden ${className}`}
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
