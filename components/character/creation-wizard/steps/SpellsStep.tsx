// components/character/creation-wizard/steps/SpellsStep.tsx
'use client';

import { useState, useMemo } from 'react';
import { useClass } from '@/hooks/queries/useClasses';
import { useSpells } from '@/hooks/queries/useSpells';
import { useSpellcastingProgression } from '@/hooks/queries/useSpellcastingProgression';
import { getEnglishClass } from '@/lib/utils/nameMappers';
import { WizardStep } from '../WizardStep';
import Loading from '@/components/custom/Loading';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Sparkles, BookOpen, Search, CheckCircle2, Info } from 'lucide-react';
import type { Spell } from '@/types/spell';
import SpellDetailDialog from '@/components/custom/SpellDetailDialog';

interface SpellsStepProps {
  classId: number;
  intelligenceScore?: number; // per wizard (dimensione grimorio)
  onConfirm: (selectedSpellIds: string[]) => void;
  onChange?: (selectedSpellIds: string[]) => void;
  initialSelectedSpells?: string[];
  onBack: () => void;
}

// Classi che preparano: nessuna selezione di spells_known
const PREPARER_CLASSES = ['cleric', 'druid', 'paladin'];

const schoolColors: Record<string, string> = {
  abjuration:    'bg-blue-100 text-blue-700',
  conjuration:   'bg-yellow-100 text-yellow-700',
  divination:    'bg-purple-100 text-purple-700',
  enchantment:   'bg-pink-100 text-pink-700',
  evocation:     'bg-red-100 text-red-700',
  illusion:      'bg-indigo-100 text-indigo-700',
  necromancy:    'bg-gray-200 text-gray-800',
  transmutation: 'bg-green-100 text-green-700',
};

export function SpellsStep({
  classId,
  intelligenceScore = 10,
  onConfirm,
  onChange,
  initialSelectedSpells = [],
  onBack,
}: SpellsStepProps) {
  const { data: classData, isLoading: classLoading } = useClass(classId);
  const [searchCantrips, setSearchCantrips] = useState('');
  const [searchSpells, setSearchSpells] = useState('');
  const [selected, setSelected] = useState<string[]>(initialSelectedSpells);
  const [detailSpell, setDetailSpell] = useState<Spell | null>(null);

  const englishClassName  = classData ? getEnglishClass(classData.name) : null;
  
  const isPreparerClass   = englishClassName ? PREPARER_CLASSES.includes(englishClassName) : false;
  const isWizard          = englishClassName === 'wizard';
  const hasSpellcasting   = !!classData?.spellcasting;

  const { data: progression, isLoading: progressionLoading } = useSpellcastingProgression(
    englishClassName,
    1,
  );

  const { data: allSpells, isLoading: spellsLoading } = useSpells(
    hasSpellcasting && englishClassName ? { class: englishClassName } : undefined,
  );

  const intModifier      = Math.floor((intelligenceScore - 10) / 2);
  const cantripsAllowed  = progression?.cantrips_known ?? 0;
  const spellsAllowed    = useMemo(() => {
    if (!progression) return 0;
    if (isWizard) return 0;
    return progression.spells_known ?? 0;
  }, [progression, isWizard]);

  const hasSpellSlots = useMemo(() => {
    if (!progression) return false;

    // Standard spell slots (full/half/third casters)
    if (progression.spell_slots && typeof progression.spell_slots === 'object') {
      if (Object.values(progression.spell_slots).some((v) => Number(v) > 0)) return true;
    }

    // Warlock / Pact magic: check pact_slot_level or pact_slots
    if (progression.pact_slot_level && Number(progression.pact_slot_level) > 0) return true;
    if (progression.pact_slots && typeof progression.pact_slots === 'object') {
      if (Object.values(progression.pact_slots).some((v) => Number(v) > 0)) return true;
    }

    return false;
  }, [progression]);

  const { cantrips, spells } = useMemo(() => {
    if (!allSpells) return { cantrips: [] as Spell[], spells: [] as Spell[] };

    // Prefer progression data from the server (spell_slots / pact_slot_level)
    // progression was fetched for the class at level 1 above.
    const availableLevelsSet = new Set<number>();

    if (progression) {
      if (progression.cantrips_known && progression.cantrips_known > 0) {
        availableLevelsSet.add(0);
      }

      // spell_slots is an object like { '1': 2, '2': 0, ... }
      if (progression.spell_slots && typeof progression.spell_slots === 'object') {
        Object.entries(progression.spell_slots).forEach(([levelStr, count]) => {
          // levelStr can be like "1st", "2nd", "3rd" — try parseInt first,
          // then fallback to extracting the first number with a regex.
          let lvl = parseInt(String(levelStr), 10);
          if (isNaN(lvl)) {
            const match = String(levelStr).match(/\d+/);
            if (match) lvl = parseInt(match[0], 10);
          }
          if (!isNaN(lvl) && Number(count) > 0) availableLevelsSet.add(lvl);
        });
      }

      // Warlock / pact magic: pact_slot_level indicates the highest level they can cast
      if (progression.pact_slot_level && Number(progression.pact_slot_level) > 0) {
        const max = Number(progression.pact_slot_level);
        for (let i = 1; i <= max; i++) availableLevelsSet.add(i);
      }
    }

    // Fallback: if nothing was deduced, allow cantrips (0) and level 1 as safe default
    if (availableLevelsSet.size === 0) {
      availableLevelsSet.add(0);
      availableLevelsSet.add(1);
    }

    const availableLevels = Array.from(availableLevelsSet.values());

    return {
      cantrips: allSpells.filter((s: Spell) => s.level === 0),
      spells: allSpells.filter((s: Spell) => s.level > 0 && availableLevels.includes(s.level)),
    };
  }, [allSpells, progression]);

  const selectedCantrips = selected.filter((id) => cantrips.some((c: Spell) => String(c.id) === id));
  const selectedSpells   = selected.filter((id) => spells.some((s: Spell) => String(s.id) === id));

  const filteredCantrips = cantrips.filter((s: Spell) =>
    s.name.toLowerCase().includes(searchCantrips.toLowerCase()),
  );
  const filteredSpells = spells.filter((s: Spell) =>
    s.name.toLowerCase().includes(searchSpells.toLowerCase()),
  );

  const toggle = (spell: Spell, type: 'cantrip' | 'spell') => {
    const idStr     = String(spell.id);
    const isSelected = selected.includes(idStr);

    if (isSelected) {
      const next = selected.filter((id) => id !== idStr);
      setSelected(next);
      onChange?.(next);
      return;
    }

    if (type === 'cantrip' && selectedCantrips.length >= cantripsAllowed) return;
    if (type === 'spell'   && selectedSpells.length   >= (isWizard ? Math.max(6, 6 + intModifier) : spellsAllowed)) return;
    console.log('Toggling spell', spell.name, 'type', type);
    const next = [...selected, idStr];
    setSelected(next);
    onChange?.(next);
  };

  const wizardSpellbookSize = isWizard ? 6 : 0;

  const canProceed = useMemo(() => {
    if (!hasSpellcasting) return true;
    if (isPreparerClass) return true;
    if (cantripsAllowed > 0 && selectedCantrips.length < cantripsAllowed) return false;
    if (spellsAllowed > 0 && selectedSpells.length < spellsAllowed) return false;
    if (isWizard && selectedSpells.length < wizardSpellbookSize) return false;
    return true;
  }, [hasSpellcasting, isPreparerClass, cantripsAllowed, spellsAllowed, isWizard, wizardSpellbookSize, selectedCantrips, selectedSpells]);

  const isLoading = classLoading || progressionLoading || spellsLoading;
  if (isLoading) return <Loading />;

  // ── Classe senza magie ───────────────────────────────────────────────────────
  if (!hasSpellcasting) {
    return (
      <WizardStep
        title="Incantesimi"
        subtitle="Questa classe non usa la magia"
        onBack={onBack}
        onNext={() => onConfirm([])}
      >
        <div className="flex flex-col items-center justify-center py-12 text-center text-amber-700 gap-3">
          <Sparkles className="w-10 h-10 opacity-30" />
          <p className="font-serif text-lg">
            I {classData?.name ?? 'personaggi di questa classe'} non usano magie.
          </p>
          <p className="text-sm text-amber-600">Puoi procedere al passo successivo.</p>
        </div>
      </WizardStep>
    );
  }

  // ── Classi che preparano (Chierico, Druido, Paladino) ────────────────────────
  if (isPreparerClass) {
    const slotsText = progression?.spell_slots
      ? Object.entries(progression.spell_slots)
          .filter(([, v]) => v > 0)
          .map(([k, v]) => `${v} slot di ${k} livello`)
          .join(', ')
      : null;

    return (
      <>
      <WizardStep
        title="Incantesimi"
        subtitle={`${classData?.name} — Preparazione incantesimi`}
        onBack={onBack}
        onNext={() => onConfirm(selected)}
      >
        <div className="space-y-4">
          {cantripsAllowed > 0 && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <Input
                  value={searchCantrips}
                  onChange={(e) => setSearchCantrips(e.target.value)}
                  placeholder="Cerca trucchetti..."
                  className="pl-9 bg-amber-50 border-amber-300"
                />
              </div>
              <SpellSection
                title={`Cantip — scegli ${cantripsAllowed}`}
                icon={<Sparkles className="w-4 h-4" />}
                selected={selectedCantrips}
                max={cantripsAllowed}
                spells={filteredCantrips}
                onToggle={(s) => toggle(s, 'cantrip')}
                onDetail={setDetailSpell}
              />
            </>
          )}

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Preparazione degli incantesimi</p>
              <p>
                I {classData?.name} preparano gli incantesimi dopo ogni riposo lungo,
                scegliendo dalla lista completa della classe. Non è necessario sceglierli ora.
              </p>
              {slotsText && (
                <p className="mt-2 font-medium">Slot al livello 1: {slotsText}</p>
              )}
            </div>
          </div>
        </div>
      </WizardStep>

      <SpellDetailDialog
        spell={detailSpell}
        open={detailSpell !== null}
        onClose={() => setDetailSpell(null)}
      />
    </>
    );
  }

  // ── Classi con spells known (Bardo, Ranger, Stregone, Warlock, Mago) ─────────
  return (
    <>
    <WizardStep
      title="Incantesimi"
      subtitle={`${classData?.name} — Scegli i tuoi incantesimi`}
      onBack={onBack}
      onNext={() => onConfirm(selected)}
      nextDisabled={!canProceed}
    >
      <div className="space-y-2 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
          <Input
            value={searchSpells}
            onChange={(e) => setSearchSpells(e.target.value)}
            placeholder="Cerca incantesimo..."
            className="pl-9 bg-amber-50 border-amber-300"
          />
        </div>

        <div className="flex gap-3 text-sm flex-wrap">
          {cantripsAllowed > 0 && (
            <span className={cn(
              'px-2 py-0.5 rounded-full font-medium',
              selectedCantrips.length === cantripsAllowed
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700',
            )}>
              Cantip: {selectedCantrips.length}/{cantripsAllowed}
            </span>
          )}
          {(spellsAllowed > 0 || isWizard) && (
            <span className={cn(
              'px-2 py-0.5 rounded-full font-medium',
              selectedSpells.length === (isWizard ? wizardSpellbookSize : spellsAllowed)
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700',
            )}>
              {isWizard ? 'Grimorio' : 'Incantesimi'}:{' '}
              {selectedSpells.length}/{isWizard ? wizardSpellbookSize : spellsAllowed}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {cantripsAllowed > 0 && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
              <Input
                value={searchCantrips}
                onChange={(e) => setSearchCantrips(e.target.value)}
                placeholder="Cerca trucchetti..."
                className="pl-9 bg-amber-50 border-amber-300 mb-2"
              />
            </div>
            <SpellSection
              title={`Cantip — scegli ${cantripsAllowed}`}
              icon={<Sparkles className="w-4 h-4" />}
              selected={selectedCantrips}
              max={cantripsAllowed}
              spells={filteredCantrips}
              onToggle={(s) => toggle(s, 'cantrip')}
              onDetail={setDetailSpell}
            />
          </>
        )}

        {(spellsAllowed > 0 || isWizard) && (
          <SpellSection
            title={
              isWizard
                ? `Grimorio — scegli ${wizardSpellbookSize} incantesimi`
                : `Incantesimi — scegli ${spellsAllowed}`
            }
            icon={<BookOpen className="w-4 h-4" />}
            selected={selectedSpells}
            max={isWizard ? wizardSpellbookSize : spellsAllowed}
            spells={filteredSpells}
            onToggle={(s) => toggle(s, 'spell')}
            onDetail={setDetailSpell}
          />
        )}

        {!hasSpellSlots && progression && !isWizard && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex gap-2 text-sm text-amber-700">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              I {classData?.name} ottengono gli slot incantesimo a partire dal livello 2.
            </span>
          </div>
        )}
      </div>
    </WizardStep>

      <SpellDetailDialog
        spell={detailSpell}
        open={detailSpell !== null}
        onClose={() => setDetailSpell(null)}
      />
    </>
  );
}

// ─── Sub-component: griglia spell selezionabile ───────────────────────────────

interface SpellSectionProps {
  title: string;
  icon: React.ReactNode;
  spells: Spell[];
  selected: string[];
  max: number;
  onToggle: (spell: Spell) => void;
  onDetail: (spell: Spell) => void;
}

function SpellSection({ title, icon, spells, selected, max, onToggle, onDetail }: SpellSectionProps) {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-serif text-amber-800 font-medium mb-2">
        {icon}
        {title}
      </h3>
      {spells.length === 0 ? (
        <p className="text-sm text-amber-500 py-2">Nessun risultato.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
          {spells.map((spell) => {
            const idStr      = String(spell.id);
            const isSelected = selected.includes(idStr);
            const isDisabled = !isSelected && selected.length >= max;

            return (
              <button
                key={spell.id}
                type="button"
                onClick={() => onToggle(spell)}
                disabled={isDisabled}
                className={cn(
                  'flex items-start gap-2 p-2 rounded-lg border text-left transition-all',
                  isSelected
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : isDisabled
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-amber-200 hover:border-amber-400 hover:bg-amber-50/50 text-amber-800',
                )}
              >
                <CheckCircle2
                  className={cn(
                    'w-4 h-4 mt-0.5 shrink-0',
                    isSelected ? 'text-amber-600' : 'text-gray-300',
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{spell.name}</p>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    {spell.school && (
                      <span className={cn(
                        'text-xs px-1.5 py-0.5 rounded-full',
                        schoolColors[spell.school] ?? 'bg-gray-100 text-gray-600',
                      )}>
                        {spell.school}
                      </span>
                    )}
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
                  onClick={(e) => { e.stopPropagation(); onDetail(spell); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDetail(spell); }
                  }}
                  className="shrink-0 p-0.5 text-amber-400 hover:text-amber-700 transition-colors cursor-pointer"
                  tabIndex={0}
                  aria-label={`Dettagli ${spell.name}`}
                >
                  <Info className="w-3.5 h-3.5" />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SpellsStep;
