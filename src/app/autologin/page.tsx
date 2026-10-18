'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { CONFIG } from '@/services/config';
import toast from 'react-hot-toast';

function AutoLoginComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const rawToken = searchParams.get('token');
    
    if (!rawToken) {
      toast.error('Authentication token is missing.');
      router.push('/login');
      return;
    }

    const token = decodeURIComponent(rawToken).trim().replace(/^["']|["']$/g, '');

    const getApiUrl = () => {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        if (hostname.includes("localhost") || hostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
          return `${protocol}//${hostname}:5000/api`;
        }
      }
      return CONFIG.API_URL;
    };

    const authenticateToken = async () => {
      const toastId = toast.loading('Synchronizing your mobile session...');
      try {
        // Query user's profile details using the token
        const response = await fetch(`${getApiUrl()}/users/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        let responseData: any = {};
        try {
          responseData = await response.json();
        } catch (e) {}

        if (!response.ok) {
          throw new Error(responseData.message || `HTTP error ${response.status}`);
        }
        
        if (responseData.success && responseData.data) {
          const user = responseData.data;
          
          // Save session to localStorage
          localStorage.setItem('accessToken', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          toast.success(`Welcome back, ${user.username}! Logged in.`, { id: toastId });
          
          // Optional same-site destination, e.g. /pay (never an external URL).
          const next = searchParams.get('next');
          if (next && next.startsWith('/') && !next.startsWith('//') && user.role !== 'ADMIN') {
            router.push(next);
            return;
          }

          // Redirect based on role
          if (user.role === 'ADMIN') {
            router.push('/admin/dashboard');
          } else {
            router.push('/dashboard');
          }
        } else {
          throw new Error(responseData.message || 'Verification failed');
        }
      } catch (err: any) {
        console.error('Auto login verification failed:', err);
        toast.error(`Auto login failed: ${err.message || 'Session expired or invalid.'} Please log in again.`, { id: toastId });
        router.push('/login');
      }
    };

    authenticateToken();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-white">
      <Loader2 className="w-10 h-10 text-[#7FB0FF] animate-spin" />
      <div className="text-center space-y-1">
        <h2 className="text-md font-extrabold text-white">Welcome to expirely web</h2>
        <p className="text-xs text-white/70 font-bold uppercase tracking-wider">Synchronizing session...</p>
      </div>
    </div>
  );
}

export default function AutoLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="w-10 h-10 text-[#7FB0FF] animate-spin" />
      </div>
    }>
      <AutoLoginComponent />
    </Suspense>
  );
}
