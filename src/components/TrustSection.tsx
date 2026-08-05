import React from 'react';
import { ShieldCheck, Award, Users, Star, CheckCircle, Sparkles, Flame, ShieldAlert, Cpu } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../data/mockData';

export const TrustSection: React.FC = () => {
  return (
    <section id="trust" className="py-20 bg-[#050505] relative overflow-hidden border-t border-b border-white/5">
      
      {/* Background Accent Glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border-glass bg-glass text-amber-400 text-[10px] font-bold uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" /> Uncompromising Standards
          </div>
          <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-white font-display">
            Engineered for <span className="font-bold gold-gradient-text">Perfection</span>.
          </h2>
          <p className="text-white/50 text-xs sm:text-sm leading-relaxed uppercase tracking-wider">
            Treating every Porsche, Ferrari, Rolls-Royce, and exotic supercar as a pinnacle masterpiece. Dust-free positive-pressure clean rooms, deionized water filtration, and thermal infrared curing.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="border-glass bg-glass p-6 rounded-sm hover:border-white/20 transition-all group space-y-3">
            <div className="w-10 h-10 border-glass bg-white/5 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-white font-display">12+ Years</div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200">Excellence</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Over a decade specializing strictly in exotic, vintage, and high-performance automotive preservation.
            </p>
          </div>

          <div className="border-glass bg-glass p-6 rounded-sm hover:border-white/20 transition-all group space-y-3">
            <div className="w-10 h-10 border-glass bg-white/5 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-white font-display">4,500+</div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200">Preserved</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Trusted by private collectors, luxury dealerships, and automotive enthusiasts worldwide.
            </p>
          </div>

          <div className="border-glass bg-glass p-6 rounded-sm hover:border-white/20 transition-all group space-y-3">
            <div className="w-10 h-10 border-glass bg-white/5 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white font-display">4.98 / 5.0</div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200">Satisfaction</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Consistently rated #1 for paint correction and self-healing PPF wrap application.
            </p>
          </div>

          <div className="border-glass bg-glass p-6 rounded-sm hover:border-white/20 transition-all group space-y-3">
            <div className="w-10 h-10 border-glass bg-white/5 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-white font-display">10-Year</div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200">Warranty</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Guaranteed against yellowing, bubbling, coating peeling, and environmental stain degradation.
            </p>
          </div>

        </div>

        {/* Studio Clean Room Standards Showcase */}
        <div className="glass-panel-gold rounded-sm p-8 lg:p-10 border border-amber-500/30 space-y-8">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-widest border border-amber-500/30">
                <Cpu className="w-3.5 h-3.5" /> ISO Class 7 Positive Pressure Bay
              </div>
              <h3 className="text-2xl sm:text-3xl font-light text-white font-display leading-tight">
                Contamination-Free Environment for <span className="font-bold text-white">Flawless Ceramic Bonding</span>
              </h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Applying ceramic coatings and paint protection film in standard garages risks dust particles getting trapped beneath clear coats or film layers. Our atelier features climate-controlled, HEPA air-filtered bays with infrared shortwave curing lamps.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 text-xs font-medium text-white/80">
                <div className="flex items-center gap-2 border-glass bg-white/5 p-2.5 rounded-sm">
                  <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>HEPA Clean Air Filtration</span>
                </div>
                <div className="flex items-center gap-2 border-glass bg-white/5 p-2.5 rounded-sm">
                  <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Deionized Water Rinsing</span>
                </div>
                <div className="flex items-center gap-2 border-glass bg-white/5 p-2.5 rounded-sm">
                  <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Infrared Thermal Curing</span>
                </div>
                <div className="flex items-center gap-2 border-glass bg-white/5 p-2.5 rounded-sm">
                  <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Digital Paint Depth Logs</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-6">
              <div className="relative rounded-sm overflow-hidden border-glass group shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1000&q=80" 
                  alt="Studio Clean Room Bay" 
                  className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
                  <span className="bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/20 text-[10px]">
                    Atelier Bay #1 (Clean Room)
                  </span>
                  <span className="bg-amber-400 text-black px-3 py-1.5 text-[10px]">
                    Curing Temp: 65°C
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Brand Partner Logos */}
        <div className="space-y-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-super text-white/40">
            Certified Applicators & Authorized Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80 filter grayscale hover:grayscale-0 transition-all">
            <span className="text-base font-bold font-display text-white/60 hover:text-amber-400 cursor-default tracking-widest">XPEL ARMOR</span>
            <span className="text-base font-bold font-display text-white/60 hover:text-amber-400 cursor-default tracking-widest">GTECHNIQ ULTRA</span>
            <span className="text-base font-bold font-display text-white/60 hover:text-amber-400 cursor-default tracking-widest">CERAMIC PRO 9H</span>
            <span className="text-base font-bold font-display text-white/60 hover:text-amber-400 cursor-default tracking-widest">KOCH-CHEMIE</span>
            <span className="text-base font-bold font-display text-white/60 hover:text-amber-400 cursor-default tracking-widest">BREMBO POWER</span>
            <span className="text-base font-bold font-display text-white/60 hover:text-amber-400 cursor-default tracking-widest">AKRAPOVIČ EXHAUST</span>
          </div>
        </div>

        {/* Verified Customer Reviews */}
        <div className="space-y-8">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-white font-display tracking-wide uppercase">Client Testimonials</h3>
            <p className="text-xs text-white/40 uppercase tracking-widest">Read what supercar owners say about Darpex Atelier</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div key={rev.id} className="border-glass bg-glass p-6 rounded-sm space-y-4 hover:border-white/20 transition-all">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-white/70 italic leading-relaxed">
                  "{rev.comment}"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <img src={rev.avatar} alt={rev.name} className="w-9 h-9 rounded-full object-cover border border-amber-500/30" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{rev.name}</h4>
                    <p className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">{rev.verifiedVehicle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
