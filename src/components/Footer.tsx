import React from 'react';
import { Sparkles, MapPin, Phone, Clock, ShieldCheck, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  onNavigateToSection: (sectionId: string) => void;
  setCurrentView: (view: 'home' | 'garage' | 'my-services' | 'admin-login' | 'admin-dashboard') => void;
  onOpenBooking: () => void;
  user: { name: string; emailOrPhone: string } | null;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentView,
  onOpenBooking,
  onOpenLogin,
  onNavigateToSection,
  user
}) => {
  const handleHomeClick = () => {
    setCurrentView('home');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const handleDashboardClick = (view: 'garage' | 'my-services') => {
    if (user) {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onOpenLogin();
    }
  };

  return (
    <footer className="bg-[#060608] text-zinc-400 border-t border-[#222230] pt-16 pb-24 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
        >

          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-[#d4af37] text-black p-1 shadow-lg shadow-[#d4af37]/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="text-lg font-bold tracking-widest-plus font-display text-white">
                  DAR<span className="text-[#d4af37]">PEX</span>
                </div>
                <p className="text-[9px] tracking-super text-[#d4af37] uppercase font-semibold">
                  Car Cleaning & Detailing Studio
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Professional car washing, interior deep cleaning, ceramic coating, paint protection film, polishing, modifications, and maintenance packages.
            </p>

            <div className="text-xs text-zinc-300 space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                <span>840 Luxury Studio Way, Auto District</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                <span>Service Hotline: +91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                <span>Mon - Sun: 8:00 AM - 8:00 PM (By Appointment)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-display">Car Services</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigateToSection('services')} className="hover:text-[#d4af37] transition-colors">Car Wash & Wax</button></li>
              <li><button onClick={() => onNavigateToSection('services')} className="hover:text-[#d4af37] transition-colors">Interior Deep Cleaning</button></li>
              <li><button onClick={() => onNavigateToSection('services')} className="hover:text-[#d4af37] transition-colors">10H Ceramic Coating</button></li>
              <li><button onClick={() => onNavigateToSection('services')} className="hover:text-[#d4af37] transition-colors">Paint Protection Film (PPF)</button></li>
              <li><button onClick={() => onNavigateToSection('services')} className="hover:text-[#d4af37] transition-colors">Car Polishing & Paint Correction</button></li>
              <li><button onClick={() => onNavigateToSection('services')} className="hover:text-[#d4af37] transition-colors">Car Modifications & Accessories</button></li>
            </ul>
          </div>

          {/* Col 3: Customer Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-display">Customer Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={handleHomeClick} className="hover:text-[#d4af37] transition-colors">Home Page</button></li>
              <li>
                <button
                  onClick={() => handleDashboardClick('garage')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  My Garage
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleDashboardClick('my-services')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  My Services
                </button>
              </li>
              <li><button onClick={onOpenBooking} className="hover:text-[#d4af37] transition-colors">Book Car Service</button></li>
            </ul>
          </div>

          {/* Col 4: Quality Guarantee */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-display">Our Promise</h4>
            <div className="bg-[#121218] border border-[#262636] p-4 rounded-sm space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-[#d4af37] font-bold uppercase text-[10px] tracking-wider">
                <ShieldCheck className="w-4 h-4" /> 100% Quality Assurance
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                All services include certified technician quality checks and digital service log verification.
              </p>
            </div>
          </div>

        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#222230] flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-zinc-400 gap-4">
          <div>
            &copy; 2026 DARPEX. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
