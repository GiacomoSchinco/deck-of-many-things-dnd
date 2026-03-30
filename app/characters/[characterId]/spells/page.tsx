"use client";
import { useParams } from 'next/navigation';
import { useSpells } from "@/hooks/queries/useSpells";
import Spellbook from '@/components/character/sheet/Spellbook';
import { useCharacterSpells } from '@/hooks/queries/useSpells';
import Loading from '@/components/custom/Loading';
import SpellCard from '@/components/custom/SpellCard';

export default function SpellPage() {
  const params = useParams();
  const characterId = params.characterId as string;
  const { data: spellsKnown, isLoading } = useCharacterSpells(characterId as string);
  if (isLoading || !spellsKnown) return <Loading />;
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
      {spellsKnown.length === 0 && (
        <p className="text-amber-700 text-center py-4">Nessun incantesimo presente</p>
      )}
      {spellsKnown.map((sk) => {
        if (!sk.spell) return null;
        return (
          <SpellCard key={sk.id} spell={sk.spell}/>
        );
      })}
      <Spellbook characterId={characterId} />
    </div>
  );
}