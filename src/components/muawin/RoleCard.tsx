'use client';

import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
}

/**
 * A premium role selection card used in auth flows.
 * Technical specs: p-8 padding, 20x20 squircle icon wrapper, transition-all interactions.
 */
export default function RoleCard({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  className 
}: RoleCardProps) {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "p-8 muawin-card cursor-pointer group hover:bg-primary/5 border-2 border-transparent hover:border-primary/30 transition-all text-center space-y-4 shadow-sm active:scale-95",
        className
      )}
    >
      <div className="w-20 h-20 bg-primary/15 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-primary/20 transition-all shadow-sm">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground px-4">{description}</p>
      </div>
    </Card>
  );
}
