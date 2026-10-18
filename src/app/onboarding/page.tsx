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
    colors: ["#F09199", "#F7A8AE"], // Peach
  },
  {
    title: "Organize Your Inventory",
    description: "Keep all your groceries and household items in one beautifully organized place.",
    image: "/onboarding/inventory.png",
    colors: ["#895B8A", "#A77CA8"], // Purple
  },
  {
    title: "Stay Ahead of Expiry Dates",
    description: "Receive timely alerts before products expire so you never waste food again.",
    image: "/onboarding/alerts.png",
    colors: ["#1E50A2", "#2A62BE"], // Lapis
  },
  {
    title: "Track Your Usage",
    description: "See smart analytics and insights about your consumption and savings.",
    image: "/onboarding/analytics.png",
    colors: ["#0E2147", "#1B2F5C"], // Navy
  },
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < ONBOARDING_DATA.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      window.location.href = '/login';
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = ONBOARDING_DATA[currentSlide];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
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
        <div className="lg:w-[45%] flex flex-col justify-center p-8 lg:p-20 relative z-20">
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
                        idx === currentSlide ? 'w-6 bg-[#1E50A2]' : 'w-1.5 bg-white/[0.06]'
                      }`} 
                    />
                  ))}
                </div>
                
                <h1 className="text-2xl lg:text-3xl font-extrabold text-white mb-4 leading-tight">
                  {slide.title}
                </h1>
                
                <p className="text-base text-white/70 mb-8 leading-relaxed">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3">
              {currentSlide > 0 && (
                <button
                  onClick={prevSlide}
                  className="p-4 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={nextSlide}
                className="flex-1 py-3.5 px-6 rounded-xl bg-[#1E50A2] text-white font-bold text-base hover:bg-[#17408A] transition-all shadow-xl shadow-[#1E50A2]/20 hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2.5 group"
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
