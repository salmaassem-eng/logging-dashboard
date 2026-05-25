import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Key, Eye, EyeOff, Copy, Check, RotateCw, AlertTriangle } from 'lucide-react';
import Modal from '../Common/Modal';

export default function ApiKeyCard() {
  const { developer, regenerateApiKey } = useContext(AppContext);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!developer) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(developer.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    // Simulate loading for cool UI feel
    setTimeout(() => {
      regenerateApiKey();
      setIsRegenerating(false);
      setConfirmOpen(false);
    }, 8000);
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-6 border border-dark-border shadow-lg relative overflow-hidden">
        {/* Background glow decorator */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-brand-500/10 border border-brand-500/20 p-3 rounded-xl text-brand-400">
              <Key size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Developer API Key</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Use this primary secret key to authenticate your server sdk or ingestion endpoint requests with LogVault. Keep it confidential.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:min-w-[400px]">
            {/* Display / Copy Area */}
            <div className="flex-1 flex items-center glass-input rounded-xl border border-dark-border px-3 py-2.5 font-mono text-sm relative">
              <span className="text-slate-300 overflow-hidden text-ellipsis whitespace-nowrap select-all max-w-[200px] sm:max-w-none">
                {showKey ? developer.apiKey : '•'.repeat(developer.apiKey.length)}
              </span>
              
              <div className="flex items-center gap-1.5 ml-auto border-l border-dark-border/40 pl-2">
                <button
                  onClick={() => setShowKey(!showKey)}
                  title={showKey ? 'Hide Secret Key' : 'Reveal Secret Key'}
                  className="p-1 text-slate-400 hover:text-white rounded transition-colors duration-150"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={handleCopy}
                  title="Copy to Clipboard"
                  className="p-1 text-slate-400 hover:text-brand-400 rounded transition-colors duration-150 relative"
                >
                  {copied ? <Check size={16} className="text-emerald-400 animate-in zoom-in" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* Regenerate Trigger */}
            <button
              onClick={() => setConfirmOpen(true)}
              className="flex items-center justify-center gap-2 border border-slate-700/80 hover:border-brand-500 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            >
              <RotateCw size={15} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => !isRegenerating && setConfirmOpen(false)}
        title="Regenerate API Key"
      >
        <div className="flex gap-4">
          <div className="text-rose-500 p-2 bg-rose-500/10 rounded-xl border border-rose-500/20 self-start">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white">Are you absolutely sure?</h4>
            <p className="text-sm text-slate-300 mt-2">
              Regenerating your key will revoke the existing one immediately. Any apps/services actively pushing logs using the old credential will fail with 401 Unauthorized errors until updated.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8">
          <button
            disabled={isRegenerating}
            onClick={() => setConfirmOpen(false)}
            className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={isRegenerating}
            onClick={handleRegenerate}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-rose-900/30 transition-all duration-200 disabled:opacity-75"
          >
            {isRegenerating ? (
              <>
                <RotateCw size={15} className="animate-spin" />
                <span>Revoking...</span>
              </>
            ) : (
              <span>Confirm Revoke & Regenerate</span>
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}
