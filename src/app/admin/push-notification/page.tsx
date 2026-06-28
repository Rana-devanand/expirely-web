'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Clock, 
  Smartphone,
  CheckCircle2, 
  XCircle, 
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  Search,
  Users,
  CheckSquare,
  Square,
  SmartphoneNfc
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  useGetAdminPushLogsQuery, 
  useAdminSendPushNotificationMutation,
  useAdminGeneratePushMutation 
} from '@/store/api/notificationApi';
import { useGetAllUsersQuery } from '@/store/api/userApi';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPushNotificationPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetType, setTargetType] = useState<'everyone' | 'selective'>('everyone');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  
  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // API Queries & Mutations
  const { data: logsResponse, isLoading: isLoadingLogs } = useGetAdminPushLogsQuery();
  const { data: usersResponse, isLoading: isLoadingUsers } = useGetAllUsersQuery();
  const [sendPushNotification, { isLoading: isSending }] = useAdminSendPushNotificationMutation();
  const [generatePush, { isLoading: isGenerating }] = useAdminGeneratePushMutation();

  const logs = logsResponse?.data || [];
  const allUsers = usersResponse || [];
  
  // Filter users based on search term
  const filteredUsers = allUsers.filter((u: any) => 
    u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    (u.username && u.username.toLowerCase().includes(userSearchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const paginatedLogs = logs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Toggle single user email selection
  const handleToggleUser = (email: string) => {
    setSelectedEmails(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email) 
        : [...prev, email]
    );
  };

  // Toggle select all filtered users
  const handleSelectAllFiltered = () => {
    const filteredEmails = filteredUsers.map((u: any) => u.email);
    const areAllSelected = filteredEmails.every(e => selectedEmails.includes(e));

    if (areAllSelected) {
      setSelectedEmails(prev => prev.filter(e => !filteredEmails.includes(e)));
    } else {
      setSelectedEmails(prev => [...new Set([...prev, ...filteredEmails])]);
    }
  };

  // AI copywriting trigger
  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return toast.error('Please describe what you want to send first');
    try {
      const response = await generatePush({ prompt: aiPrompt }).unwrap();
      if (response && response.success) {
        setTitle(response.data.title);
        setBody(response.data.body);
        toast.success('AI suggestions generated!');
      }
    } catch (err: any) {
      toast.error('AI suggestion failed to generate');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Please enter a notification title');
    if (!body.trim()) return toast.error('Please enter a notification body');
    
    if (targetType === 'selective' && selectedEmails.length === 0) {
      return toast.error('Please select at least one recipient user');
    }

    const recipientCount = targetType === 'everyone' ? allUsers.length : selectedEmails.length;
    const confirmSend = window.confirm(
      `Are you sure you want to broadcast this push notification to ${recipientCount} targeted device(s)?`
    );
    if (!confirmSend) return;

    try {
      const response = await sendPushNotification({ 
        title, 
        body,
        recipients: targetType === 'everyone' ? undefined : selectedEmails
      }).unwrap();
      
      toast.success(response.message || 'Push notification broadcasted successfully!');
      setTitle('');
      setBody('');
      setSelectedEmails([]);
      setTargetType('everyone');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to broadcast push notification');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {isLoadingLogs && (
          <div className="absolute inset-0 bg-[#020617]/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Syncing Dashboard...</p>
            </div>
          </div>
        )}

        <main className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar pb-16 relative">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-50 flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-emerald-400" />
              Push Notifications (FCM)
            </h1>
            <p className="text-slate-400 text-xs mt-1">Send system-level push notifications directly to users' phones with AI help</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left/Middle area: Settings & AI, Device Preview */}
            <div className="xl:col-span-7 space-y-6">
              
              {/* AI & Message Form */}
              <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  AI Notification Assistant (Groq)
                </h3>
                <div className="space-y-3">
                  <p className="text-slate-400 text-xs leading-normal">
                    Describe what announcement you want to make, and our Llama model will generate a catchy mobile notification alert layout.
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="e.g. we have updated our terms and conditions"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="flex-grow bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 placeholder:text-slate-600"
                    />
                    <button 
                      type="button"
                      onClick={handleGenerateAI}
                      disabled={isGenerating}
                      className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs whitespace-nowrap disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      Generate suggestions
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-5">
                  <form className="space-y-4" onSubmit={handleSend}>
                    
                    {/* Destination/Target Selector */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Delivery Recipients</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setTargetType('everyone')}
                          className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                            targetType === 'everyone'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          <Users className="w-3.5 h-3.5" />
                          Everyone ({allUsers.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setTargetType('selective')}
                          className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                            targetType === 'selective'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                          Selective ({selectedEmails.length})
                        </button>
                      </div>
                    </div>

                    {/* Conditional Selected Users List */}
                    <AnimatePresence>
                      {targetType === 'selective' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 overflow-hidden"
                        >
                          <div className="flex gap-2 items-center bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-1.5">
                            <Search className="w-3.5 h-3.5 text-slate-500" />
                            <input 
                              type="text"
                              placeholder="Search user list..."
                              value={userSearchTerm}
                              onChange={(e) => setUserSearchTerm(e.target.value)}
                              className="bg-transparent border-none outline-none text-xs text-slate-300 w-full placeholder:text-slate-600"
                            />
                            <button
                              type="button"
                              onClick={handleSelectAllFiltered}
                              className="text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 px-2 py-1 rounded font-bold uppercase tracking-wider shrink-0 transition-all"
                            >
                              Toggle Page
                            </button>
                          </div>

                          <div className="border border-slate-800 bg-slate-950/30 rounded-xl max-h-40 overflow-y-auto p-2 custom-scrollbar space-y-1">
                            {filteredUsers.map((user: any) => {
                              const isSelected = selectedEmails.includes(user.email);
                              return (
                                <div 
                                  key={user.id}
                                  onClick={() => handleToggleUser(user.email)}
                                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/40 cursor-pointer transition-all border border-transparent hover:border-slate-800/60"
                                >
                                  <div className="flex items-center gap-2">
                                    {isSelected ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5 text-slate-600" />}
                                    <span className="text-xs font-semibold text-slate-300">{user.username || 'User'}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-500">{user.email}</span>
                                </div>
                              );
                            })}
                            {filteredUsers.length === 0 && (
                              <div className="text-center text-xs py-8 text-slate-600">No users found</div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Standard Inputs */}
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Notification Title</label>
                        <input 
                          type="text"
                          placeholder="Notification headline alert"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Notification Body</label>
                        <textarea 
                          placeholder="Notification message body detail..." 
                          value={body}
                          onChange={(e) => setBody(e.target.value)}
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 h-24 resize-none"
                        ></textarea>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit" 
                        disabled={isSending}
                        className="w-full bg-emerald-500 text-white font-bold py-2.5 rounded-xl hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg shadow-emerald-950/20 text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {isSending ? 'Broadcasting...' : 'Broadcast Push Notification'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Push Broadcast Logs */}
              <div className="bg-slate-900/20 border border-slate-800 rounded-2xl flex flex-col shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-800">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Delivery History logs
                  </h3>
                </div>
                
                <div className="overflow-x-auto min-h-[300px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/40">
                        <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Broadcast Details</th>
                        <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Targets</th>
                        <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">FCM Delivery</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {paginatedLogs.map((log: any) => {
                        const { title: logTitle, body: logBody, target = 'All Users', sentCount = 0, failCount = 0, totalCount = 0 } = log.details || {};
                        return (
                          <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-5 py-3 max-w-[200px]">
                              <div className="font-semibold text-xs text-slate-200 truncate">{logTitle || 'Untitled'}</div>
                              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{logBody}</div>
                            </td>
                            <td className="px-5 py-3">
                              <span className="text-[11px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded border border-slate-700/60 uppercase tracking-wider">
                                {target}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <div className="inline-flex items-center gap-3 text-[11px] font-bold">
                                <span className="text-slate-400">{totalCount} dev</span>
                                <span className="text-emerald-400 flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> {sentCount}</span>
                                <span className="text-rose-400 flex items-center gap-0.5"><XCircle className="w-3 h-3" /> {failCount}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {logs.length === 0 && !isLoadingLogs && (
                        <tr>
                          <td colSpan={3} className="px-5 py-14 text-center text-slate-600 text-xs">
                            No logs recorded
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {logs.length > ITEMS_PER_PAGE && (
                  <div className="px-5 py-3.5 border-t border-slate-800 flex items-center justify-between bg-slate-900/40">
                    <span className="text-[11px] text-slate-500">Page {currentPage} of {totalPages}</span>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1 rounded border border-slate-800 text-slate-500 hover:text-slate-300 disabled:opacity-50"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1 rounded border border-slate-800 text-slate-500 hover:text-slate-300 disabled:opacity-50"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right area: Lockscreen Device Mock Notification Preview */}
            <div className="xl:col-span-5 xl:sticky xl:top-6 space-y-6">
              
              <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center">
                <h3 className="text-base font-bold mb-6 flex items-center gap-2 self-start">
                  <SmartphoneNfc className="w-4 h-4 text-emerald-400" />
                  Live Lockscreen Preview
                </h3>

                {/* iPhone / Android Lockscreen Frame Wrapper */}
                <div className="relative w-full max-w-[280px] h-[480px] bg-slate-950 rounded-[40px] border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between p-4 py-8 select-none">
                  {/* Speaker Notch */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-slate-950 rounded-full mr-2"></div>
                    <div className="w-8 h-1 bg-slate-950 rounded-full"></div>
                  </div>

                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold px-1.5">
                    <span>9:41 AM</span>
                    <div className="flex gap-1.5 items-center">
                      <span>5G</span>
                      <div className="w-4 h-2 bg-slate-400 rounded-sm"></div>
                    </div>
                  </div>

                  {/* Lock Screen Time Display */}
                  <div className="text-center mt-6">
                    <div className="text-3xl font-extralight text-slate-100 font-sans tracking-tight">Sunday</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">June 28</div>
                  </div>

                  {/* Mock Push Notification Bubble (Real-time Bound) */}
                  <div className="my-auto w-full px-1">
                    <motion.div 
                      key={title + body}
                      initial={{ scale: 0.95, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-3 shadow-xl flex gap-2.5 items-start text-left w-full"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0 shadow shadow-emerald-950/20 text-slate-950 font-extrabold text-sm">
                        E
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">Expirely</span>
                          <span className="text-[9px] text-slate-500 font-semibold">now</span>
                        </div>
                        <h4 className="font-extrabold text-[12px] text-slate-100 truncate mt-0.5">
                          {title.trim() || '💡 Notification Title'}
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-normal mt-0.5 break-words line-clamp-3">
                          {body.trim() || 'Describe your announcement or ask Groq AI to suggest one, and see the preview here.'}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Lock Screen Bottom Swipe Indicator */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-4 bg-slate-900/60 border border-slate-800 rounded-full flex items-center justify-center text-[8px] text-slate-400 font-semibold">
                      Swipe up to open
                    </div>
                    <div className="w-24 h-1.5 bg-slate-700/60 rounded-full"></div>
                  </div>

                </div>

                <p className="text-slate-500 text-[10px] text-center mt-3 max-w-[240px]">
                  This template demonstrates how the notification matches the device's system tray. Emojis and formats update dynamically.
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
