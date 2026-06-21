'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import footerData from '../../../data/landing/footer.json';
import { Scan, Bell, PieChart, Users, Snowflake, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

const FEATURES_DETAILS = [
  {
    icon: Scan,
    title: "AI Barcode Scanning",
    tagline: "Instant Inventory Input",
    description: "Scan product barcodes using your smartphone camera. Expirely automatically identifies the item name, brand, category, and suggests standard expiry dates based on global food database averages.",
    benefits: ["99.4% database accuracy", "Automatic item categorization", "Manual shelf-life adjustment overrides"],
    accent: "from-emerald-500 to-teal-400"
  },
  {
    icon: Bell,
    title: "Smart Notification Engine",
    tagline: "Configurable Expiry Alerts",
    description: "Get alerts before your food spoils. Choose to receive push notifications, text messages, or weekly digest emails. Customize how many days in advance you want to be warned for different food groups.",
    benefits: ["Custom warning thresholds per item", "Quiet hours schedule support", "Multi-device notification sync"],
    accent: "from-amber-500 to-orange-400"
  },
  {
    icon: Snowflake,
    title: "Storage Zone Management",
    tagline: "Fridge, Pantry & Freezer Zones",
    description: "Group items into thermal storage zones. See exactly what items are sitting in your deep freezer versus the vegetable drawer, and get temperature-sensitive tips to keep your groceries fresh.",
    benefits: ["Visual zone division graphics", "Fridge/Freezer specific guidelines", "Batch move items between zones"],
    accent: "from-blue-500 to-cyan-400"
  },
  {
    icon: PieChart,
    title: "Consumption & Savings Analytics",
    tagline: "Visualize Your Food Waste Impact",
    description: "Our intelligence portal shows your waste-reduction index. Discover which categories of products you waste most frequently (e.g., dairy vs. produce) and track the exact dollars saved over time.",
    benefits: ["Monthly waste financial loss reports", "Success and thrift achievements", "Exportable CSV analytics data"],
    accent: "from-indigo-500 to-purple-400"
  },
  {
    icon: Users,
    title: "Family Sync & Cloud Sharing",
    tagline: "One Inventory, Entire Household",
    description: "Keep your family on the same page. Shared lists update in real-time across multiple devices so nobody buys double milk or consumes expiring groceries without the app updating.",
    benefits: ["Instant WebSocket sync capabilities", "Unlimited member invitations", "Admin control over sharing permissions"],
    accent: "from-pink-500 to-rose-400"
  },
  {
    icon: ShieldCheck,
    title: "Eco-Impact Milestones",
    tagline: "Reduce Your Carbon Footprint",
    description: "Every item consumed before expiry translates to reduced landfill emissions. Watch your household eco-savings badge grow and unlock impact milestones to share with friends.",
    benefits: ["CO2 savings tracking metric", "Landfill redirection calculations", "Social impact sharing templates"],
    accent: "from-emerald-400 to-emerald-600"
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 flex flex-col grid-backdrop">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Header Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20 relative z-10">
          <div className="glow-blob top-12 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-emerald-500/5" />
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-shine text-emerald-400 text-xs font-semibold mb-6 border border-emerald-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Explore the Technology
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight leading-tight"
          >
            Engineered to Stop <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              Household Waste
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Expirely brings cutting-edge barcode algorithms, cloud synchronization, and smart alert engines together to make managing your kitchen completely effortless.
          </motion.p>
        </section>

        {/* Feature Rows / Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES_DETAILS.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index % 2 * 0.1 }}
                  className="glass-card glass-card-hover p-8 sm:p-10 rounded-3xl flex flex-col justify-between border-slate-900/60 relative overflow-hidden group"
                >
                  {/* Accent Glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feat.accent} opacity-5 group-hover:opacity-10 blur-2xl transition-opacity pointer-events-none`} />
                  
                  <div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${feat.accent} rounded-2xl flex items-center justify-center mb-6 shadow-md text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase mb-1 block">
                      {feat.tagline}
                    </span>
                    <h3 className="text-xl font-bold text-slate-50 mb-4 group-hover:text-emerald-400 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                      {feat.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-900/50 pt-5 mt-4">
                    <h4 className="text-xs font-bold text-slate-300 mb-3 tracking-wide">KEY ADVANTAGES:</h4>
                    <ul className="space-y-2">
                      {feat.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="flex items-center gap-2 text-xs text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Dynamic Simulated Scanner Component */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-20">
          <div className="glass-card p-8 sm:p-12 rounded-3xl border-slate-900/60 text-center relative overflow-hidden flex flex-col items-center">
            <div className="glow-blob -bottom-24 bg-emerald-500/10 w-[400px] h-[200px]" />
            <h2 className="text-2xl sm:text-3xl font-black mb-4 relative z-10">Experience the Speed</h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mb-10 relative z-10 leading-relaxed">
              Our advanced scanning engine processes barcodes in under 150ms, querying massive food databases to retrieve nutritional information and ideal storage conditions immediately.
            </p>
            
            {/* Interactive Scanner Graphics */}
            <div className="w-full max-w-md bg-slate-950/80 rounded-2xl border border-slate-900 p-6 relative z-10 shadow-2xl flex flex-col items-center">
              <div className="w-full aspect-video bg-slate-900 rounded-xl relative overflow-hidden border border-slate-800 flex items-center justify-center">
                {/* Scanner Target */}
                <div className="absolute w-2/3 h-1/2 border-2 border-emerald-500/40 rounded-xl flex items-center justify-center">
                  <div className="w-full h-0.5 bg-emerald-500/70 shadow-[0_0_10px_#10b981] animate-bounce" />
                </div>
                {/* Mock Barcode Graphic */}
                <div className="flex gap-1.5 items-center opacity-45">
                  <div className="w-1.5 h-16 bg-white" />
                  <div className="w-3.5 h-16 bg-white" />
                  <div className="w-1 h-16 bg-white" />
                  <div className="w-2 h-16 bg-white" />
                  <div className="w-4 h-16 bg-white" />
                  <div className="w-1.5 h-16 bg-white" />
                  <div className="w-3.5 h-16 bg-white" />
                </div>
                {/* Floating item label after scan simulation */}
                <div className="absolute bottom-3 left-3 bg-emerald-500/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide flex items-center gap-1">
                  <Scan className="w-3 h-3 animate-pulse" />
                  SCAN SUCCESS: MILK
                </div>
              </div>
              <div className="mt-5 w-full flex flex-col gap-2.5 text-left bg-slate-950 p-4 rounded-xl border border-slate-900">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-100">UPC Code:</span>
                  <span className="font-mono text-slate-500">012000000133</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-100">Match Name:</span>
                  <span className="text-emerald-400 font-bold">Organic Semi-Skimmed Milk 1L</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-100">Suggested Expiry:</span>
                  <span className="text-slate-400 font-semibold">June 29, 2026 (9 Days)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-4xl mx-auto px-4 text-center relative z-10 mt-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-50 mb-6">
            Help Shape the Future of Food Management
          </h2>
          <p className="text-slate-400 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
            Become a beta tester and get exclusive first access to barcode scanning, customizable alerts, and dashboard features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/testers" className="bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-xl shadow-emerald-950/20 active:scale-95 group">
              Apply as Tester
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/" className="text-slate-400 hover:text-white px-6 py-3.5 text-sm font-semibold transition-colors">
              Return Home
            </Link>
          </div>
        </section>
      </main>

      <Footer data={footerData} />
    </div>
  );
}
