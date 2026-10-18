import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import AiShowcase from '@/components/AiShowcase';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import PricingSection from '@/components/PricingSection';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import { PREMIUM_ENABLED } from '@/lib/flags';
import heroData from '../../data/landing/hero.json';
import featuresData from '../../data/landing/features.json';
import howItWorksData from '../../data/landing/how-it-works.json';
import testimonialsData from '../../data/landing/testimonials.json';
import faqData from '../../data/landing/faq.json';
import footerData from '../../data/landing/footer.json';

export const metadata: Metadata = {
  title: 'Smart Expiry Tracker & Inventory Manager',
  description:
    "Track your household inventory, receive expiry alerts, and reduce waste with Expirely's premium dashboard.",
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <Hero data={heroData} />
        <Features data={featuresData} />
        <AiShowcase />
        <HowItWorks data={howItWorksData} />
        <Testimonials data={testimonialsData} />
        {PREMIUM_ENABLED && <PricingSection />}
        <FAQ data={{ faq: { ...faqData.faq, questions: faqData.faq.questions.slice(0, 5) } }} />
      </main>

      <Footer data={footerData} />
    </div>
  );
}
