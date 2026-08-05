import React, { useState } from 'react';
import { X, Mail, Phone, Lock, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; emailOrPhone: string }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  // Name state
  const [name, setName] = useState('Alexander Vance');

  // Email state
  const [email, setEmail] = useState('alexander@vance.com');
  const [password, setPassword] = useState('••••••••');

  // Phone state
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === 'email') {
      onLoginSuccess({
        name: name.trim() || 'Alexander Vance',
        emailOrPhone: email || 'alexander@vance.com'
      });
    } else {
      onLoginSuccess({
        name: name.trim() || 'Alexander Vance',
        emailOrPhone: phone || '+91 98765 43210'
      });
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
            Customer <span className="font-bold text-[#d4af37]">Login</span>
          </h2>
          <p className="text-xs text-zinc-400 uppercase tracking-widest">
            Access your garage & service history
          </p>
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
              className="w-full bg-[#d4af37] hover:bg-[#e5c158] text-black py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-lg rounded-sm"
            >
              <span>Login To Garage</span>
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

      </div>
    </div>
  );
};
