'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const ONBOARDING_DATA = [
  {
    title: "Scan Products Instantly",
    description: "Use barcode scanning to add items quickly and accurately to your smart inventory.",
    image: "/onboarding/person-scanning.jpg",
    colors: ["#F97316", "#FB923C"], // Orange
  },
  {
    title: "Organize Your Inventory",
    description: "Keep all your groceries and household items in one beautifully organized place.",
    image: "/onboarding/inventory.png",
    colors: ["#7C3AED", "#8B5CF6"], // Purple
  },
  {
    title: "Stay Ahead of Expiry Dates",
    description: "Receive timely alerts before products expire so you never waste food again.",
    image: "/onboarding/alerts.png",
    colors: ["#0D9488", "#14B8A6"], // Teal
  },
  {
    title: "Track Your Usage",
    description: "See smart analytics and insights about your consumption and savings.",
    image: "/onboarding/analytics.png",
    colors: ["#0F172A", "#334155"], // Dark/Navy
  },
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < ONBOARDING_DATA.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      window.location.href = '/testers';
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = ONBOARDING_DATA[currentSlide];

  return (
    <div className="h-screen bg-[#020617] flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col lg:flex-row pt-20 h-full overflow-hidden">
        {/* Left Side: Illustration with Dynamic Background */}
        <div className="relative flex-1 flex items-center justify-center p-6 lg:p-16 overflow-hidden lg:h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-0"
              style={{ 
                background: `linear-gradient(135deg, ${slide.colors[0]}, ${slide.colors[1]})` 
              }}
            />
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="relative z-10 w-full max-w-lg aspect-square lg:aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Content & Controls */}
        <div className="lg:w-[45%] flex flex-col justify-center p-8 lg:p-20 bg-[#020617] relative z-20">
          <div className="max-w-md mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex gap-1.5 mb-6">
                  {ONBOARDING_DATA.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1 rounded-full transition-all duration-300 ${
                        idx === currentSlide ? 'w-6 bg-emerald-500' : 'w-1.5 bg-slate-800'
                      }`} 
                    />
                  ))}
                </div>
                
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-50 mb-4 leading-tight">
                  {slide.title}
                </h1>
                
                <p className="text-base text-slate-400 mb-8 leading-relaxed">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3">
              {currentSlide > 0 && (
                <button
                  onClick={prevSlide}
                  className="p-4 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-50 hover:bg-slate-800 transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={nextSlide}
                className="flex-1 py-3.5 px-6 rounded-xl bg-[#10b981] text-white font-bold text-base hover:bg-[#059669] transition-all shadow-xl shadow-emerald-900/20 hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2.5 group"
              >
                {currentSlide === ONBOARDING_DATA.length - 1 ? 'GET STARTED' : 'NEXT'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
