// components/character/level-up/LevelUpFeaturesStep.tsx
'use client';

import { WizardNav } from '@/components/shared/WizardNav';
import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';
import { Shield, Swords, Wand2, Users, Zap, Star } from 'lucide-react';
import { Character } from '@/types';

interface LevelUpFeaturesStepProps {
  character: Character;
  currentLevel: number;
  newLevel: number;
  changes: {
    newFeatures: Array<{
      name: string;
      description: string;
      icon?: string;
      level: number;
    }>;
  };
  data?: unknown;
  onNext: (data: { featuresConfirmed: boolean }) => void;
  onBack: () => void;
  isLast: boolean;
}

// Mappa delle icone per tipo di feature (temporanea)
const featureIcons: Record<string, LucideIcon> = {
  combat: Swords,
  magic: Wand2,
  utility: Users,
  defense: Shield,
  special: Zap,
  default: Star,
};

export default function LevelUpFeaturesStep({
  newLevel,
  changes,
  onNext,
  onBack,
  isLast,
}: LevelUpFeaturesStepProps) {
  const features = changes.newFeatures || [];

  if (features.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="fantasy-icon-wrap">
            <Shield className="w-8 h-8 text-amber-700" />
          </div>
          <h2 className="text-xl fantasy-title">
            Nuove Abilità
          </h2>
          <p className="fantasy-subtitle mt-1">
            Al livello {newLevel} non ottieni nuove abilità di classe.
          </p>
        </div>

        <WizardNav
          onBack={onBack}
          onNext={() => onNext({ featuresConfirmed: true })}
          nextLabel={isLast ? 'Conferma ✓' : 'Avanti →'}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="fantasy-icon-wrap">
          <Zap className="w-8 h-8 text-amber-700" />
        </div>
        <h2 className="text-xl fantasy-title">
          Nuove Abilità
        </h2>
        <p className="fantasy-subtitle mt-1">
          Al livello {newLevel} ottieni le seguenti abilità
        </p>
      </div>

      <div className="space-y-3">
        {features.map((feature, idx) => {
          const Icon = featureIcons[feature.icon || 'default'] || Star;
          return (
            <div key={idx} className="fantasy-section overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-amber-200 bg-amber-100/30">
                <Icon className="w-5 h-5 text-amber-700" />
                <div>
                  <h3 className="fantasy-title">{feature.name}</h3>
                  <Badge className="bg-amber-200 text-amber-800 text-xs">Livello {feature.level}</Badge>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-amber-700 whitespace-pre-wrap">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <WizardNav
        onBack={onBack}
        onNext={() => onNext({ featuresConfirmed: true })}
        nextLabel={isLast ? 'Conferma ✓' : 'Avanti →'}
      />
    </div>
  );
}