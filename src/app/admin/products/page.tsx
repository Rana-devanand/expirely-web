'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Package,
  Calendar,
  User,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ArrowUpDown
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

import { useGetAdminProductsQuery } from '@/store/api/productApi';
import { Loader2 } from 'lucide-react';

export default function AdminProductsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: productsResponse, isLoading } = useGetAdminProductsQuery();
  const products = productsResponse?.data || [];

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.addedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || p.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const TABS = ['All', 'Active', 'Expiring Soon', 'Expired'];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {isLoading && (
          <div className="absolute inset-0 bg-[#020617]/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Fetching Products...</p>
            </div>
          </div>
        )}

        <main className={`flex-1 ${isLoading ? 'overflow-hidden' : 'overflow-y-auto'} p-6 space-y-6 custom-scrollbar pb-16 relative`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-50">Products</h1>
              <p className="text-slate-400 text-xs mt-1">View products added by users</p>
            </div>
          </div>

          {/* Filters & Tabs */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/40 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600 text-slate-50"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 border border-slate-800 rounded-xl text-slate-300 hover:text-slate-50 hover:bg-slate-800 transition-all text-sm font-medium shrink-0">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <div className="flex bg-slate-900/40 p-1 rounded-xl border border-slate-800 h-[42px]">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === tab 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-950/20' 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900/20 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2 cursor-pointer hover:text-slate-300 transition-colors">
                        Product Name <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Expiry Date</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Added By</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredProducts.map((product: any) => (
                    <tr key={product.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 shadow-sm group-hover:border-emerald-500/30 transition-all">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = ''; 
                                  (e.target as HTMLImageElement).className = 'hidden';
                                }}
                              />
                            ) : (
                              <Package className="w-5 h-5 text-slate-500" />
                            )}
                            {!product.imageUrl && <Package className="w-5 h-5 text-slate-500" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-slate-50 leading-tight">{product.name}</span>
                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">{product.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-slate-400">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[13px] text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {new Date(product.expiryDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[13px] text-slate-400">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          {product.addedBy}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                          product.status === 'good' || product.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : product.status === 'warning' || product.status === 'Expiring Soon'
                            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {product.status === 'good' ? 'Active' : product.status === 'warning' ? 'Expiring Soon' : product.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Package className="w-10 h-10 text-slate-700" />
                          <p className="text-slate-500 text-sm">No products found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/40">
              <span className="text-xs text-slate-500">Showing {filteredProducts.length} products</span>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all disabled:opacity-50" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">1</button>
                <button className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all disabled:opacity-50" disabled>
                  <ChevronRight className="w-4 h-4" />
                </button>
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
