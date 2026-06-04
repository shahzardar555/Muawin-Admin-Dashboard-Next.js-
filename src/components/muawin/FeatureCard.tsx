'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: 'primary' | 'secondary';
  className?: string;
}

/**
 * A reusable feature card used for highlighting key value propositions.
 * Replicates the "Verified Pros" and "Instant Matching" design.
 */
export default function FeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  variant = 'primary',
  className 
}: FeatureCardProps) {
  return (
    <div className={cn(
      "p-4 rounded-2xl flex items-center gap-4 text-left transition-all",
      variant === 'primary' ? "bg-primary/10" : "bg-secondary/30",
      className
    )}>
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground leading-snug">{description}</p>
      </div>
    </div>
  );
}
