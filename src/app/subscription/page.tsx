'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// The subscription details now live in the user dashboard ("Subscription" tab).
// This address stays so older links keep working.
export default function SubscriptionRedirectPage() {
  useEffect(() => {
    window.location.replace('/dashboard?tab=subscription');
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#7FB0FF]" />
    </div>
  );
}
