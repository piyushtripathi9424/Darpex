import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, ShieldCheck, Clock, Award, CheckCircle2, Loader2, Car, AlertCircle } from 'lucide-react';
import { LUXURY_CAR_BRANDS, BODY_TYPES } from '../data/mockData';
import { AIRecommendation } from '../types';

interface AiDetailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecommendedPackage: (pkgName: string) => void;
}

export const AiDetailerModal: React.FC<AiDetailerModalProps> = ({
  isOpen,
  onClose,
  onSelectRecommendedPackage
}) => {
  const [brand, setBrand] = useState('BMW');
  const [model, setModel] = useState('3 Series');
  const [color, setColor] = useState('Mineral Grey');
  const [bodyType, setBodyType] = useState('Sedan');
  const [condition, setCondition] = useState('Light Swirls & Dust');
  const [parking, setParking] = useState('Shaded Driveway');
  const [goals, setGoals] = useState('Deep Gloss & Surface Protection');

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);

  if (!isOpen) return null;

  const handleGenerateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setRecommendation({
        vehicleOverview: `${brand} ${model} (${color})`,
        primaryPackage: 'Ceramic Coating 10H & Interior Steam Treatment',
        estimatedCost: 4999,
        estimatedDuration: '1.5 Days',
        recommendedAddons: ['High-Pressure Engine Bay Dressing', 'Windshield Hydrophobic Coat'],
        reasoning: `Based on your vehicle being parked in a ${parking} and having ${condition}, applying a 10H Nano-Ceramic matrix will seal the clear coat against oxidation while restoring 98% optical clarity.`,
        suggestedMaintenanceSchedule: 'Quarterly Hydrophobic Wash & Biannual Inspection'
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="border-glass bg-glass rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative border-amber-500/40 shadow-2xl my-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white p-2 border-glass bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-widest border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" /> AI Master Detailer Advisor
          </div>
          <h3 className="text-2xl font-light text-white font-display uppercase tracking-wider">
            Personalized <span className="font-bold text-white">Car Care Recommendation</span>
          </h3>
          <p className="text-xs text-white/50 uppercase tracking-widest">
            Enter your vehicle details for an instant service recommendation
          </p>
        </div>

        {!recommendation ? (
          <form onSubmit={handleGenerateAssessment} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-white uppercase tracking-widest mb-1">Car Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-black/80 border-glass p-3 text-white focus:outline-none"
                >
                  {LUXURY_CAR_BRANDS.map(b => (
                    <option key={b} value={b} className="bg-black text-white">{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white uppercase tracking-widest mb-1">Model Name</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. 3 Series, City, C-Class"
                  className="w-full bg-black/80 border-glass p-3 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-white uppercase tracking-widest mb-1">Vehicle Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Mineral Grey"
                  className="w-full bg-black/80 border-glass p-3 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white uppercase tracking-widest mb-1">Body Architecture</label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  className="w-full bg-black/80 border-glass p-3 text-white focus:outline-none"
                >
                  {BODY_TYPES.map(bt => (
                    <option key={bt} value={bt} className="bg-black text-white">{bt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-white uppercase tracking-widest mb-1">Primary Parking Environment</label>
              <select
                value={parking}
                onChange={(e) => setParking(e.target.value)}
                className="w-full bg-black/80 border-glass p-3 text-white focus:outline-none"
              >
                <option value="Garage (Indoor)" className="bg-black text-white">Garage (Indoor)</option>
                <option value="Shaded Driveway" className="bg-black text-white">Shaded Driveway</option>
                <option value="Open Sun Parking" className="bg-black text-white">Open Sun Parking</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white hover:bg-white/90 text-black py-3.5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Paint & Material Parameters...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Generate AI Recommendation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="border-glass bg-glass p-6 rounded-sm border-amber-500/40 space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest font-display">
                  RECOMMENDED TREATMENT
                </span>
                <span className="text-xl font-bold gold-accent font-display">
                  ₹{recommendation.estimatedCost}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white uppercase tracking-wider font-display">
                  {recommendation.primaryPackage}
                </h4>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  {recommendation.reasoning}
                </p>
              </div>

              <div className="text-xs space-y-2 pt-2 border-t border-white/5">
                <div className="text-white/80">
                  <strong className="text-white uppercase tracking-wider text-[10px]">Estimated Duration:</strong> {recommendation.estimatedDuration}
                </div>
                <div className="text-white/80">
                  <strong className="text-white uppercase tracking-wider text-[10px]">Suggested Schedule:</strong> {recommendation.suggestedMaintenanceSchedule}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setRecommendation(null)}
                className="flex-1 border-glass bg-white/5 hover:bg-white/10 text-white py-3 text-[10px] font-bold uppercase tracking-widest"
              >
                Recalculate
              </button>
              <button
                onClick={() => {
                  onSelectRecommendedPackage(recommendation.primaryPackage);
                }}
                className="flex-1 bg-white hover:bg-white/90 text-black py-3 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-lg"
              >
                Book This Package
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
