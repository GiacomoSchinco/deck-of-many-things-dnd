// components/character/level-up/LevelUpSpellsStep.tsx
'use client';

import { useState, useMemo } from 'react';
import { useSpells } from '@/hooks/queries/useSpells';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Search, Sparkles, BookOpen, CheckCircle2, Info, ArrowUpCircle } from 'lucide-react';
import { getItalianSchool } from '@/lib/utils/nameMappers';
import type { Spell } from '@/types/spell';
import SpellDetailDialog from '@/components/custom/SpellDetailDialog';

interface LevelUpSpellsStepProps {
  character: Record<string, unknown>;
  currentLevel: number;
  newLevel: number;
  changes: {
    spellChanges: {
      newCantrips: number;
      newSpellsKnown: number;
      newSpellsPreparable: number;
      newSpellSlots: Record<number, number>;
    };
    newSpellProgression: unknown;
  };
  data: Record<string, unknown>;
  onNext: (data: { newSpells: string[] }) => void;
  onBack: () => void;
  isLast: boolean;
}

const schoolColors: Record<string, string> = {
  abjuration: 'bg-blue-100 text-blue-700',
  conjuration: 'bg-yellow-100 text-yellow-700',
  divination: 'bg-purple-100 text-purple-700',
  enchantment: 'bg-pink-100 text-pink-700',
  evocation: 'bg-red-100 text-red-700',
  illusion: 'bg-indigo-100 text-indigo-700',
  necromancy: 'bg-gray-200 text-gray-800',
  transmutation: 'bg-green-100 text-green-700',
};

export default function LevelUpSpellsStep({
  character,
  // currentLevel is part of the standard step interface but not needed here
  newLevel,
  changes,
  data,
  onNext,
  onBack,
  isLast,
}: LevelUpSpellsStepProps) {
  const [search, setSearch] = useState('');
  const [selectedSpells, setSelectedSpells] = useState<string[]>((data.newSpells as string[] | undefined) || []);
  const [detailSpell, setDetailSpell] = useState<Spell | null>(null);

  const className = (character.classes as Record<string, unknown> | undefined)?.name as string | undefined;
  const isPreparer = ['cleric', 'druid', 'paladin'].includes(className ?? '');

  // Ottieni gli incantesimi disponibili per la classe
  const { data: allSpells } = useSpells({ class: className });

  // Determina quali livelli di incantesimi sono disponibili al nuovo livello
  const availableLevels = useMemo(() => {
    const levels = new Set<number>();
    const slots = changes.spellChanges.newSpellSlots;
    
    Object.entries(slots).forEach(([level, count]) => {
      if (count > 0) levels.add(parseInt(level));
    });
    
    return Array.from(levels).sort((a, b) => a - b);
  }, [changes.spellChanges.newSpellSlots]);

  // Filtra gli incantesimi per livello e ricerca
  const spellsByLevel = useMemo(() => {
    if (!allSpells) return {};

    const spells = allSpells.filter((s: Spell) => 
      availableLevels.includes(s.level) &&
      s.name.toLowerCase().includes(search.toLowerCase())
    );

    // Raggruppa per livello
    const grouped: Record<number, Spell[]> = {};
    spells.forEach((spell: Spell) => {
      if (!grouped[spell.level]) grouped[spell.level] = [];
      grouped[spell.level].push(spell);
    });

    return grouped;
  }, [allSpells, availableLevels, search]);

  // Incantesimi già conosciuti (per evitare di selezionarli di nuovo)
  const existingSpellIds = (character.spells_known as Array<{ spell_id: number }> | undefined)?.map(s => String(s.spell_id)) || [];

  const toggleSpell = (spell: Spell) => {
    const id = String(spell.id);
    const isSelected = selectedSpells.includes(id);

    if (isSelected) {
      setSelectedSpells(prev => prev.filter(s => s !== id));
    } else {
      if (selectedSpells.length >= changes.spellChanges.newSpellsKnown) return;
      setSelectedSpells(prev => [...prev, id]);
    }
  };

  const isSpellAlreadyKnown = (spellId: number) => existingSpellIds.includes(String(spellId));

  const canProceed = () => {
    if (isPreparer) return true;
    if (changes.spellChanges.newCantrips > 0) return true; // TODO: gestire selezione cantrip
    return selectedSpells.length === changes.spellChanges.newSpellsKnown;
  };

  // Nuovi slot sbloccati
  const newSlots = Object.entries(changes.spellChanges.newSpellSlots)
    .filter(([, count]) => count > 0)
    .map(([level, count]) => `${count} slot di ${level}° livello`);

  return (
    <>
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-amber-700" />
          </div>
          <h2 className="text-xl font-serif font-bold text-amber-900">
            Nuovi Incantesimi
          </h2>
          <p className="text-amber-600 text-sm mt-1">
            {isPreparer 
              ? 'Puoi preparare nuovi incantesimi dalla lista della tua classe'
              : `Scegli ${changes.spellChanges.newSpellsKnown} nuovi incantesimi da imparare`
            }
          </p>
        </div>

        {/* Nuovi slot sbloccati */}
        {newSlots.length > 0 && (
          <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-200">
            <h3 className="font-serif font-medium text-amber-800 mb-2 flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4" />
              Nuovi slot incantesimo
            </h3>
            <div className="flex flex-wrap gap-2">
              {newSlots.map((slot, i) => (
                <Badge key={i} className="bg-amber-100 text-amber-700">
                  {slot}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Nuovi trucchetti */}
        {changes.spellChanges.newCantrips > 0 && (
          <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-200">
            <h3 className="font-serif font-medium text-amber-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Nuovi trucchetti ({changes.spellChanges.newCantrips})
            </h3>
            <p className="text-sm text-amber-600">
              Al livello {newLevel} impari {changes.spellChanges.newCantrips} nuovo trucchetto.
              (Selezione in sviluppo)
            </p>
          </div>
        )}

        {/* Selezione incantesimi (solo per classi che conoscono) */}
        {!isPreparer && changes.spellChanges.newSpellsKnown > 0 && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca incantesimo..."
                className="pl-9 bg-amber-50 border-amber-300"
              />
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-amber-700">Incantesimi selezionati:</span>
              <span className={cn(
                "font-medium",
                selectedSpells.length === changes.spellChanges.newSpellsKnown 
                  ? "text-green-600" 
                  : "text-amber-700"
              )}>
                {selectedSpells.length}/{changes.spellChanges.newSpellsKnown}
              </span>
            </div>

            <ScrollArea className="h-80">
              <div className="space-y-4 pr-4">
                {Object.entries(spellsByLevel).map(([level, spells]) => (
                  <div key={level}>
                    <h4 className="font-serif font-medium text-amber-800 mb-2 sticky top-0 bg-white py-1">
                      {level}° Livello
                    </h4>
                    <div className="space-y-2">
                      {(spells as Spell[]).map((spell) => {
                        const isSelected = selectedSpells.includes(String(spell.id));
                        const isKnown = isSpellAlreadyKnown(spell.id);
                        const isDisabled = (!isSelected && selectedSpells.length >= changes.spellChanges.newSpellsKnown) || isKnown;

                        return (
                          <button
                            key={spell.id}
                            type="button"
                            onClick={() => !isKnown && toggleSpell(spell)}
                            disabled={isDisabled}
                            className={cn(
                              "w-full flex items-start gap-2 p-2 rounded-lg border text-left transition-all",
                              isSelected
                                ? "border-amber-500 bg-amber-50 text-amber-900"
                                : isKnown
                                ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                                : "border-amber-200 hover:border-amber-400 hover:bg-amber-50/50 text-amber-800"
                            )}
                          >
                            <CheckCircle2
                              className={cn(
                                "w-4 h-4 mt-0.5 shrink-0",
                                isSelected ? "text-amber-600" : "text-gray-300"
                              )}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{spell.name}</p>
                              <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                <span className={cn(
                                  "text-xs px-1.5 py-0.5 rounded-full",
                                  schoolColors[spell.school] ?? 'bg-gray-100 text-gray-600'
                                )}>
                                  {getItalianSchool(spell.school)}
                                </span>
                                {spell.ritual && (
                                  <Badge variant="outline" className="text-xs py-0 h-4">Rituale</Badge>
                                )}
                                {spell.concentration && (
                                  <Badge variant="outline" className="text-xs py-0 h-4">Conc.</Badge>
                                )}
                              </div>
                            </div>
                            <span
                              role="button"
                              onClick={(e) => { e.stopPropagation(); setDetailSpell(spell); }}
                              className="shrink-0 p-0.5 text-amber-400 hover:text-amber-700 transition-colors cursor-pointer"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {Object.keys(spellsByLevel).length === 0 && (
                  <p className="text-center text-amber-500 py-8">
                    {search ? 'Nessun incantesimo trovato' : 'Nessun incantesimo disponibile per questo livello'}
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Messaggio per classi che preparano */}
        {isPreparer && changes.spellChanges.newSpellsPreparable > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              🔮 Al livello {newLevel} puoi preparare {changes.spellChanges.newSpellsPreparable} incantesimi in più.
              Puoi modificare la tua lista di incantesimi preparati nella scheda del personaggio.
            </p>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-amber-200">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-amber-600 text-amber-700"
          >
            Indietro
          </Button>
          <Button
            type="button"
            onClick={() => onNext({ newSpells: selectedSpells })}
            disabled={!canProceed()}
            className="bg-amber-700 hover:bg-amber-800 text-white"
          >
            {isLast ? 'Conferma' : 'Avanti'}
          </Button>
        </div>
      </div>

      <SpellDetailDialog
        spell={detailSpell}
        open={detailSpell !== null}
        onClose={() => setDetailSpell(null)}
      />
    </>
  );
}