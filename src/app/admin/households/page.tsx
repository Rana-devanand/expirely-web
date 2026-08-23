'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Users, 
  Package, 
  Search, 
  Key, 
  Calendar, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Building
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useGetAdminHouseholdsQuery, AdminHousehold, HouseholdMember } from '@/store/api/householdApi';
import { toast } from 'react-hot-toast';

export default function AdminHouseholdsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedHouseholdId, setExpandedHouseholdId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: householdsResponse, isLoading, refetch } = useGetAdminHouseholdsQuery();
  const households: AdminHousehold[] = householdsResponse?.data || [];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied invite code: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredHouseholds = households.filter((hh) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      hh.name.toLowerCase().includes(q) ||
      hh.join_code.toLowerCase().includes(q) ||
      hh.owner.username.toLowerCase().includes(q) ||
      hh.owner.email.toLowerCase().includes(q) ||
      hh.members.some((m) => m.username.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
    );
  });

  const totalHouseholds = households.length;
  const totalMembers = households.reduce((sum, hh) => sum + hh.member_count, 0);
  const totalHouseholdProducts = households.reduce((sum, hh) => sum + hh.product_count, 0);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 custom-scrollbar pb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-50 flex items-center gap-2.5">
                <Home className="w-6 h-6 text-emerald-400" />
                Household Connections
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Manage all user households, ownerships, and invited member connections.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="self-start md:self-auto bg-slate-900/50 border border-slate-800 hover:bg-slate-800 text-slate-300 px-3.5 py-2 rounded-sm text-xs font-bold transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Refresh Data
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/30 border border-slate-800 rounded-sm p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-sm bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-50">{totalHouseholds}</p>
                <p className="text-slate-400 text-xs font-medium mt-0.5">Total Households</p>
              </div>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 rounded-sm p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-sm bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-50">{totalMembers}</p>
                <p className="text-slate-400 text-xs font-medium mt-0.5">Connected Members</p>
              </div>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 rounded-sm p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-sm bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-50">{totalHouseholdProducts}</p>
                <p className="text-slate-400 text-xs font-medium mt-0.5">Shared Products</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by household, code, owner, or member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/40 border border-slate-800 rounded-sm pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-200 placeholder:text-slate-600"
            />
          </div>

          {/* Household Listing */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-slate-400 text-xs font-medium">Loading household connections...</p>
            </div>
          ) : filteredHouseholds.length === 0 ? (
            <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-10 text-center">
              <Home className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">No Households Found</h3>
              <p className="text-slate-500 text-xs mt-1">
                {searchQuery ? 'Try adjusting your search filter.' : 'No user households have been created yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredHouseholds.map((hh) => {
                const isExpanded = expandedHouseholdId === hh.id;
                return (
                  <div
                    key={hh.id}
                    className="bg-slate-900/30 border border-slate-800/80 hover:border-slate-700/80 rounded-sm transition-all overflow-hidden"
                  >
                    {/* Household Card Header */}
                    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-sm bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                          <Home className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-base font-extrabold text-slate-100">{hh.name}</h3>
                            <button
                              onClick={() => handleCopyCode(hh.join_code)}
                              className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700/80 text-emerald-400 text-xs font-mono font-bold px-2.5 py-1 rounded-sm transition-all"
                              title="Click to copy join code"
                            >
                              <Key className="w-3 h-3" />
                              {hh.join_code}
                              {copiedCode === hh.join_code ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-slate-500" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5 flex-wrap">
                            <span className="flex items-center gap-1.5 text-slate-300">
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                              Owner: <strong className="text-slate-100">{hh.owner.username}</strong> ({hh.owner.email})
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              Created {new Date(hh.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-auto">
                        <div className="text-right px-2.5 py-1.5 rounded-sm bg-slate-800/40 border border-slate-800">
                          <p className="text-xs font-bold text-slate-200">{hh.member_count} Members</p>
                          <p className="text-[10px] text-slate-500 font-medium">{hh.product_count} Products</p>
                        </div>
                        <button
                          onClick={() => setExpandedHouseholdId(isExpanded ? null : hh.id)}
                          className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-2 rounded-sm border border-emerald-500/20 transition-all"
                        >
                          {isExpanded ? 'Hide Members' : 'View Members'}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Members List Collapsible Drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-slate-800/80 bg-slate-950/40 p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Users className="w-3.5 h-3.5 text-emerald-400" />
                              Connected Members & Invites ({hh.members.length})
                            </h4>
                            <span className="text-[11px] text-slate-500">
                              Invite Code: <code className="text-emerald-400 font-mono">{hh.join_code}</code>
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {hh.members.map((m: HouseholdMember) => (
                              <div
                                key={m.id}
                                className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-3 rounded-sm"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 uppercase">
                                    {m.username?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-200 flex items-center gap-2">
                                      {m.username}
                                      {m.role === 'OWNER' && (
                                        <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                                          OWNER
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-[11px] text-slate-500">{m.email}</p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span className="text-[10px] text-slate-500 block">
                                    Joined {new Date(m.joined_at).toLocaleDateString()}
                                  </span>
                                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded mt-1 inline-block">
                                    Connected
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
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
