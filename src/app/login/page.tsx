'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  Smartphone,
  LogOut,
  CheckCircle2,
  Download,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import footerData from '../../../data/landing/footer.json';
import { authService } from '@/services/auth.service';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function UserLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check if user is already logged in
  useEffect(() => {
    const loggedInUser = authService.getUser();
    if (loggedInUser) {
      setUser(loggedInUser);
      if (loggedInUser.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, []);

  // Google SSO Initialization
  useEffect(() => {
    // Only load Google client if user is not logged in
    if (user) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      try {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '891189343114-losvuf3l2tj1i9gvhrtdvm8urk1km304.apps.googleusercontent.com';
        (window as any).google?.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });

        const btnElement = document.getElementById('google-signin-btn');
        if (btnElement) {
          (window as any).google?.accounts.id.renderButton(
            btnElement,
            { 
              theme: 'outline', 
              size: 'large', 
              width: 320,
              text: 'signin_with',
              shape: 'pill'
            }
          );
        }
      } catch (err) {
        console.error('Google client initialization error:', err);
      }
    };

    return () => {
      // Clean up script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [user]);

  const handleGoogleCredentialResponse = async (response: any) => {
    const idToken = response.credential;
    const toastId = toast.loading('Authenticating with Google...');
    try {
      const res: any = await api.post('/users/social-login', {
        token: idToken,
        idToken: idToken,
        provider: 'google'
      });

      if (res.success && res.data) {
        const { accessToken, refreshToken, user: loggedUser } = res.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        
        toast.success('Logged in successfully!', { id: toastId });
        setUser(loggedUser);

        if (loggedUser.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        toast.error(res.message || 'Google authentication failed', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err?.message || 'Google authentication failed', { id: toastId });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Signing in...');
    try {
      const result = await authService.login(formData.email, formData.password);
      if (result.success && result.user) {
        toast.success('Signed in successfully!', { id: toastId });
        setUser(result.user);
        
        if (result.user.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        toast.error(result.message || 'Invalid credentials', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err?.message || 'Sign in failed', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setFormData({ email: '', password: '' });
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: 'var(--gradient-bg)' }}>
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <AnimatePresence mode="wait">
            {!user ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-slate-950/40 border border-slate-900 rounded-3xl p-8 backdrop-blur-md shadow-2xl space-y-6"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-extrabold text-slate-50 tracking-tight">Welcome Back</h1>
                  <p className="text-xs text-slate-500">Sign in to sync your household expiry dates</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900/30 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 placeholder:text-slate-650 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between pl-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900/30 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 placeholder:text-slate-650 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] mt-6"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-900" />
                  <span className="flex-shrink mx-4 text-slate-500 font-bold text-[9px] uppercase tracking-wider">or sign in with</span>
                  <div className="flex-grow border-t border-slate-900" />
                </div>

                {/* Google Sign-in Container */}
                <div className="flex justify-center pt-1 min-h-[44px]">
                  <div id="google-signin-btn" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="welcome-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-slate-950/40 border border-slate-900 rounded-3xl p-8 backdrop-blur-md shadow-2xl text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-xl font-extrabold text-slate-100">Welcome to Expirely</h1>
                  <p className="text-xs text-slate-400 font-medium">
                    You are logged in as <span className="text-emerald-400 font-bold">{user.username || user.email}</span>
                  </p>
                </div>

                <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-4 text-left">
                  <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="w-4.5 h-4.5 text-slate-400" />
                    Mobile Application App Access
                  </h3>
                  <p className="text-[11px] text-slate-450 leading-relaxed font-medium">
                    Expirely is designed to work on the go! Download our mobile client on iOS or Android to add pantry items, scan barcodes, and receive push notifications before your food expires.
                  </p>
                  
                  {/* Mock store badges */}
                  <div className="flex gap-2.5 pt-2">
                    <button className="flex-1 bg-slate-950 border border-slate-850 hover:bg-slate-900 py-2.5 px-3 rounded-lg text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold">Google Play</span>
                    </button>
                    <button className="flex-1 bg-slate-950 border border-slate-850 hover:bg-slate-900 py-2.5 px-3 rounded-lg text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold">App Store</span>
                    </button>
                  </div>
                </div>

                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin/dashboard"
                    className="block w-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-3 px-4 rounded-xl text-xs border border-slate-800 transition-colors"
                  >
                    Go to Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full bg-slate-950 border border-slate-900 hover:bg-red-500/10 text-slate-500 hover:text-red-400 py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout Account
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer data={footerData} />
    </div>
  );
}
