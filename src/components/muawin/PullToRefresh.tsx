'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A wrapper component that implements a mobile-friendly "Pull-to-Refresh" gesture.
 * When the user drags down from the top of the scroll, a refresh indicator appears
 * and triggers a page reload (simulating a data refresh).
 */
export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const startY = useRef(0);
  const threshold = 80; // Distance in px to trigger refresh

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only track if we are at the very top of the window
      if (window.scrollY <= 0) {
        startY.current = e.touches[0].pageY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;

      const currentY = e.touches[0].pageY;
      const distance = currentY - startY.current;

      if (distance > 0) {
        // We are pulling down at the top
        if (window.scrollY <= 0) {
          // Prevent the default browser scroll/pull behavior
          if (e.cancelable) e.preventDefault();
          
          // Apply a dampening effect (logarithmic feel)
          const dampedDistance = Math.pow(distance, 0.85);
          setPullDistance(Math.min(dampedDistance, threshold + 40));
        }
      } else {
        // User swiped back up
        setPullDistance(0);
        setIsPulling(false);
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling) return;

      if (pullDistance >= threshold) {
        triggerRefresh();
      } else {
        setPullDistance(0);
      }
      setIsPulling(false);
    };

    const triggerRefresh = () => {
      setIsRefreshing(true);
      setPullDistance(threshold);
      
      // Simulate a refresh action. 
      // For a prototype, a full reload is the cleanest way to "refresh the screen".
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    };

    // Passive: false is required to allow preventDefault()
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, isRefreshing, pullDistance]);

  return (
    <div 
      className="will-change-transform min-h-screen"
      style={{ 
        transform: `translateY(${pullDistance}px)`,
        transition: isPulling ? 'none' : 'transform 0.4s cubic-bezier(0.19, 1, 0.22, 1)'
      }}
    >
      {/* Visual Indicator */}
      <div 
        className={cn(
          "fixed left-0 right-0 z-[100] flex justify-center pointer-events-none transition-opacity duration-200",
          pullDistance > 10 ? "opacity-100" : "opacity-0"
        )}
        style={{ 
          top: `${Math.min(pullDistance / 2.5, 40)}px`,
        }}
      >
        <div className="bg-white rounded-full p-2.5 shadow-2xl border border-primary/10 flex items-center justify-center ring-4 ring-black/[0.02]">
          {isRefreshing ? (
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          ) : (
            <div 
              className="transition-transform duration-75"
              style={{ 
                transform: `rotate(${Math.min(pullDistance * 3, 180)}deg) scale(${Math.min(0.5 + pullDistance / threshold, 1)})`,
                opacity: Math.min(pullDistance / threshold, 1)
              }}
            >
              <ArrowDown className="w-6 h-6 text-primary stroke-[3px]" />
            </div>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
