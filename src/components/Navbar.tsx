'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Onboarding', href: '/onboarding' },
  { name: 'Testers', href: '/testers' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#020617]/80 backdrop-blur-lg shadow-lg border-b border-slate-800' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group transition-transform duration-300 overflow-hidden">
              <div className="relative w-8 h-8">
                <Image 
                  src="/logo.png" 
                  alt="Expirely Logo" 
                  fill 
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-50 to-slate-300">
              Expirely
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-[#10b981] font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/admin/login" className="text-slate-300 hover:text-slate-50 font-semibold px-4 py-2 transition-colors text-sm">
              Admin Login
            </Link>
            <Link href="/onboarding" className="bg-[#10b981] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-[#059669] transition-all flex items-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-slate-50 hover:bg-slate-800"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#020617] border-b border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-4 text-base font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/admin/login" className="w-full text-center py-3 font-semibold text-slate-300 hover:text-emerald-400" onClick={() => setIsOpen(false)}>
                  Admin Login
                </Link>
                <Link href="/onboarding" className="w-full bg-[#10b981] text-white py-3 rounded-full font-bold text-center" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
