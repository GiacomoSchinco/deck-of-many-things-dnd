"use client";
import { useParams } from 'next/navigation';
import { useSpells } from "@/hooks/queries/useSpells";
import Spellbook from '@/components/character/sheet/Spellbook';

export default function SpellPage() {
  const params = useParams();
  const characterId = params.characterId as string;
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header con titolo e pulsante nuovo personaggio */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-amber-900">
            Le Mie Campagne
          </h1>
          <p className="text-amber-700 mt-1">
            Gestisci tutte le tue campagne e avventure
          </p>
        </div>
      </div>
      <Spellbook characterId={characterId} />
    </div>
  );
}