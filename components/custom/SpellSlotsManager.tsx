// components/custom/SpellSlotsManager.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Minus, 
  Crown, 
  Star, 
  RefreshCw
} from 'lucide-react';

export interface SpellSlot {
  level: number;
  total: number;
  used: number;
  isPactSlot?: boolean;
}

interface SpellSlotsManagerProps {
  slots: SpellSlot[];
  onUpdate: (updatedSlots: SpellSlot[]) => void;
  className?: string;
  showRefresh?: boolean;
  onLongRest?: () => void;
  pactMagic?: {
    slots: number;
    level: number;
    mysticArcanum?: number[];
  };
}

const levelNames: Record<number, string> = {
  1: '1°', 2: '2°', 3: '3°', 4: '4°', 5: '5°', 6: '6°', 7: '7°', 8: '8°', 9: '9°'
};

const levelIcons: Record<number, React.ElementType> = {
  1: Star, 2: Star, 3: Star, 4: Star, 5: Star,
  6: Crown, 7: Crown, 8: Crown, 9: Crown
};

export default function SpellSlotsManager({ 
  slots, 
  onUpdate, 
  className,
  showRefresh = true,
  onLongRest,
}: SpellSlotsManagerProps) {
  
  const updateSlot = (level: number, delta: number) => {
    const updated = slots.map(slot => {
      if (slot.level === level) {
        const newUsed = Math.min(slot.total, Math.max(0, slot.used + delta));
        return { ...slot, used: newUsed };
      }
      return slot;
    });
    onUpdate(updated);
  };

  const resetAll = () => {
    const resetSlots = slots.map(slot => ({ ...slot, used: 0 }));
    onUpdate(resetSlots);
    if (onLongRest) onLongRest();
  };

  const normalSlots = slots.filter(s => !s.isPactSlot);

  if (normalSlots.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full mb-4", className)}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm fantasy-title">Slot Incantesimo</h3>
        {showRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAll}
            className="h-7 px-2 text-amber-600 hover:text-amber-800"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Riposo lungo
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {normalSlots.map(slot => {
          const Icon = levelIcons[slot.level] || Star;
          return (
            <div key={slot.level} className="fantasy-section flex items-center justify-between p-1.5">
              <div className="flex items-center gap-1">
                <Icon className="w-3 h-3 text-amber-600" />
                <span className="font-serif font-medium text-amber-800 text-xs">{levelNames[slot.level]}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-amber-600 hover:text-amber-800"
                  onClick={() => updateSlot(slot.level, -1)}
                  disabled={slot.used <= 0}
                >
                  <Minus className="w-2.5 h-2.5" />
                </Button>
                <span className="w-6 text-center text-xs font-mono text-amber-900">
                  {slot.used}/{slot.total}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-amber-600 hover:text-amber-800"
                  onClick={() => updateSlot(slot.level, 1)}
                  disabled={slot.used >= slot.total}
                >
                  <Plus className="w-2.5 h-2.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}