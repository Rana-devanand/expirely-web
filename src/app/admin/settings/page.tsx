'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  Bell, 
  Globe, 
  Check, 
  X, 
  Plus,
  Save,
  Shield,
  Mail,
  Smartphone,
  FileText
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

const INITIAL_CATEGORIES = ['Food', 'Dairy', 'Medicine', 'Cosmetics', 'Household', 'Beverages', 'Supplements'];

export default function AdminSettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [newCategory, setNewCategory] = useState('');

  const removeCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-16">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-50">Settings</h1>
            <p className="text-slate-400 text-xs mt-1">Configure your application</p>
          </div>

          <div className="max-w-4xl space-y-6">
            {/* Manage Categories */}
            <section className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Manage Categories
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-xl group transition-all">
                    <span className="text-xs font-medium text-slate-300 group-hover:text-slate-100">{cat}</span>
                    <button 
                      onClick={() => removeCategory(cat)}
                      className="p-0.5 hover:bg-red-500/20 rounded-md text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 max-w-sm">
                <input 
                  type="text" 
                  placeholder="New category..." 
                  className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 placeholder:text-slate-600"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                />
                <button 
                  onClick={addCategory}
                  className="bg-[#10b981] text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#059669] transition-all active:scale-[0.98]"
                >
                  Add
                </button>
              </div>
            </section>

            {/* Notification Settings */}
            <section className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                Notification Settings
              </h3>

              <div className="space-y-6">
                {[
                  { id: 'email', label: 'Email Notifications', desc: 'Send email alerts for expiring products', icon: Mail },
                  { id: 'push', label: 'Push Notifications', desc: 'Enable push notifications for mobile users', icon: Smartphone },
                  { id: 'digest', label: 'Daily Digest', desc: 'Send a daily summary of expiring products', icon: Globe },
                  { id: 'weekly', label: 'Weekly Reports', desc: 'Automatically send weekly analytics reports', icon: FileText }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex gap-4">
                      <div className="w-9 h-9 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200">{item.label}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-800 border border-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-emerald-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500/20 peer-checked:border-emerald-500/40 peer-checked:after:bg-emerald-400"></div>
                    </label>
                  </div>
                ))}
              </div>
            </section>

            {/* App Configuration */}
            <section className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                App Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                   <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">App Name</label>
                   <input type="text" defaultValue="Expirely" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200" />
                </div>
                <div className="col-span-1 md:col-span-2">
                   <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Support Email</label>
                   <input type="email" defaultValue="support@expirely.app" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200" />
                </div>
                <div>
                   <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Default Reminder Days</label>
                   <input type="number" defaultValue="3" className="w-24 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200" />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <button className="flex items-center gap-2 bg-[#10b981] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#059669] transition-all active:scale-[0.98] shadow-lg shadow-emerald-950/20">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
