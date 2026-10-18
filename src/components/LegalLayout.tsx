import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import footerData from '../../data/landing/footer.json';

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 pb-8 pt-32 sm:px-6 md:pt-36">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="group mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#7FB0FF] transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_20px_60px_-20px_rgba(30,50,110,0.35)] backdrop-blur-xl sm:p-10">
            <h1 className="mb-8 text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h1>
            <div className="max-w-none text-white/70">{children}</div>
          </div>
        </div>
      </main>

      <Footer data={footerData} hideCta />
    </div>
  );
}
