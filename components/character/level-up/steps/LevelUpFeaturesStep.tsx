// components/character/level-up/LevelUpFeaturesStep.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Swords, Wand2, Users, Zap, Star } from 'lucide-react';

interface LevelUpFeaturesStepProps {
  character: any;
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
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isLast: boolean;
}

// Mappa delle icone per tipo di feature (temporanea)
const featureIcons: Record<string, any> = {
  combat: Swords,
  magic: Wand2,
  utility: Users,
  defense: Shield,
  special: Zap,
  default: Star,
};

export default function LevelUpFeaturesStep({
  character,
  currentLevel,
  newLevel,
  changes,
  data,
  onNext,
  onBack,
  isLast,
}: LevelUpFeaturesStepProps) {
  const [confirmed, setConfirmed] = useState(false);

  const features = changes.newFeatures || [];

  if (features.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-amber-700" />
          </div>
          <h2 className="text-xl font-serif font-bold text-amber-900">
            Nuove Abilità
          </h2>
          <p className="text-amber-600 text-sm mt-1">
            Al livello {newLevel} non ottieni nuove abilità di classe.
          </p>
        </div>

        <div className="flex justify-between pt-4 border-t border-amber-200">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-amber-600 text-amber-700"
          >
            Indietro
          </Button>
          <Button
            type="button"
            onClick={() => onNext({ featuresConfirmed: true })}
            className="bg-amber-700 hover:bg-amber-800 text-white"
          >
            {isLast ? 'Conferma' : 'Avanti'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4">
          <Zap className="w-8 h-8 text-amber-700" />
        </div>
        <h2 className="text-xl font-serif font-bold text-amber-900">
          Nuove Abilità
        </h2>
        <p className="text-amber-600 text-sm mt-1">
          Al livello {newLevel} ottieni le seguenti abilità
        </p>
      </div>

      <div className="space-y-3">
        {features.map((feature, idx) => {
          const Icon = featureIcons[feature.icon || 'default'] || Star;
          return (
            <div key={idx} className="bg-amber-50/50 rounded-lg border border-amber-200 overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-amber-200 bg-amber-100/30">
                <Icon className="w-5 h-5 text-amber-700" />
                <div>
                  <h3 className="font-serif font-bold text-amber-900">{feature.name}</h3>
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

      <div className="flex justify-between pt-4 border-t border-amber-200">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-amber-600 text-amber-700"
        >
          Indietro
        </Button>
        <Button
          type="button"
          onClick={() => onNext({ featuresConfirmed: true })}
          className="bg-amber-700 hover:bg-amber-800 text-white"
        >
          {isLast ? 'Conferma' : 'Avanti'}
        </Button>
      </div>
    </div>
  );
}