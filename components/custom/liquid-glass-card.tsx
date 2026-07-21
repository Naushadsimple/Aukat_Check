'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  borderBeam?: boolean;
  onClick?: () => void;
}

export function LiquidGlassCard({
  children,
  className,
  hoverEffect = true,
  borderBeam = false,
  onClick,
}: LiquidGlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverEffect ? { y: -3 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'relative group overflow-hidden rounded-3xl p-6 md:p-8',
        'bg-white/70 backdrop-blur-xl border border-white/90 shadow-sm',
        'hover:shadow-md hover:border-white transition-all duration-200 ease-out',
        onClick ? 'cursor-pointer' : '',
        className
      )}
    >
      {/* Light Glass Highlight */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/30 via-transparent to-black/[0.01] pointer-events-none" />

      {/* Border beam animated edge light */}
      {borderBeam && (
        <div className="absolute inset-0 rounded-3xl p-[1px] pointer-events-none overflow-hidden">
          <div className="absolute -inset-[100%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,#38BDF8,#818CF8,#38BDF8)] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
