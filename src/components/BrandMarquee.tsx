import React from 'react';
import { motion } from 'motion/react';

const brands = [
  { name: 'Porsche', icon: 'porsche', color: 'd4af37' },
  { name: 'Ferrari', icon: 'ferrari', color: 'ff2800' },
  { name: 'Lamborghini', icon: 'lamborghini', color: 'd4af37' },
  { name: 'Rolls-Royce', icon: 'rollsroyce', color: 'ffffff' },
  { name: 'Bentley', icon: 'bentley', color: 'ffffff' },
  { name: 'Aston Martin', icon: 'astonmartin', color: '006633' },
  { name: 'McLaren', icon: 'mclaren', color: 'ff8000' },
  { name: 'Maserati', icon: 'maserati', color: 'ffffff' },
  { name: 'BMW', icon: 'bmw', color: '0066b1' },
  { name: 'Audi', icon: 'audi', color: 'ffffff' }
];

export const BrandMarquee: React.FC = () => {
  return (
    <div className="bg-[#050505] border-y border-[#222230] py-6 overflow-hidden flex whitespace-nowrap">
      <motion.div
        className="flex gap-16 items-center"
        animate={{ x: [0, -1035] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20
        }}
      >
        {[...brands, ...brands, ...brands].map((brand, i) => (
          <div 
            key={i}
            className="flex items-center justify-center min-w-[120px]"
          >
            <img 
              src={`https://cdn.simpleicons.org/${brand.icon}/${brand.color}`}
              alt={`${brand.name} logo`}
              className="w-12 h-12 object-contain hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
