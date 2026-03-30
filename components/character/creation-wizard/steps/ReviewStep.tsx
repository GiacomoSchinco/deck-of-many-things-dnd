// components/character/creation-wizard/steps/ReviewStep.tsx
 'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CreationData } from '@/types/creation';
import { calculateModifier } from '@/lib/calculations/abilityModifiers';
import { useCharacterCalculations } from '@/hooks/useCharacterCalculations';
import { useCampaign } from '@/hooks/queries/useCampaigns';
import { useSkillList } from '@/hooks/queries/useSkills';
import StatDiamond from '@/components/custom/StatDiamond';
import { RaceClassCard } from '@/components/custom/RaceClassCard';
import { FanCardGroup } from '@/components/custom/FanCardGroup';
import { Package, Target } from 'lucide-react';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import { WizardStep } from '../WizardStep';

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

const ABILITY_SHORT: Record<string, string> = {
  strength: 'FOR',
  dexterity: 'DES',
  constitution: 'COS',
  intelligence: 'INT',
  wisdom: 'SAG',
  charisma: 'CAR',
};

export function ReviewStep({ data, onBack, onSave, loading }: ReviewStepProps) {
  const [rollHp, setRollHp] = useState(true);
  const [seed, setSeed] = useState(0);

  const { calculations, isLoading: calcLoading, isReady } = useCharacterCalculations(
    data.raceId ?? null,
    data.classId ?? null,
    data.abilityScores ?? null,
    data.level ?? 1,
    rollHp,
    seed,
  );
  const { data: campaign } = useCampaign(data.campaignId ?? null);
  const { data: allSkills } = useSkillList();

  // Trova i dettagli delle skill selezionate
  const selectedSkillsDetails = data.skills?.map(skillId => {
    const skill = allSkills?.find(s => String(s.id) === skillId);
    if (!skill) return null;
    
    const abilityScore = data.abilityScores?.[skill.ability as keyof typeof data.abilityScores] || 10;
    const abilityModifier = calculateModifier(abilityScore);
    const proficiencyBonus = 2; // Livello 1
    
    return {
      id: skill.id,
      name: skill.name_it,
      ability: skill.ability,
      abilityShort: ABILITY_SHORT[skill.ability] || skill.ability.slice(0,3).toUpperCase(),
      abilityModifier: abilityModifier,
      totalBonus: abilityModifier + proficiencyBonus,
    };
  }).filter((s): s is NonNullable<typeof s> => s !== null) ?? [];

  const equipmentList = data.equipment ?? [];

  return (
    <WizardStep
      title="📜 Riepilogo Personaggio"
      subtitle="Controlla i dati prima di creare il tuo eroe"
      onBack={onBack}
      onNext={onSave}
      nextDisabled={loading || calcLoading}
      nextLoading={loading}
      nextLabel={loading ? 'Salvataggio...' : '✨ Crea Personaggio'}
    >

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

              {/* Mobile: compact list */}
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

          {/* 🆕 COMPETENZE SELEZIONATE CON DETTAGLI */}
          {selectedSkillsDetails.length > 0 && (
            <AncientCardContainer className="p-4">
              <h3 className="font-serif font-bold text-amber-900 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Competenze di Classe
                <span className="text-sm font-normal text-amber-500 ml-2">
                  (Bonus competenza: +{calculations?.proficiencyBonus || 2})
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedSkillsDetails.map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-amber-50 rounded">
                    <div>
                      <span className="font-medium text-amber-900">{skill.name}</span>
                      <p className="text-xs text-amber-600">
                        {skill.abilityShort} ({skill.abilityModifier >= 0 ? `+${skill.abilityModifier}` : skill.abilityModifier})
                      </p>
                    </div>
                    <Badge className="bg-amber-200 text-amber-900">
                      +{skill.totalBonus}
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs text-amber-500 mt-3 text-center">
                Bonus totale = modificatore di {selectedSkillsDetails[0]?.abilityShort} + bonus competenza (+2)
              </p>
            </AncientCardContainer>
          )}

          {/* Statistiche di combattimento (calcolate) */}
          {isReady && calculations && (
            <>
              <div className="flex justify-center gap-2 mb-3">
                <Button variant={rollHp ? 'default' : 'ghost'} size="sm" onClick={() => setRollHp(true)}>Tira HP</Button>
                <Button variant={!rollHp ? 'default' : 'ghost'} size="sm" onClick={() => setRollHp(false)}>Usa media</Button>
                {rollHp && (
                  <Button variant="outline" size="sm" onClick={() => setSeed((s) => s + 1)}>Ritira</Button>
                )}
              </div>

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
            </>
          )}

          {/* Equipaggiamento */}
          {equipmentList.length > 0 && (
            <AncientCardContainer className="p-4">
              <h3 className="font-serif font-bold text-amber-900 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Equipaggiamento Iniziale
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {equipmentList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-amber-50 rounded">
                    <Package className="w-4 h-4 text-amber-700" />
                    <span className="text-amber-900 flex-1">{item.name ?? `Item #${item.item_id}`}</span>
                    {item.quantity > 1 && (
                      <span className="text-xs text-amber-600">x{item.quantity}</span>
                    )}
                  </div>
                ))}
              </div>
            </AncientCardContainer>
          )}

          {/* Se non c'è equipaggiamento */}
          {equipmentList.length === 0 && (
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
    </WizardStep>
  );
}