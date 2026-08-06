import React, { useState } from 'react';
import { MEMBERSHIP_PLANS } from '../data/mockData';
import { ShieldCheck, CheckCircle2, Award, Sparkles, ArrowRight, Gift, Calendar, Calculator } from 'lucide-react';
import { motion } from 'motion/react';

interface MembershipSectionProps {
  onOpenBooking: () => void;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({ onOpenBooking }) => {
  const [annualBilling, setAnnualBilling] = useState(false);
  const [estimatedVisits, setEstimatedVisits] = useState(4);

  // Loyalty rewards points calculation
  const calculatedPoints = estimatedVisits * 250;
  const redeemableValue = (calculatedPoints / 100) * 10;

  return (
    <section id="memberships" className="py-20 bg-[#050505] relative border-t border-white/5">
      
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border-glass bg-glass text-amber-400 text-[10px] font-bold uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" /> Continuous Excellence
          </div>
          <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-white font-display">
            The Atelier <span className="font-bold gold-gradient-text">Membership Club</span>
          </h2>
          <p className="text-white/50 text-xs sm:text-sm leading-relaxed uppercase tracking-wider">
            Ensure your vehicle remains in showroom perfection with monthly spa washes, priority studio calendar slots, free enclosed transport, and exclusive ceramic booster maintenance.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center gap-3 border-glass bg-glass p-1.5 rounded-sm mt-4">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                !annualBilling ? 'bg-white text-black font-extrabold' : 'text-white/50 hover:text-white'
              }`}
            >
              Monthly Subscription
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                annualBilling ? 'bg-white text-black font-extrabold' : 'text-white/50 hover:text-white'
              }`}
            >
              Annual Billing <span className="bg-amber-400 text-black px-1.5 py-0.5 text-[8px] rounded-sm">-20%</span>
            </button>
          </div>
        </motion.div>

        {/* Membership Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {MEMBERSHIP_PLANS.map((plan) => {
            const displayPrice = annualBilling ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice;

            return (
              <div 
                key={plan.id}
                className={`border-glass bg-glass rounded-sm p-8 flex flex-col justify-between space-y-6 relative transition-all duration-300 ${
                  plan.popular 
                    ? 'border-amber-400/60 shadow-2xl gold-border-glow' 
                    : 'hover:border-white/30'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-black px-4 py-1 text-[9px] font-black uppercase tracking-widest shadow-lg">
                    Most Popular Membership
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest gold-accent border border-amber-500/30 px-3 py-1 bg-amber-500/10">
                      {plan.badge}
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>

                  <h3 className="text-xl font-bold text-white uppercase tracking-wider font-display">{plan.name}</h3>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold gold-accent font-display">${displayPrice}</span>
                    <span className="text-xs text-white/50 uppercase tracking-widest">/ month</span>
                    {annualBilling && <span className="text-[9px] text-amber-300 font-bold uppercase tracking-widest ml-2">Billed Annually</span>}
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-white/70 font-medium">
                    {plan.perks.map((perk, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onOpenBooking}
                  className={`w-full py-3.5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'bg-white hover:bg-white/90 text-black font-extrabold'
                      : 'border-glass bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  <span>Subscribe to {plan.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Loyalty Rewards Calculator & Service Reminder Feature */}
        <div className="border-glass bg-glass rounded-sm p-8 lg:p-10 border border-amber-500/30">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-widest border border-amber-500/30">
                <Gift className="w-3.5 h-3.5" /> Client Rewards Program
              </div>
              <h3 className="text-2xl sm:text-3xl font-light text-white font-display">
                Earn 250 Loyalty Points Every Visit. <span className="font-bold text-white">Redeem for Upgrades.</span>
              </h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Every detailing appointment automatically logs points to your digital customer garage profile. 
                Use points for complimentary wheel ceramic coating, starlight headliner discounts, or enclosed trailer delivery.
              </p>

              {/* Calculator Slider */}
              <div className="border-glass bg-white/5 p-4 rounded-sm space-y-3">
                <div className="flex items-center justify-between text-xs text-white/80 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-amber-400" />
                    Estimated Annual Atelier Visits:
                  </span>
                  <span className="gold-accent text-base font-bold font-display">{estimatedVisits} Visits / Year</span>
                </div>

                <input 
                  type="range" 
                  min="1" 
                  max="12" 
                  value={estimatedVisits}
                  onChange={(e) => setEstimatedVisits(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1 bg-white/20 rounded-none cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10 text-center">
                  <div>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">Total Points Earned</span>
                    <div className="text-xl font-bold gold-accent font-display">{calculatedPoints} PTS</div>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">Redeemable Credit Value</span>
                    <div className="text-xl font-bold text-amber-300 font-display">${redeemableValue} USD</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 border-glass bg-white/5 p-6 rounded-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <Calendar className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Automated Reminders</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Never miss a ceramic coating inspection</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-white/70">
                <div className="flex items-center justify-between bg-black/60 p-2.5 border-glass text-[10px] uppercase tracking-wider">
                  <span>6-Month Ceramic Inspection</span>
                  <span className="text-amber-300 font-bold">SMS & Email Sync</span>
                </div>
                <div className="flex items-center justify-between bg-black/60 p-2.5 border-glass text-[10px] uppercase tracking-wider">
                  <span>Leather Feed & Steam Schedule</span>
                  <span className="text-amber-300 font-bold">Quarterly Alert</span>
                </div>
                <div className="flex items-center justify-between bg-black/60 p-2.5 border-glass text-[10px] uppercase tracking-wider">
                  <span>Digital Service Log PDF</span>
                  <span className="text-emerald-400 font-bold">Auto-Saved to Garage</span>
                </div>
              </div>

              <button
                onClick={onOpenBooking}
                className="w-full bg-white hover:bg-white/90 text-black py-3 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-md"
              >
                Join Darpex Atelier Today
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
