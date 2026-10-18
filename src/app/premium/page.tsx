import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Ban,
  BellRing,
  Check,
  ChevronDown,
  FileText,
  Minus,
  ShieldCheck,
  Sparkles,
  Wand2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';
import CompareTable from '@/components/CompareTable';
import Reveal from '@/components/Reveal';
import { PREMIUM_ENABLED } from '@/lib/flags';
import footerData from '../../../data/landing/footer.json';

export const metadata: Metadata = {
  title: 'Expirely Premium',
  description:
    'Try Expirely Premium free for 7 days. Unlimited AI product scan, estimated expiry dates, PDF inventory reports and no ads. See Free vs Premium and how Expirely compares.',
};

const card =
  'relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-6 sm:p-8';

type Cell = boolean | string;
const ROWS: { feature: string; free: Cell; premium: Cell }[] = [
  { feature: 'Track products and expiry dates', free: true, premium: true },
  { feature: 'Expiry reminders (7 days and 3 days before)', free: true, premium: true },
  { feature: 'Barcode scanning and manual add', free: true, premium: true },
  { feature: 'Calendar, categories, zones and shopping list', free: true, premium: true },
  { feature: 'Family household sharing', free: true, premium: true },
  { feature: 'Recipes, meal planner, storage tips, nutrition insights', free: true, premium: true },
  { feature: 'AI product scan', free: 'A few per month', premium: 'Unlimited' },
  { feature: 'AI estimated expiry from the manufacturing date', free: 'With free scans', premium: 'Unlimited' },
  { feature: 'Key ingredients and allergens', free: 'With free scans', premium: 'Unlimited' },
  { feature: 'PDF reports (all, by category, per product)', free: false, premium: true },
  { feature: 'Ads when you save an item', free: 'Yes', premium: 'None' },
  { feature: 'Daily add limit (then one short video)', free: 'Yes', premium: 'None' },
];

function CellView({ value, premium = false }: { value: Cell; premium?: boolean }) {
  if (value === true)
    return (
      <span className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full ${premium ? 'bg-emerald-400 text-black' : 'bg-white/10 text-white/80'}`}>
        <Check className="h-3.5 w-3.5" aria-label="Included" />
      </span>
    );
  if (value === false) return <Minus className="mx-auto h-5 w-5 text-white/25" aria-label="Not included" />;
  return <span className={`text-[13px] font-bold ${premium ? 'text-emerald-300' : 'text-white/75'}`}>{value}</span>;
}

const COMPETITORS = [
  {
    name: 'NoWaste',
    facts: [
      'Pro barcode scanner is the main paid feature',
      'Free version includes 6 lists',
      'Pro: $6.99 a year or $29.99 lifetime',
    ],
  },
  {
    name: 'Pantry Days',
    facts: [
      'Free tier is limited to 50 items',
      'Premium adds unlimited items and unlimited barcode scanning',
      'Premium also adds a waste and savings report',
    ],
  },
  {
    name: 'Fridgely',
    facts: [
      'Free with in-app purchases',
      'Barcode scan fills in the name and estimates an expiry date',
      'Exporting to CSV is a premium feature',
    ],
  },
];

const FAQ = [
  {
    q: 'Is there a free trial?',
    a: 'Yes. First-time subscribers get a 7-day free trial. The checkout page shows the trial length and the date of your first charge before you pay. Cancel before the trial ends and you are not charged.',
  },
  {
    q: 'Can I keep using Expirely for free?',
    a: 'Yes. Tracking, reminders, barcode scanning, the calendar, recipes and the other tools stay free. Premium adds unlimited AI scans, PDF reports and an ad-free experience.',
  },
  {
    q: 'How do I subscribe?',
    a: 'Choose Go Premium in the app, or open the Pricing page on this website. You pay on a secure checkout run by our payment partner, Dodo Payments, and Premium turns on as soon as the payment is confirmed. Prices are shown in US dollars before you pay.',
  },
  {
    q: 'Can I cancel any time?',
    a: 'Yes. Sign in to the website, open Subscription and choose Cancel. You keep Premium until the end of the period you paid for and are not charged again.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'Nothing is deleted. Your products, reminders and history stay in your account and you return to the Free plan.',
  },
];

export default function PremiumPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 overflow-hidden pb-8">
        {/* Hero */}
        <section className="relative px-4 pt-32 sm:px-6 md:pt-44">
          <div className="pointer-events-none absolute left-1/2 top-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500/25 via-sky-500/20 to-fuchsia-500/20 blur-[110px]" />
          <Reveal className="relative mx-auto max-w-3xl text-center">
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" /> Expirely Premium
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
              Add products from <br className="hidden sm:block" />
              <span className="text-gradient-brand">a single photo</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-medium text-white/70 sm:text-lg">
              Expirely is free to use. Premium is for people who add a lot of products and want it to take seconds, with
              reports to keep and no ads.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={PREMIUM_ENABLED ? '/pay' : '/onboarding'}
                className="btn-primary !px-8 !py-4"
              >
                {PREMIUM_ENABLED ? 'Start your 7-day free trial' : 'Get started free'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/pricing" className="btn-outline !px-8 !py-4">
                See pricing
              </Link>
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-white/55">
              <ShieldCheck className="h-4 w-4 text-emerald-300" /> 7 days free for first-time subscribers · Cancel any time
            </p>
          </Reveal>
        </section>

        {/* Bento */}
        <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 md:grid-cols-6">
            <Reveal className="md:col-span-4 md:row-span-2">
              <div className={`${card} h-full`}>
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
                <span className="inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                  Unlimited AI product scan
                </span>
                <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">One photo. The whole form.</h2>
                <p className="mt-3 max-w-lg text-sm font-medium leading-relaxed text-white/70">
                  Take a photo of a pack and Expirely reads it: name, brand, category, quantity, size, price, barcode,
                  ingredients, allergens and storage advice. Labels in English, Arabic and Hindi are supported. Free accounts
                  get a few scans each month; Premium has no limit.
                </p>
                <div className="mt-6 grid max-w-md grid-cols-2 gap-2.5">
                  {[
                    ['Name', 'Fresh Paneer 200 g'],
                    ['Brand', 'Amul'],
                    ['Category', 'Dairy'],
                    ['Size', '200 g'],
                    ['Price', '₹ 90.00'],
                    ['Quantity', '1'],
                  ].map(([l, v]) => (
                    <div key={l} className="rounded-2xl border border-white/10 bg-black/30 px-3.5 py-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-white/45">{l}</p>
                      <p className="text-[13px] font-extrabold text-white">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal className="md:col-span-2" delay={0.05}>
              <div className={`${card} h-full`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-400/15 text-indigo-300">
                  <Wand2 className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-white">Estimated expiry</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">
                  Only a manufacturing date on the pack? AI suggests an expiry and you confirm it with one tap. Never used
                  for medicines or baby products.
                </p>
                <div className="mt-4 rounded-2xl border border-indigo-300/20 bg-indigo-400/10 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-200/80">AI estimate</p>
                  <p className="text-xl font-black text-white">21 Oct 2026</p>
                </div>
              </div>
            </Reveal>

            <Reveal className="md:col-span-2" delay={0.1}>
              <div className={`${card} h-full`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300">
                  <BellRing className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-white">Ingredients and allergens</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">
                  See what is in a product and what it may contain, straight from the label.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Milk', 'Citric acid'].map((t) => (
                    <span key={t} className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">
                      {t}
                    </span>
                  ))}
                  <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300">⚠ Milk</span>
                </div>
              </div>
            </Reveal>

            <Reveal className="md:col-span-3" delay={0.05}>
              <div className={`${card} h-full`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-400/15 text-rose-300">
                  <FileText className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-white">PDF inventory reports</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">
                  Download everything, one category, or a single product as a PDF. It saves straight to your phone with an
                  Open button. Good for stock-taking and sharing with family.
                </p>
              </div>
            </Reveal>

            <Reveal className="md:col-span-3" delay={0.1}>
              <div className={`${card} h-full`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-300">
                  <Ban className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-white">No ads, no daily limit</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">
                  Add items without ads, and without the daily add limit that free accounts have.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Free vs Premium */}
        <section className="mx-auto mt-24 max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <span className="eyebrow">Free vs Premium</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">Everything, side by side</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-white/70">
              What you use every day is free. Premium removes the limits on the AI scan and adds PDF reports.
            </p>
          </div>
          <Reveal className="mt-8">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left">
                  <thead>
                    <tr className="text-[11px] font-extrabold uppercase tracking-wider text-white/55">
                      <th className="px-6 py-5">Feature</th>
                      <th className="px-6 py-5 text-center">Free</th>
                      <th className="bg-emerald-400/10 px-6 py-5 text-center text-emerald-300">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.07]">
                    {ROWS.map((row) => (
                      <tr key={row.feature}>
                        <td className="px-6 py-4 text-sm font-semibold text-white">{row.feature}</td>
                        <td className="px-6 py-4 text-center">
                          <CellView value={row.free} />
                        </td>
                        <td className="bg-emerald-400/[0.06] px-6 py-4 text-center">
                          <CellView value={row.premium} premium />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Competitors */}
        <section className="mx-auto mt-24 max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <span className="eyebrow">How we compare</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">How we compare</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-white/70">
              Most expiry trackers make you type each product in. Expirely reads the pack for you.
            </p>
          </div>

          <Reveal className="mt-10">
            <CompareTable
              ctaHref={PREMIUM_ENABLED ? '/pay' : '/onboarding'}
              ctaLabel={PREMIUM_ENABLED ? 'Start free trial' : 'Get started free'}
            />
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {COMPETITORS.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                  <h3 className="text-base font-extrabold text-white">{c.name}</h3>
                  <ul className="mt-3 space-y-2">
                    {c.facts.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[13px] font-medium leading-relaxed text-white/65">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-center text-xs font-medium text-white/45">
            Competitor details come from their public App Store listings, checked in October 2026. Features and prices change,
            and all names belong to their owners.
          </p>
        </section>

        {/* Price */}
        <section className="mt-10">
          {PREMIUM_ENABLED ? (
            <PricingSection showHeader={false} />
          ) : (
            <Reveal className="mx-auto mt-10 max-w-xl px-4 text-center">
              <div className="glass-card rounded-3xl px-6 py-10">
                <h2 className="text-2xl font-black text-white">Premium plans are coming soon</h2>
                <p className="mt-3 text-sm font-medium text-white/70">Expirely stays free to use in the meantime.</p>
                <Link href="/onboarding" className="btn-primary mt-6 !px-8 !py-3.5">
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          )}
        </section>

        {/* How billing works */}
        <section className="mx-auto mt-20 max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-black tracking-tight text-white sm:text-4xl">How billing works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { n: '1', t: 'Start free for 7 days', d: 'Choose monthly or yearly. First-time subscribers start with a 7-day free trial, and the first charge date is shown before you confirm.' },
              { n: '2', t: 'Pay securely', d: 'Checkout is run by Dodo Payments, our payment partner and merchant of record. We never see or store your card details.' },
              { n: '3', t: 'Cancel any time', d: 'Cancel from the website whenever you like. Cancel during the trial and you pay nothing. Later, you keep Premium until the paid period ends.' },
            ].map((s) => (
              <Reveal key={s.n}>
                <div className={`${card} h-full`}>
                  <span className="text-6xl font-black leading-none text-white/10">{s.n}</span>
                  <h3 className="mt-2 text-lg font-extrabold text-white">{s.t}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-sm font-medium text-white/60">
            Read the{' '}
            <Link href="/cancellation-policy" className="font-bold text-[#7FB0FF] underline">
              Cancellation and Refund Policy
            </Link>{' '}
            for the full details.
          </p>
        </section>

        {/* FAQ */}
        <section className="mx-auto mt-20 max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-black tracking-tight text-white sm:text-4xl">Questions</h2>
          <div className="mt-8 space-y-3">
            {FAQ.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 open:bg-white/[0.07]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-extrabold text-white">
                  {item.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-white/50 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm font-medium leading-relaxed text-white/70">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer data={footerData} hideCta />
    </div>
  );
}
