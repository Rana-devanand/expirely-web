'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { PREMIUM_ENABLED } from '@/lib/flags';

const navLinks = [
  { name: 'Features', href: '/features' },
  { name: 'Recipes', href: '/recipes' },
  ...(PREMIUM_ENABLED ? [{ name: 'Pricing', href: '/pricing' }] : []),
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu when the route changes.
  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className={`border-b transition-all duration-300 ${
          scrolled || isOpen
            ? 'border-white/10 bg-black/80 backdrop-blur-xl'
            : 'border-transparent bg-black/30 backdrop-blur-md'
        }`}
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative h-9 w-9 overflow-hidden rounded-xl">
              <Image src="/logo1.png" alt="Expirely logo" fill className="object-cover" priority />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white">Expirely</span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3.5 py-2 text-[13px] font-bold transition-colors ${
                    active ? 'bg-white/12 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-[13px] font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              Log in
            </Link>
            <Link href="/onboarding" className="btn-primary !px-5 !py-2.5 !text-[13px]">
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="rounded-full p-2.5 text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-white/10 lg:hidden"
            >
              <div className="mx-auto max-w-7xl px-4 pb-5 pt-3 sm:px-6">
                <div className="flex flex-col gap-1">
                  {[{ name: 'Home', href: '/' }, ...navLinks].map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`rounded-xl px-4 py-3 text-sm font-bold ${
                          active ? 'bg-white/12 text-white' : 'text-white/75 hover:bg-white/10'
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link href="/login" className="btn-outline !py-3 !text-sm">
                    Log in
                  </Link>
                  <Link href="/onboarding" className="btn-primary !py-3 !text-sm">
                    Get started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
