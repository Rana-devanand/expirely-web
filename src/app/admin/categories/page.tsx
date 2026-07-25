'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tags, 
  Search, 
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
  Loader2,
  Info
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  useGetAdminCategoriesQuery, 
  useCreateCategoryMutation, 
  useAdminDeleteCategoryMutation 
} from '@/store/api/categoryApi';
import toast from 'react-hot-toast';

const PRESET_EMOJIS = ['🍏', '🥛', '🥩', '🍞', '🌾', '🥤', '🐟', '🍫', '❄️', '🥫', '💊', '🧴', '🥚', '🍕', '🥬', '🍖', '🍇', '☕', '🍲', '🍽️'];



export default function AdminCategoriesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<string | null>(null);
  const [creatorFilter, setCreatorFilter] = useState<'all' | 'system' | 'user'>('all');

  // Form State
  const [categoryName, setCategoryName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🍏');
  const [customEmoji, setCustomEmoji] = useState('');

  const itemsPerPage = 8;

  // RTK Queries & Mutations
  const { data: categories = [], isLoading, refetch } = useGetAdminCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useAdminDeleteCategoryMutation();

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    const emoji = customEmoji.trim() || selectedEmoji;

    try {
      await createCategory({
        name: categoryName.trim(),
        icon: emoji
      }).unwrap();

      toast.success('Category created successfully');
      setIsCreateModalOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success('Category deleted successfully');
      setIsDeleteConfirmOpen(null);
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || 'Failed to delete category');
    }
  };

  const resetForm = () => {
    setCategoryName('');
    setSelectedEmoji('🍏');
    setCustomEmoji('');
  };

  // Filtering
  const filteredCategories = categories.filter(cat => {
    const nameMatch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const creatorEmail = cat.users?.email || 'global';
    const creatorName = cat.users?.username || 'system';
    const creatorMatch = creatorEmail.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         creatorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!(nameMatch || creatorMatch)) return false;

    if (creatorFilter === 'system') {
      return cat.user_id === null;
    }
    if (creatorFilter === 'user') {
      return cat.user_id !== null;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {(isLoading || isDeleting) && (
          <div className="absolute inset-0 bg-[#020617]/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">
                {isDeleting ? 'Deleting Category...' : 'Loading Categories...'}
              </p>
            </div>
          </div>
        )}

        <main className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar pb-16 relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-50 flex items-center gap-2">
                <Tags className="w-6 h-6 text-emerald-400" />
                Category Management
              </h1>
              <p className="text-slate-400 text-xs mt-1">Manage global system categories and view user-created custom categories</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/10 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Create Category
            </button>
          </div>

          {/* Search and Filter bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search by category name or creator..." 
                className="w-full bg-slate-900/40 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600 text-slate-50"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <select
              value={creatorFilter}
              onChange={(e) => {
                setCreatorFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-slate-900/40 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer h-[42px] min-w-[160px]"
            >
              <option value="all" className="bg-slate-950 text-slate-200">All Creators</option>
              <option value="system" className="bg-slate-950 text-slate-200">System (Admin)</option>
              <option value="user" className="bg-slate-950 text-slate-200">User Custom</option>
            </select>
          </div>

          {/* Categories Table */}
          <div className="bg-slate-900/20 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Creator</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Created Date</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {paginatedCategories.length > 0 ? (
                    paginatedCategories.map((cat) => {
                      return (
                        <tr key={cat.id} className="hover:bg-slate-800/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shadow-sm">
                                {cat.icon || '📦'}
                              </div>
                              <span className="font-bold text-xs text-slate-200">{cat.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {cat.users ? (
                              <div>
                                <div className="font-bold text-xs text-slate-300">{cat.users.username || 'User'}</div>
                                <div className="text-[9px] text-slate-500 mt-0.5">{cat.users.email}</div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                  Global System
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                            {new Date(cat.created_at).toLocaleDateString(undefined, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end">
                              <button
                                onClick={() => setIsDeleteConfirmOpen(cat.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 rounded-xl transition-all font-bold text-[10px] uppercase tracking-wider active:scale-95"
                                title="Delete Category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-slate-500 text-xs font-semibold">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/20 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-slate-700 disabled:opacity-40 disabled:hover:border-slate-800 transition-all text-slate-400 hover:text-slate-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-slate-700 disabled:opacity-40 disabled:hover:border-slate-800 transition-all text-slate-400 hover:text-slate-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative z-10 flex flex-col gap-4 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  <Tags className="w-5 h-5 text-emerald-400" />
                  Create Global Category
                </h3>
                <button 
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    resetForm();
                  }}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="text-[10px] leading-relaxed font-semibold">
                  Adding a category here makes it a global category, making it instantly visible and available to all users across the platform.
                </p>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4">
                {/* Category Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dairy, Beverages, Snacks"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-100 placeholder:text-slate-700 font-medium"
                    required
                  />
                </div>

                {/* Emojis selection */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Icon (Emoji)</label>
                    <span className="text-[10px] font-semibold text-slate-500">Preview: {customEmoji || selectedEmoji}</span>
                  </div>
                  <div className="grid grid-cols-10 gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-xl max-h-24 overflow-y-auto custom-scrollbar">
                    {PRESET_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setSelectedEmoji(emoji);
                          setCustomEmoji('');
                        }}
                        className={`text-base p-1.5 rounded-lg hover:bg-slate-800 transition-all ${
                          selectedEmoji === emoji && !customEmoji ? 'bg-emerald-500/20 border border-emerald-500/30 scale-110' : 'border border-transparent'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    placeholder="Or type a custom Emoji..."
                    value={customEmoji}
                    onChange={(e) => {
                      setCustomEmoji(e.target.value);
                      setSelectedEmoji('');
                    }}
                    maxLength={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-[11px] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-100 placeholder:text-slate-700"
                  />
                </div>



                {/* Action button */}
                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-slate-300 font-bold text-xs rounded-xl border border-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all text-slate-950 font-bold text-xs py-2 px-4 rounded-xl shadow-lg shadow-emerald-500/10"
                  >
                    {isCreating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Create Category
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteConfirmOpen(null)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative z-10 flex flex-col gap-4"
            >
              <div>
                <h3 className="text-base font-extrabold text-slate-100">Delete Category</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Are you sure you want to delete this category? Any products associated with this category may lose their category link. This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setIsDeleteConfirmOpen(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-slate-300 font-bold text-xs rounded-xl border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCategory(isDeleteConfirmOpen)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white font-bold text-xs rounded-xl shadow-lg shadow-red-500/10"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
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
