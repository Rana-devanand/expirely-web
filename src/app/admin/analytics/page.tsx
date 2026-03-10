'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Bell, 
  Calendar,
  Layers,
  Activity
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

// Mock Data
const GROWTH_DATA = [
  { name: 'Sep', users: 2000 },
  { name: 'Oct', users: 3500 },
  { name: 'Nov', users: 5100 },
  { name: 'Dec', users: 7200 },
  { name: 'Jan', users: 9500 },
  { name: 'Feb', users: 11000 },
  { name: 'Mar', users: 12847 },
];

const PRODUCT_TRACKING_DATA = [
  { name: 'Sep', active: 1200, expired: 200 },
  { name: 'Oct', active: 2100, expired: 350 },
  { name: 'Nov', active: 3400, expired: 480 },
  { name: 'Dec', active: 4100, expired: 520 },
  { name: 'Jan', active: 5800, expired: 640 },
  { name: 'Feb', active: 7200, expired: 710 },
  { name: 'Mar', active: 10400, expired: 890 },
];

const SUCCESS_RATE_DATA = [
  { name: 'Sep', sent: 1000, delivered: 950 },
  { name: 'Oct', sent: 2300, delivered: 2150 },
  { name: 'Nov', sent: 3400, delivered: 3320 },
  { name: 'Dec', sent: 4800, delivered: 4680 },
  { name: 'Jan', sent: 6200, delivered: 6100 },
  { name: 'Feb', sent: 8500, delivered: 8300 },
  { name: 'Mar', sent: 12500, delivered: 12100 },
];

const ALERT_STATS_DATA = [
  { name: 'W1', alerts: 120, color: '#f59e0b' },
  { name: 'W2', alerts: 180, color: '#f59e0b' },
  { name: 'W3', alerts: 95, color: '#f59e0b' },
  { name: 'W4', alerts: 240, color: '#f59e0b' },
  { name: 'W5', alerts: 160, color: '#f59e0b' },
  { name: 'W6', alerts: 210, color: '#f59e0b' },
  { name: 'W7', alerts: 280, color: '#f59e0b' },
  { name: 'W8', alerts: 190, color: '#f59e0b' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-2xl">
        <p className="text-slate-400 text-[10px] font-bold mb-2 uppercase tracking-wider">{label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
            <p className="text-sm font-bold text-slate-100">
              {item.name}: {item.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminAnalyticsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-16">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-50">Analytics</h1>
            <p className="text-slate-400 text-xs mt-1">Advanced analytics and insights</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Trend */}
            <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                User Growth Trend
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={GROWTH_DATA}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Product Tracking Analytics */}
            <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                Product Tracking Analytics
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PRODUCT_TRACKING_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="active" name="Active Products" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                    <Bar dataKey="expired" name="Expired Products" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Notification Success Rate */}
            <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                Notification Success Rate
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SUCCESS_RATE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="sent" name="Sent" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey="delivered" name="Delivered" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expiry Alerts Statistics */}
            <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                Expiry Alerts Statistics
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ALERT_STATS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="alerts" name="Alerts Sent" radius={[4, 4, 0, 0]} barSize={40}>
                      {ALERT_STATS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
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
