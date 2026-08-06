import React, { useState, useRef, useEffect } from 'react';
import { BEFORE_AFTER_GALLERY } from '../data/mockData';
import { Sparkles, Sliders, ArrowLeftRight, CheckCircle2, Mouse } from 'lucide-react';
import { motion } from 'motion/react';

export const BeforeAfterGallery: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const isDragging = useRef<boolean>(false);

  const activeItem = BEFORE_AFTER_GALLERY[activeItemIndex];

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <section id="gallery" className="py-20 bg-[#050505] relative border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border-glass bg-glass text-amber-400 text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Proof of Precision
          </div>
          <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-white font-display">
            Transformation <span className="font-bold gold-gradient-text">Gallery</span>
          </h2>
          <p className="text-white/50 text-xs sm:text-sm leading-relaxed uppercase tracking-wider">
            Drag the vertical divider to inspect the before-and-after surface enhancements performed in our clean room bays.
          </p>
        </motion.div>

        {/* Gallery Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {BEFORE_AFTER_GALLERY.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveItemIndex(idx);
                setSliderPos(50);
              }}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all border-glass ${
                activeItemIndex === idx
                  ? 'bg-white text-black font-extrabold'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {item.category} • {item.vehicle.split(' ')[1]} {item.vehicle.split(' ')[2]}
            </button>
          ))}
        </div>

        {/* Interactive Split Comparison Card */}
        <div className="max-w-5xl mx-auto border-glass bg-glass rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-bold gold-accent uppercase tracking-widest">
                {activeItem.category} Case Study
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider font-display">{activeItem.title}</h3>
              <p className="text-xs text-white/50 mt-1">{activeItem.serviceProvided}</p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 rounded-sm text-[10px] font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>{activeItem.improvementStats}</span>
            </div>
          </div>

          {/* Interactive Image Split Container */}
          <div 
            className="relative h-[380px] sm:h-[480px] w-full rounded-sm overflow-hidden cursor-ew-resize select-none border-glass shadow-2xl"
            onMouseDown={() => (isDragging.current = true)}
            onMouseUp={() => (isDragging.current = false)}
            onMouseLeave={() => (isDragging.current = false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* After Image (Full background) */}
            <img 
              src={activeItem.afterImage} 
              alt="After Detail Finish" 
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute bottom-4 right-4 bg-emerald-500/90 text-black font-black text-[9px] px-3 py-1.5 shadow-lg uppercase tracking-widest backdrop-blur-md">
              AFTER: Restored Mirror Gloss
            </div>

            {/* Before Image (Clipped overlay) */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img 
                src={activeItem.beforeImage} 
                alt="Before Detail Condition" 
                draggable={false}
                className="absolute inset-y-0 left-0 max-w-none h-full object-cover pointer-events-none"
                style={{ width: '100%', minWidth: '800px' }}
              />
              <div className="absolute bottom-4 left-4 bg-red-500/90 text-white font-black text-[9px] px-3 py-1.5 shadow-lg uppercase tracking-widest backdrop-blur-md">
                BEFORE: Swirls & Oxidation
              </div>
            </div>

            {/* Split Divider Line & Handle */}
            <div 
              className="absolute inset-y-0 w-0.5 bg-amber-400 shadow-2xl pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-amber-400 border-2 border-black rounded-full shadow-[0_0_20px_rgba(251,191,36,0.5)] flex items-center justify-center text-black transition-transform hover:scale-110">
                <Mouse className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Explanation Footer */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/40 pt-2">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Drag slider left or right to compare optical clarity
            </span>
            <span className="font-semibold text-white/70">Vehicle: {activeItem.vehicle}</span>
          </div>

        </div>

      </div>
    </section>
  );
};
