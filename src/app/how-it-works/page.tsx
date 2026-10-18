import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Bell, PencilLine, ScanBarcode, ShoppingBasket } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import footerData from '../../../data/landing/footer.json';

export const metadata: Metadata = {
  title: 'How it works',
  description: 'See how Expirely works: add a product, set the expiry date, get reminded in time and waste less.',
};

const STEPS = [
  {
    icon: ScanBarcode,
    title: 'Add a product',
    description:
      'Scan the barcode with your phone camera, or add the product by hand. Expirely fills in the name, brand and category when it can, so you only confirm the details.',
    tips: ['Works for food, medicines, cosmetics and household items', 'Edit anything before you save'],
  },
  {
    icon: PencilLine,
    title: 'Set the expiry date',
    description:
      'Enter the date printed on the pack and pick where it is stored: fridge, freezer, pantry or medicine box. That is all the setup a product needs.',
    tips: ['Choose a storage zone and category', 'Add quantity so you know how much is left'],
  },
  {
    icon: Bell,
    title: 'Get reminded in time',
    description:
      'Expirely sends a notification before a product expires, with enough time left to use it. Choose how early you want to hear about it.',
    tips: ['Push notifications on your phone', 'A daily reminder at a time you pick'],
  },
  {
    icon: ShoppingBasket,
    title: 'Use it, save money',
    description:
      'Open the dashboard to see what to use first, get recipe ideas from items that expire soon and keep your shopping list in sync with what you actually need.',
    tips: ['Recipes built from your inventory', 'A shared household inventory for the family'],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 pb-8 pt-32 sm:px-6 md:pt-40">
        <div className="mx-auto max-w-4xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">How it works</span>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              From the shelf to a <span className="text-gradient-brand">reminder</span> in under a minute
            </h1>
            <p className="mt-5 text-base font-medium leading-relaxed text-white/70 sm:text-lg">
              Four simple steps keep everything you buy from going to waste.
            </p>
          </Reveal>

          <ol className="mt-14 space-y-5">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.title}>
                  <li className="glass-card flex flex-col gap-5 rounded-3xl p-6 sm:flex-row sm:p-8">
                    <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-start">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2A62BE]/25 text-[#7FB0FF]">
                        <Icon className="h-7 w-7" />
                      </span>
                      <span className="text-5xl font-black leading-none text-white/10">0{i + 1}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-white">{step.title}</h2>
                      <p className="mt-2 text-sm font-medium leading-relaxed text-white/70 sm:text-base">
                        {step.description}
                      </p>
                      <ul className="mt-4 space-y-1.5">
                        {step.tips.map((tip) => (
                          <li key={tip} className="flex items-start gap-2 text-sm font-semibold text-white/80">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7FB0FF]" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>

          <Reveal className="mt-12 text-center">
            <Link href="/onboarding" className="btn-primary !px-8 !py-4">
              Try it free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </main>

      <Footer data={footerData} />
    </div>
  );
}
