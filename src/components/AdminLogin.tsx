import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, Sparkles, UserCheck } from 'lucide-react';

interface AdminLoginProps {
  onAdminLoginSuccess: () => void;
  onBackToCustomer: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onAdminLoginSuccess,
  onBackToCustomer
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (username.trim().toLowerCase() === 'admin' && password === 'admin123') {
        setLoading(false);
        onAdminLoginSuccess();
      } else {
        setLoading(false);
        setError('Invalid admin credentials. Use admin / admin123');
      }
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#08080a] luxury-gradient">
      <div className="bg-[#121218] border border-[#2a2a3c] max-w-md w-full p-8 rounded-sm shadow-2xl space-y-6 text-white relative">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] mx-auto flex items-center justify-center shadow-lg">
            <Lock className="w-6 h-6" />
          </div>

          <div className="inline-block px-3 py-0.5 bg-amber-500/10 text-[#d4af37] border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest mt-2">
            Restricted Access
          </div>

          <h2 className="text-2xl font-light font-display uppercase tracking-wider text-white">
            Admin <span className="font-bold text-[#d4af37]">Studio Portal</span>
          </h2>
          <p className="text-xs text-zinc-400 uppercase tracking-widest">
            Enter administrator credentials to manage studio operations
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 text-red-300 text-xs text-center font-medium rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1.5">
              Admin Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full bg-[#181822] border border-[#2a2a3a] p-3 text-white focus:border-[#d4af37] focus:outline-none rounded-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#181822] border border-[#2a2a3a] p-3 text-white focus:border-[#d4af37] focus:outline-none rounded-sm"
            />
          </div>

          <div className="p-3 bg-[#181822] border border-[#2a2a3a] text-[11px] text-zinc-400 space-y-1">
            <div className="text-[#d4af37] font-bold uppercase tracking-wider">Demo Credentials:</div>
            <div>Username: <strong className="text-white">admin</strong></div>
            <div>Password: <strong className="text-white">admin123</strong></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4af37] hover:bg-[#e5c158] text-black py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-xl"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Login to Admin Console</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-[#262636] text-center">
          <button
            type="button"
            onClick={onBackToCustomer}
            className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest flex items-center justify-center gap-1.5 mx-auto"
          >
            ← Return to Customer Website
          </button>
        </div>

      </div>
    </div>
  );
};
