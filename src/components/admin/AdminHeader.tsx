'use client';

import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#020617] shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="max-w-md w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-500 text-slate-50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
         <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative text-slate-400">
           <Bell className="w-5 h-5" />
           <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020617]" />
         </button>
         <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-emerald-500/30 transition-colors">
           A
         </div>
      </div>
    </header>
  );
}
