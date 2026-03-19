// app/test-store/page.tsx
'use client';

import { useCharacterStore } from '@/store/useCharacterStore';
import { Button } from '@/components/ui/button';
import { generateId } from '@/lib/utils';

export default function TestStorePage() {
  const { characters, addCharacter, setCurrentCharacter, currentCharacter, clearCharacters } = useCharacterStore();

  const createTestCharacter = () => {
    const newChar = {
      id: generateId(),
      name: `Eroe ${characters.length + 1}`,
      raceId: 1,
      classId: 1,
      level: 1,
      abilityScores: {
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 10,
        wisdom: 12,
        charisma: 8
      },
      createdAt: new Date().toISOString()
    };
    
    addCharacter(newChar);
    setCurrentCharacter(newChar);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Store Zustand</h1>
      
      <div className="flex gap-2">
        <Button onClick={createTestCharacter}>
          Crea Personaggio di Test
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            if (!confirm('Sei sicuro di voler cancellare tutti i personaggi?')) return;
            clearCharacters();
          }}
        >
          Cancella Tutti
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Personaggi ({characters.length})</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(characters, null, 2)}
        </pre>
      </div>

      {currentCharacter && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Personaggio Corrente</h2>
          <pre className="bg-green-100 p-4 rounded">
            {JSON.stringify(currentCharacter, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}