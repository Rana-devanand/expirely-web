'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Search,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

import { useGetAdminNotificationsQuery, useAdminSendNotificationMutation } from '@/store/api/notificationApi';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminNotificationsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [target, setTarget] = useState('All Users');
  const [message, setMessage] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const { data: logsResponse, isLoading } = useGetAdminNotificationsQuery();
  const [sendNotification, { isLoading: isSending }] = useAdminSendNotificationMutation();

  const logs = logsResponse?.data || [];
  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const paginatedLogs = logs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return toast.error('Please enter a message');
    
    try {
      await sendNotification({ target, message }).unwrap();
      toast.success('Notification sent successfully');
      setMessage('');
    } catch (err) {
      toast.error('Failed to send notification');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {isLoading && (
          <div className="absolute inset-0 bg-[#020617]/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Fetching Logs...</p>
            </div>
          </div>
        )}

        <main className={`flex-1 ${isLoading ? 'overflow-hidden' : 'overflow-y-auto'} p-6 space-y-6 custom-scrollbar pb-16 relative`}>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-50">Notifications</h1>
            <p className="text-slate-400 text-xs mt-1">Manage and send notifications to users</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Notification Logs - Left side */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="bg-slate-900/20 border border-slate-800 rounded-2xl flex flex-col h-full shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Notification Logs
                  </h3>
                </div>
                
                <div className="overflow-x-auto flex-1 min-h-[400px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/40">
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Message</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {paginatedLogs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-[13px] text-slate-300 line-clamp-1">{log.message}</span>
                          </td>
                          <td className="px-6 py-4 text-[13px] text-slate-400 font-medium">{log.target}</td>
                          <td className="px-6 py-4 text-[13px] text-slate-500">{new Date(log.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`flex items-center gap-1.5 text-[11px] font-bold ${
                              log.status === 'Read' ? 'text-emerald-400' : 'text-orange-400'
                            }`}>
                              {log.status === 'Read' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {logs.length === 0 && !isLoading && (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center text-slate-600 text-sm">No notification logs found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/40">
                  <span className="text-xs text-slate-500">Showing {(currentPage-1)*ITEMS_PER_PAGE + 1}-{Math.min(currentPage*ITEMS_PER_PAGE, logs.length)} of {logs.length} logs</span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button 
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg font-bold text-xs border transition-all ${
                          currentPage === page 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'hover:bg-slate-800 text-slate-500 border-transparent'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Send Notification Form - Right side & Sticky */}
            <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-6">
              <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-400" />
                  Send Notification
                </h3>
                
                <form className="space-y-5" onSubmit={handleSend}>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Target</label>
                    <select 
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 appearance-none cursor-pointer"
                    >
                      <option>All Users</option>
                      <option>Beta Testers</option>
                      <option>Active Users</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Message</label>
                    <textarea 
                      placeholder="Type your notification message..." 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 h-32 resize-none placeholder:text-slate-600"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={isSending}
                      className="w-full bg-emerald-500 text-white font-bold py-2.5 rounded-xl hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg shadow-emerald-950/20 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {isSending ? 'Sending...' : 'Send Now'}
                    </button>
                  </div>
                </form>
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
