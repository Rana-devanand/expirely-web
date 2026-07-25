'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  Menu,
  X,
  Smartphone,
  CheckCircle2,
  Clock,
  Loader2,
  HardDrive,
  Activity,
  Tags
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetStatsQuery, useGetChartsQuery } from '@/store/api/dashboardApi';
import { useGetAdminCategoriesQuery } from '@/store/api/categoryApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { dashboardService } from '@/services/dashboard.service';
import toast from 'react-hot-toast';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-2xl">
        <p className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="text-sm font-bold" style={{ color: item.color || item.fill }}>
            {item.name}: {item.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Use RTK Query hooks for caching and automatic state management
  const { data: statsData, isLoading: isStatsLoading } = useGetStatsQuery();
  const { data: chartsData, isLoading: isChartsLoading } = useGetChartsQuery();
  const { data: adminCategories = [], isLoading: isAdminCategoriesLoading } = useGetAdminCategoriesQuery();

  const weeklyCategoriesData = React.useMemo(() => {
    if (!adminCategories) return [];
    
    // Get the last 5 weeks
    const weeks: { name: string; start: Date; end: Date; count: number }[] = [];
    const now = new Date();
    
    // Find the start of the current week (Sunday)
    const currentDay = now.getDay();
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - currentDay);
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    for (let i = 4; i >= 0; i--) {
      const start = new Date(startOfCurrentWeek);
      start.setDate(startOfCurrentWeek.getDate() - i * 7);
      
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      
      const label = `Wk ${start.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}`;
      weeks.push({ name: label, start, end, count: 0 });
    }

    // Populate counts
    adminCategories.forEach((cat: any) => {
      const createdDate = new Date(cat.created_at);
      weeks.forEach((w) => {
        if (createdDate >= w.start && createdDate <= w.end) {
          w.count++;
        }
      });
    });

    return weeks.map(w => ({ name: w.name, "Categories": w.count }));
  }, [adminCategories]);

  const stats = statsData?.data || {
    totalUsers: 0,
    userChange: "0%",
    activeUsers: 0,
    activeChange: "0%",
    totalProducts: 0,
    productChange: "0%",
    notificationsSent: 0,
    notificationChange: "0%"
  };

  const charts = chartsData?.data || {
    userGrowth: [],
    productTrends: [],
    categoryData: [],
    notificationActivity: []
  };

  const isLoading = isStatsLoading || isChartsLoading;

  const statsList = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), change: stats.userChange, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Users', value: stats.activeUsers.toLocaleString(), change: stats.activeChange, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Products Added', value: stats.totalProducts.toLocaleString(), change: stats.productChange, icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Notifications Sent', value: stats.notificationsSent.toLocaleString(), change: stats.notificationChange, icon: Bell, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Dashboard Content */}
        <main className={`flex-1 ${isLoading ? 'overflow-hidden' : 'overflow-y-auto'} p-6 space-y-6 custom-scrollbar pb-16 relative`}>
          {isLoading && (
            <div className="absolute inset-0 bg-[#020617]/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Loading Analytics...</p>
              </div>
            </div>
          )}

          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-50">Dashboard</h1>
              <p className="text-slate-400 text-xs mt-1">Overview of your application metrics</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {statsList.map((stat) => (
              <motion.div 
                key={stat.label}
                whileHover={{ y: -2 }}
                onClick={() => {
                  if (stat.label === 'Products Added') router.push('/admin/products');
                }}
                className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50 hover:border-emerald-500/20 transition-all flex flex-col gap-3 shadow-sm cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                  <div className="flex items-end gap-2 mt-0.5">
                    <span className="text-xl font-bold">{stat.value}</span>
                    <span className={`text-[9px] font-bold pb-1 ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {charts && (
            <>
              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth */}
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 shadow-sm overflow-hidden">
                  <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                    User Growth
                  </h3>
                  <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={charts.userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#475569" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis 
                          stroke="#475569" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#10b981" 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#020617' }}
                          activeDot={{ r: 6, fill: '#10b981', strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Products Added */}
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 shadow-sm overflow-hidden">
                  <h3 className="text-base font-bold mb-6">Products Added per Month</h3>
                  <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={charts.productTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="added" fill="#10b981" radius={[6, 6, 0, 0]} barSize={35} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Category Creation Chart */}
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 shadow-sm h-full flex flex-col">
                  <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                    <Tags className="w-5 h-5 text-emerald-400" />
                    Categories Created Weekly
                  </h3>
                  <div className="h-[260px] w-full flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyCategoriesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="Categories" fill="#10b981" radius={[4, 4, 0, 0]} barSize={35} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Notification Activity */}
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 shadow-sm overflow-hidden h-full">
                  <h3 className="text-base font-bold mb-6">Notification Activity</h3>
                  <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={charts.notificationActivity}>
                        <defs>
                          <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorRead" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="sent" stroke="#10b981" fillOpacity={1} fill="url(#colorSent)" strokeWidth={3} />
                    <Area type="monotone" dataKey="read" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRead)" strokeWidth={3} />
                  </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* System Categories Overview Card */}
              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Tags className="w-5 h-5 text-emerald-400" />
                      System Categories
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">Summary of categories available in the application</p>
                  </div>
                  <Link 
                    href="/admin/categories"
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Manage Categories &rarr;
                  </Link>
                </div>

                {isAdminCategoriesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                  </div>
                ) : adminCategories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {adminCategories.slice(0, 8).map((cat: any) => (
                      <div 
                        key={cat.id} 
                        className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/50 flex items-center gap-3.5 hover:border-emerald-500/20 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                          {cat.icon || '📦'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-200 truncate">{cat.name}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div 
                              className="w-2 h-2 rounded-full shrink-0" 
                              style={{ backgroundColor: cat.color || '#64748b' }}
                            />
                            <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                              {cat.users ? 'Custom' : 'System'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-slate-500 text-xs font-semibold">No categories registered.</p>
                )}
              </div>
            </>
          )}
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
