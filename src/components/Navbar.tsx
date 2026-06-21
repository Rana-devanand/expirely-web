'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Smart Recipes', href: '/recipes' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-md border-b'
          : 'bg-transparent'
      }`}
      style={scrolled ? {
        background: 'rgba(8,13,30,0.85)',
        borderColor: 'rgba(168,85,247,0.2)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105 overflow-hidden">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo1.png"
                  alt="Expirely Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight"
              style={{ background: 'linear-gradient(135deg, #f1f5f9 30%, #d8b4fe 70%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Expirely
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-2 px-1 text-[13px] font-semibold tracking-wide transition-colors duration-300 ${
                    isActive ? '' : 'hover:opacity-100'
                  }`}
                  style={{ color: isActive ? 'var(--brand-400)' : 'var(--color-text-muted)' }}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                      style={{ background: 'var(--gradient-brand)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/onboarding"
              className="relative overflow-hidden group px-5 py-2.5 rounded-full font-bold text-xs text-white flex items-center gap-1.5 active:scale-95 transition-all"
              style={{ background: 'var(--gradient-brand)', boxShadow: 'var(--shadow-brand)' }}
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="md:hidden border-b overflow-hidden"
            style={{ background: 'rgba(8,13,30,0.96)', borderColor: 'rgba(168,85,247,0.2)' }}
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-3 py-3.5 text-sm font-medium rounded-lg transition-colors`}
                    style={isActive
                      ? { color: 'var(--brand-300)', background: 'rgba(168,85,247,0.10)', borderLeft: '2px solid var(--brand-500)', paddingLeft: '10px' }
                      : { color: 'var(--color-text-muted)' }}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 flex flex-col gap-2.5">
                <Link
                  href="/admin/login"
                  className="w-full text-center py-3 text-sm font-semibold rounded-xl border"
                  style={{ color: 'var(--color-text-muted)', borderColor: 'rgba(168,85,247,0.2)' }}
                  onClick={() => setIsOpen(false)}
                >
                  Admin Login
                </Link>
                <Link
                  href="/onboarding"
                  className="w-full py-3 rounded-xl font-bold text-sm text-center text-white"
                  style={{ background: 'var(--gradient-brand)', boxShadow: 'var(--shadow-brand)' }}
                  onClick={() => setIsOpen(false)}
                >
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
