import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import faqData from '../../../data/landing/faq.json';
import footerData from '../../../data/landing/footer.json';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers to common questions about Expirely: reminders, barcode scanning, sharing and your data.',
};

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-24 md:pt-32">
        <FAQ data={faqData} />
        <div className="px-4 text-center">
          <p className="text-sm font-semibold text-white/60">Still have a question?</p>
          <Link href="/contact" className="btn-outline mt-4 !px-7">
            Contact us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <Footer data={footerData} hideCta />
    </div>
  );
}
