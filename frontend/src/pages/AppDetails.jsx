import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import LogMetrics from '../components/Logs/LogMetrics';
import LogFilters from '../components/Logs/LogFilters';
import LogsTable from '../components/Logs/LogsTable';
import { ArrowLeft, Layout, Terminal, Key, Calendar, Info, ShieldAlert } from 'lucide-react';

export default function AppDetails() {
  const { selectedApp, setSelectedAppId } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [sortBy, setSortBy] = useState('recent');
  const [showAppKey, setShowAppKey] = useState(false);

  if (!selectedApp) return null;

  // Process logs: filtering and sorting
  let processedLogs = [...selectedApp.logs];

  // 1. Filter by Search Term
  if (searchTerm.trim()) {
    const query = searchTerm.toLowerCase();
    processedLogs = processedLogs.filter(log => 
      log.message.toLowerCase().includes(query)
    );
  }

  // 2. Filter by Level
  if (filterLevel !== 'ALL') {
    const lvl = filterLevel.toLowerCase();
    processedLogs = processedLogs.filter(log => 
      log.level.toLowerCase() === lvl
    );
  }

  // 3. Sort Logs
  processedLogs.sort((a, b) => {
    if (sortBy === 'recent') {
      // Sort by lastOccurrence datetime (descending)
      return new Date(b.lastOccurrence) - new Date(a.lastOccurrence);
    } else if (sortBy === 'occurred') {
      // Sort by count (descending)
      return b.count - a.count;
    }
    return 0;
  });

  // Date formatter
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Back to Workspace button */}
      <div>
        <button
          onClick={() => setSelectedAppId(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold transition-colors duration-150 py-1.5 px-3 border border-dark-border rounded-xl hover:bg-slate-900"
        >
          <ArrowLeft size={14} />
          <span>Back to Workspace</span>
        </button>
      </div>

      {/* App Header & Credentials Banner */}
      <div className="glass-card rounded-2xl p-6 border border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Info */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded border border-slate-700/50">
              {selectedApp.platform}
            </span>
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Calendar size={12} /> Registered {formatDate(selectedApp.createdAt)}
            </span>
          </div>

          <h1 className="text-2xl font-black text-white m-0 tracking-tight">
            {selectedApp.name}
          </h1>
          
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            {selectedApp.description}
          </p>
        </div>

        {/* Project API Secret */}
        <div className="md:border-l md:border-dark-border/40 md:pl-6 space-y-2 self-stretch flex flex-col justify-center min-w-[280px]">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Key size={12} /> App Ingestion Token
          </span>
          
          <div className="flex items-center glass-input rounded-xl border border-dark-border px-3 py-2 font-mono text-xs relative">
            <span className="text-slate-300 overflow-hidden text-ellipsis whitespace-nowrap select-all max-w-[150px] sm:max-w-none">
              {showAppKey ? selectedApp.apiKey : '•'.repeat(selectedApp.apiKey.length)}
            </span>
            <button
              onClick={() => setShowAppKey(!showAppKey)}
              className="ml-auto text-slate-400 hover:text-white px-1 text-[10px] font-bold uppercase transition-colors"
            >
              {showAppKey ? 'Hide' : 'Show'}
            </button>
          </div>
          <span className="text-[9px] text-slate-500 leading-tight block">
            Pass this app-scoped key in the headers of your LogVault client library.
          </span>
        </div>

      </div>

      {/* 3. Analytics Charts Section */}
      <LogMetrics app={selectedApp} />

      {/* 4. Logs Header & Simulation Info */}
      <div className="space-y-4 pt-4 border-t border-dark-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-white m-0 uppercase tracking-wider flex items-center gap-2">
              <Terminal size={16} className="text-brand-400" /> Logs Explorer
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Search, filter, and sort indexed warnings and errors.
            </p>
          </div>
        </div>

        {/* Log Filters controls */}
        <LogFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterLevel={filterLevel}
          setFilterLevel={setFilterLevel}
          sortBy={sortBy}
          setSortBy={setSortBy}
          appId={selectedApp.id}
        />

        {/* Paginated Logs Table */}
        <LogsTable logs={processedLogs} />
      </div>

    </div>
  );
}
