'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await authService.login(formData.email, formData.password);
      
      if (result.success) {
        if (result.user.role === 'ADMIN') {
          toast.success('Admin login successful!');
          router.push('/admin/dashboard');
        } else {
          authService.logout();
          toast.error("User can't login in here. Admin access only.");
        }
      } else {
        toast.error(result.message || 'Invalid credentials');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-[360px] mx-auto py-10">
        {/* Centered Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="relative w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform overflow-hidden">
               <div className="relative w-5 h-5">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
               </div>
            </div>
            <span className="text-lg font-bold text-slate-50">Expirely</span>
          </Link>
          <h2 className="text-xl font-extrabold text-slate-50 mb-1">Welcome back</h2>
          <p className="text-[12px] text-slate-400">Sign in to the admin dashboard</p>
        </div>

        {/* Login Card */}
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-slate-900/50 p-6 md:p-7 rounded-[20px] shadow-2xl shadow-emerald-950/20 border border-slate-800"
        >
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">Email</label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700 text-slate-50 text-sm"
                placeholder="admin@expirely.app"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  required
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700 text-slate-50 text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950/50 text-emerald-500 focus:ring-emerald-500" />
                <span className="text-slate-400 text-[11px] font-medium group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-emerald-400 hover:text-emerald-300 text-[11px] font-bold transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#10b981] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#059669] transition-all shadow-xl shadow-emerald-950/20 active:scale-[0.98] flex items-center justify-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>
        </motion.div>

        {/* Footer Link */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors text-[13px]">
             <span className="text-lg">←</span> Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
