import React, { useState } from 'react';
import { ServiceItem, ServiceCategory } from '../types';
import { ShieldCheck, Clock, Award, CheckCircle2, Sparkles, ArrowRight, X, ChevronRight } from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  onOpenBooking: (serviceId?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onOpenBooking }) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);

  const categories: { id: ServiceCategory; label: string }[] = [
    { id: 'all', label: 'All Studio Services' },
    { id: 'coating', label: 'Ceramic Coating' },
    { id: 'ppf', label: 'PPF Paint Armor' },
    { id: 'detailing', label: 'Exterior Polishing' },
    { id: 'interior', label: 'Interior Restoration' },
    { id: 'modification', label: 'Car Modification' },
    { id: 'maintenance', label: 'Maintenance Packages' }
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <section id="services" className="py-20 bg-[#08080a] relative border-b border-[#222230]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121218] border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold uppercase tracking-widest rounded-sm">
            <Sparkles className="w-3.5 h-3.5" /> Comprehensive Service Suite
          </div>
          <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-white font-display">
            Bespoke Services & <span className="font-bold gold-gradient-text">Packages</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed uppercase tracking-wider">
            Explore our detailed procedures, warranties, and rates. Every treatment is performed in climate-controlled clean room bays.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 rounded-sm border ${activeCategory === cat.id
                  ? 'bg-[#d4af37] text-black border-[#d4af37] font-extrabold shadow-md'
                  : 'bg-[#121218] text-zinc-300 border-[#262636] hover:bg-[#181822]'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-[#121218] border border-[#262636] rounded-sm overflow-hidden hover:border-[#d4af37]/50 transition-all duration-300 flex flex-col group hover:-translate-y-1 shadow-2xl"
            >
              {/* Service Image Header */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-transparent" />

                {service.popular && (
                  <span className="absolute top-3 right-3 bg-[#d4af37] text-black px-2.5 py-1 text-[9px] font-black uppercase tracking-widest shadow-lg rounded-sm">
                    Most Requested
                  </span>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 text-[10px] uppercase tracking-wider">
                  <span className="bg-[#08080a] text-[#d4af37] px-2.5 py-1 border border-[#d4af37]/40 font-semibold flex items-start gap-1.5 rounded-sm max-w-full">
                    <Clock className="w-3 h-3 shrink-0 mt-0.5" />
                    <span className="break-words text-left">{service.duration}</span>
                  </span>
                  <span className="bg-[#08080a] text-zinc-200 px-2.5 py-1 border border-[#262636] font-medium flex items-start gap-1.5 rounded-sm max-w-full text-left">
                    <ShieldCheck className="w-3 h-3 text-[#d4af37] shrink-0 mt-0.5" />
                    <span className="break-words text-left">{service.warranty}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-display group-hover:text-[#d4af37] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Core Features List */}
                <div className="space-y-2 pt-2 border-t border-[#262636] text-xs text-zinc-300 font-medium">
                  {service.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-4 border-t border-[#262636] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[9px] text-zinc-400 uppercase tracking-widest font-semibold">Starting From</div>
                    <div className="text-xl font-bold text-[#d4af37] font-display">
                      ₹{service.startingPrice}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedServiceModal(service)}
                      className="bg-[#181822] hover:bg-[#20202c] border border-[#2a2a3a] text-zinc-200 px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-sm"
                      title="View Process Steps"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => onOpenBooking(service.id)}
                      className="bg-[#d4af37] hover:bg-[#e5c158] text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-all rounded-sm shadow-md"
                    >
                      Book <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Detail Process Modal */}
      {selectedServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
          <div className="bg-[#121218] border border-[#d4af37]/40 rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative shadow-2xl text-white">

            <button
              onClick={() => setSelectedServiceModal(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 bg-[#181822] border border-[#2a2a3a] rounded-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-sm bg-[#181822] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-display uppercase tracking-wider">{selectedServiceModal.name}</h3>
                <p className="text-xs text-[#d4af37] font-medium uppercase tracking-widest">{selectedServiceModal.duration} • {selectedServiceModal.warranty}</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {selectedServiceModal.fullDescription}
            </p>

            {/* Step-by-Step Procedure */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display border-b border-[#262636] pb-2">
                Step-By-Step Studio Process
              </h4>

              <div className="space-y-3">
                {selectedServiceModal.processSteps.map((step) => (
                  <div key={step.step} className="bg-[#181822] p-3.5 rounded-sm border border-[#2a2a3a] flex gap-3">
                    <div className="w-7 h-7 rounded-sm bg-[#d4af37] text-black font-black text-xs flex items-center justify-center flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#d4af37] uppercase">{step.title}</h5>
                      <p className="text-xs text-zinc-300 leading-relaxed mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="pt-4 border-t border-[#262636] flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 uppercase tracking-widest">Starting Price:</span>
                <span className="text-2xl font-extrabold text-[#d4af37] ml-2 font-display">₹{selectedServiceModal.startingPrice}</span>
              </div>

              <button
                onClick={() => {
                  const id = selectedServiceModal.id;
                  setSelectedServiceModal(null);
                  onOpenBooking(id);
                }}
                className="bg-[#d4af37] hover:bg-[#e5c158] text-black px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg"
              >
                Book This Service Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
