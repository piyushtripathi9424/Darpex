import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Clock, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutAndContactSection: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  return (
    <div className="space-y-0">
      
      {/* ABOUT SECTION */}
      <section id="about" className="py-20 bg-[#050505] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-12 gap-12 items-center"
          >
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border-glass bg-glass text-amber-400 text-[10px] font-bold uppercase tracking-widest font-display">
                <Sparkles className="w-3.5 h-3.5" /> About Darpex
              </div>

              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white font-display leading-tight">
                Crafting Automotive <br />
                <span className="font-bold gold-gradient-text">Masterpieces Since 2014</span>
              </h2>

              <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                Darpex is an elite car cleaning, detailing, and modification center dedicated to bringing out the finest shine and protection for your vehicles. From high-pressure wash procedures to 10H nano-ceramic coats, our master detailers treat every car with absolute precision.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border-glass bg-white/5 p-4 rounded-sm">
                  <div className="text-2xl font-bold gold-accent font-display">10,000+</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Cars Serviced</div>
                </div>
                <div className="border-glass bg-white/5 p-4 rounded-sm">
                  <div className="text-2xl font-bold text-white font-display">100%</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Satisfaction Rate</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-sm overflow-hidden border-glass shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80" 
                  alt="Darpex Workshop" 
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs font-bold text-white uppercase tracking-wider">
                  <span className="bg-black/90 px-3 py-1 border border-white/10 text-[10px]">Pristine Clean Bay</span>
                  <span className="bg-amber-400 text-black px-3 py-1 text-[10px]">Certified Specialists</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-20 bg-black/60 border-t border-b border-white/5 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
        >
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border-glass bg-glass text-amber-400 text-[10px] font-bold uppercase tracking-widest font-display">
              <Phone className="w-3.5 h-3.5" /> Get In Touch
            </div>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white font-display">
              Contact <span className="font-bold gold-gradient-text">Darpex</span>
            </h2>
            <p className="text-xs text-white/50 uppercase tracking-widest">
              Visit our studio or call us for service inquiries & instant bookings
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-glass bg-glass p-6 rounded-sm space-y-3 text-center hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 border-glass bg-white/5 rounded-full mx-auto flex items-center justify-center text-amber-400">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">Studio Address</h3>
              <p className="text-xs text-white/60">
                100 Luxury Avenue, Automotive Hub<br />Bangalore, KA 560001
              </p>
            </div>

            <div className="border-glass bg-glass p-6 rounded-sm space-y-3 text-center hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 border-glass bg-white/5 rounded-full mx-auto flex items-center justify-center text-amber-400">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">Phone & WhatsApp</h3>
              <p className="text-xs text-white/60">
                +91 98765 43210<br />
                +91 80 2345 6789
              </p>
            </div>

            <div className="border-glass bg-glass p-6 rounded-sm space-y-3 text-center hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 border-glass bg-white/5 rounded-full mx-auto flex items-center justify-center text-amber-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">Studio Hours</h3>
              <p className="text-xs text-white/60">
                Monday - Saturday: 9:00 AM - 7:00 PM<br />
                Sunday: 10:00 AM - 4:00 PM
              </p>
            </div>
          </div>

        </motion.div>
      </section>

    </div>
  );
};
