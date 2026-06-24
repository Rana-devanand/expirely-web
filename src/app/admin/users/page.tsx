'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye, 
  Slash, 
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Ban,
  CheckSquare,
  Square,
  Mail
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

import { useGetAllUsersQuery, useUpdateUserStatusMutation } from '@/store/api/userApi';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const router = useRouter();
  const itemsPerPage = 8;

  // Use RTK Query hooks
  const { data: usersData = [], isLoading, refetch } = useGetAllUsersQuery();
  const [updateUserStatus] = useUpdateUserStatusMutation();

  const users = usersData;

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAllSelected = filteredUsers.length > 0 && filteredUsers.every(u => selectedEmails.includes(u.email));

  const handleSelectAll = () => {
    if (isAllSelected) {
      const filteredEmails = filteredUsers.map(u => u.email);
      setSelectedEmails(prev => prev.filter(e => !filteredEmails.includes(e)));
    } else {
      const filteredEmails = filteredUsers.map(u => u.email);
      setSelectedEmails(prev => [...new Set([...prev, ...filteredEmails])]);
    }
  };

  const handleGoToBroadcast = () => {
    sessionStorage.setItem('broadcast_recipients', JSON.stringify(selectedEmails));
    router.push('/admin/email-broadcast');
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusUpdate = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'blocked' : 'active';
    try {
      await updateUserStatus({ userId, status: newStatus as any }).unwrap();
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'blocked'} successfully`);
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus === 'active' ? 'Active' : 'Blocked' });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-16 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-[#020617]/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Fetching Users...</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-50">Users</h1>
              <p className="text-slate-400 text-xs mt-1">Manage your application users</p>
            </div>
            <div className="flex gap-2">
              {selectedEmails.length > 0 && (
                <button
                  onClick={handleGoToBroadcast}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-purple-950/20 active:scale-[0.98]"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Broadcast to Selected ({selectedEmails.length})
                </button>
              )}
              <button className="bg-[#10b981] text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#059669] transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/20 active:scale-[0.98]">
                <Download className="w-3.5 h-3.5" />
                Export Users
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full bg-slate-900/40 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600 text-slate-50"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 border border-slate-800 rounded-xl text-slate-300 hover:text-slate-50 hover:bg-slate-800 transition-all text-sm font-medium">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-slate-900/20 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40">
                    <th className="pl-6 pr-2 py-4 w-12">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-slate-500 hover:text-emerald-400 transition-colors flex items-center justify-center"
                      >
                        {isAllSelected ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">User ID</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Join Date</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Products</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="pl-6 pr-2 py-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEmails(prev => 
                              prev.includes(user.email) 
                                ? prev.filter(e => e !== user.email) 
                                : [...prev, user.email]
                            );
                          }}
                          className="text-slate-500 hover:text-emerald-400 transition-colors flex items-center justify-center"
                        >
                          {selectedEmails.includes(user.email) ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-[13px] font-medium text-slate-500">{user.id.slice(0, 8)}...</td>
                      <td className="px-4 py-4 text-[13px] font-bold text-slate-50">{user.name}</td>
                      <td className="px-4 py-4 text-[13px] text-slate-400">{user.email}</td>
                      <td className="px-4 py-4 text-[13px] text-slate-400">{user.joinDate}</td>
                      <td className="px-4 py-4 text-[13px] font-medium text-slate-300">{user.products}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          user.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 transition-opacity">
                          <button 
                            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors" 
                            title="Send Broadcast Email"
                            onClick={() => {
                              sessionStorage.setItem('broadcast_recipients', JSON.stringify([user.email]));
                              router.push('/admin/email-broadcast');
                            }}
                          >
                            <Mail className="w-4 h-4 text-purple-400" />
                          </button>
                          <button 
                            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors" 
                            title="View Profile"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className={`p-1.5 rounded-lg transition-colors ${
                              user.status === 'Active' ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-400' : 'hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400'
                            }`}
                            title={user.status === 'Active' ? "Block User" : "Unblock User"}
                            onClick={() => handleStatusUpdate(user.id, user.status)}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/40">
              <span className="text-xs text-slate-500">Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users</span>
              <div className="flex items-center gap-1">
                <button 
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && <span className="text-slate-700 px-1 text-xs">...</span>}
                      <button 
                        className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${
                          currentPage === page 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'hover:bg-slate-800 text-slate-500'
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
                <button 
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* User Detail Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="h-24 bg-linear-to-r from-emerald-500/20 to-blue-500/20" />
            <div className="px-8 pb-8">
              <div className="relative -mt-12 mb-6">
                <div className="w-24 h-24 rounded-2xl bg-slate-900 border-4 border-[#0f172a] flex items-center justify-center text-3xl font-bold text-emerald-500 shadow-xl">
                  {selectedUser.name.charAt(0)}
                </div>
                <div className={`absolute bottom-2 right-0 w-5 h-5 rounded-full border-4 border-[#0f172a] ${
                  selectedUser.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'
                }`} />
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                  <p className="text-slate-400 text-sm">{selectedUser.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Joined</p>
                    <p className="text-sm font-medium">{selectedUser.joinDate}</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Products</p>
                    <p className="text-sm font-medium text-emerald-400">{selectedUser.products} Items</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Administrative Actions</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleStatusUpdate(selectedUser.id, selectedUser.status)}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        selectedUser.status === 'Active' 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                      }`}
                    >
                      <Ban className="w-4 h-4" />
                      {selectedUser.status === 'Active' ? 'Block User Account' : 'Unblock Account'}
                    </button>
                    <button 
                      className="px-6 py-3 bg-slate-800 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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
