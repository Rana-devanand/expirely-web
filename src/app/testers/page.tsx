import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import footerData from '../../../data/landing/footer.json';
import TesterForm from '@/components/TesterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Join as Beta Tester",
  description: "Apply to become an exclusive beta tester for Expirely and help shape the future of inventory management.",
};

export default function TestersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 pt-32 pb-20">
        <TesterForm />
      </main>
      <Suspense fallback={<div className="h-[20vh]" />}>
        <Footer data={footerData} />
      </Suspense>
    </div>
  );
}
