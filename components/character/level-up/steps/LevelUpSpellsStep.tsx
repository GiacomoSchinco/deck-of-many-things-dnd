// components/character/level-up/LevelUpSpellsStep.tsx
'use client';

import { useState, useMemo } from 'react';
import { useSpells, useCharacterSpells } from '@/hooks/queries/useSpells';
import { WizardNav } from '@/components/shared/WizardNav';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SpellDetailButton } from '@/components/shared/SpellDetailButton';
import { SpellSearchInput } from '@/components/shared/SpellSearchInput';
import { SpellFlagBadges } from '@/components/shared/SpellSummary';
import { useSpellDetailDialog } from '@/hooks/useSpellDetailDialog';
import { cn, filterByName } from '@/lib/utils';
import { Sparkles, BookOpen, ArrowUpCircle, RefreshCw, X } from 'lucide-react';
import { getSchoolMeta } from '@/lib/theme/schools';
import { SelectableCard } from '@/components/ui/selectable-card';
import { getAvailableSpellLevels, groupSpellsByLevel } from '@/lib/utils/spellLevels';
import { PREPARER_CLASSES_LEVELUP, SWAP_CLASSES } from '@/lib/rules/spellcasting';
import type { Spell, SpellKnown } from '@/types/spell';
import SpellDetailDialog from '@/components/custom/SpellDetailDialog';

interface LevelUpSpellsStepProps {
  character: {
    id?: string;
    classes?: { name: string };
    spells_known?: Array<{ spell_id: number }>;
  };
  currentLevel: number;
  newLevel: number;
  changes: {
    spellChanges: {
      newCantrips: number;
      newSpellsKnown: number;
      newSpellsPreparable: number;
      newSpellSlots: Record<number, number>;
    };
    newSpellProgression: {
      spellSlots?: Record<number, number>;
      pactMagic?: { slots: number; level: number };
    };
  };
  data: { newSpells?: string[] };
  onNext: (data: { newSpells: string[]; swapFrom?: string; swapTo?: string }) => void;
  onBack: () => void;
  isLast: boolean;
}




type SpellKnownWithSpell = SpellKnown & { spell: Spell };

export default function LevelUpSpellsStep({
  character,
  newLevel,
  changes,
  data,
  onNext,
  onBack,
  isLast,
}: LevelUpSpellsStepProps) {
  const [search, setSearch] = useState('');
  const [selectedSpells, setSelectedSpells] = useState<string[]>(data.newSpells || []);
  const { openDetail, dialogProps: spellDialogProps } = useSpellDetailDialog();
  // Stato sostituzione incantesimo (SWAP_CLASSES)
  const [swapFrom, setSwapFrom] = useState<string | null>(null);  // known_id da rimuovere
  const [swapTo, setSwapTo] = useState<string | null>(null);       // spell_id sostituto
  const [swapSearch, setSwapSearch] = useState('');

  const className = character.classes?.name?.toLowerCase();
  const isPreparer = className ? (PREPARER_CLASSES_LEVELUP as readonly string[]).includes(className) : false;
  const canSwap = className ? (SWAP_CLASSES as readonly string[]).includes(className) : false;

  // Per le classi che conoscono, recupera gli incantesimi già conosciuti
  const { data: existingSpellsRaw } = useCharacterSpells(!isPreparer ? character.id ?? null : null);
  const existingSpells = useMemo(
    () => (existingSpellsRaw ?? []) as SpellKnownWithSpell[],
    [existingSpellsRaw]
  );
  const existingSpellIds = useMemo(
    () => existingSpells.map(ks => String(ks.spell_id)),
    [existingSpells]
  );

  // Ottieni gli incantesimi disponibili per la classe (solo per classi che conoscono)
  const { data: allSpells } = useSpells(
    !isPreparer && className ? { class: className } : undefined
  );

  // Tutti i livelli di incantesimo accessibili al nuovo livello (fix: non solo slot nuovi)
  const availableLevels = useMemo(() => {
    if (!className) return [];
    return getAvailableSpellLevels(className, newLevel).filter(l => l > 0);
  }, [className, newLevel]);

  // Filtra gli incantesimi per livello e ricerca (nuovi incantesimi)
  const spellsByLevel = useMemo(() => {
    const spells = allSpells
      ? filterByName(
          (allSpells as Spell[]).filter(s => availableLevels.includes(s.level)),
          search
        )
      : [];
    return groupSpellsByLevel(spells, (spell) => spell.level);
  }, [allSpells, availableLevels, search]);

  // Incantesimi disponibili per la sostituzione (escludi già conosciuti e già selezionati)
  const swapToByLevel = useMemo(() => {
    if (!allSpells || !canSwap) return groupSpellsByLevel<Spell>([], (spell) => spell.level);
    const spells = filterByName(
      (allSpells as Spell[]).filter(s =>
        availableLevels.includes(s.level) &&
        !existingSpellIds.includes(String(s.id)) &&
        !selectedSpells.includes(String(s.id))
      ),
      swapSearch
    );
    return groupSpellsByLevel(spells, (spell) => spell.level);
  }, [allSpells, availableLevels, existingSpellIds, selectedSpells, swapSearch, canSwap]);

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
    if (changes.spellChanges.newSpellsKnown === 0) return true;
    if (changes.spellChanges.newCantrips > 0 && changes.spellChanges.newSpellsKnown === 0) return true;
    const mainOk = selectedSpells.length === changes.spellChanges.newSpellsKnown;
    const swapOk = !swapFrom || !!swapTo;
    return mainOk && swapOk;
  };

  const handleNext = () => {
    onNext({
      newSpells: selectedSpells,
      swapFrom: swapFrom ?? undefined,
      swapTo: swapTo ?? undefined,
    });
  };

  // Nuovi slot sbloccati (formattazione migliorata)
  const newSlots = Object.entries(changes.spellChanges.newSpellSlots)
    .filter(([, count]) => count > 0)
    .map(([level, count]) => {
      const levelNum = parseInt(level);
      return `${count} slot di ${levelNum}° livello`;
    });

  // Aggiungi slot patto per Warlock
  const pactMagic = changes.newSpellProgression?.pactMagic;
  if (pactMagic && pactMagic.slots > 0) {
    newSlots.push(`${pactMagic.slots} slot di ${pactMagic.level}° livello (Pact Magic)`);
  }

  // Se non ci sono cambiamenti, mostra solo messaggio
  if (changes.spellChanges.newCantrips === 0 && 
      changes.spellChanges.newSpellsKnown === 0 && 
      changes.spellChanges.newSpellsPreparable === 0 &&
      newSlots.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="fantasy-icon-wrap">
            <BookOpen className="w-8 h-8 text-amber-700" />
          </div>
          <h2 className="text-xl fantasy-title">
            Incantesimi
          </h2>
          <p className="fantasy-subtitle mt-1">
            Al livello {newLevel} non ottieni nuovi incantesimi o slot.
          </p>
        </div>
        <WizardNav
          onBack={onBack}
          onNext={() => onNext({ newSpells: [] })}
          nextLabel={isLast ? 'Conferma ✓' : 'Avanti →'}
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="text-center">
          <div className="fantasy-icon-wrap">
            <BookOpen className="w-8 h-8 text-amber-700" />
          </div>
          <h2 className="text-xl fantasy-title">
            Nuovi Incantesimi
          </h2>
          <p className="fantasy-subtitle mt-1">
            {isPreparer 
              ? `Al livello ${newLevel} puoi preparare più incantesimi`
              : `Scegli ${changes.spellChanges.newSpellsKnown} nuovi incantesimi da imparare`
            }
          </p>
        </div>

        {/* Nuovi slot sbloccati */}
        {newSlots.length > 0 && (
          <div className="fantasy-section p-4">
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
          <div className="fantasy-section p-4">
            <h3 className="font-serif font-medium text-amber-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Nuovi trucchetti ({changes.spellChanges.newCantrips})
            </h3>
            <p className="text-sm text-amber-600">
              Al livello {newLevel} impari {changes.spellChanges.newCantrips} nuovo trucchetto.
            </p>
          </div>
        )}

        {/* Selezione incantesimi (solo per classi che conoscono) */}
        {!isPreparer && changes.spellChanges.newSpellsKnown > 0 && (
          <div className="space-y-4">
            <SpellSearchInput value={search} onChange={setSearch} />

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
                {spellsByLevel.levels.map((level) => (
                  <div key={level}>
                    <h4 className="font-serif font-medium text-amber-800 mb-2 sticky top-0 bg-white py-1">
                      {level}° Livello
                    </h4>
                    <div className="space-y-2">
                      {spellsByLevel.byLevel[level].map((spell) => {
                        const isSelected = selectedSpells.includes(String(spell.id));
                        const isKnown = isSpellAlreadyKnown(spell.id);
                        const isDisabled = (!isSelected && selectedSpells.length >= changes.spellChanges.newSpellsKnown) || isKnown;

                        return (
                          <div key={spell.id} className="flex items-stretch gap-1.5">
                            <SelectableCard
                              multiple
                              size="sm"
                              selected={isSelected}
                              disabled={isDisabled && !isKnown}
                              onClick={() => toggleSpell(spell)}
                              className="flex flex-1 items-start gap-2"
                            >
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-ink-strong">{spell.name}</span>
                                <span className="mt-0.5 flex flex-wrap items-center gap-1">
                                  <Badge className={cn('text-xs py-0 h-4', getSchoolMeta(spell.school).badge)}>
                                    {getSchoolMeta(spell.school).it}
                                  </Badge>
                                  <SpellFlagBadges spell={spell} variant="compact" />
                                  {isKnown && <span className="text-xs text-ink-muted">già conosciuto</span>}
                                </span>
                              </span>
                            </SelectableCard>

                            {/* Dettagli fuori dall'area selezionabile (prima era un
                                comando annidato dentro un altro comando). */}
                            <SpellDetailButton spellName={spell.name} onOpen={() => openDetail(spell)} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {spellsByLevel.levels.length === 0 && (
                  <p className="text-center text-amber-500 py-8">
                    {search ? 'Nessun incantesimo trovato' : 'Nessun incantesimo disponibile per questo livello'}
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Sostituzione incantesimo (SWAP_CLASSES) */}
        {canSwap && changes.spellChanges.newSpellsKnown > 0 && (
          <div className="rounded-lg border border-amber-300 bg-amber-50/30">
            <div className="p-4 border-b border-amber-200">
              <h3 className="font-serif font-medium text-amber-800 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Sostituisci un incantesimo
                <span className="text-xs font-normal text-amber-500">(opzionale)</span>
              </h3>
              <p className="text-xs text-amber-600 mt-1">
                Puoi rimuovere un incantesimo già conosciuto e impararne uno nuovo al suo posto.
              </p>
            </div>

            {/* Step 1: scegli da rimuovere */}
            <div className="p-4 space-y-2">
              <p className="text-sm font-medium text-amber-700">1. Scegli quale rimuovere:</p>
              {existingSpells.filter(ks => ks.spell && ks.spell.level > 0).length === 0 ? (
                <p className="text-xs text-amber-500 italic">Nessun incantesimo conosciuto</p>
              ) : (
                <ScrollArea className="h-40">
                  <div className="space-y-1 pr-2">
                    {existingSpells
                      .filter(ks => ks.spell && ks.spell.level > 0)
                      .sort((a, b) => a.spell.level - b.spell.level || a.spell.name.localeCompare(b.spell.name))
                      .map(ks => (
                        <button
                          key={ks.id}
                          type="button"
                          onClick={() => {
                            setSwapFrom(prev => prev === ks.id ? null : ks.id);
                            setSwapTo(null);
                          }}
                          className={cn(
                            'w-full flex items-center gap-2 p-2 rounded-lg border text-left text-sm transition-all',
                            swapFrom === ks.id
                              ? 'border-red-400 bg-red-50 text-red-800'
                              : 'border-amber-200 hover:border-amber-400 hover:bg-amber-50/50 text-amber-800'
                          )}
                        >
                          {swapFrom === ks.id
                            ? <X className="w-3.5 h-3.5 shrink-0 text-red-500" />
                            : <span className="w-3.5 h-3.5 shrink-0" />
                          }
                          <span className="flex-1 truncate">{ks.spell.name}</span>
                          <Badge variant="outline" className="text-xs shrink-0">Lv {ks.spell.level}</Badge>
                        </button>
                      ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Step 2: scegli sostituto */}
            {swapFrom && (
              <div className="p-4 pt-0 space-y-2 border-t border-amber-200">
                <p className="text-sm font-medium text-amber-700">2. Scegli il sostituto:</p>
                <SpellSearchInput
                  value={swapSearch}
                  onChange={setSwapSearch}
                  placeholder="Cerca..."
                  size="sm"
                />
                <ScrollArea className="h-56">
                  <div className="space-y-4 pr-2">
                    {swapToByLevel.levels.map((level) => (
                      <div key={level}>
                        <h4 className="text-xs font-medium text-ink-muted mb-1 sticky top-0 bg-parchment-50 py-0.5">
                          {level}° Livello
                        </h4>
                        <div className="space-y-1">
                          {swapToByLevel.byLevel[level].map(spell => (
                            <div key={spell.id} className="flex items-stretch gap-1.5">
                              <SelectableCard
                                size="sm"
                                selected={swapTo === String(spell.id)}
                                onClick={() => setSwapTo(prev => prev === String(spell.id) ? null : String(spell.id))}
                              >
                                <span className="min-w-0 flex-1 block truncate text-sm text-ink-strong">
                                  {spell.name}
                                </span>
                                <Badge className={cn('mt-0.5 text-xs py-0 h-4', getSchoolMeta(spell.school).badge)}>
                                  {getSchoolMeta(spell.school).it}
                                </Badge>
                              </SelectableCard>

                              <SpellDetailButton spellName={spell.name} onOpen={() => openDetail(spell)} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {swapToByLevel.levels.length === 0 && (
                      <p className="text-center text-amber-500 py-4 text-sm">
                        {swapSearch ? 'Nessun incantesimo trovato' : 'Nessun incantesimo disponibile'}
                      </p>
                    )}
                  </div>
                </ScrollArea>
                {swapFrom && !swapTo && (
                  <p className="text-xs text-red-500">Seleziona un sostituto oppure annulla la selezione sopra.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Messaggio per classi che preparano */}
        {isPreparer && changes.spellChanges.newSpellsPreparable > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              Al livello {newLevel} puoi preparare {changes.spellChanges.newSpellsPreparable} incantesimi in più.
              {className === 'wizard' && (
                <span className="block mt-1 text-xs text-blue-600">
                  Puoi anche aggiungere nuovi incantesimi al tuo grimorio dalla sezione &quot;Gestisci Incantesimi&quot;.
                </span>
              )}
            </p>
          </div>
        )}

        {/* Messaggio per classi che non hanno cambiamenti significativi */}
        {!isPreparer && changes.spellChanges.newSpellsKnown === 0 && changes.spellChanges.newCantrips === 0 && (
          <div className="fantasy-section p-4 text-center">
            <p className="text-sm text-amber-700">
              Al livello {newLevel} non impari nuovi incantesimi.
            </p>
          </div>
        )}

        <WizardNav
          onBack={onBack}
          onNext={handleNext}
          nextLabel={isLast ? 'Conferma ✓' : 'Avanti →'}
          nextDisabled={!canProceed()}
        />
      </div>

      <SpellDetailDialog {...spellDialogProps} />
    </>
  );
}