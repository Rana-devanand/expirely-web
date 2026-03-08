'use client';

import { motion } from 'framer-motion';
import { Star, Zap, Shield, Sparkles } from 'lucide-react';

export default function AnimatedCard() {
  const cards = [
    { title: 'Fast Performance', icon: <Zap className="w-6 h-6 text-yellow-400" />, delay: 0 },
    { title: 'Secure & Safe', icon: <Shield className="w-6 h-6 text-blue-400" />, delay: 0.2 },
    { title: 'Sparkling UI', icon: <Sparkles className="w-6 h-6 text-purple-400" />, delay: 0.4 },
    { title: 'Premium Features', icon: <Star className="w-6 h-6 text-pink-400" />, delay: 0.6 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: card.delay }}
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center hover:bg-white/20 transition-colors"
        >
          <div className="mb-4 bg-white/10 p-4 rounded-full">
            {card.icon}
          </div>
          <h3 className="text-xl font-bold text-white">{card.title}</h3>
          <p className="text-gray-300 mt-2 text-sm opacity-80">
            Discover the magic of Next.js and Framer Motion integration.
          </p>
        </motion.div>
      ))}
    </div>
  );
}
