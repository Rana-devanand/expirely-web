'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import footerData from '../../../data/landing/footer.json';
import { Sparkles, Utensils, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  daysLeft: number;
}

interface Recipe {
  title: string;
  prep: string;
  savings: string;
  calories: string;
  instructions: string;
  difficulty: string;
}

const INGREDIENTS: Ingredient[] = [
  { id: 'tomato',  name: 'Ripe Tomato',    emoji: '🍅', daysLeft: 2 },
  { id: 'basil',   name: 'Fresh Basil',    emoji: '🌿', daysLeft: 1 },
  { id: 'cheese',  name: 'Mozzarella',     emoji: '🧀', daysLeft: 3 },
  { id: 'chicken', name: 'Chicken Breast', emoji: '🍗', daysLeft: 2 },
  { id: 'rice',    name: 'Cooked Rice',    emoji: '🌾', daysLeft: 2 },
  { id: 'avocado', name: 'Avocado',        emoji: '🥑', daysLeft: 4 },
];

const PRESETS = [
  {
    ingredients: ['tomato', 'basil', 'cheese'],
    title: 'Tuscan Caprese Pasta',
    prep: '15 mins',
    savings: '$6.20 Saved',
    calories: '450 kcal',
    instructions:
      'Boil spaghetti. Toss with chopped ripe tomatoes, torn fresh basil, cubed mozzarella, olive oil, and a splash of balsamic glaze. Melt cheese slightly before serving.',
    difficulty: 'Easy',
  },
  {
    ingredients: ['chicken', 'rice', 'avocado'],
    title: 'Pantry Burrito Bowl',
    prep: '20 mins',
    savings: '$9.50 Saved',
    calories: '580 kcal',
    instructions:
      'Pan-fry seasoned chicken breast and slice. Reheat cooked rice. Assemble in a bowl with cubed avocado, a dollop of Greek yogurt (or sour cream), and salsa.',
    difficulty: 'Medium',
  },
];

const STATS = [
  {
    value: '34%',
    label: 'Grocery Bill Reduction',
    desc: 'By eating food you already bought instead of throwing it away, families save an average of 1/3 of their grocery spending.',
  },
  {
    value: '$1,200',
    label: 'Average Yearly Savings',
    desc: 'Typical four-member households throw away over $100 per month of edible products. Automating tracking prevents this loss.',
  },
  {
    value: '180 kg',
    label: 'CO₂ Emissions Saved',
    desc: 'Eliminating food waste redirects massive agricultural resources, directly lowering carbon footprints per household.',
  },
];

export default function RecipesPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);

  const toggleSelect = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleGenerate = () => {
    if (selected.length === 0) return;
    setLoading(true);
    setGeneratedRecipe(null);
    setTimeout(() => {
      setLoading(false);
      const matched = PRESETS.find((p) =>
        p.ingredients.every((id) => selected.includes(id))
      );
      if (matched) {
        setGeneratedRecipe(matched);
      } else {
        const names = INGREDIENTS.filter((i) => selected.includes(i.id)).map((i) => i.name);
        setGeneratedRecipe({
          title: 'Creative Kitchen Stir-Fry',
          prep: '10 mins',
          savings: `$${(selected.length * 2.1).toFixed(2)} Saved`,
          calories: '380 kcal',
          instructions: `Sauté your remaining ${names.join(' and ')} in a skillet with a dash of soy sauce, garlic, and sesame oil. Serve hot over any grains you have. Perfectly clears the fridge!`,
          difficulty: 'Easy',
        });
      }
    }, 1200);
  };

  return (
    <div
      className="min-h-screen flex flex-col grid-backdrop"
      style={{ background: 'var(--gradient-bg)', color: 'var(--color-text)' }}
    >
      <Navbar />

      <main className="flex-1 pt-32 pb-24">

        {/* ── Hero Header ───────────────────────────────────── */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 z-10">
          {/* Purple glow */}
          <div
            className="glow-blob top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
            style={{ background: 'rgba(168,85,247,0.15)' }}
          />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-shine text-xs font-semibold mb-6 border"
            style={{ borderColor: 'rgba(168,85,247,0.30)', color: 'var(--brand-300)' }}
          >
            <Utensils className="w-3.5 h-3.5" />
            AI-Driven Kitchen Assistant
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative z-10 text-3xl sm:text-5xl font-black mb-5 tracking-tight leading-tight"
            style={{ color: 'var(--color-text)' }}
          >
            Turn Nearing Expiries <br />
            <span className="text-gradient-brand">Into Delicious Meals</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Don&apos;t toss ingredients because you don&apos;t know what to make. Select items
            that are expiring and let Expirely suggest smart, budget-clearing recipes instantly.
          </motion.p>
        </section>

        {/* ── Interactive Simulator ─────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-24">
          <div
            className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border"
            style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(168,85,247,0.20)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(168,85,247,0.08)',
            }}
          >
            {/* Card glow */}
            <div
              className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl"
              style={{ background: 'rgba(168,85,247,0.12)' }}
            />

            {/* Card header */}
            <div className="relative z-10 text-center sm:text-left mb-8">
              <h2 className="text-lg sm:text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                AI Recipe Matcher Simulator
              </h2>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                Click items below (representing expiring inventory) to simulate recipe creation.
              </p>
            </div>

            {/* Ingredient grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 relative z-10">
              {INGREDIENTS.map((item) => {
                const isSelected = selected.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className="p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 cursor-pointer"
                    style={
                      isSelected
                        ? {
                            borderColor: 'rgba(168,85,247,0.6)',
                            background: 'rgba(168,85,247,0.12)',
                            boxShadow: '0 0 20px rgba(168,85,247,0.15)',
                          }
                        : {
                            borderColor: 'rgba(168,85,247,0.15)',
                            background: 'rgba(255,255,255,0.03)',
                          }
                    }
                  >
                    <div className="flex justify-between items-center w-full mb-3">
                      <span className="text-2xl">{item.emoji}</span>
                      {isSelected ? (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                          style={{ background: 'var(--gradient-brand)' }}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div
                          className="w-5 h-5 rounded-full border"
                          style={{ borderColor: 'rgba(168,85,247,0.30)' }}
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                        {item.name}
                      </div>
                      <div
                        className="text-[10px] font-semibold mt-1"
                        style={{ color: item.daysLeft <= 2 ? '#f87171' : 'var(--color-text-subtle)' }}
                      >
                        {item.daysLeft} days left
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action bar */}
            <div
              className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t pt-6 relative z-10"
              style={{ borderColor: 'rgba(168,85,247,0.15)' }}
            >
              <div className="text-xs font-semibold text-center sm:text-left" style={{ color: 'var(--color-text-muted)' }}>
                {selected.length === 0
                  ? 'Select one or more items to begin…'
                  : `${selected.length} items selected (Try Tomato + Basil + Cheese)`}
              </div>
              <button
                disabled={selected.length === 0 || loading}
                onClick={handleGenerate}
                className="w-full sm:w-auto text-white px-8 py-3 rounded-full font-bold text-xs active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5"
                style={{
                  background: 'var(--gradient-brand)',
                  boxShadow: 'var(--shadow-brand)',
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Matching Ingredients…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    Generate Recipe Match
                  </>
                )}
              </button>
            </div>

            {/* Generated recipe */}
            <AnimatePresence mode="wait">
              {generatedRecipe && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 p-6 rounded-2xl relative z-10 border"
                  style={{
                    background: 'rgba(168,85,247,0.07)',
                    borderColor: 'rgba(168,85,247,0.35)',
                    boxShadow: '0 8px 32px rgba(168,85,247,0.12)',
                  }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                    <h3
                      className="text-base font-bold flex items-center gap-2"
                      style={{ color: 'var(--brand-300)' }}
                    >
                      <Utensils className="w-4 h-4" style={{ color: 'var(--brand-400)' }} />
                      {generatedRecipe.title}
                    </h3>
                    <div className="flex gap-2">
                      <span
                        className="text-[10px] font-black px-2.5 py-1 rounded-full border"
                        style={{
                          background: 'rgba(168,85,247,0.15)',
                          borderColor: 'rgba(168,85,247,0.35)',
                          color: 'var(--brand-300)',
                        }}
                      >
                        {generatedRecipe.savings}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          borderColor: 'rgba(168,85,247,0.2)',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        {generatedRecipe.prep}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs leading-relaxed mb-4" style={{ color: 'var(--color-text-muted)' }}>
                    <strong className="block mb-1 font-bold" style={{ color: 'var(--color-text)' }}>
                      INSTRUCTIONS:
                    </strong>
                    {generatedRecipe.instructions}
                  </div>
                  <div
                    className="flex items-center gap-4 text-[10px] font-semibold border-t pt-4"
                    style={{ borderColor: 'rgba(168,85,247,0.15)', color: 'var(--color-text-subtle)' }}
                  >
                    <span>
                      Difficulty:{' '}
                      <strong style={{ color: 'var(--color-text)' }}>{generatedRecipe.difficulty}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Energy:{' '}
                      <strong style={{ color: 'var(--color-text)' }}>{generatedRecipe.calories}</strong>
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── Stats Row ─────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(12px)',
                  borderColor: 'rgba(168,85,247,0.18)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
                }}
              >
                <div
                  className="text-3xl font-black mb-2 text-gradient-brand"
                >
                  {stat.value}
                </div>
                <h4 className="font-bold text-sm mb-2" style={{ color: 'var(--color-text)' }}>
                  {stat.label}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────── */}
        <section className="relative max-w-4xl mx-auto px-4 text-center z-10">
          {/* Glow behind CTA */}
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full blur-3xl"
            style={{ background: 'rgba(168,85,247,0.12)' }}
          />

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 text-xl sm:text-3xl font-extrabold mb-6"
            style={{ color: 'var(--color-text)' }}
          >
            Get Custom Recipes in Your Pocket
          </motion.h2>
          <p
            className="relative z-10 text-sm mb-8 max-w-xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Download the Expirely dashboard app to unlock full barcode integration and
            automatically match recipe guides on your phone.
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/onboarding"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white active:scale-95 transition-all group"
              style={{ background: 'var(--gradient-brand)', boxShadow: 'var(--shadow-brand-lg)' }}
            >
              Start Onboarding Flow
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3.5 text-sm font-semibold transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              View Pricing Tiers
            </Link>
          </div>
        </section>
      </main>

      <Footer data={footerData} />
    </div>
  );
}
