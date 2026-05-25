import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import Modal from '../Common/Modal';
import { AlertCircle, Trash2 } from 'lucide-react';

export default function DeleteAppModal({ isOpen, onClose, app }) {
  const { deleteApp } = useContext(AppContext);
  const [confirmName, setConfirmName] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset confirmation text on open/close
    setConfirmName('');
    setError(false);
  }, [isOpen, app]);

  if (!app) return null;

  const handleDelete = (e) => {
    e.preventDefault();
    if (confirmName.trim() !== app.name) {
      setError(true);
      return;
    }
    
    deleteApp(app.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Application">
      <form onSubmit={handleDelete} className="space-y-5">
        
        <div className="flex gap-4 p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl text-rose-400">
          <div className="self-start mt-0.5">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Critical Warning: Action cannot be undone</h4>
            <p className="text-xs text-rose-400/90 mt-1 leading-relaxed">
              This will permanently delete the application <strong className="text-white">"{app.name}"</strong> and erase all associated logs, metrics, and API settings from our systems.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirm-app-name" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Confirm Application Name
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Please type <span className="font-mono text-rose-300 select-all font-semibold">"{app.name}"</span> to confirm.
          </p>
          <input
            id="confirm-app-name"
            type="text"
            required
            autoComplete="off"
            placeholder={app.name}
            value={confirmName}
            onChange={(e) => {
              setConfirmName(e.target.value);
              setError(false);
            }}
            className="glass-input rounded-xl border border-dark-border px-4 py-2.5 text-sm text-white w-full"
          />
          {error && (
            <span className="text-rose-400 text-[11px] font-semibold">
              The input does not match the application name.
            </span>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-dark-border/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={confirmName.trim() !== app.name}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-950/40 disabled:text-slate-600 disabled:border-rose-950/20 disabled:shadow-none text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-rose-900/30 border border-rose-500/20 transition-all duration-200"
          >
            <Trash2 size={15} />
            <span>Permanently Delete</span>
          </button>
        </div>

      </form>
    </Modal>
  );
}
