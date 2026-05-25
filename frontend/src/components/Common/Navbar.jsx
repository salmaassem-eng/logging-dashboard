import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Terminal, LogOut, User, Activity } from 'lucide-react';

export default function Navbar() {
  const { developer, logout } = useContext(AppContext);

  if (!developer) return null;

  return (
    <nav className="glass-panel border-b border-dark-border sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-brand-600/20 border border-brand-500/30 p-2 rounded-lg text-brand-400">
          <Terminal size={22} className="animate-pulse" />
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-brand-200 to-brand-500 bg-clip-text text-transparent">
            LogVault
          </span>
          <span className="ml-1.5 text-[10px] uppercase font-bold tracking-widest bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded border border-brand-500/20">
            Console
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Connection status indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Telemetry Active</span>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 border-l border-dark-border pl-6">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-200">{developer.name}</span>
            <span className="text-xs text-slate-400">{developer.email}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-200 font-bold text-sm">
            {developer.name.charAt(0)}
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
