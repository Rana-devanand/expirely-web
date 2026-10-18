import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  ChefHat,
  Scan,
  Snowflake,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import AiShowcase from '@/components/AiShowcase';
import footerData from '../../../data/landing/footer.json';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Barcode scanning, smart reminders, storage zones, household sharing and recipes. Everything Expirely does to cut food waste.',
};

const FEATURES: {
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  points: string[];
}[] = [
  {
    icon: Scan,
    title: 'Barcode scanning',
    tagline: 'Add products in seconds',
    description:
      'Point your camera at a barcode and Expirely fills in the product details. You only confirm the expiry date.',
    points: ['Name, brand and category filled in for you', 'Edit any detail before saving', 'Add manually when there is no barcode'],
  },
  {
    icon: Bell,
    title: 'Smart reminders',
    tagline: 'Hear about it before it expires',
    description:
      'Get a heads-up while there is still time to use the product. Choose how early you want to be reminded.',
    points: ['Push notifications on your phone', 'Daily reminder at a time you choose', 'Reminders per product'],
  },
  {
    icon: Snowflake,
    title: 'Storage zones',
    tagline: 'Know where everything lives',
    description:
      'Group items by fridge, freezer, pantry or medicine box, so you can see exactly what is where.',
    points: ['Fridge, freezer, pantry and medicine box', 'Filter by zone and category', 'Quickly spot what needs attention'],
  },
  {
    icon: Users,
    title: 'Household sharing',
    tagline: 'One inventory for the whole home',
    description:
      'Share your inventory with family or roommates so nobody buys a second carton of milk by accident.',
    points: ['Invite people to your household', 'Everyone sees the same inventory', 'Share a common shopping list'],
  },
  {
    icon: ChefHat,
    title: 'Smart recipes',
    tagline: 'Turn leftovers into meals',
    description:
      'Get recipe ideas built around the items that expire soon, and plan your meals for the week.',
    points: ['Recipes from what you already have', 'Meal planner', 'Less waste, fewer extra shopping trips'],
  },
  {
    icon: BarChart3,
    title: 'Waste insights',
    tagline: 'See where the money goes',
    description:
      'Understand what you use and what ends up in the bin, so you can buy smarter over time.',
    points: ['Usage and waste overview', 'Spot the categories you waste most', 'Track habits month by month'],
  },
];

const MORE = [
  'Calendar view',
  'Shopping list',
  'Push notifications',
  'Daily reminder',
  'Dark mode',
  'Categories',
  'Quantity tracking',
  'Product notes',
  'Household sharing',
  'Receipt scanner',
];

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 pb-8 pt-32 sm:px-6 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Features</span>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              Everything that keeps your home <span className="text-gradient-brand">fresh</span>
            </h1>
            <p className="mt-5 text-base font-medium leading-relaxed text-white/70 sm:text-lg">
              Simple tools that help you track expiry dates, reduce waste and save money.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delay={(i % 3) * 0.07}>
                  <div className="glass-card glass-card-hover flex h-full flex-col rounded-3xl p-7">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-[#7FB0FF] shadow-sm">
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="mt-5 text-xs font-extrabold uppercase tracking-wider text-[#F7A8AE]">
                      {feature.tagline}
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold text-white">{feature.title}</h2>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-white/70">
                      {feature.description}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {feature.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-sm font-semibold text-white">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7FB0FF]" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>

        </div>

        <AiShowcase />

        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <span className="eyebrow">And more</span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Everything else inside the app
            </h2>
            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2.5">
              {MORE.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-14 text-center">
            <Link href="/onboarding" className="btn-primary !px-8 !py-4">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </main>

      <Footer data={footerData} hideCta />
    </div>
  );
}
