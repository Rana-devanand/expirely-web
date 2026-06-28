'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  ChevronLeft,
  ChevronRight,
  Globe,
  Navigation
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useGetAllUserLocationsQuery } from '@/store/api/userApi';
import { Loader2 } from 'lucide-react';

const COUNTRY_FLAGS: Record<string, string> = {
  'India': '🇮🇳',
  'United States': '🇺🇸',
  'Afghanistan': '🇦🇫',
  'United Arab Emirates': '🇦🇪',
  'United Kingdom': '🇬🇧',
  'Canada': '🇨🇦',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Australia': '🇦🇺',
  'Brazil': '🇧🇷',
  'China': '🇨🇳',
  'Japan': '🇯🇵',
  'Russia': '🇷🇺',
  'South Africa': '🇿🇦',
  'Nepal': '🇳🇵',
  'Bangladesh': '🇧🇩',
  'Pakistan': '🇵🇰',
  'Sri Lanka': '🇱🇰',
  'Singapore': '🇸🇬',
  'Malaysia': '🇲🇾',
  'Indonesia': '🇮🇩',
  'Mexico': '🇲🇽',
  'Saudi Arabia': '🇸🇦',
  'Turkey': '🇹🇷',
  'Egypt': '🇪🇬',
  'Spain': '🇪🇸',
  'Italy': '🇮🇹',
  'Netherlands': '🇳🇱',
  'Switzerland': '🇨🇭',
  'Sweden': '🇸🇪',
  'Norway': '🇳🇴',
  'New Zealand': '🇳🇿',
};

export default function AdminLocationsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: locations = [], isLoading } = useGetAllUserLocationsQuery();

  const filteredLocations = locations.filter(loc => 
    loc.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    loc.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLocations = filteredLocations.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {isLoading && (
          <div className="absolute inset-0 bg-[#020617]/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Loading Locations...</p>
            </div>
          </div>
        )}

        <main className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar pb-16 relative">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-50 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-emerald-400" />
              User Locations
            </h1>
            <p className="text-slate-400 text-xs mt-1">Geographic distribution and active locales of your application users</p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by user, country, or state..." 
              className="w-full bg-slate-900/40 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600 text-slate-50"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Locations Table */}
          <div className="bg-slate-900/20 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Country</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">State / Locality</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {paginatedLocations.map((loc) => (
                    <tr key={loc.userId} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {loc.avatarUrl ? (
                            <img 
                              src={loc.avatarUrl} 
                              alt={loc.userName} 
                              className="w-8 h-8 rounded-full object-cover border border-slate-800" 
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                              {loc.userName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-xs text-slate-50">{loc.userName}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{loc.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-slate-200 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base select-none">
                            {COUNTRY_FLAGS[loc.country] || '🌐'}
                          </span>
                          <span>{loc.country}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                          <span>{loc.state || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[12px] text-slate-500">
                        {new Date(loc.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                  {filteredLocations.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-slate-600 text-sm">
                        No user location records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredLocations.length > itemsPerPage && (
              <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/40">
                <span className="text-xs text-slate-500">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredLocations.length)} of {filteredLocations.length} locations
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all disabled:opacity-30"
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
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
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
