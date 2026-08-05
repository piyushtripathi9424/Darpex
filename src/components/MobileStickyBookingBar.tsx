import React from 'react';
import { Calendar } from 'lucide-react';

interface MobileStickyBookingBarProps {
  onOpenBooking: () => void;
}

export const MobileStickyBookingBar: React.FC<MobileStickyBookingBarProps> = ({
  onOpenBooking
}) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-md border-t border-[#262636] p-3 flex items-center shadow-2xl">
      <button
        onClick={onOpenBooking}
        className="w-full bg-[#d4af37] hover:bg-[#e5c158] text-black py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-lg rounded-sm"
      >
        <Calendar className="w-4 h-4" />
        <span>Reserve Service Slot</span>
      </button>
    </div>
  );
};
