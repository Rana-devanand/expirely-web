'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Users, 
  Package, 
  Bell, 
  Calendar,
  ChevronDown,
  Clock,
  ArrowRight
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

import { useGetAdminReportsQuery, useLazyExportReportQuery } from '@/store/api/reportApi';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminReportsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: reportsResponse, isLoading } = useGetAdminReportsQuery();
  const [triggerExport, { isFetching: isExporting }] = useLazyExportReportQuery();

  const handleDownload = async (type: string, format: string) => {
    if (format === 'pdf') {
      toast('PDF Export is coming soon. Please use CSV for now.', { icon: 'ℹ️' });
      return;
    }

    const toastId = toast.loading(`Generating ${type} report...`);
    try {
      const blob = await triggerExport({ type, format }).unwrap();
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${type}_report_${new Date().toISOString().split('T')[0]}.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report downloaded!`, { id: toastId });
      }
    } catch (err) {
      toast.error('Failed to download report.', { id: toastId });
    }
  };

  const reports = reportsResponse?.data || {
    users: { total: 0, active: 0, inactive: 0 },
    products: { total: 0, expired: 0, soon: 0 },
    notifications: { total: 0, read: 0, pending: 0 }
  };

  const REPORT_CARDS = [
    {
      id: 'users',
      title: 'User Activity Report',
      description: `Total: ${reports.users.total} | Active: ${reports.users.active} | Inactive: ${reports.users.inactive}`,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      lastGenerated: 'Real-time'
    },
    {
      id: 'products',
      title: 'Product Expiry Report',
      description: `Total: ${reports.products.total} | Expired: ${reports.products.expired} | Expiring Soon: ${reports.products.soon}`,
      icon: Package,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      lastGenerated: 'Real-time'
    },
    {
      id: 'notifications',
      title: 'Notification Performance',
      description: `Total: ${reports.notifications.total} | Read: ${reports.notifications.read} | Pending: ${reports.notifications.pending}`,
      icon: Bell,
      color: 'text-teal-500',
      bg: 'bg-teal-500/10',
      lastGenerated: 'Real-time'
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {isLoading && (
          <div className="absolute inset-0 bg-[#020617]/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Generating Reports...</p>
            </div>
          </div>
        )}

        <main className={`flex-1 ${isLoading ? 'overflow-hidden' : 'overflow-y-auto'} p-6 space-y-8 custom-scrollbar pb-16 relative`}>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-50">Reports</h1>
            <p className="text-slate-400 text-xs mt-1">Generate and download reports</p>
          </div>

          {/* Report Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REPORT_CARDS.map((report) => (
              <motion.div 
                key={report.title}
                whileHover={{ y: -4 }}
                className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 flex flex-col h-full shadow-sm hover:border-emerald-500/20 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl ${report.bg} ${report.color} flex items-center justify-center mb-6`}>
                  <report.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold mb-2">{report.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6 flex-1 whitespace-pre-line">
                  {report.description}
                </p>
                <div className="pt-4 border-t border-slate-800 flex flex-col gap-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Generated: {report.lastGenerated}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDownload(report.id, 'csv')}
                      disabled={isExporting}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-900/50 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      CSV
                    </button>
                    <button 
                      onClick={() => handleDownload(report.id, 'pdf')}
                      disabled={isExporting}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-900/50 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      PDF
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Custom Report Section */}
          <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-8 shadow-sm">
            <h3 className="text-base font-bold mb-2">Custom Report</h3>
            <p className="text-slate-400 text-xs mb-8">Generate a custom report by selecting parameters.</p>
            
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Report Type</label>
                <div className="relative">
                  <select className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 appearance-none cursor-pointer">
                    <option>Select Report Type</option>
                    <option>User Growth</option>
                    <option>Product Inactivity</option>
                    <option>Category Distribution</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
              
              <div className="w-48">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input type="text" placeholder="mm/dd/yyyy" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 placeholder:text-slate-600" />
                </div>
              </div>

              <div className="w-48">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input type="text" placeholder="mm/dd/yyyy" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 placeholder:text-slate-600" />
                </div>
              </div>

              <button className="bg-[#10b981] text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-[#059669] transition-all whitespace-nowrap active:scale-[0.98] shadow-lg shadow-emerald-950/20">
                Generate Report
              </button>
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
