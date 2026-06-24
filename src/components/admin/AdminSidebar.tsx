'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Bell, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut,
  Search,
  Mail
} from 'lucide-react';

const SIDEBAR_LINKS = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { name: 'Users', icon: Users, href: '/admin/users' },
  { name: 'Products', icon: Package, href: '/admin/products' },
  { name: 'Notifications', icon: Bell, href: '/admin/notifications' },
  { name: 'Email Broadcast', icon: Mail, href: '/admin/email-broadcast' },
  { name: 'Testers', icon: Search, href: '/admin/testers' },
  { name: 'Reports', icon: FileText, href: '/admin/reports' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

interface AdminSidebarProps {
  isOpen: boolean;
}

import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  return (
    <aside 
      className={`${
        isOpen ? 'w-56' : 'w-16'
      } transition-all duration-300 border-r border-slate-800 bg-[#020617] flex flex-col z-50`}
    >
      <div className="p-4 flex items-center gap-2.5">
        <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
          <Image src="/logo.png" alt="Expirely" fill className="object-cover" priority />
        </div>
        {isOpen && <span className="font-bold text-lg tracking-tight text-slate-50">Expirely</span>}
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-1">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-4">
          {isOpen ? 'Menu' : '•••'}
        </div>
        {SIDEBAR_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all group ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 font-semibold text-sm' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 text-sm'
              }`}
            >
              <link.icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              {isOpen && <span>{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 mt-auto">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg border border-slate-800 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all group text-sm"
        >
          <LogOut className="w-4 h-4" />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
