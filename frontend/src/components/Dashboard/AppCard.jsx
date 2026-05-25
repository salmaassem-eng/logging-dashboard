import React from 'react';
import { Layers, Activity, AlertCircle, FileText, ChevronRight, Trash2 } from 'lucide-react';

export default function AppCard({ app, onViewLogs, onDeleteClick }) {
  const { name, platform, description, metrics } = app;

  // Compute status colors for the error rate
  const getRateColor = (rate) => {
    if (rate >= 5) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (rate >= 1) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-dark-border shadow-md hover:border-brand-500/40 hover:shadow-brand-900/10 transition-all duration-300 flex flex-col justify-between group">
      
      {/* App Core Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
            {platform}
          </span>
          <button
            onClick={() => onDeleteClick(app)}
            className="text-slate-500 hover:text-rose-400 p-1.5 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Delete Application"
          >
            <Trash2 size={15} />
          </button>
        </div>
        
        <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
          {name}
        </h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 h-8">
          {description}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 border-y border-dark-border/40 py-3.5 my-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
            <FileText size={10} /> Volume
          </span>
          <span className="text-sm font-extrabold text-slate-200">
            {metrics.totalLogs.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
            <AlertCircle size={10} /> Errors
          </span>
          <span className="text-sm font-extrabold text-rose-400">
            {metrics.errorCount}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
            <Activity size={10} /> Err Rate
          </span>
          <span className={`text-xs px-1.5 py-0.5 font-extrabold rounded-md border w-fit ${getRateColor(metrics.errorRate)}`}>
            {metrics.errorRate}%
          </span>
        </div>
      </div>

      {/* View logs button */}
      <button
        onClick={onViewLogs}
        className="w-full flex items-center justify-center gap-1.5 bg-brand-600/15 hover:bg-brand-600 border border-brand-500/20 hover:border-brand-500 text-brand-300 hover:text-white py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200"
      >
        <span>Explore Application Logs</span>
        <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
      </button>

    </div>
  );
}
