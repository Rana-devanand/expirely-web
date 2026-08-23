'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Layers3,
  Loader2,
  RefreshCw,
  Rows3,
  Search,
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useGetTableStatsQuery } from '@/store/api/dashboardApi';

const numberFormatter = new Intl.NumberFormat('en-IN');

export default function AdminDatabasePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [group, setGroup] = useState('All');
  const { data: response, isLoading, isFetching, error, refetch } = useGetTableStatsQuery();
  const data = response?.data;

  const groups = useMemo(
    () => ['All', ...Array.from(new Set((data?.tables || []).map((table) => table.group)))],
    [data?.tables],
  );

  const filteredTables = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return (data?.tables || []).filter((table) => {
      const matchesGroup = group === 'All' || table.group === group;
      const matchesSearch =
        !query ||
        table.name.toLowerCase().includes(query) ||
        table.description.toLowerCase().includes(query) ||
        table.group.toLowerCase().includes(query);
      return matchesGroup && matchesSearch;
    });
  }, [data?.tables, group, searchQuery]);

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#020617] font-sans text-slate-50">
      <AdminSidebar isOpen={isSidebarOpen} />
      <div className="relative flex h-screen flex-1 flex-col overflow-hidden">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen((open) => !open)} />

        <main className="custom-scrollbar flex-1 space-y-5 overflow-y-auto p-5 pb-14 md:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="flex items-center gap-2.5 text-2xl font-extrabold text-slate-50">
                <Database className="h-6 w-6 text-emerald-400" />
                Database Tables
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Live record counts and purpose of every application table.
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-slate-800 bg-slate-900/50 px-4 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-60 sm:self-auto"
            >
              <RefreshCw className={`h-4 w-4 text-emerald-400 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh counts
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryCard
              icon={Layers3}
              label="Known Tables"
              value={data ? numberFormatter.format(data.totalTables) : '—'}
              color="text-blue-400"
              background="bg-blue-500/10"
            />
            <SummaryCard
              icon={CheckCircle2}
              label="Available Tables"
              value={data ? numberFormatter.format(data.availableTables) : '—'}
              color="text-emerald-400"
              background="bg-emerald-500/10"
            />
            <SummaryCard
              icon={Rows3}
              label="Total Records"
              value={data ? numberFormatter.format(data.totalRecords) : '—'}
              color="text-amber-400"
              background="bg-amber-500/10"
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search table name, group, or purpose..."
                className="h-10 w-full rounded-lg border border-slate-800 bg-slate-900/40 pl-10 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <select
              value={group}
              onChange={(event) => setGroup(event.target.value)}
              className="h-10 min-w-44 cursor-pointer rounded-lg border border-slate-800 bg-slate-900/40 px-3 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {groups.map((item) => (
                <option key={item} value={item} className="bg-slate-950">
                  {item}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900/20">
              <Loader2 className="h-9 w-9 animate-spin text-emerald-400" />
              <p className="text-xs font-semibold text-slate-400">Reading table counts…</p>
            </div>
          ) : error ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
              <AlertTriangle className="h-9 w-9 text-red-400" />
              <div>
                <p className="font-bold text-red-300">Unable to load database details</p>
                <p className="mt-1 text-xs text-slate-500">Confirm the admin session and backend connection, then retry.</p>
              </div>
            </div>
          ) : filteredTables.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredTables.map((table) => (
                  <article
                    key={table.name}
                    className="flex min-h-44 flex-col rounded-xl border border-slate-800 bg-slate-900/30 p-4 transition-colors hover:border-slate-700 hover:bg-slate-900/45"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                          <Database className="h-4.5 w-4.5 text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                          <code className="block truncate text-sm font-bold text-slate-100">
                            {table.name}
                          </code>
                          <span className="text-[10px] font-semibold text-slate-500">{table.group}</span>
                        </div>
                      </div>

                      {table.available ? (
                        <div className="shrink-0 text-right">
                          <p className="text-xl font-extrabold tabular-nums text-emerald-400">
                            {numberFormatter.format(table.count ?? 0)}
                          </p>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">records</p>
                        </div>
                      ) : (
                        <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold text-red-400">
                          <AlertTriangle className="h-3 w-3" /> Unavailable
                        </span>
                      )}
                    </div>

                    <div className="my-3 h-px bg-slate-800" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Purpose</p>
                    <p className="mt-1.5 text-xs leading-5 text-slate-400">{table.description}</p>
                  </article>
                ))}
              </div>
              {data?.generatedAt && (
                <p className="text-right text-[10px] text-slate-600">
                  Last refreshed {new Date(data.generatedAt).toLocaleString()}
                </p>
              )}
            </>
          ) : (
            <div className="flex min-h-52 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/20 p-6 text-center text-xs text-slate-500">
              No tables match the selected filters.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
  background,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
  background: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/30 p-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${background}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div>
        <p className="text-xl font-extrabold text-slate-50">{value}</p>
        <p className="text-xs font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}
