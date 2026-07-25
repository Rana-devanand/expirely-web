'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Braces, 
  Copy, 
  Download, 
  RefreshCw, 
  FileCode, 
  Check, 
  Loader2 
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import toast from 'react-hot-toast';

// RTK Query imports
import { useGetAdminCategoriesQuery } from '@/store/api/categoryApi';
import { useGetAdminProductsQuery } from '@/store/api/productApi';
import { useGetAllUsersQuery } from '@/store/api/userApi';
import { useGetStatsQuery, useGetChartsQuery } from '@/store/api/dashboardApi';

type TabType = 'categories' | 'products' | 'users' | 'stats' | 'charts';

export default function RawDataViewerPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('categories');
  const [isCopied, setIsCopied] = useState(false);

  // Hook Calls
  const { 
    data: categoriesData, 
    isLoading: isCategoriesLoading, 
    isFetching: isCategoriesFetching, 
    refetch: refetchCategories 
  } = useGetAdminCategoriesQuery();

  const { 
    data: productsData, 
    isLoading: isProductsLoading, 
    isFetching: isProductsFetching, 
    refetch: refetchProducts 
  } = useGetAdminProductsQuery();

  const { 
    data: usersData, 
    isLoading: isUsersLoading, 
    isFetching: isUsersFetching, 
    refetch: refetchUsers 
  } = useGetAllUsersQuery();

  const { 
    data: statsData, 
    isLoading: isStatsLoading, 
    isFetching: isStatsFetching, 
    refetch: refetchStats 
  } = useGetStatsQuery();

  const { 
    data: chartsData, 
    isLoading: isChartsLoading, 
    isFetching: isChartsFetching, 
    refetch: refetchCharts 
  } = useGetChartsQuery();

  // Combine loading states
  const currentTabInfo = useMemo(() => {
    switch (activeTab) {
      case 'categories':
        return {
          url: '/categories/admin',
          data: categoriesData,
          isLoading: isCategoriesLoading,
          isFetching: isCategoriesFetching,
          refetch: refetchCategories,
          name: 'Categories API'
        };
      case 'products':
        return {
          url: '/products/admin',
          data: productsData,
          isLoading: isProductsLoading,
          isFetching: isProductsFetching,
          refetch: refetchProducts,
          name: 'Products API'
        };
      case 'users':
        return {
          url: '/users',
          data: usersData,
          isLoading: isUsersLoading,
          isFetching: isUsersFetching,
          refetch: refetchUsers,
          name: 'Users API'
        };
      case 'stats':
        return {
          url: '/dashboard/stats',
          data: statsData,
          isLoading: isStatsLoading,
          isFetching: isStatsFetching,
          refetch: refetchStats,
          name: 'Dashboard Stats API'
        };
      case 'charts':
        return {
          url: '/dashboard/charts',
          data: chartsData,
          isLoading: isChartsLoading,
          isFetching: isChartsFetching,
          refetch: refetchCharts,
          name: 'Dashboard Charts API'
        };
    }
  }, [
    activeTab, 
    categoriesData, isCategoriesLoading, isCategoriesFetching, refetchCategories,
    productsData, isProductsLoading, isProductsFetching, refetchProducts,
    usersData, isUsersLoading, isUsersFetching, refetchUsers,
    statsData, isStatsLoading, isStatsFetching, refetchStats,
    chartsData, isChartsLoading, isChartsFetching, refetchCharts
  ]);

  const jsonString = useMemo(() => {
    if (!currentTabInfo.data) return 'null';
    return JSON.stringify(currentTabInfo.data, null, 2);
  }, [currentTabInfo.data]);

  // Syntax highlighting for raw JSON text
  const highlightedJson = useMemo(() => {
    if (jsonString === 'null') return '<span class="text-slate-500">No data loaded</span>';
    
    // Escape HTML special characters
    const escaped = jsonString
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
      
    // Perform regex matching for keys, strings, booleans, and nulls
    return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
      let cls = 'text-amber-400'; // numbers
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-purple-400 font-bold'; // object keys
        } else {
          cls = 'text-emerald-400'; // string values
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-blue-400 font-semibold'; // boolean
      } else if (/null/.test(match)) {
        cls = 'text-rose-500 font-semibold'; // null
      }
      return `<span class="${cls}">${match}</span>`;
    });
  }, [jsonString]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setIsCopied(true);
    toast.success('JSON copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-raw-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${activeTab}-raw-data.json`);
  };

  const TABS: { id: TabType; label: string }[] = [
    { id: 'categories', label: 'Categories' },
    { id: 'products', label: 'Products' },
    { id: 'users', label: 'Users List' },
    { id: 'stats', label: 'Dashboard Stats' },
    { id: 'charts', label: 'Dashboard Charts' }
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar pb-16">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-50 flex items-center gap-2">
              <Braces className="w-6 h-6 text-emerald-400" />
              API Data Viewer
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Inspect and download raw JSON payloads fetched from the production API services.
            </p>
          </div>

          {/* Selector Tabs */}
          <div className="flex bg-slate-900/40 p-1 rounded-xl border border-slate-800 self-start max-w-full overflow-x-auto gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsCopied(false);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Info & Toolbar */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/25 px-1.5 py-0.5 rounded uppercase">
                  GET
                </span>
                <span className="text-xs font-mono text-slate-300 truncate">
                  {currentTabInfo.url}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">
                Target: <span className="text-slate-400 font-semibold">{currentTabInfo.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => currentTabInfo.refetch()}
                disabled={currentTabInfo.isFetching || currentTabInfo.isLoading}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs text-slate-300 font-bold transition-all active:scale-95 disabled:opacity-40"
                title="Refetch API Payload"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${currentTabInfo.isFetching ? 'animate-spin text-emerald-400' : ''}`} />
                {currentTabInfo.isFetching ? 'Syncing...' : 'Refetch'}
              </button>

              <button
                onClick={handleCopy}
                disabled={currentTabInfo.isLoading || !currentTabInfo.data}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs text-slate-300 font-bold transition-all active:scale-95 disabled:opacity-40"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                disabled={currentTabInfo.isLoading || !currentTabInfo.data}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-40 shadow-md shadow-emerald-500/5"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>

          {/* JSON code container */}
          <div className="bg-[#030712] border border-slate-850 rounded-2xl overflow-hidden shadow-inner flex flex-col relative h-[55vh]">
            <div className="bg-slate-900/60 px-4 py-2.5 border-b border-slate-850 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400 font-semibold">{activeTab}-data.json</span>
              </div>
              {currentTabInfo.data && (
                <span className="text-[10px] text-slate-500 font-mono">
                  Size: {Math.round(jsonString.length / 102) / 10} KB
                </span>
              )}
            </div>

            <div className="flex-grow overflow-auto p-5 custom-scrollbar font-mono text-[11px] leading-relaxed relative">
              {currentTabInfo.isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#030712]">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Loading Payload...</p>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap select-text selection:bg-slate-850">
                  <code 
                    dangerouslySetInnerHTML={{ __html: highlightedJson }} 
                    className="block"
                  />
                </pre>
              )}
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
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
