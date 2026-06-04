'use client';

import { cn } from '@/lib/utils';

interface MuawinIconProps {
  className?: string;
  showOuterRoof?: boolean;
}

/**
 * Global Muawin Branding Icon.
 * Implements the double-roof architecture: 
 * - Teal Outer Roof
 * - Golden Inner Roof
 * - Teal "W" House Walls
 */
export default function MuawinIcon({ className, showOuterRoof = true }: MuawinIconProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn("fill-none", className)} xmlns="http://www.w3.org/2000/svg">
      {/* Outer Roof Ridge (Larger Green/Teal) */}
      {showOuterRoof && (
        <path 
          d="M12 52L50 10L88 52" 
          stroke="currentColor" 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      )}
      {/* Inner Roof (Golden) */}
      <path 
        d="M24 50L50 22L76 50" 
        stroke="#FFB800" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Walls (Teal "W" structure) */}
      <path 
        d="M32 50V74C32 80.6274 37.3726 86 44 86H56C62.6274 86 68 80.6274 68 74V50" 
        stroke="currentColor" 
        strokeWidth="10" 
        strokeLinecap="round"
      />
      <path 
        d="M50 86V66" 
        stroke="currentColor" 
        strokeWidth="10" 
        strokeLinecap="round"
      />
    </svg>
  );
}
