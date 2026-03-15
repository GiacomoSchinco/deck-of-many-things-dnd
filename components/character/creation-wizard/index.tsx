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

interface Race {
  id: number;
  name: string;
  ability_bonuses: Record<string, number>;
  // ... altri campi
}

export function CreationWizard() {
  const {
    currentStep,
    data,
    loading,
    error,
    updateData,
    nextStep,
    prevStep,
    saveCharacter,
    isFirstStep,
    isLastStep,
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
          onConfirm={(abilityScores) => {
            updateData({ abilityScores });
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
          error={error}
        />
      );
    
    default:
      return null;
  }
};

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress bar */}
      <div className="h-2 bg-amber-200 rounded-full">
        <div
          className="h-full bg-amber-700 rounded-full transition-all"
          style={{
            width: `${
              currentStep === 'basic-info' ? 16 :
              currentStep === 'race' ? 32 :
              currentStep === 'class' ? 48 :
              currentStep === 'campaign' ? 64 :
              currentStep === 'abilities' ? 80 : 100
            }%`
          }}
        />
      </div>

      {/* Step content */}
      <div className="bg-parchment-100 rounded-lg p-6 shadow-xl border-2 border-amber-900/30">
        {renderStep()}
      </div>
    </div>
  );
}