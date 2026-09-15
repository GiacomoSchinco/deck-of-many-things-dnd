// components/character/creation-wizard/index.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCharacterCreation } from './hooks/useCharacterCreation';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { RaceStep } from './steps/RaceStep';
import { ClassStep } from './steps/ClassStep';
import { AbilityScoresStep } from './steps/AbilityScoresStep';
import { ReviewStep } from './steps/ReviewStep';
import { CampaignStep } from './steps/CampaignStep';
import { EquipmentStep } from './steps/EquipmentStep';
import { SkillsStep } from './steps/SkillsStep';
import { SpellsStep } from './steps/SpellsStep';
import Loading from '@/components/custom/Loading';
import { WizardStepper } from '@/components/shared/WizardStepper';
import type { Race } from '@/types/race';
import type { CreationStep } from '@/types/creation';
import { PageWrapper } from '@/components/layout/PageWrapper';

/** Etichette leggibili per lo stepper, nell'ordine del flusso. */
const STEP_LABELS: Record<CreationStep, string> = {
  'basic-info': 'Dati',
  race: 'Razza',
  class: 'Classe',
  campaign: 'Campagna',
  abilities: 'Caratteristiche',
  skills: 'Competenze',
  equipment: 'Equipaggiamento',
  spells: 'Incantesimi',
  review: 'Riepilogo',
};

export function CreationWizard() {
  const {
    currentStep,
    steps,
    stepIndex,
    data,
    loading,
    updateData,
    nextStep,
    prevStep,
    saveCharacter,
    isHydrated,
  } = useCharacterCreation();

  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  // Carica i dettagli della razza quando cambia raceId
  useEffect(() => {
    async function loadRaceDetails() {
      if (data.raceId) {
        try {
          const response = await fetch(`/api/races/${data.raceId}`);
          const raceData = await response.json();
          setSelectedRace(raceData);
        } catch (error) {
          console.error('Errore caricamento razza:', error);
        }
      }
    }
    loadRaceDetails();
  }, [data.raceId]);

  const renderStep = () => {
    switch (currentStep) {
      case 'basic-info':
        return (
          <BasicInfoStep
            initialData={data}
            onNext={(newData) => {
              updateData(newData);
              nextStep();
            }}
          />
        );

      case 'race':
        return (
          <RaceStep
            initialRaceId={data.raceId}
            onBack={prevStep}
            onSelect={(raceId) => {
              updateData({ raceId });
              nextStep();
            }}
          />
        );

      case 'class':
        return (
          <ClassStep
            initialClassId={data.classId}
            onBack={prevStep}
            onSelect={(classId) => {
              updateData({ classId });
              nextStep();
            }}
          />
        );

      // 🔥 NUOVO STEP CAMPAGNA
      case 'campaign':
        return (
          <CampaignStep
            initialCampaignId={data.campaignId}
            onBack={prevStep}
            onSelect={(campaignId) => {
              updateData({ campaignId });
              nextStep();
            }}
          />
        );

      case 'abilities':
        return (
          <AbilityScoresStep
            initialScores={data.abilityScores}
            raceBonuses={selectedRace?.ability_bonuses || {}}
            raceName={selectedRace?.name}
            onBack={prevStep}
            onConfirm={(abilityScores) => {
              updateData({ abilityScores });
              nextStep();
            }}
          />
        );
      case 'skills':
        return (
          <SkillsStep
            classId={data.classId!}
            abilityScores={data.abilityScores!}
            onBack={prevStep}
            initialSelectedSkills={data.skills || []}
            onChange={(selectedSkills) => updateData({ skills: selectedSkills })}
            onConfirm={(selectedSkills) => {
              updateData({ skills: selectedSkills });
              nextStep();
            }}
          />
        );

      case 'equipment':
        return (
          <EquipmentStep
            classId={data.classId!}
            onBack={prevStep}
            initialSelectedItems={data.equipment || []}
            onChange={(selectedItems) => updateData({ equipment: selectedItems })}
            onConfirm={(selectedItems) => {
              updateData({ equipment: selectedItems });
              nextStep();
            }}
          />
        );

      case 'spells':
        return (
          <SpellsStep
            classId={data.classId!}
            intelligenceScore={data.abilityScores?.intelligence ?? 10}
            initialSelectedSpells={data.spells || []}
            onBack={prevStep}
            onChange={(spellIds) => updateData({ spells: spellIds })}
            onConfirm={(spellIds) => {
              updateData({ spells: spellIds });
              nextStep();
            }}
          />
        );
      case 'review':
        return (
          <ReviewStep
            data={data}
            onBack={prevStep}
            onSave={saveCharacter}
            loading={loading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <PageWrapper
      withContainer={false}
      variant='minimal'
      title="Creazione Personaggio"
      subtitle="Segui i passi per dare vita al tuo eroe"
      centerHeader
    >
      <div className="mx-auto max-w-3xl space-y-8">
        {!isHydrated ? (
          <Loading />
        ) : (
          <>
            {/* Avanzamento: step attivi e posizione corrente dal hook */}
            <WizardStepper
              steps={steps.map((step) => STEP_LABELS[step] ?? step)}
              current={stepIndex}
            />

            {/* Contenuto dello step */}
            <div>{renderStep()}</div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}