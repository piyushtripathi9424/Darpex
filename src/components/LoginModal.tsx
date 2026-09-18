import React, { useState } from 'react';
import { X, Mail, Phone, Lock, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, User } from 'lucide-react';

import { registerUser, loginUser } from '../api/auth';
import { API_URL } from '../api/client';
import { useToast } from './ToastContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; emailOrPhone: string }, token: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Phone state
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === 'phone') {
      toast('Phone login is coming soon. Please use email.', 'info');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'register') {
        const res = await registerUser({ email, password, name });
        if (!res.session) {
          toast('Account created! Please check your email to verify your account.', 'success');
          setMode('login');
          return;
        }
        onLoginSuccess({
          name: res.user.name,
          emailOrPhone: res.user.email
        }, res.session.access_token);
        toast('Registration successful! Welcome.', 'success');
      } else {
        const res = await loginUser({ email, password });
        if (res.user?.role === 'admin') {
          toast('Admin accounts must use the Admin Login portal.', 'error');
          return;
        }
        onLoginSuccess({
          name: res.user.name || 'Customer',
          emailOrPhone: res.user.email
        }, res.token);
      }
    } catch (err: any) {
      toast(err.response?.data?.error || 'Authentication failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
      <div className="bg-[#121218] border border-[#2a2a3c] rounded-sm max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-2xl text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 bg-[#181822] border border-[#2a2a3a] rounded-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#181822] border border-[#d4af37]/40 text-[#d4af37] mx-auto flex items-center justify-center rounded-sm shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-light font-display uppercase tracking-wider text-white">
            Customer <span className="font-bold text-[#d4af37]">{mode === 'login' ? 'Login' : 'Register'}</span>
          </h2>
          <p className="text-xs text-zinc-400 uppercase tracking-widest">
            Access your garage & service history
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-2">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1 border-b-2 ${mode === 'login' ? 'border-[#d4af37] text-white' : 'border-transparent text-zinc-500'}`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1 border-b-2 ${mode === 'register' ? 'border-[#d4af37] text-white' : 'border-transparent text-zinc-500'}`}
          >
            Create Account
          </button>
        </div>

        {/* Login Method Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-[#181822] p-1 border border-[#2a2a3a]">
          <button
            type="button"
            onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
            className={`py-2 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all ${
              loginMethod === 'email'
                ? 'bg-[#d4af37] text-black font-extrabold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Email & Password
          </button>

          <button
            type="button"
            onClick={() => { setLoginMethod('phone'); setOtpSent(false); }}
            className={`py-2 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all ${
              loginMethod === 'phone'
                ? 'bg-[#d4af37] text-black font-extrabold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            Phone & OTP
          </button>
        </div>

        {/* Option 1: Email + Password */}
        {loginMethod === 'email' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alexander Vance"
                    className="w-full bg-[#181822] border border-[#2a2a3a] p-3 pl-10 text-xs text-white focus:border-[#d4af37] focus:outline-none rounded-sm"
                  />
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#181822] border border-[#2a2a3a] p-3 pl-10 text-xs text-white focus:border-[#d4af37] focus:outline-none rounded-sm"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#181822] border border-[#2a2a3a] p-3 pl-10 text-xs text-white focus:border-[#d4af37] focus:outline-none rounded-sm"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#d4af37] hover:bg-[#e5c158] text-black py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-lg rounded-sm"
            >
              <span>{isLoading ? 'Processing...' : (mode === 'login' ? 'Login To Garage' : 'Create Account')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Option 2: Phone Number + OTP */}
        {loginMethod === 'phone' && (
          <form onSubmit={otpSent ? handleSubmit : handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alexander Vance"
                  className="w-full bg-[#181822] border border-[#2a2a3a] p-3 pl-10 text-xs text-white focus:border-[#d4af37] focus:outline-none rounded-sm"
                />
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#181822] border border-[#2a2a3a] p-3 pl-10 text-xs text-white focus:border-[#d4af37] focus:outline-none rounded-sm"
                />
                <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {otpSent && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                    Enter OTP
                  </label>
                  <span className="text-[10px] text-[#d4af37] font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> OTP Sent
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1 2 3 4 5 6"
                  className="w-full bg-[#181822] border border-[#2a2a3a] p-3 text-center text-lg tracking-widest font-mono text-[#d4af37] focus:border-[#d4af37] focus:outline-none rounded-sm"
                />
              </div>
            )}

            {!otpSent ? (
              <button
                type="submit"
                className="w-full bg-[#d4af37] hover:bg-[#e5c158] text-black py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-lg rounded-sm"
              >
                <span>Send Verification OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-[#d4af37] hover:bg-[#e5c158] text-black py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-lg rounded-sm"
              >
                <span>Verify OTP & Enter</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}
          </form>
        )}

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-[#2a2a3a] w-full"></div>
          <span className="absolute bg-[#121218] px-3 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
            OR
          </span>
        </div>

        <button
          onClick={() => window.location.href = `${API_URL}/auth/google`}
          className="w-full bg-[#181822] border border-[#2a2a3a] hover:bg-[#20202d] text-white py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-colors shadow-lg rounded-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

      </div>
    </div>
  );
};
