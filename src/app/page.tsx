import { Suspense } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import heroData from '../../data/landing/hero.json';
import Features from '@/components/Features';
import featuresData from '../../data/landing/features.json';
import HowItWorks from '@/components/HowItWorks';
import howItWorksData from '../../data/landing/how-it-works.json';
import Benefits from '@/components/Benefits';
import benefitsData from '../../data/landing/benefits.json';
import FAQ from '@/components/FAQ';
import faqData from '../../data/landing/faq.json';
import Footer from '@/components/Footer';
import footerData from '../../data/landing/footer.json';

export const metadata: Metadata = {
  title: 'Smart Expiry Tracker & Inventory Manager',
  description:
    "Track your household inventory, receive expiry alerts, and reduce waste with Expirely's premium dashboard.",
};

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <Navbar />

      <main>
        <Suspense
          fallback={
            <div className="h-[70vh] flex items-center justify-center animate-pulse bg-slate-100" />
          }
        >
          <Hero data={heroData} />
        </Suspense>

        <Suspense fallback={<div className="h-[40vh] bg-white" />}>
          <Features data={featuresData} />
        </Suspense>

        <Suspense fallback={<div className="h-[40vh] bg-slate-50" />}>
          <HowItWorks data={howItWorksData} />
        </Suspense>

        <Suspense fallback={<div className="h-[40vh] bg-slate-50" />}>
          <Benefits data={benefitsData} />
        </Suspense>

        <Suspense fallback={<div className="h-[40vh] bg-white" />}>
          <FAQ data={faqData} />
        </Suspense>
      </main>

      <Suspense fallback={<div className="h-[20vh] bg-white" />}>
        <Footer data={footerData} />
      </Suspense>
    </div>
  );
}
