'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  User, 
  Mail, 
  FileText, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Calendar
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useGetAllUsersQuery } from '@/store/api/userApi';
import { useSendUserReportEmailMutation } from '@/store/api/reportApi';
import { toast } from 'react-hot-toast';

export default function SendReportsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch Users
  const { data: usersResponse, isLoading: isUsersLoading } = useGetAllUsersQuery();
  const users = usersResponse || [];

  // Mutation
  const [sendReport, { isLoading: isSending }] = useSendUserReportEmailMutation();

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => 
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Find selected user
  const selectedUser = useMemo(() => {
    return users.find((u: any) => u.id === selectedUserId);
  }, [users, selectedUserId]);

  const handleSelectUser = (user: any) => {
    setSelectedUserId(user.id);
    setSearchTerm(`${user.username} (${user.email})`);
    setIsDropdownOpen(false);
  };

  const handleSend = async () => {
    if (!selectedUserId) {
      toast.error('Please select a user first');
      return;
    }

    const toastId = toast.loading('Generating PDF and sending email...');
    try {
      const response = await sendReport({ userId: selectedUserId }).unwrap();
      const targetEmail = response?.data?.email || selectedUser?.email;
      toast.success(`PDF report sent successfully to ${targetEmail}!`, { id: toastId });
    } catch (err: any) {
      const errMsg = err?.data?.message || 'Failed to generate or send report email.';
      toast.error(errMsg, { id: toastId });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {isUsersLoading && (
          <div className="absolute inset-0 bg-[#020617]/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Fetching User Directory...</p>
            </div>
          </div>
        )}

        <main className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar pb-16">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-50 flex items-center gap-2">
              <Send className="w-6 h-6 text-emerald-400" />
              Email PDF Reports
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Select a user to generate their product inventory report and transmit it directly to their email in PDF format.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl">
            
            {/* User Selection Card */}
            <div className="lg:col-span-6 bg-slate-900/20 border border-slate-800 rounded-2xl p-6 space-y-6 h-fit">
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                  Select Recipient User
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Search by username or email address
                </p>
              </div>

              {/* Custom Searchable Dropdown */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                      if (!e.target.value) {
                        setSelectedUserId('');
                      }
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="w-full bg-slate-900/40 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600 text-slate-50 font-medium"
                  />
                </div>

                <AnimatePresence>
                  {isDropdownOpen && filteredUsers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-25 max-h-56 overflow-y-auto custom-scrollbar"
                    >
                      {filteredUsers.map((user: any) => (
                        <button
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          className="w-full px-4 py-2.5 text-left text-xs font-semibold hover:bg-slate-850 border-b border-slate-850/50 flex flex-col gap-0.5 transition-colors"
                        >
                          <span className="text-slate-200">{user.username}</span>
                          <span className="text-slate-500 font-medium">{user.email}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {selectedUser && (
                <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-100">{selectedUser.username}</h4>
                      <p className="text-[10px] text-slate-550 font-bold uppercase tracking-wider mt-0.5">
                        Role: <span className="text-slate-400">{selectedUser.role}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-slate-850 flex flex-col gap-2">
                    <div className="flex items-center gap-2.5 text-xs text-slate-350">
                      <Mail className="w-4 h-4 text-slate-550 shrink-0" />
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-350">
                      <Calendar className="w-4 h-4 text-slate-550 shrink-0" />
                      <span>Registered: {new Date(selectedUser.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleSend}
                disabled={!selectedUserId || isSending}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/5 mt-4"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating & Transmitting PDF...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send PDF Report to User
                  </>
                )}
              </button>
            </div>

            {/* Preview Section Card */}
            <div className="lg:col-span-6 bg-slate-900/20 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Report Scope & Specifications
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  The generated document is formatted in A4 sizing and features:
                </p>
              </div>

              {/* Simulated PDF mock layout */}
              <div className="my-6 border border-slate-800 bg-[#090d16] rounded-xl p-5 aspect-[1/1.3] relative shadow-inner overflow-hidden font-sans select-none flex flex-col justify-between text-[10px]">
                <div className="space-y-4">
                  {/* Top header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-extrabold text-emerald-400 text-xs">EXPIRELY</span>
                    <span className="text-slate-500 font-bold text-[8px] uppercase tracking-widest">A4 Audit PDF</span>
                  </div>

                  {/* Summary Block */}
                  <div className="space-y-1.5 pt-2">
                    <div className="h-2 w-1/3 bg-slate-800 rounded" />
                    <div className="h-1.5 w-1/2 bg-slate-800/60 rounded" />
                    <div className="h-1.5 w-2/3 bg-slate-800/40 rounded" />
                  </div>

                  {/* Visual grid summary */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-850">
                    <div className="bg-slate-900/40 border border-slate-850 rounded p-2 text-center space-y-1">
                      <p className="text-[6px] text-slate-500 font-bold uppercase">Total</p>
                      <div className="h-2.5 w-1/2 bg-slate-800 rounded mx-auto" />
                    </div>
                    <div className="bg-slate-900/40 border border-slate-855 rounded p-2 text-center space-y-1">
                      <p className="text-[6px] text-emerald-500 font-bold uppercase">Active</p>
                      <div className="h-2.5 w-1/2 bg-slate-800 rounded mx-auto" />
                    </div>
                    <div className="bg-slate-900/40 border border-slate-850 rounded p-2 text-center space-y-1">
                      <p className="text-[6px] text-rose-500 font-bold uppercase">Expired</p>
                      <div className="h-2.5 w-1/2 bg-slate-800 rounded mx-auto" />
                    </div>
                  </div>

                  {/* Listing mock rows */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center">
                      <div className="h-2 w-1/4 bg-slate-800 rounded" />
                      <div className="h-2 w-16 bg-slate-800 rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-2 w-1/3 bg-slate-800/80 rounded" />
                      <div className="h-2 w-12 bg-slate-800/80 rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-2 w-1/5 bg-slate-800/60 rounded" />
                      <div className="h-2 w-14 bg-slate-800/60 rounded" />
                    </div>
                  </div>
                </div>

                {/* Footer mock */}
                <div className="border-t border-slate-850 pt-2 text-[6px] text-slate-500 text-center font-mono">
                  CONFIDENTIAL AUDIT REPORT - AUTO GENERATED
                </div>
              </div>

              <div className="bg-slate-950/20 border border-slate-800 p-4 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-slate-450 text-[11px] leading-relaxed">
                  Upon clicking send, the PDF is generated dynamically in memory, joined with user metadata, and dispatched instantly via NodeMailer transport templates.
                </p>
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
