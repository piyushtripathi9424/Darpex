import React from 'react';
import { Calendar, ArrowRight, ShieldCheck, Sparkles, Droplets, Sofa, Shield, Wrench, Star, Award } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { BrandMarquee } from './BrandMarquee';
import { AnimatedCounter } from './AnimatedCounter';
import { MagneticButton } from './MagneticButton';
import { StaggeredText } from './StaggeredText';

interface HeroProps {
  onOpenBooking: () => void;
  onNavigateToSection: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onNavigateToSection
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  return (
    <section className="relative w-full flex flex-col overflow-hidden bg-[#08080a] luxury-gradient pt-[80px] pb-12 border-b border-[#222230]">

      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div style={{ y }} className="w-full h-[120%] -top-[10%] relative">
          <motion.img
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85"
            alt="Darpex"
            className="w-full h-full object-cover object-center opacity-30 filter contrast-125"
            initial={{ scale: 1.0 }}
            animate={{ scale: 1.15 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-[#08080a]/60 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left pt-2 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121218] border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold uppercase tracking-widest font-display rounded-sm">
              <Sparkles className="w-3.5 h-3.5" /> Darpex Automotive Atelier
            </div>

            {/* Prompt Heading */}
            <h1 className="text-[13vw] sm:text-7xl xl:text-8xl font-light tracking-tight leading-[1.1] sm:leading-[0.92] text-white font-display">
              <StaggeredText text="Darpex" delay={0.2} />
              <div className="font-bold gold-gradient-text w-full">
                <StaggeredText text="For Your Car" delay={0.3} />
              </div>
            </h1>

            {/* Prompt Subtitle */}
            <div className="text-base sm:text-xl text-zinc-300 max-w-xl font-normal leading-relaxed">
              <StaggeredText text="Professional cleaning, detailing and modification services." delay={0.5} />
            </div>

            {/* Prompt CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <MagneticButton
                onClick={onOpenBooking}
                className="px-8 py-4 bg-[#d4af37] text-black text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 rounded-sm glow-hover-gold relative z-20"
              >
                <Calendar className="w-4 h-4 text-black" />
                <span>Book Your Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </MagneticButton>
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

          </motion.div>

          {/* Right side Floating Badges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:col-span-5 relative hidden lg:block h-full min-h-[400px]"
          >
            {/* Badge 1 */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-4 right-0 bg-[#121218]/80 backdrop-blur-md border border-[#262636] p-4 rounded-lg shadow-2xl flex items-center gap-4 z-20 w-64"
            >
              <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 flex items-center justify-center shrink-0 border border-[#d4af37]/30">
                <Star className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <div className="text-white font-bold text-lg font-display">
                  <AnimatedCounter value={4.9} suffix="/5" /> Rating
                </div>
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Based on <AnimatedCounter value={500} suffix="+" /> Reviews</div>
              </div>
            </motion.div>

            {/* Badge 2 */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute top-36 left-0 bg-[#121218]/80 backdrop-blur-md border border-[#262636] p-4 rounded-lg shadow-2xl flex items-center gap-4 z-10 w-64"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-white font-bold text-lg font-display">Certified</div>
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Master Technicians</div>
              </div>
            </motion.div>

            {/* Badge 3 */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute bottom-8 right-10 bg-[#121218]/80 backdrop-blur-md border border-[#262636] p-4 rounded-lg shadow-2xl flex items-center gap-4 z-30 w-64"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-white font-bold text-lg font-display">
                  <AnimatedCounter value={1000} suffix="+" />
                </div>
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Vehicles Detailed</div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Brand Marquee inside Hero at the bottom */}
      <div className="relative z-10 w-full mt-4">
        <BrandMarquee />
      </div>
    </section>
  );
};
