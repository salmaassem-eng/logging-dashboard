import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Terminal, LogIn, UserPlus, AlertCircle, ShieldAlert } from 'lucide-react';

export default function Login() {
  const { login, register } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);

    // Simulate small latency for cool load effect
    setTimeout(() => {
      let result;
      if (isLogin) {
        result = login(email, password);
      } else {
        result = register(name, email, password);
      }
      setLoading(false);
      if (!result.success) {
        setError(result.message || 'Authentication failed. Please check credentials.');
      }
    }, 600);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      {/* Decorative Cyber Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 space-y-6">
        
        {/* Branding Logo */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <div className="bg-brand-600/10 border border-brand-500/25 p-3 rounded-2xl text-brand-400 shadow-lg shadow-brand-500/5 animate-pulse">
            <Terminal size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">
              LogVault
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Real-time telemetry ingestion, metrics visualization, and centralized log explorer for developers.
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-3xl p-8 border border-dark-border shadow-2xl relative">
          
          <h2 className="text-xl font-bold text-white mb-6">
            {isLogin ? 'Sign in to Console' : 'Create Developer Account'}
          </h2>

          {error && (
            <div className="flex gap-2.5 p-3.5 bg-rose-500/5 border border-rose-500/10 text-rose-400 rounded-xl text-xs mb-5 items-start">
              <ShieldAlert size={16} className="self-start mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Input (Register Only) */}
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Developer Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  required={!isLogin}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input px-4 py-2.5 rounded-xl border border-dark-border text-sm text-white w-full placeholder-slate-600 transition-all"
                />
              </div>
            )}

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                placeholder="dev@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input px-4 py-2.5 rounded-xl border border-dark-border text-sm text-white w-full placeholder-slate-600 transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input px-4 py-2.5 rounded-xl border border-dark-border text-sm text-white w-full placeholder-slate-600 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white py-3 px-4 rounded-xl text-sm font-bold shadow-lg shadow-brand-900/30 transition-all duration-200 mt-6 disabled:opacity-80"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn size={16} />
                  <span>Log In to Dashboard</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Create Account & Join</span>
                </>
              )}
            </button>

          </form>

          {/* Toggle Tab Footer */}
          <div className="mt-6 pt-5 border-t border-dark-border/40 text-center">
            <button
              onClick={toggleMode}
              className="text-xs text-slate-400 hover:text-brand-300 transition-colors font-medium"
            >
              {isLogin 
                ? "New to LogVault? Create a developer account" 
                : "Already registered? Sign in here"}
            </button>
          </div>

        </div>

        {/* Demo hints */}
        <div className="text-center">
          <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto">
            Demo Mode Sandbox: You can input any credentials to login (or click signup to create a new profile).
          </p>
        </div>

      </div>
    </div>
  );
}
