'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  lightMode?: boolean;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  lightMode = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative min-w-[150px] text-left select-none ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-sm py-2.5 px-4 text-xs outline-none flex items-center justify-between font-semibold transition-all cursor-pointer ${
          lightMode 
            ? 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300' 
            : 'bg-slate-900/40 border border-slate-800 text-slate-350 hover:border-slate-700'
        }`}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`absolute left-0 right-0 mt-2 border rounded-sm shadow-xl overflow-hidden z-40 max-h-56 overflow-y-auto custom-scrollbar ${
              lightMode 
                ? 'bg-white border-slate-200 shadow-slate-100' 
                : 'bg-slate-900 border-slate-800 shadow-black/50'
            }`}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-xs font-semibold transition-colors block border-b last:border-0 ${
                  lightMode 
                    ? 'border-slate-100 hover:bg-slate-50' 
                    : 'border-slate-850/50 hover:bg-slate-800'
                } ${
                  value === option.value 
                    ? (lightMode ? 'text-emerald-600 bg-emerald-50/50' : 'text-emerald-400 bg-slate-850') 
                    : (lightMode ? 'text-slate-600' : 'text-slate-300')
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
