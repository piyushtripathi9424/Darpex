import React, { useState } from 'react';
import { Sparkles, Calendar, User, Menu, X, Car, Wrench, ShieldCheck, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'garage' | 'my-services' | 'admin-login' | 'admin-dashboard';
  setCurrentView: (view: 'home' | 'garage' | 'my-services' | 'admin-login' | 'admin-dashboard') => void;
  onOpenBooking: () => void;
  onOpenLogin: () => void;
  onNavigateToSection: (sectionId: string) => void;
  user: { name: string; emailOrPhone: string } | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenBooking,
  onOpenLogin,
  onNavigateToSection,
  user,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavSectionClick = (sectionId: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        onNavigateToSection(sectionId);
      }, 100);
    } else {
      onNavigateToSection(sectionId);
    }
    setMobileMenuOpen(false);
  };

  // If in admin dashboard, render standard top header
  if (currentView === 'admin-dashboard' || currentView === 'admin-login') {
    return (
      <header className="sticky top-0 z-50 bg-[#0c0c10] border-b border-[#262636]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-[#d4af37] text-black flex items-center justify-center font-black rounded-sm shadow-lg">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-widest-plus font-display text-white">
                DAR<span className="text-[#d4af37]">PEX</span>
              </div>
              <p className="text-[9px] tracking-super text-[#d4af37] uppercase font-semibold">
                Admin Operations Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-zinc-300 hover:text-white font-bold uppercase tracking-widest flex items-center gap-1.5 bg-[#181822] border border-[#2a2a3a] px-4 py-2 rounded-sm transition-colors"
            >
              ← Back To Customer Site
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-[#08080c] border-b border-[#222230]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-sm bg-[#d4af37] text-black p-1 shadow-lg shadow-[#d4af37]/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-widest-plus font-display text-white flex items-center gap-1.5">
              DAR<span className="text-[#d4af37]">PEX</span>
            </div>
            <p className="text-[9px] tracking-super text-[#d4af37] uppercase font-semibold">
              Car Cleaning & Detailing
            </p>
          </div>
        </div>

        {/* Customer Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-zinc-300">
          <button 
            onClick={() => setCurrentView('home')} 
            className={`py-1 transition-colors hover:text-[#d4af37] ${currentView === 'home' ? 'text-[#d4af37] border-b-2 border-[#d4af37]' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => handleNavSectionClick('services')} 
            className="py-1 transition-colors hover:text-[#d4af37]"
          >
            Services
          </button>

          {user ? (
            <>
              <button 
                onClick={() => setCurrentView('garage')} 
                className={`py-1 transition-colors hover:text-[#d4af37] ${currentView === 'garage' ? 'text-[#d4af37] border-b-2 border-[#d4af37]' : ''}`}
              >
                My Garage
              </button>
              <button 
                onClick={() => setCurrentView('my-services')} 
                className={`py-1 transition-colors hover:text-[#d4af37] ${currentView === 'my-services' ? 'text-[#d4af37] border-b-2 border-[#d4af37]' : ''}`}
              >
                My Services
              </button>

              <div className="flex items-center gap-3 ml-2">
                <div className="flex items-center gap-2 bg-[#181822] border border-[#d4af37]/40 px-3 py-1.5 rounded-sm">
                  <User className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="text-xs font-bold text-white tracking-wider uppercase truncate max-w-[140px]">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="hover:text-red-400 text-zinc-400 transition-colors py-1 text-xs font-bold uppercase tracking-widest flex items-center gap-1"
                  title="Logout from account"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleNavSectionClick('gallery')} 
                className="py-1 transition-colors hover:text-[#d4af37]"
              >
                Gallery
              </button>
              <button 
                onClick={() => handleNavSectionClick('contact')} 
                className="py-1 transition-colors hover:text-[#d4af37]"
              >
                Contact
              </button>
              <button 
                onClick={onOpenLogin} 
                className="hover:text-[#d4af37] text-amber-400 transition-colors py-1 font-bold flex items-center gap-1.5 ml-2"
              >
                <User className="w-3.5 h-3.5" />
                Login
              </button>
            </>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="px-6 py-2.5 bg-[#d4af37] text-black text-xs font-extrabold uppercase tracking-widest hover:bg-[#e5c158] transition-all flex items-center gap-2 shadow-lg rounded-sm"
          >
            <Calendar className="w-4 h-4 text-black" />
            Book Car Service
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onOpenBooking}
            className="bg-[#d4af37] text-black px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider"
          >
            Book Service
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#121218] border-b border-[#262636] px-4 py-6 space-y-4 text-white">
          <nav className="flex flex-col gap-3 font-bold uppercase text-xs tracking-wider">
            <button 
              onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
              className="text-left py-2 hover:text-[#d4af37] border-b border-[#262636]"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavSectionClick('services')}
              className="text-left py-2 hover:text-[#d4af37] border-b border-[#262636]"
            >
              Services
            </button>

            {user ? (
              <>
                <button 
                  onClick={() => { setCurrentView('garage'); setMobileMenuOpen(false); }}
                  className="text-left py-2 hover:text-[#d4af37] border-b border-[#262636]"
                >
                  My Garage
                </button>
                <button 
                  onClick={() => { setCurrentView('my-services'); setMobileMenuOpen(false); }}
                  className="text-left py-2 hover:text-[#d4af37] border-b border-[#262636]"
                >
                  My Services
                </button>
                <div className="py-2 border-b border-[#262636] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-white font-bold text-xs uppercase">{user.name}</span>
                  </div>
                  <button
                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                    className="text-red-400 hover:text-red-300 text-xs font-bold uppercase flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleNavSectionClick('gallery')}
                  className="text-left py-2 hover:text-[#d4af37] border-b border-[#262636]"
                >
                  Gallery
                </button>
                <button 
                  onClick={() => handleNavSectionClick('contact')}
                  className="text-left py-2 hover:text-[#d4af37] border-b border-[#262636]"
                >
                  Contact
                </button>
                <button 
                  onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                  className="text-left py-2 text-[#d4af37] flex items-center gap-2 border-b border-[#262636]"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
              </>
            )}
          </nav>

          <div className="pt-2">
            <button
              onClick={() => { onOpenBooking(); setMobileMenuOpen(false); }}
              className="w-full bg-[#d4af37] text-black py-3 rounded-sm font-extrabold text-center uppercase tracking-wider text-xs shadow-lg"
            >
              Book Car Service
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
