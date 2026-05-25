import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Modal from '../Common/Modal';
import { PlusCircle } from 'lucide-react';

export default function CreateAppModal({ isOpen, onClose }) {
  const { createApp } = useContext(AppContext);
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('Backend (Node.js/Express)');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const platforms = [
    'Backend (Node.js/Express)',
    'Backend (Python/FastAPI)',
    'Backend (Go/Rust)',
    'Frontend (React/Vite)',
    'Frontend (Next.js/Svelte)',
    'Mobile (React Native/Flutter)',
    'Serverless (AWS Lambda/GCP)',
    'Other/Universal',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Application name is required.');
      return;
    }
    setError('');
    createApp(name.trim(), platform, description.trim());
    
    // Reset state
    setName('');
    setPlatform('Backend (Node.js/Express)');
    setDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Application">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Name input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="app-name" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Application Name *
          </label>
          <input
            id="app-name"
            type="text"
            required
            placeholder="e.g. Stripe Sync Webhook"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass-input rounded-xl border border-dark-border px-4 py-2.5 text-sm text-white w-full"
          />
          {error && <span className="text-rose-400 text-[11px] font-medium">{error}</span>}
        </div>

        {/* Platform dropdown */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="app-platform" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Platform / Ecosystem
          </label>
          <select
            id="app-platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="glass-input rounded-xl border border-dark-border px-4 py-2.5 text-sm text-white w-full bg-dark-card [&>option]:bg-dark-bg [&>option]:text-white"
          >
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Description textarea */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="app-desc" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Description (Optional)
          </label>
          <textarea
            id="app-desc"
            placeholder="Summarize the purpose of this application and what events it tracks."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="glass-input rounded-xl border border-dark-border px-4 py-2.5 text-sm text-white w-full resize-none"
          />
        </div>

        {/* Buttons */}
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
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-brand-900/30 transition-all duration-200"
          >
            <PlusCircle size={15} />
            <span>Create Application</span>
          </button>
        </div>

      </form>
    </Modal>
  );
}
