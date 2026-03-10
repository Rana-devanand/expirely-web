import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-50 mb-12 tracking-tight">
          {title}
        </h1>
        
        <div className="prose prose-invert prose-emerald max-w-none">
          {children}
        </div>
        
        <div className="mt-20 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 Expirely. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
