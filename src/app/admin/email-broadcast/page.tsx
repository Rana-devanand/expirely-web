'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Send, 
  Sparkles, 
  Loader2, 
  Eye, 
  AlertTriangle,
  Users,
  Search,
  CheckSquare,
  Square,
  ChevronDown
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useLazyGenerateBroadcastEmailQuery } from '@/store/api/aiApi';
import { useBroadcastEmailMutation, useGetAllUsersQuery } from '@/store/api/userApi';
import toast from 'react-hot-toast';

export default function EmailBroadcastPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [emailType, setEmailType] = useState('privacy_updated');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: users = [], isLoading: isUsersLoading } = useGetAllUsersQuery();
  const [generateTemplate, { isLoading: isGenerating }] = useLazyGenerateBroadcastEmailQuery();
  const [broadcastEmail, { isLoading: isBroadcasting }] = useBroadcastEmailMutation();

  // Initialize selected emails list when users are loaded
  useEffect(() => {
    if (users && users.length > 0) {
      const stored = sessionStorage.getItem('broadcast_recipients');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSelectedEmails(parsed);
            // Clear to avoid keeping it around on reload
            sessionStorage.removeItem('broadcast_recipients');
            return;
          }
        } catch (e) {
          console.error('Error parsing broadcast_recipients:', e);
        }
      }
      setSelectedEmails(users.map(u => u.email));
    }
  }, [users]);

  const handleGenerate = async () => {
    try {
      const response = await generateTemplate({ type: emailType }).unwrap();
      if (response) {
        setSubject(response.subject);
        setContent(response.body);
        toast.success('AI Template generated successfully!');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to generate AI email template');
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggleUser = (email: string) => {
    setSelectedEmails(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email) 
        : [...prev, email]
    );
  };

  const handleToggleSelectAll = () => {
    const allFilteredEmails = filteredUsers.map(u => u.email);
    const areAllSelected = allFilteredEmails.every(e => selectedEmails.includes(e));

    if (areAllSelected) {
      // Unselect all filtered users
      setSelectedEmails(prev => prev.filter(e => !allFilteredEmails.includes(e)));
    } else {
      // Select all filtered users
      setSelectedEmails(prev => [...new Set([...prev, ...allFilteredEmails])]);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      return toast.error('Subject and content cannot be empty');
    }
    if (selectedEmails.length === 0) {
      return toast.error('Please select at least one recipient');
    }

    const confirmSend = window.confirm(
      `Are you sure you want to broadcast this email to the ${selectedEmails.length} selected user(s)? This action cannot be undone.`
    );
    if (!confirmSend) return;

    try {
      const result = await broadcastEmail({ 
        subject, 
        content, 
        recipients: selectedEmails 
      }).unwrap();
      toast.success(result.message || 'Email broadcast completed successfully!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to complete email broadcast');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar pb-16">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-50 flex items-center gap-2">
              <Mail className="w-6 h-6 text-emerald-400" />
              Email Broadcast System
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Draft and broadcast important announcements to selected users using AI-assisted copywriting.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form & Configuration (span 8) */}
            <div className="xl:col-span-8 space-y-6">
              <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-200">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  AI Template Generator
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Announcement Topic
                    </label>
                    <select
                      value={emailType}
                      onChange={(e) => setEmailType(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 cursor-pointer"
                    >
                      <option value="privacy_updated">Privacy Policy & Terms Updates</option>
                      <option value="general_announcement">General Platform Announcement</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-xl transition-all disabled:opacity-50 text-xs shadow-md"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    {isGenerating ? 'Generating...' : 'Generate with Groq'}
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-200">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  Edit Campaign Content
                </h3>

                <form className="space-y-4" onSubmit={handleSendBroadcast}>
                  {/* Select Recipients Dropdown */}
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Select Recipients ({selectedEmails.length} / {users.length} Selected)
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 cursor-pointer flex items-center justify-between transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {selectedEmails.length === 0 
                            ? "No recipients selected" 
                            : selectedEmails.length === users.length 
                            ? "All Users Selected" 
                            : `${selectedEmails.length} of ${users.length} Selected`}
                        </span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                      <>
                        {/* Overlay backdrop to handle click-away behavior */}
                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                        
                        <div className="absolute z-20 mt-2 w-full bg-[#0d1527] border border-slate-800 rounded-xl p-4 shadow-2xl space-y-3 max-h-[320px] overflow-hidden flex flex-col">
                          <div className="relative shrink-0">
                            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              placeholder="Search by name or email..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-550/20 text-slate-200 placeholder:text-slate-500"
                            />
                          </div>

                          <div className="flex items-center justify-between px-2 py-1.5 bg-slate-900/60 rounded-lg border border-slate-800/80 shrink-0">
                            <span className="text-[10px] text-slate-400 font-bold">Select All Filtered</span>
                            <button
                              type="button"
                              onClick={handleToggleSelectAll}
                              className="text-slate-400 hover:text-emerald-400 transition-colors"
                            >
                              {filteredUsers.length > 0 && filteredUsers.every(u => selectedEmails.includes(u.email)) ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          <div className="overflow-y-auto pr-1 custom-scrollbar space-y-2 flex-grow">
                            {isUsersLoading ? (
                              <div className="flex items-center justify-center py-8 text-slate-500 gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                <span className="text-xs">Loading users...</span>
                              </div>
                            ) : filteredUsers.length === 0 ? (
                              <div className="text-center py-8 text-slate-650 text-xs italic">
                                No matching users found
                              </div>
                            ) : (
                              filteredUsers.map((user) => {
                                const isChecked = selectedEmails.includes(user.email);
                                return (
                                  <div
                                    key={user.id}
                                    onClick={() => handleToggleUser(user.email)}
                                    className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                                      isChecked 
                                        ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/30' 
                                        : 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700/50'
                                    }`}
                                  >
                                    <div className="space-y-0.5">
                                      <div className="text-[11px] font-bold text-slate-200 line-clamp-1">{user.name}</div>
                                      <div className="text-[9px] text-slate-500 font-medium line-clamp-1">{user.email}</div>
                                    </div>
                                    <div className="text-slate-505 shrink-0">
                                      {isChecked ? (
                                        <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                                      ) : (
                                        <Square className="w-3.5 h-3.5" />
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Important Updates to our Privacy Policy"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 placeholder:text-slate-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Email Body Content
                    </label>
                    <textarea
                      placeholder="Draft your email body here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 h-48 resize-none placeholder:text-slate-600 custom-scrollbar leading-relaxed"
                    ></textarea>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-2.5 text-amber-200 text-[10px] items-start">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <p>
                      Selected Recipients: <strong>{selectedEmails.length}</strong>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isBroadcasting || !subject || !content || selectedEmails.length === 0}
                    className="w-full bg-emerald-500 text-white font-bold py-2 rounded-xl hover:bg-emerald-600 transition-all active:scale-[0.98] text-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {isBroadcasting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    {isBroadcasting ? 'Broadcasting...' : 'Send Broadcast Email'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Live E-mail Preview (span 4) */}
            <div className="xl:col-span-4 space-y-3 xl:sticky xl:top-6">
              <h3 className="text-xs font-bold flex items-center gap-2 text-slate-400">
                <Eye className="w-3.5 h-3.5" />
                Live Email Template Preview
              </h3>

              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#080d1e] text-slate-200 shadow-xl max-h-[570px] flex flex-col">
                {/* Header Mockup */}
                <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-fuchsia-800 p-4 text-center shrink-0">
                  <div className="inline-flex items-center gap-1.5 text-white font-bold text-base mb-0.5">
                    <span>Expirely</span>
                  </div>
                  <div className="text-[9px] uppercase font-bold text-purple-200 tracking-wider">
                    Important Update
                  </div>
                  <h4 className="text-white font-extrabold text-xs mt-1.5 line-clamp-1">
                    {subject || 'Email Subject Line Preview'}
                  </h4>
                </div>

                {/* Email Body Mockup */}
                <div className="p-5 bg-[#0f172a] overflow-y-auto flex-grow text-[11px] leading-relaxed space-y-3 custom-scrollbar">
                  <p className="text-slate-300 font-semibold">Hello [User Name],</p>
                  
                  {content ? (
                    <div className="text-slate-400 whitespace-pre-wrap">{content}</div>
                  ) : (
                    <div className="text-slate-600 italic py-16 text-center">
                      No body content drafted yet. Use the generator on the left or write custom content to see the live preview.
                    </div>
                  )}

                  {/* Buttons Mockup */}
                  <div className="pt-3 space-y-2 text-center max-w-[280px] mx-auto">
                    <a
                      href="https://expirely.foocusedai.com/"
                      target="_blank"
                      className="block bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-2 rounded-full text-center hover:opacity-90 shadow-md shadow-purple-900/10 pointer-events-none text-xs"
                    >
                      Open Web Application
                    </a>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.expirely.mobile"
                      target="_blank"
                      className="inline-block border border-purple-500/40 text-purple-300 font-semibold py-1 px-4 rounded-full text-center hover:bg-purple-500/5 pointer-events-none text-[9px]"
                    >
                      Download Mobile App
                    </a>
                  </div>
                </div>

                {/* Footer Mockup */}
                <div className="p-4 bg-[#080d1e] text-center border-t border-slate-800/50 shrink-0">
                  <div className="text-purple-300 font-bold text-xs mb-0.5">Expirely</div>
                  <p className="text-slate-600 text-[9px] leading-normal">
                    Never let your groceries expire again. Track inventory, receive alerts, and prevent waste.<br />
                    © 2026 Expirely. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
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
