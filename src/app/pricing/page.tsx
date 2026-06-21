'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import footerData from '../../../data/landing/footer.json';
import { Check, X, Shield, Sparkles, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const PLANS = [
  {
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    description: "Essential expiry tracking for single households.",
    features: [
      "Up to 25 active items",
      "Manual date entry only",
      "Basic push notifications",
      "Pantry & Fridge zones",
      "Single-device access"
    ],
    notFeatures: [
      "AI Barcode scanning",
      "SMS & Email alerts",
      "Smart recipe matches",
      "Household family sharing",
      "Advanced thrift analytics"
    ],
    buttonText: "Get Started Free",
    link: "/onboarding",
    popular: false,
    accent: "border-slate-900/60"
  },
  {
    name: "Pro",
    priceMonthly: 4.99,
    priceYearly: 3.75, // $45 billed annually
    description: "Automate scans, manage alerts, and optimize kitchen efficiency.",
    features: [
      "Unlimited active items",
      "Unlimited AI Barcode scans",
      "Push, Email & SMS notifications",
      "Full zone customization",
      "Smart recipe recommendations",
      "Thrift & food waste analytics",
      "Sync up to 3 devices"
    ],
    notFeatures: [
      "Household family sharing",
      "Priority server co-syncing"
    ],
    buttonText: "Start 14-Day Free Trial",
    link: "/onboarding",
    popular: true,
    accent: "border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
  },
  {
    name: "Family",
    priceMonthly: 9.99,
    priceYearly: 7.50, // $90 billed annually
    description: "Perfect for sharing food management and logs across a full household.",
    features: [
      "Everything in Pro plan",
      "Shared household inventory",
      "Invite up to 6 family members",
      "Real-time WebSocket co-sync",
      "Shared chore checklist logs",
      "Priority customer support",
      "Unlimited device support"
    ],
    notFeatures: [],
    buttonText: "Start Family Trial",
    link: "/onboarding",
    popular: false,
    accent: "border-slate-900/60"
  }
];

const COMPARISON_FEATURES = [
  { category: "Inventory Limits", free: "25 Items", pro: "Unlimited", family: "Unlimited" },
  { category: "AI Barcode Scanning", free: false, pro: "Unlimited", family: "Unlimited" },
  { category: "Alert Systems", free: "Push Only", pro: "Push, SMS & Email", family: "Push, SMS, Email & Slack" },
  { category: "Device Synced Limit", free: "1 Device", pro: "3 Devices", family: "Unlimited" },
  { category: "Family Shared Spaces", free: false, pro: false, family: "Unlimited Members" },
  { category: "Smart Recipe Recommendations", free: false, pro: true, family: true },
  { category: "Food Waste Financial Reports", free: false, pro: true, family: true },
  { category: "Priority Customer Support", free: false, pro: false, family: "24/7 Dedicated Support" }
];

const PRICING_FAQS = [
  { question: "How does the 14-day trial work?", answer: "When you sign up for Pro or Family, you get full access to all features for 14 days. You can cancel at any time during the trial and you won't be charged a single cent." },
  { question: "Can I switch billing cycles later?", answer: "Yes, you can upgrade, downgrade, or switch from monthly to annual billing (and vice versa) directly from your account settings page at any time." },
  { question: "How does Family sharing co-syncing work?", answer: "When you invite family members under the Family plan, they connect to your household database. Any item scanned, edited, or consumed syncs instantly across all devices using live WebSockets." },
  { question: "Do you offer refunds?", answer: "Yes, if you cancel within 30 days of your payment, we offer a full money-back guarantee. Just drop an email to our support desk." }
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 flex flex-col grid-backdrop">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Page Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 relative z-10">
          <div className="glow-blob top-12 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-emerald-500/5" />
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-shine text-emerald-400 text-xs font-semibold mb-6 border border-emerald-500/20"
          >
            <Shield className="w-3.5 h-3.5" />
            Simple, Transparent Pricing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight leading-tight"
          >
            Invest in Zero Waste, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              Save Money Daily
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Save up to $1,200/year in food waste with the tools you need. Select the plan that matches your household size.
          </motion.p>

          {/* Toggle Cycle */}
          <div className="flex justify-center items-center gap-3 relative z-20">
            <span className={`text-sm font-semibold transition-colors ${billingCycle === 'monthly' ? 'text-slate-100' : 'text-slate-500'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-7 rounded-full bg-slate-900 border border-slate-800 p-1 flex items-center cursor-pointer transition-colors relative"
            >
              <motion.div
                layout
                className="w-5 h-5 rounded-full bg-emerald-500"
                animate={{ x: billingCycle === 'yearly' ? 26 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${billingCycle === 'yearly' ? 'text-slate-100' : 'text-slate-500'}`}>
              Yearly 
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/20">Save 25%</span>
            </span>
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {PLANS.map((plan, index) => {
              const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`glass-card p-8 rounded-3xl border flex flex-col justify-between relative group ${plan.accent}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 tracking-wider uppercase border border-emerald-400/20">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      MOST POPULAR
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-slate-100 mb-2">{plan.name}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed mb-6 min-h-[36px]">{plan.description}</p>
                    
                    {/* Price Block */}
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-4xl sm:text-5xl font-black text-slate-50">${price.toFixed(2)}</span>
                      <span className="text-slate-400 text-xs font-semibold">/ month</span>
                      {billingCycle === 'yearly' && plan.priceYearly > 0 && (
                        <span className="text-[10px] text-slate-500 font-bold block ml-2">
                          (Billed annually)
                        </span>
                      )}
                    </div>

                    {/* Features checklist */}
                    <div className="border-t border-slate-900/60 pt-6 space-y-4">
                      <h4 className="text-[11px] font-bold text-slate-300 tracking-wider uppercase">Included Features:</h4>
                      <ul className="space-y-3">
                        {plan.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5 text-xs text-slate-300 leading-tight">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                        {plan.notFeatures.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5 text-xs text-slate-500 leading-tight opacity-50">
                            <X className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link
                      href={plan.link}
                      className={`w-full text-center py-3.5 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                        plan.popular
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-98'
                          : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800/40 active:scale-98'
                      }`}
                    >
                      {plan.buttonText}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black mb-3">Compare All Plans</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Detailed overview of features side-by-side.</p>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden border-slate-900/60 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-900 text-slate-300">
                    <th className="p-4 font-bold">Feature</th>
                    <th className="p-4 font-bold text-center">Free</th>
                    <th className="p-4 font-bold text-center text-emerald-400">Pro</th>
                    <th className="p-4 font-bold text-center">Family</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/50">
                  {COMPARISON_FEATURES.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/25 transition-colors">
                      <td className="p-4 font-semibold text-slate-200">{row.category}</td>
                      <td className="p-4 text-center text-slate-400">
                        {typeof row.free === 'boolean' ? (row.free ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-700 mx-auto" />) : row.free}
                      </td>
                      <td className="p-4 text-center text-slate-200 font-medium">
                        {typeof row.pro === 'boolean' ? (row.pro ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-700 mx-auto" />) : row.pro}
                      </td>
                      <td className="p-4 text-center text-slate-400">
                        {typeof row.family === 'boolean' ? (row.family ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-700 mx-auto" />) : row.family}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1 text-slate-500 text-xs font-bold uppercase mb-2">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">Pricing Help & Support</h2>
          </div>

          <div className="space-y-3">
            {PRICING_FAQS.map((faq, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl border-slate-900/40">
                <h4 className="font-bold text-slate-200 text-sm mb-2">{faq.question}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer data={footerData} />
    </div>
  );
}
