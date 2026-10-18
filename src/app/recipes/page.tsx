'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarClock,
  Check,
  ChefHat,
  Clock,
  Loader2,
  ShoppingBasket,
  Sparkles,
  Utensils,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import footerData from '../../../data/landing/footer.json';

interface Ingredient {
  id: string;
  name: string;
  image: string;
  daysLeft: number;
}

interface Recipe {
  title: string;
  prep: string;
  difficulty: string;
  instructions: string;
}

const INGREDIENTS: Ingredient[] = [
  { id: 'avocado', name: 'Avocado', image: '/products/global/avocado.svg', daysLeft: 2 },
  { id: 'cheese', name: 'Cheddar', image: '/products/global/cheese.svg', daysLeft: 5 },
  { id: 'croissant', name: 'Croissant', image: '/products/global/croissant.svg', daysLeft: 1 },
  { id: 'pasta', name: 'Pasta', image: '/products/global/pasta.svg', daysLeft: 30 },
  { id: 'oil', name: 'Olive oil', image: '/products/global/olive-oil.svg', daysLeft: 90 },
  { id: 'juice', name: 'Orange juice', image: '/products/global/orange-juice.svg', daysLeft: 3 },
];

const PRESETS: (Recipe & { ingredients: string[] })[] = [
  {
    ingredients: ['pasta', 'cheese', 'oil'],
    title: 'Cheesy Olive Oil Pasta',
    prep: '15 mins',
    difficulty: 'Easy',
    instructions:
      'Boil the pasta until al dente. Toss it with a generous glug of olive oil, grated cheddar and black pepper until the cheese melts into a glossy sauce.',
  },
  {
    ingredients: ['avocado', 'croissant', 'cheese'],
    title: 'Avocado and Cheese Croissant',
    prep: '10 mins',
    difficulty: 'Easy',
    instructions:
      'Halve the croissant, layer it with mashed avocado and slices of cheddar, then warm it in a pan or oven until the cheese just softens.',
  },
];

const HOW_IT_WORKS = [
  {
    icon: ShoppingBasket,
    title: 'Start from your inventory',
    description: 'Expirely already knows what you have at home, so there is nothing extra to type in.',
  },
  {
    icon: CalendarClock,
    title: 'Expiring items come first',
    description: 'Items closest to their expiry date are suggested first, so they get used before they go to waste.',
  },
  {
    icon: Utensils,
    title: 'Cook and save',
    description: 'Pick a recipe, cook it, and mark the items as used. Your inventory stays up to date.',
  },
];

const IDEAS = [
  {
    title: 'Cheesy Olive Oil Pasta',
    time: '15 mins',
    uses: ['pasta', 'cheese', 'oil'],
    note: 'A fast weeknight dinner from pantry basics.',
  },
  {
    title: 'Avocado and Cheese Croissant',
    time: '10 mins',
    uses: ['avocado', 'croissant', 'cheese'],
    note: 'Use up soft avocados and day-old croissants.',
  },
  {
    title: 'Citrus Glazed Pasta',
    time: '20 mins',
    uses: ['pasta', 'juice', 'oil'],
    note: 'Orange juice reduced with olive oil makes a bright sauce.',
  },
  {
    title: 'Avocado Pasta Salad',
    time: '15 mins',
    uses: ['avocado', 'pasta', 'oil'],
    note: 'Cold pasta tossed with creamy avocado and olive oil.',
  },
];

const TIPS = [
  'Cook the items that expire first, then plan around the rest.',
  'Plan two or three meals before you shop, and buy only what is missing.',
  'Store produce and dairy where they last longest. The Storage guru can help.',
  'Freeze what you will not use in time, such as bread and cooked pasta.',
  'Check your list before heading out so you do not buy duplicates.',
];

const byId = (id: string) => INGREDIENTS.find((i) => i.id === id)!;

export default function RecipesPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const toggle = (id: string) => {
    setRecipe(null);
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const generate = () => {
    if (!selected.length) return;
    setLoading(true);
    setRecipe(null);
    setTimeout(() => {
      const match = PRESETS.find((p) => p.ingredients.every((id) => selected.includes(id)));
      if (match) {
        setRecipe(match);
      } else {
        const names = INGREDIENTS.filter((i) => selected.includes(i.id)).map((i) => i.name.toLowerCase());
        setRecipe({
          title: 'Quick Kitchen Skillet',
          prep: '10 mins',
          difficulty: 'Easy',
          instructions: `Chop and sauté ${names.join(', ')} in a pan with a little oil, season to taste and serve warm.`,
        });
      }
      setLoading(false);
    }, 900);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 pb-8 pt-32 sm:px-6 md:pt-40">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">
              <ChefHat className="h-3.5 w-3.5" /> Smart recipes
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              Turn items that are about to expire into <span className="text-gradient-brand">meals</span>
            </h1>
            <p className="mt-5 text-base font-medium leading-relaxed text-white/70 sm:text-lg">
              Expirely suggests recipes from what you already have, starting with what expires first. Try the
              demo below.
            </p>
          </Reveal>

          {/* Demo */}
          <Reveal className="mt-12">
            <div className="glass-card rounded-3xl p-5 sm:p-8">
              <h2 className="text-lg font-extrabold text-white">Recipe matcher demo</h2>
              <p className="mt-1 text-sm font-medium text-white/60">
                Pick the items you want to use up. This is a simplified demo of the in-app feature.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {INGREDIENTS.map((item) => {
                  const active = selected.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggle(item.id)}
                      aria-pressed={active}
                      className={`group relative rounded-2xl border p-3 text-left transition ${
                        active
                          ? 'border-[#7FB0FF] bg-white/10 shadow-[0_0_24px_rgba(127,176,255,0.25)]'
                          : 'border-white/10 bg-white/[0.04] hover:border-white/25'
                      }`}
                    >
                      {active && (
                        <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#2A62BE] text-white">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      )}
                      <div className="relative mx-auto h-28 w-28 sm:h-32 sm:w-32">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          sizes="128px"
                          className="object-contain transition group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-sm font-extrabold text-white">{item.name}</div>
                        <div
                          className={`text-xs font-bold ${item.daysLeft <= 3 ? 'text-[#FF8A9A]' : 'text-white/50'}`}
                        >
                          {item.daysLeft} {item.daysLeft === 1 ? 'day' : 'days'} left
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={generate}
                disabled={!selected.length || loading}
                className="btn-primary mt-6 w-full !py-4 disabled:opacity-40"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {loading ? 'Finding a recipe…' : 'Suggest a recipe'}
              </button>

              {recipe && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-extrabold text-white">{recipe.title}</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-white/70">
                      <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                        <Clock className="h-3 w-3" /> {recipe.prep}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1">{recipe.difficulty}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-white/75">{recipe.instructions}</p>
                </div>
              )}
            </div>
          </Reveal>

          {/* How it works */}
          <section className="mt-20">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">How it works</span>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Recipes that fit your kitchen
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {HOW_IT_WORKS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Reveal key={step.title} delay={i * 0.07}>
                    <div className="glass-card h-full rounded-3xl p-6">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2A62BE]/25 text-[#7FB0FF]">
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className="mt-4 text-base font-extrabold text-white">{step.title}</h3>
                      <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">{step.description}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* Ideas */}
          <section className="mt-20">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">Recipe ideas</span>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                A taste of what you can cook
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {IDEAS.map((idea, i) => (
                <Reveal key={idea.title} delay={(i % 2) * 0.07}>
                  <div className="glass-card glass-card-hover h-full rounded-3xl p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-extrabold text-white">{idea.title}</h3>
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
                        <Clock className="h-3 w-3" /> {idea.time}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-white/70">{idea.note}</p>
                    <div className="mt-4 flex gap-2">
                      {idea.uses.map((id) => {
                        const item = byId(id);
                        return (
                          <div
                            key={id}
                            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-3"
                          >
                            <span className="relative h-9 w-9">
                              <Image src={item.image} alt="" fill unoptimized sizes="36px" className="object-contain" />
                            </span>
                            <span className="text-xs font-bold text-white/80">{item.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Tips */}
          <section className="mt-20">
            <Reveal>
              <div className="glass-card rounded-3xl p-7 sm:p-10">
                <h2 className="text-2xl font-black text-white">Simple ways to waste less food</h2>
                <ul className="mt-6 space-y-3.5">
                  {TIPS.map((tip) => (
                    <li key={tip} className="flex items-start gap-3 text-sm font-semibold leading-relaxed text-white/80 sm:text-base">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-[#7FB0FF]" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </section>

          <Reveal className="mt-14 text-center">
            <p className="text-sm font-semibold text-white/60">Get recipes from your own inventory in the app.</p>
            <Link href="/onboarding" className="btn-primary mt-4 !px-8 !py-4">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </main>

      <Footer data={footerData} />
    </div>
  );
}
