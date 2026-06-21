'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HeroMockup() {
  return (
    <div className="flex w-full items-center justify-center px-8 sm:px-12 md:justify-end md:px-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative"
      >
        {/* Purple radial glow behind the phone */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 scale-[1.4] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.28) 0%, rgba(99,102,241,0.14) 50%, transparent 75%)' }}
        />

        {/* Floating phone — gentle bob animation */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10"
        >
          {/* Phone shell */}
          <div className="relative mx-auto w-[240px] sm:w-[258px] md:w-[270px]">
            {/* Shadow puddle beneath the phone */}
            <div
              className="absolute -bottom-6 left-1/2 h-8 w-4/5 -translate-x-1/2 rounded-full blur-2xl"
              style={{ background: 'rgba(168,85,247,0.3)' }}
            />

            <div
              className="relative overflow-hidden rounded-[2.8rem] border shadow-2xl"
              style={{
                height: 'clamp(480px, 55vw, 540px)',
                borderColor: 'rgba(168,85,247,0.3)',
                // boxShadow: '0 32px 80px rgba(168,85,247,0.25), 0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              <Image
                src="/phone-light.png"
                alt="Expirely App Screenshot"
                fill
                className="object-fill"
                priority
                sizes="(max-width: 640px) 240px, (max-width: 768px) 258px, 290px"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
