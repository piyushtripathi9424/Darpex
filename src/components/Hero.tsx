import React from 'react';
import { Calendar, ArrowRight, ShieldCheck, Sparkles, Droplets, Sofa, Shield, Wrench } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onNavigateToSection: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onNavigateToSection
}) => {
  return (
    <section className="relative w-full min-h-[100svh] lg:min-h-[85vh] flex flex-col justify-center overflow-hidden bg-[#08080a] luxury-gradient pt-28 lg:pt-8 pb-16 border-b border-[#222230]">

      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85"
          alt="Darpex"
          className="w-full h-full object-cover object-center opacity-25 scale-105 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-[#08080a]/60 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Main Copy */}
          <div className="lg:col-span-7 space-y-6">

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121218] border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold uppercase tracking-widest font-display rounded-sm">
              <Sparkles className="w-3.5 h-3.5" /> Darpex Automotive Atelier
            </div>

            {/* Prompt Heading */}
            <h1 className="text-5xl sm:text-7xl xl:text-8xl font-light tracking-tight leading-[0.92] text-white font-display">
              Darpex <br />
              <span className="font-bold gold-gradient-text">For Your Car</span>
            </h1>

            {/* Prompt Subtitle */}
            <p className="text-base sm:text-xl text-zinc-300 max-w-xl font-normal leading-relaxed">
              Professional cleaning, detailing and modification services.
            </p>

            {/* Prompt CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="px-8 py-4 bg-[#d4af37] text-black text-xs font-black uppercase tracking-widest hover:bg-[#e5c158] transition-all flex items-center justify-center gap-3 shadow-2xl rounded-sm"
              >
                <Calendar className="w-4 h-4 text-black" />
                <span>Book Your Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Services Preview Bar */}
            <div className="pt-8 border-t border-[#262636] space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] font-display mb-4">
                Services Preview
              </div>
              <div className="overflow-hidden w-full relative group py-1" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                <div className="animate-infinite-scroll flex gap-3 text-xs font-medium text-zinc-300 pr-3">
                  {[...Array(2)].map((_, i) => (
                    <React.Fragment key={i}>
                      <button onClick={() => onNavigateToSection('services')} className="px-4 py-2 bg-[#121218] border border-[#2a2a3a] hover:border-[#d4af37] text-white text-[11px] font-semibold transition-all rounded-sm flex items-center gap-2 whitespace-nowrap">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" /> Car Wash
                      </button>
                      <button onClick={() => onNavigateToSection('services')} className="px-4 py-2 bg-[#121218] border border-[#2a2a3a] hover:border-[#d4af37] text-white text-[11px] font-semibold transition-all rounded-sm flex items-center gap-2 whitespace-nowrap">
                        <Sofa className="w-3.5 h-3.5 text-orange-400" /> Interior Cleaning
                      </button>
                      <button onClick={() => onNavigateToSection('services')} className="px-4 py-2 bg-[#121218] border border-[#2a2a3a] hover:border-[#d4af37] text-white text-[11px] font-semibold transition-all rounded-sm flex items-center gap-2 whitespace-nowrap">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" /> Ceramic Coating
                      </button>
                      <button onClick={() => onNavigateToSection('services')} className="px-4 py-2 bg-[#121218] border border-[#2a2a3a] hover:border-[#d4af37] text-white text-[11px] font-semibold transition-all rounded-sm flex items-center gap-2 whitespace-nowrap">
                        <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> Detailing
                      </button>
                      <button onClick={() => onNavigateToSection('services')} className="px-4 py-2 bg-[#121218] border border-[#2a2a3a] hover:border-[#d4af37] text-white text-[11px] font-semibold transition-all rounded-sm flex items-center gap-2 whitespace-nowrap">
                        <Wrench className="w-3.5 h-3.5 text-zinc-400" /> Modification
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-[#121218] border border-[#262636] p-6 rounded-sm shadow-2xl space-y-6">

              <div className="flex items-center justify-between pb-4 border-b border-[#262636]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#181822] border border-[#d4af37]/30 flex items-center justify-center rounded-sm">
                    <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xs uppercase tracking-widest font-display">Darpex Studio</h3>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Master Technicians</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative h-48 border border-[#262636] rounded-sm overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
                    alt="Darpex Detailing"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-semibold">
                    <span className="uppercase text-[10px] tracking-widest text-zinc-300">Clean Room Detailing Bays</span>
                    <span className="bg-[#d4af37] text-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">Instant Slot</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenBooking}
                className="w-full bg-[#181822] hover:bg-[#20202c] border border-[#2a2a3a] text-white py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all rounded-sm"
              >
                <span>Reserve Appointment Slot</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
