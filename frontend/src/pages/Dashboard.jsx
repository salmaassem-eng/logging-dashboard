import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import ApiKeyCard from '../components/Dashboard/ApiKeyCard';
import AppCard from '../components/Dashboard/AppCard';
import CreateAppModal from '../components/Dashboard/CreateAppModal';
import DeleteAppModal from '../components/Dashboard/DeleteAppModal';
import { Plus, Terminal, RefreshCw, FolderGit } from 'lucide-react';

export default function Dashboard() {
  const { apps, setSelectedAppId } = useContext(AppContext);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAppToDelete, setSelectedAppToDelete] = useState(null);

  const handleDeleteClick = (app) => {
    setSelectedAppToDelete(app);
    setDeleteOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white m-0 tracking-tight">
            Developer Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Overview of your connected microservices, logs volume, and system alerts.
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-900/35 border border-brand-500/20 transition-all duration-200"
        >
          <Plus size={16} />
          <span>Register New App</span>
        </button>
      </div>

      {/* 1. Api Key Card */}
      <ApiKeyCard />

      {/* 2. Apps Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-dark-border/40">
          <FolderGit size={18} className="text-brand-400" />
          <h2 className="text-base font-extrabold text-white m-0 uppercase tracking-wider">
            Connected Applications ({apps.length})
          </h2>
        </div>

        {apps.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 border border-dark-border text-center flex flex-col items-center justify-center gap-4">
            <div className="bg-slate-900/80 border border-dark-border p-4 rounded-full text-slate-500">
              <Terminal size={32} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No applications registered</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Get started by creating a new application project to receive your unique project API ingestion keys.
              </p>
            </div>
            <button
              onClick={() => setCreateOpen(true)}
              className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all mt-2"
            >
              Add Your First Application
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onViewLogs={() => setSelectedAppId(app.id)}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateAppModal 
        isOpen={createOpen} 
        onClose={() => setCreateOpen(false)} 
      />

      {/* Delete Modal */}
      <DeleteAppModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedAppToDelete(null);
        }}
        app={selectedAppToDelete}
      />

    </div>
  );
}
