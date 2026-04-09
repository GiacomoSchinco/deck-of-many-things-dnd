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
import { getItalianAbilityFull } from '@/lib/utils/nameMappers';
import type { ProficiencyType } from '@/types/character';
import StatDiamond from '@/components/custom/StatDiamond';
import { RaceClassCard } from '@/components/custom/RaceClassCard';
import { FanCardGroup } from '@/components/custom/FanCardGroup';
import { Package } from 'lucide-react';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import { SkillsDisplay } from '@/components/custom/SkillsDisplay';
import { WizardStep } from '../WizardStep';

interface ReviewStepProps {
  data: Partial<CreationData>;
  onBack: () => void;
  onSave: () => void;
  loading: boolean;
}

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

  // Skill selezionate (solo quelle scelte nel wizard)
  const selectedSkillIds = new Set(data.skills ?? []);
  const selectedSkills = (allSkills ?? []).filter(s => selectedSkillIds.has(String(s.id)));
  const selectedSkillsMap = new Map<number, ProficiencyType>(
    selectedSkills.map(s => [s.id, 'proficient' as ProficiencyType])
  );

  // Punteggi finali con bonus razza
  const finalAbilityScores = data.abilityScores ? {
    strength:     (data.abilityScores.strength     ?? 10) + (calculations?.raceData?.ability_bonuses?.strength     || 0),
    dexterity:    (data.abilityScores.dexterity    ?? 10) + (calculations?.raceData?.ability_bonuses?.dexterity    || 0),
    constitution: (data.abilityScores.constitution ?? 10) + (calculations?.raceData?.ability_bonuses?.constitution || 0),
    intelligence: (data.abilityScores.intelligence ?? 10) + (calculations?.raceData?.ability_bonuses?.intelligence || 0),
    wisdom:       (data.abilityScores.wisdom       ?? 10) + (calculations?.raceData?.ability_bonuses?.wisdom       || 0),
    charisma:     (data.abilityScores.charisma     ?? 10) + (calculations?.raceData?.ability_bonuses?.charisma     || 0),
  } : null;

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
            <h1 className="text-3xl fantasy-title">
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
              <h3 className="fantasy-title mb-3 text-center">
                Caratteristiche
              </h3>

              {/* Desktop/Tablet: stat diamonds */}
              <div className="hidden md:grid md:grid-cols-3 gap-3">
                {Object.entries(data.abilityScores).map(([key, value]) => {
                  const bonus = (calculations?.raceData?.ability_bonuses?.[key] || 0);
                  const finalValue = value + bonus;
                  const modifier = calculateModifier(finalValue);
                  return (
                    <StatDiamond key={key} label={getItalianAbilityFull(key)} value={finalValue} modifier={modifier} statKey={key} />
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
                    <div key={key} className="fantasy-row">
                      <div>
                        <div className="text-sm font-semibold text-amber-800">{getItalianAbilityFull(key)}</div>
                        <div className="text-lg fantasy-title">
                          {finalValue} <span className="text-sm text-amber-600 ml-2">({modifier >= 0 ? `+${modifier}` : modifier})</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Competenze selezionate */}
          {selectedSkills.length > 0 && finalAbilityScores && (
            <SkillsDisplay
              gridCols={2}
              information={false}
              skills={selectedSkills}
              characterSkills={selectedSkillsMap}
              abilityScores={finalAbilityScores}
              proficiencyBonus={calculations?.proficiencyBonus ?? 2}
            />
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
              <h3 className="fantasy-title mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Equipaggiamento Iniziale
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {equipmentList.map((item, idx) => (
                  <div key={idx} className="fantasy-row">
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