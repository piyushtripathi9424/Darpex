import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface PageLoaderProps {
  isLoading: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-sm bg-[#d4af37] text-black p-2 shadow-2xl shadow-[#d4af37]/40 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            
            <div className="text-3xl font-bold tracking-widest-plus font-display text-white mb-2 flex items-center gap-1.5">
              DAR<span className="text-[#d4af37]">PEX</span>
            </div>
            <p className="text-xs tracking-super text-[#d4af37] uppercase font-semibold">
              Initializing Studio
            </p>

            <div className="w-48 h-[1px] bg-[#222230] mt-8 relative overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-0 bg-[#d4af37] w-1/2"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
