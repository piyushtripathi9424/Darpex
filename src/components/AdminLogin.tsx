import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, Sparkles, UserCheck, KeyRound, Mail, User, Phone } from 'lucide-react';
import { adminLogin, registerAdmin } from '../api/admin';

interface AdminLoginProps {
  onAdminLoginSuccess: () => void;
  onBackToCustomer: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onAdminLoginSuccess,
  onBackToCustomer
}) => {
  const [view, setView] = useState<'login' | 'register'>('login');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await adminLogin(email, password);
      localStorage.setItem('admin_session', JSON.stringify(data.session));
      localStorage.setItem('admin_jwt_token', data.session.access_token);
      onAdminLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await registerAdmin({
        name,
        email,
        phone,
        password,
        inviteCode
      });
      localStorage.setItem('admin_session', JSON.stringify(data.session));
      localStorage.setItem('admin_jwt_token', data.session.access_token);
      onAdminLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
            {view === 'login' && 'Enter administrator credentials'}
            {view === 'register' && 'Register a new administrator account'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 text-red-300 text-xs text-center font-medium rounded-sm">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs text-center font-medium rounded-sm">
            {successMsg}
          </div>
        )}

        {/* LOGIN VIEW */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@darpex.com"
                className="w-full bg-[#181822] border border-[#2a2a3a] p-3 text-white focus:border-[#d4af37] focus:outline-none rounded-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3 h-3" /> Password
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d4af37] hover:bg-[#e5c158] text-black py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-xl mt-4"
            >
              {loading ? 'Authenticating...' : <><ShieldCheck className="w-4 h-4" /> Login to Admin Console</>}
            </button>
            
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => { setView('register'); setError(''); setEmail(''); setPassword(''); }}
                className="text-[10px] text-zinc-400 hover:text-[#d4af37] uppercase tracking-widest"
              >
                Create new admin account
              </button>
            </div>
          </form>
        )}

        {/* REGISTER VIEW */}
        {view === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">Full Name</label>
              <input
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#181822] border border-[#2a2a3a] p-2.5 text-white focus:border-[#d4af37] focus:outline-none rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">Email Address</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#181822] border border-[#2a2a3a] p-2.5 text-white focus:border-[#d4af37] focus:outline-none rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">Phone Number</label>
              <input
                type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1234567890"
                className="w-full bg-[#181822] border border-[#2a2a3a] p-2.5 text-white focus:border-[#d4af37] focus:outline-none rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">Password</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#181822] border border-[#2a2a3a] p-2.5 text-white focus:border-[#d4af37] focus:outline-none rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#d4af37] uppercase tracking-widest mb-1">Secret Invite Code</label>
              <input
                type="password" required value={inviteCode} onChange={(e) => setInviteCode(e.target.value)}
                className="w-full bg-[#181822] border border-[#d4af37]/30 p-2.5 text-white focus:border-[#d4af37] focus:outline-none rounded-sm"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#d4af37] hover:bg-[#e5c158] text-black py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors mt-4"
            >
              {loading ? 'Registering...' : <><UserCheck className="w-4 h-4" /> Register & Access Portal</>}
            </button>
            
            <div className="text-center mt-3">
              <button 
                type="button" onClick={() => { setView('login'); setError(''); }}
                className="text-[10px] text-zinc-400 hover:text-[#d4af37] uppercase tracking-widest"
              >
                Back to login
              </button>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-[#262636] text-center">
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
