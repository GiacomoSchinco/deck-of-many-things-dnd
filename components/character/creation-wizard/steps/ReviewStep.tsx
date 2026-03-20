// components/character/creation-wizard/steps/ReviewStep.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreationData } from '../hooks/useCharacterCreation';
import { calculateModifier } from '@/lib/calculations/abilityModifiers';
import { useCharacterCalculations } from '@/hooks/useCharacterCalculations';
import { useCampaign } from '@/hooks/queries/useCampaigns';
import StatDiamond from '@/components/custom/StatDiamond';
import { RaceClassCard } from '@/components/custom/RaceClassCard';
import { FanCardGroup } from '@/components/custom/FanCardGroup';
import { Package, Sword, Shield, FlaskConical, Wrench } from 'lucide-react';
import AncientCardContainer from '@/components/custom/AncientCardContainer';

interface ReviewStepProps {
  data: Partial<CreationData>;
  onBack: () => void;
  onSave: () => void;
  loading: boolean;
}

// Mappa per i nomi delle caratteristiche
const ABILITY_NAMES: Record<string, string> = {
  strength: 'Forza',
  dexterity: 'Destrezza',
  constitution: 'Costituzione',
  intelligence: 'Intelligenza',
  wisdom: 'Saggezza',
  charisma: 'Carisma',
};

// Icona per tipo di oggetto
const getItemIcon = (type: string) => {
  switch (type) {
    case 'weapon': return <Sword className="w-4 h-4" />;
    case 'armor': return <Shield className="w-4 h-4" />;
    case 'consumable': return <FlaskConical className="w-4 h-4" />;
    case 'tool': return <Wrench className="w-4 h-4" />;
    default: return <Package className="w-4 h-4" />;
  }
};

export function ReviewStep({ data, onBack, onSave, loading }: ReviewStepProps) {
  const { calculations, isLoading: calcLoading, isReady } = useCharacterCalculations(
    data.raceId ?? null,
    data.classId ?? null,
    data.abilityScores ?? null,
  );
  const { data: campaign } = useCampaign(data.campaignId ?? null);

  const proficiencyBonus = 2; // Livello 1

  // Raggruppa l'equipaggiamento per tipo
  const equipmentByType = data.equipment?.reduce((acc, item) => {
    const type = item.type || 'gear';
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {} as Record<string, typeof data.equipment>);

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif text-amber-900 mb-2">
          📜 Riepilogo Personaggio
        </h2>
        <p className="text-amber-700 text-sm">
          Controlla i dati prima di creare il tuo eroe
        </p>
      </div>

      {/* Scheda di anteprima in stile carta */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Header con nome e allineamento */}
          <div className="text-center border-b-2 border-amber-700/30 pb-4">
            <h1 className="text-3xl font-serif font-bold text-amber-900">
              {data.name || 'Senza Nome'}
            </h1>
            <div className="flex justify-center gap-2 mt-2">
              <Badge className="bg-amber-200 text-amber-900">
                {data.alignment || 'Neutrale'}
              </Badge>
              <Badge className="bg-amber-200 text-amber-900">
                {data.background || 'Nessuno'}
              </Badge>
            </div>
          </div>

          {/* Info giocatore/campagna */}
          {(data.playerName || data.campaignId) && (
            <div className="text-sm text-amber-700 text-center">
              {data.playerName && <p>Giocato da: {data.playerName}</p>}
              {data.campaignId && <p>Campagna: {campaign?.name ?? '...'}</p>}
            </div>
          )}

          {/* Razza e Classe */}
          <FanCardGroup size="md" spread="normal" noWrapper>
            <RaceClassCard type='race' name={calculations?.raceData?.name ?? '...'} size='md' isSelected={false} />
            <RaceClassCard type='class' name={calculations?.classData?.name ?? '...'} size='md' isSelected={false} />
          </FanCardGroup>

          {/* Caratteristiche */}
          {data.abilityScores && (
            <div>
              <h3 className="font-serif font-semibold text-amber-900 mb-3 text-center">
                Caratteristiche
              </h3>

              {/* Desktop/Tablet: stat diamonds */}
              <div className="hidden md:grid md:grid-cols-3 gap-3">
                {Object.entries(data.abilityScores).map(([key, value]) => {
                  const bonus = (calculations?.raceData?.ability_bonuses?.[key] || 0);
                  const finalValue = value + bonus;
                  const modifier = calculateModifier(finalValue);
                  return (
                    <StatDiamond key={key} label={ABILITY_NAMES[key] ?? key} value={finalValue} modifier={modifier} statKey={key} />
                  );
                })}
              </div>

              {/* Mobile: compact list with value and modifier */}
              <div className="flex flex-col md:hidden gap-2">
                {Object.entries(data.abilityScores).map(([key, value]) => {
                  const bonus = (calculations?.raceData?.ability_bonuses?.[key] || 0);
                  const finalValue = value + bonus;
                  const modifier = calculateModifier(finalValue);
                  return (
                    <div key={key} className="flex items-center justify-between bg-amber-50 p-3 rounded">
                      <div>
                        <div className="text-sm font-semibold text-amber-800">{ABILITY_NAMES[key] ?? key}</div>
                        <div className="text-lg font-serif font-bold text-amber-900">
                          {finalValue} <span className="text-sm text-amber-600 ml-2">({modifier >= 0 ? `+${modifier}` : modifier})</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Statistiche di combattimento (calcolate) */}
          {isReady && calculations && (
            <FanCardGroup size="sm">
              <div className="flex flex-col items-center justify-center h-full p-1 text-center">
                <p className="text-xs text-amber-700">Punti ferita</p>
                <p className="text-xl font-bold text-amber-900">{calculations.combatStats.max_hp}</p>
                <p className="text-xs text-amber-600">{calculations.classData.hit_die} + mod COS</p>
              </div>

              <div className="flex flex-col items-center justify-center h-full p-1 text-center">
                <p className="text-xs text-amber-700">Classe Armatura</p>
                <p className="text-xl font-bold text-amber-900">{calculations.combatStats.armor_class}</p>
                <p className="text-xs text-amber-600">10 + mod DES</p>
              </div>

              <div className="flex flex-col items-center justify-center h-full p-1 text-center">
                <p className="text-xs text-amber-700">Velocità</p>
                <p className="text-xl font-bold text-amber-900">{calculations.combatStats.speed} ft</p>
                <p className="text-xs text-amber-600">{calculations.raceData.name}</p>
              </div>

              <div className="flex flex-col items-center justify-center h-full p-1 text-center">
                <p className="text-xs text-amber-700 whitespace-nowrap">Bonus Competenza</p>
                <p className="text-xl font-bold text-amber-900">+{calculations.proficiencyBonus}</p>
              </div>
            </FanCardGroup>
          )}

          {/* 🆕 EQUIPAGGIAMENTO SELEZIONATO */}
          {data.equipment && data.equipment.length > 0 && (
            <AncientCardContainer className="p-4">
              <h3 className="font-serif font-bold text-amber-900 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Equipaggiamento Iniziale
              </h3>
              
              <div className="space-y-3">
                {Object.entries(equipmentByType || {}).map(([type, items]) => (
                  <div key={type}>
                    <h4 className="text-sm font-semibold text-amber-800 mb-2 capitalize">
                      {type === 'weapon' && '⚔️ Armi'}
                      {type === 'armor' && '🛡️ Armature'}
                      {type === 'consumable' && '🧪 Consumabili'}
                      {type === 'tool' && '🔧 Attrezzi'}
                      {type === 'gear' && '🎒 Equipaggiamento'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-amber-50 rounded">
                          {getItemIcon(type)}
                          <span className="text-amber-900 flex-1">{item.name}</span>
                          {item.quantity > 1 && (
                            <span className="text-xs text-amber-600">x{item.quantity}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AncientCardContainer>
          )}

          {/* Se non c'è equipaggiamento selezionato */}
          {(!data.equipment || data.equipment.length === 0) && (
            <AncientCardContainer className="p-4 text-center">
              <Package className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-amber-600">Nessun equipaggiamento selezionato</p>
              <p className="text-xs text-amber-500 mt-1">Potrai aggiungerlo in seguito</p>
            </AncientCardContainer>
          )}
        </div>
      </div>

      {/* Note di riepilogo */}
      <div className="text-xs text-amber-600 text-center">
        <p>Verifica che tutti i dati siano corretti prima di procedere</p>
        <p>Potrai modificare il personaggio in seguito</p>
      </div>

      {/* Pulsanti */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="border-amber-700 text-amber-700"
        >
          ← Indietro
        </Button>

        <Button
          onClick={onSave}
          disabled={loading || calcLoading}
          className="bg-amber-700 hover:bg-amber-800 text-amber-50"
        >
          {loading ? 'Salvataggio...' : '✨ Crea Personaggio'}
        </Button>
      </div>
    </div>
  );
}