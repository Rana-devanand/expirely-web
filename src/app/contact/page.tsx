import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, Mail, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import ContactForm from './ContactForm';
import footerData from '../../../data/landing/footer.json';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Questions, feedback or need help? Get in touch with the Expirely team.',
};

export default function ContactPage() {
  const email = footerData.footer.contact.email;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 pb-8 pt-32 sm:px-6 md:pt-40">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Contact</span>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              We would love to <span className="text-gradient-brand">hear from you</span>
            </h1>
            <p className="mt-5 text-base font-medium leading-relaxed text-white/70 sm:text-lg">
              Questions, feedback or need a hand? Send us a message and we will get back to you.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal>
              <div className="glass-card rounded-3xl p-6 sm:p-8">
                <ContactForm email={email} />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="space-y-4">
                <a
                  href={`mailto:${email}`}
                  className="glass-card glass-card-hover flex items-start gap-4 rounded-3xl p-6"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.07] text-[#7FB0FF]">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-base font-extrabold text-white">Email us</span>
                    <span className="mt-1 block break-all text-sm font-medium text-white/70">{email}</span>
                  </span>
                </a>

                <Link href="/faq" className="glass-card glass-card-hover flex items-start gap-4 rounded-3xl p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.07] text-[#7FB0FF]">
                    <HelpCircle className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-base font-extrabold text-white">Read the FAQ</span>
                    <span className="mt-1 block text-sm font-medium text-white/70">
                      Quick answers about reminders, scanning and sharing.
                    </span>
                  </span>
                </Link>

                <Link
                  href="/delete-account"
                  className="glass-card glass-card-hover flex items-start gap-4 rounded-3xl p-6"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.07] text-[#7FB0FF]">
                    <Trash2 className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-base font-extrabold text-white">Delete your account</span>
                    <span className="mt-1 block text-sm font-medium text-white/70">
                      Steps to remove your account and data.
                    </span>
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </main>

      <Footer data={footerData} hideCta />
    </div>
  );
}
