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
  FileText,
  Download,
  Users,
  Package,
  Calendar,
  ChevronDown,
  Send,
  Loader2,
  Sparkles
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  useGetAllCategoriesQuery, 
  useCreateCategoryMutation, 
  useDeleteCategoryMutation 
} from '@/store/api/categoryApi';
import { useGetAdminReportsQuery, useLazyExportReportQuery } from '@/store/api/reportApi';
import { toast } from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'settings' | 'reports'>('settings');
  const [newCategory, setNewCategory] = useState('');

  // Email Reports state
  const [emailRecipients, setEmailRecipients] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Category queries
  const { data: categories = [] } = useGetAllCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // Reports queries
  const { data: reportsResponse, isLoading: isLoadingReports } = useGetAdminReportsQuery();
  const [triggerExport, { isFetching: isExporting }] = useLazyExportReportQuery();

  const handleRemoveCategory = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success('Category removed');
    } catch (err) {
      toast.error('Failed to remove category');
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        await createCategory({ name: newCategory.trim() }).unwrap();
        setNewCategory('');
        toast.success('Category added globally');
      } catch (err) {
        toast.error('Failed to add category');
      }
    }
  };

  const handleDownloadReport = async (type: string, format: string) => {
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

  const handleSendEmailReport = async () => {
    if (!emailRecipients.trim()) {
      toast.error('Please enter at least one recipient email');
      return;
    }

    setIsSendingEmail(true);
    const toastId = toast.loading('Sending PDF report email...');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/reports/send-email-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emails: emailRecipients.split(',').map((e) => e.trim()).filter(Boolean),
        }),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        toast.success(resData.message || 'Report sent via email!', { id: toastId });
        setEmailRecipients('');
      } else {
        toast.error(resData.message || 'Failed to send email report', { id: toastId });
      }
    } catch (error) {
      toast.error('Failed to send email report', { id: toastId });
    } finally {
      setIsSendingEmail(false);
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
    },
    {
      id: 'products',
      title: 'Product Expiry Report',
      description: `Total: ${reports.products.total} | Expired: ${reports.products.expired} | Expiring Soon: ${reports.products.soon}`,
      icon: Package,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      id: 'notifications',
      title: 'Notification Performance',
      description: `Total: ${reports.notifications.total} | Read: ${reports.notifications.read} | Pending: ${reports.notifications.pending}`,
      icon: Bell,
      color: 'text-teal-500',
      bg: 'bg-teal-500/10',
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-50">Settings & Reports</h1>
              <p className="text-slate-400 text-xs mt-1">Configure app settings and generate system analytics reports</p>
            </div>

            {/* Top Tab Switcher */}
            <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-emerald-500 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                App Settings
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'reports'
                    ? 'bg-emerald-500 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Reports & Analytics
              </button>
            </div>
          </div>

          {activeTab === 'settings' ? (
            <div className="max-w-4xl space-y-6">
              {/* Manage Categories */}
              <section className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Manage Categories
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((cat: any) => (
                    <div key={cat.id} className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-xl group transition-all">
                      <span className="text-xs font-medium text-slate-300 group-hover:text-slate-100">{cat.name}</span>
                      <button 
                        onClick={() => handleRemoveCategory(cat.id)}
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
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  />
                  <button 
                    onClick={handleAddCategory}
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
          ) : (
            /* Reports & Analytics Section */
            <div className="space-y-6 max-w-5xl">
              {isLoadingReports && (
                <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  Fetching latest report analytics...
                </div>
              )}

              {/* Download Reports Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {REPORT_CARDS.map((card) => (
                  <div
                    key={card.id}
                    className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-4`}>
                        <card.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-100 mb-2">{card.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6 whitespace-pre-line">
                        {card.description}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-slate-800">
                      <button
                        onClick={() => handleDownloadReport(card.id, 'csv')}
                        disabled={isExporting}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900/50 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        CSV
                      </button>
                      <button
                        onClick={() => handleDownloadReport(card.id, 'pdf')}
                        disabled={isExporting}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900/50 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Email Reports Box */}
              <section className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-base font-bold mb-2 flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-400" />
                  Email PDF Reports
                </h3>
                <p className="text-slate-400 text-xs mb-6">
                  Send a complete PDF analytics summary directly to admin emails.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                  <input
                    type="text"
                    placeholder="Enter email addresses (comma separated)..."
                    value={emailRecipients}
                    onChange={(e) => setEmailRecipients(e.target.value)}
                    className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 placeholder:text-slate-600"
                  />
                  <button
                    onClick={handleSendEmailReport}
                    disabled={isSendingEmail}
                    className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSendingEmail ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send Report Email
                  </button>
                </div>
              </section>
            </div>
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
