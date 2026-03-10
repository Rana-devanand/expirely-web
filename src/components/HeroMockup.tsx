'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HeroMockup() {
  return (
    <div className="flex justify-center lg:justify-end items-center w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        {/* Glow effect - adjusted for better visibility */}
        <div className="absolute -inset-10 bg-gradient-to-tr from-[#10b981]/20 to-emerald-300/20 blur-[60px] rounded-full -z-10" />
        
        <motion.div
          animate={{ 
            y: [0, -15, 0],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative z-10"
        >
          {/* Phone Template Container */}
          <div className="bg-gray-900 p-2 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-4 border-gray-800 overflow-hidden w-[260px] md:w-[260px]">
             <div className="bg-white h-[500px] md:h-[520px] w-full rounded-[2.2rem] overflow-hidden relative border border-gray-200 pt-10">
                {/* User's App Screenshot */}
                <Image 
                  src="/phone-light.jpeg" 
                  alt="App Screenshot" 
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 260px, 280px"
                />
                
                {/* Notch/Island Mock */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20" />
                
                {/* Reflection Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10" />
             </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
