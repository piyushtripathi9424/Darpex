import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({ 
  children, 
  className = "",
  tiltAmount = 15 // Max rotation in degrees
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Motion values for x and y cursor position relative to center of card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Add spring physics for smooth return
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  // Transform coordinates into rotation
  const rotateX = useTransform(springY, [-1, 1], [tiltAmount, -tiltAmount]);
  const rotateY = useTransform(springX, [-1, 1], [-tiltAmount, tiltAmount]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Get mouse position relative to element center (-1 to 1)
    const mouseX = (e.clientX - rect.left) / width * 2 - 1;
    const mouseY = (e.clientY - rect.top) / height * 2 - 1;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    // Reset to center
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      {/* Container for parallax children effect if needed */}
      <div style={{ transform: "translateZ(30px)" }} className="w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};
