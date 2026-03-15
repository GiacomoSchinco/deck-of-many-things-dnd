// components/character/creation-wizard/steps/ReviewStep.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AncientCardContainer from '@/components/ui/custom/AncientCardContainer';
import { CreationData } from '../hooks/useCharacterCreation';
import { calculateModifier } from '@/lib/calculations/abilityModifiers';

interface ReviewStepProps {
  data: Partial<CreationData>;
  onBack: () => void;
  onSave: () => void;
  loading: boolean;
  error?: string | null;
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

export function ReviewStep({ data, onBack, onSave, loading, error }: ReviewStepProps) {
  const [raceName, setRaceName] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [loadingDetails, setLoadingDetails] = useState(true);

  // Carica i dettagli di razza e classe
  useEffect(() => {
    async function loadDetails() {
      setLoadingDetails(true);
      try {
        if (data.raceId) {
          const raceRes = await fetch(`/api/races/${data.raceId}`);
          const raceData = await raceRes.json();
          setRaceName(raceData.name);
        }
        
        if (data.classId) {
          const classRes = await fetch(`/api/classes/${data.classId}`);
          const classData = await classRes.json();
          setClassName(classData.name);
        }
      } catch (error) {
        console.error('Errore nel caricamento dettagli:', error);
      } finally {
        setLoadingDetails(false);
      }
    }

    loadDetails();
  }, [data.raceId, data.classId]);

  // Calcoli automatici
  const calculateHP = () => {
    // Per ora valore fisso, poi lo calcoleremo dalla classe
    return 10 + (data.abilityScores ? calculateModifier(data.abilityScores.constitution) : 0);
  };

  const calculateAC = () => {
    // CA base = 10 + mod DES
    return 10 + (data.abilityScores ? calculateModifier(data.abilityScores.dexterity) : 0);
  };

  const calculateInitiative = () => {
    return data.abilityScores ? calculateModifier(data.abilityScores.dexterity) : 0;
  };

  const proficiencyBonus = 2; // Livello 1

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif text-amber-900 mb-2">
          📜 Riepilogo Personaggio
        </h2>
        <p className="text-amber-700 text-sm">
          Controlla i dati prima di creare il tuo eroe
        </p>
      </div>
{error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {error}
  </div>
)}
      {/* Scheda di anteprima in stile carta */}
      <AncientCardContainer className="p-6">
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
          {(data.playerName || data.campaign) && (
            <div className="text-sm text-amber-700 text-center">
              {data.playerName && <p>Giocato da: {data.playerName}</p>}
              {data.campaign && <p>Campagna: {data.campaign}</p>}
            </div>
          )}

          {/* Razza e Classe */}
          <div className="grid grid-cols-2 gap-4">
            <AncientCardContainer className="p-4 text-center">
              <p className="text-xs text-amber-700 mb-1">Razza</p>
              <p className="text-lg font-serif font-bold text-amber-900">
                {loadingDetails ? '...' : raceName || `ID: ${data.raceId}`}
              </p>
            </AncientCardContainer>

            <AncientCardContainer className="p-4 text-center">
              <p className="text-xs text-amber-700 mb-1">Classe</p>
              <p className="text-lg font-serif font-bold text-amber-900">
                {loadingDetails ? '...' : className || `ID: ${data.classId}`}
              </p>
              <p className="text-xs text-amber-600">Livello 1</p>
            </AncientCardContainer>
          </div>

          {/* Caratteristiche */}
          {data.abilityScores && (
            <div>
              <h3 className="font-serif font-semibold text-amber-900 mb-3 text-center">
                Caratteristiche
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(data.abilityScores).map(([key, value]) => {
                  const modifier = calculateModifier(value);
                  return (
                    <div key={key} className="text-center p-2 bg-amber-100/50 rounded">
                      <div className="text-xs text-amber-700">{key.slice(0,3).toUpperCase()}</div>
                      <div className="text-xl font-bold text-amber-900">{value}</div>
                      <div className="text-xs text-amber-600">
                        ({modifier >= 0 ? '+' : ''}{modifier})
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Statistiche di combattimento (calcolate) */}
          {data.abilityScores && (
            <div className="grid grid-cols-3 gap-3">
              <AncientCardContainer className="p-3 text-center">
                <p className="text-xs text-amber-700">PF</p>
                <p className="text-xl font-bold text-amber-900">{calculateHP()}</p>
              </AncientCardContainer>

              <AncientCardContainer className="p-3 text-center">
                <p className="text-xs text-amber-700">CA</p>
                <p className="text-xl font-bold text-amber-900">{calculateAC()}</p>
              </AncientCardContainer>

              <AncientCardContainer className="p-3 text-center">
                <p className="text-xs text-amber-700">Iniziativa</p>
                <p className="text-xl font-bold text-amber-900">
                  {calculateInitiative() >= 0 ? '+' : ''}{calculateInitiative()}
                </p>
              </AncientCardContainer>
            </div>
          )}

          {/* Bonus competenza */}
          <div className="text-center text-sm text-amber-700">
            Bonus competenza: <span className="font-bold">+{proficiencyBonus}</span>
          </div>
        </div>
      </AncientCardContainer>

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
          disabled={loading || loadingDetails}
          className="bg-amber-700 hover:bg-amber-800 text-amber-50"
        >
          {loading ? 'Salvataggio...' : '✨ Crea Personaggio'}
        </Button>
      </div>
    </div>
  );
}