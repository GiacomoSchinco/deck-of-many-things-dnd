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
import Loading from '@/components/custom/Loading';
import type { Race } from '@/types/race';

export function CreationWizard() {
  const {
    currentStep,
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
    <div className="min-h-screen bg-gradient-to-br from-parchment-100 to-parchment-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif text-amber-900 mb-6 text-center">
          Creazione Personaggio
        </h1>

        {!isHydrated ? (
          <Loading />
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Progress bar */}
            <div className="h-2 bg-amber-200 rounded-full">
              <div
                className="h-full bg-amber-700 rounded-full transition-all"
                style={{
                  width: `${currentStep === 'basic-info' ? 12 :
                      currentStep === 'race' ? 25 :
                        currentStep === 'class' ? 37 :
                          currentStep === 'campaign' ? 50 :
                            currentStep === 'abilities' ? 62 :
                              currentStep === 'skills' ? 75 :
                                currentStep === 'equipment' ? 87 : 100
                    }%`
                }}
              />
            </div>

            {/* Step content */}
            <div className="bg-parchment-100 rounded-lg p-6 shadow-xl border-2 border-amber-900/30">
              {renderStep()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}