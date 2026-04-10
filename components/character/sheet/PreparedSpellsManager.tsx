// components/character/sheet/PreparedSpellsManager.tsx
'use client';

import { useState, useMemo } from 'react';
import { useCharacterSpells, useCharacterPreparedSpells } from '@/hooks/queries/useSpells';
import { useSpells } from '@/hooks/queries/useSpells';
import { useAddPreparedSpells, useRemovePreparedSpells } from '@/hooks/mutations/useCharacterSpellMutations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { Spell } from '@/types/spell';
import { getItalianSchool, schoolBadgeColors } from '@/lib/utils/nameMappers';
import { filterByName } from '@/lib/utils';

interface PreparedSpellsManagerProps {
  characterId: string;
  className?: string;      // Nome della classe in inglese (es. 'cleric')
  characterLevel: number;
  abilityModifier: number; // Modificatore della caratteristica (Wisdom per cleric/druid, Intelligence per wizard, Charisma per paladin)
  isWizard?: boolean;
  onRefresh?: () => void;
}



export default function PreparedSpellsManager({
  characterId,
  className,
  characterLevel,
  abilityModifier,
  isWizard = false,
  onRefresh,
}: PreparedSpellsManagerProps) {
  const [search, setSearch] = useState('');
  
  // Per il mago: usa spells_known (il grimorio)
  // Per le altre classi: usa TUTTI gli incantesimi della classe
  const { data: spellsKnown, isLoading: knownLoading } = useCharacterSpells(isWizard ? characterId : null);
  const { data: allClassSpells, isLoading: classSpellsLoading } = useSpells(
    !isWizard && className ? { class: className } : undefined
  );
  const { data: preparedSpells, refetch: refetchPrepared } = useCharacterPreparedSpells(characterId);
  const addPrepared = useAddPreparedSpells();
  const removePrepared = useRemovePreparedSpells();

  const preparedSpellIds = new Set((preparedSpells ?? []).map((p: { spell_id: number }) => p.spell_id));

  // Calcola il numero massimo di incantesimi preparabili
  const maxPreparable = useMemo(() => {
    if (isWizard) {
      // Mago: livello + mod Intelligenza
      return Math.max(1, characterLevel + abilityModifier);
    }
    // Chierico/Druido: livello + mod Saggezza
    // Paladino: livello/2 + mod Carisma
    if (className === 'paladin') {
      return Math.max(1, Math.floor(characterLevel / 2) + abilityModifier);
    }
    return Math.max(1, characterLevel + abilityModifier);
  }, [className, characterLevel, abilityModifier, isWizard]);

  // Lista degli incantesimi da mostrare
  const availableSpells: Spell[] = useMemo(() => {
    if (isWizard) {
      // Mago: solo quelli nel grimorio (spells_known)
      return (spellsKnown ?? [])
        .map((sk: { spell: Spell }) => sk.spell)
        .filter((s: Spell) => s && s.level > 0);
    } else {
      // Altre classi: tutti gli incantesimi della classe
      return allClassSpells?.filter((s: Spell) => s.level > 0) ?? [];
    }
  }, [isWizard, spellsKnown, allClassSpells]);

  const filteredSpells = useMemo(() => filterByName(availableSpells, search), [availableSpells, search]);

  // Raggruppa per livello
  const byLevel: Record<number, Spell[]> = {};
  for (const spell of filteredSpells) {
    if (!byLevel[spell.level]) byLevel[spell.level] = [];
    byLevel[spell.level].push(spell);
  }

  const handleToggle = async (spellId: number, currentlyPrepared: boolean) => {
    // Limite massimo
    if (!currentlyPrepared && preparedSpellIds.size >= maxPreparable) {
      toast.error(`Puoi preparare al massimo ${maxPreparable} incantesimi`);
      return;
    }

    try {
      if (currentlyPrepared) {
        await removePrepared.mutateAsync({ characterId, spellIds: [spellId] });
        toast.success('Incantesimo rimosso dai preparati');
      } else {
        await addPrepared.mutateAsync({ characterId, spellIds: [spellId] });
        toast.success('Incantesimo aggiunto ai preparati');
      }
      refetchPrepared();
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Errore durante la preparazione' + (error instanceof Error ? `: ${error.message}` : ''));
    }
  };

  const handleReset = async () => {
    const allSpellIds = availableSpells.map((s) => s.id);
    if (allSpellIds.length > 0) {
      await removePrepared.mutateAsync({ characterId, spellIds: allSpellIds });
      refetchPrepared();
      toast.success('Lista preparati resettata');
    }
  };

  const isLoading = isWizard ? knownLoading : classSpellsLoading;

  if (isLoading) {
    return <p className="text-amber-700 text-center py-4">Caricamento incantesimi...</p>;
  }

  if (availableSpells.length === 0) {
    return (
      <div className="text-center py-8 text-amber-600">
        <p>Nessun incantesimo disponibile.</p>
        {!isWizard && (
          <p className="text-sm mt-1">
            La lista incantesimi per questa classe non è ancora stata caricata.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h3 className="text-lg fantasy-title">Incantesimi Preparati</h3>
          <p className="fantasy-subtitle">
            {preparedSpellIds.size} di {maxPreparable} preparati
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="border-amber-300 text-amber-700"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Resetta tutti
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca incantesimo..."
          className="pl-9 bg-amber-50 border-amber-300"
        />
      </div>

      {/* Lista per livello */}
      {Object.keys(byLevel)
        .map(Number)
        .sort((a, b) => a - b)
        .map((level) => (
          <div key={level} className="space-y-2">
            <h4 className="fantasy-title font-semibold border-b border-amber-200 pb-1">
              Livello {level}
            </h4>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {byLevel[level].map((spell) => {
                const isPrepared = preparedSpellIds.has(spell.id);
                return (
                  <div
                    key={spell.id}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border transition-all
                      ${isPrepared 
                        ? 'bg-green-50 border-green-300' 
                        : 'fantasy-section hover:bg-amber-100/50'
                      }
                    `}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-amber-900">{spell.name}</span>
                        <Badge className={`text-xs ${schoolBadgeColors[spell.school] ?? 'bg-gray-100'}`}>
                          {getItalianSchool(spell.school)}
                        </Badge>
                        {spell.ritual && (
                          <Badge className="text-xs bg-emerald-100 text-emerald-800">Rituale</Badge>
                        )}
                        {spell.concentration && (
                          <Badge className="text-xs bg-orange-100 text-orange-800">Concentrazione</Badge>
                        )}
                      </div>
                      <div className="flex gap-3 text-xs text-amber-600 mt-1">
                        {spell.casting_time && <span>⏱ {spell.casting_time}</span>}
                        {spell.range && <span>🎯 {spell.range}</span>}
                        {spell.duration && <span>⏳ {spell.duration}</span>}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={isPrepared ? "default" : "outline"}
                      className={`
                        ml-4 h-8 px-3 text-xs shrink-0
                        ${isPrepared 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'border-amber-300 text-amber-700 hover:bg-amber-100'
                        }
                      `}
                      onClick={() => handleToggle(spell.id, isPrepared)}
                    >
                      {isPrepared ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Preparato
                        </>
                      ) : (
                        'Prepara'
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}