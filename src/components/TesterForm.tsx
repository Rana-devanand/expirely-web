'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Send, CheckCircle2, ChevronLeft, Eye } from 'lucide-react';
import { testerService } from '@/services/tester.service';
import toast from 'react-hot-toast';

export default function TesterForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      await testerService.register(formData);
      toast.success('Application submitted successfully!');
      setStatus('success');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application');
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/[0.06] p-10 rounded-2xl shadow-xl border border-white/10 text-center max-w-[360px] mx-auto"
      >
        <div className="w-16 h-16 bg-[#1E50A2]/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-[#7FB0FF]" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Thank you!</h3>
        <p className="text-white/70 text-xs">Your application to become a tester has been received. We'll be in touch soon.</p>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-[#7FB0FF] font-bold hover:text-white transition-colors text-xs">
          <span className="text-base">←</span> Back to website
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-[360px] mx-auto">
      {/* Centered Logo & Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-extrabold text-white mb-1">Apply as Tester</h2>
        <p className="text-[12px] text-white/70">Join our exclusive beta program</p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.06] p-6 md:p-7 rounded-[20px] shadow-2xl shadow-[#1E50A2]/20 border border-white/10"
      >
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label htmlFor="username" className="block text-[10px] font-bold text-white/70 mb-1.5 ml-1 uppercase tracking-wider">Username</label>
            <input
              type="text"
              id="username"
              required
              className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#1E50A2]/25 focus:border-[#1E50A2]/50 outline-none transition-all placeholder:text-white/70 text-white text-sm"
              placeholder="Your username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[10px] font-bold text-white/70 mb-1.5 ml-1 uppercase tracking-wider">Email</label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#1E50A2]/25 focus:border-[#1E50A2]/50 outline-none transition-all placeholder:text-white/70 text-white text-sm"
              placeholder="tester@expirely.app"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-[10px] font-bold text-white/70 mb-1.5 ml-1 uppercase tracking-wider">Notes (Optional)</label>
            <textarea
              id="notes"
              rows={2}
              className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#1E50A2]/25 focus:border-[#1E50A2]/50 outline-none transition-all placeholder:text-white/70 text-white text-sm resize-none"
              placeholder="Why do you want to test?"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-[#1E50A2] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#17408A] transition-all shadow-xl shadow-[#1E50A2]/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
          >
            {status === 'submitting' ? 'Submitting...' : 'Apply Now'}
          </button>
        </form>
      </motion.div>

      {/* Footer Link */}
      <div className="text-center mt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[#7FB0FF] font-bold hover:text-white transition-colors text-[13px]">
           <span className="text-lg">←</span> Back to website
        </Link>
      </div>
    </div>
  );
}
