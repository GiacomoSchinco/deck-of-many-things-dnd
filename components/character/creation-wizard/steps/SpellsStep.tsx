// components/character/creation-wizard/steps/SpellsStep.tsx
'use client';

import { useState, useMemo } from 'react';
import { useClass } from '@/hooks/queries/useClasses';
import { useSpells } from '@/hooks/queries/useSpells';
import { getSpellProgression, SpellCastingClass } from '@/lib/rules/spellcasting';
import { getEnglishClass } from '@/lib/utils/nameMappers';
import { useCreationStore } from '@/store/useCreationStore';
import { WizardStep } from '../WizardStep';
import Loading from '@/components/custom/Loading';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Sparkles, BookOpen, Search, CheckCircle2, Info, Lock } from 'lucide-react';
import type { Spell } from '@/types/spell';
import SpellDetailDialog from '@/components/custom/SpellDetailDialog';

interface SpellsStepProps {
  classId: number;
  intelligenceScore?: number;
  mode?: 'create' | 'edit';
  existingSpellIds?: string[];
  characterLevel?: number;
  onConfirm: (selectedSpellIds: string[]) => void;
  onChange?: (selectedSpellIds: string[]) => void;
  initialSelectedSpells?: string[];
  onBack: () => void;
}

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
  // intelligenceScore: accettato per compatibilità ma non usato internamente
  mode = 'create',
  existingSpellIds = [],
  characterLevel,
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

  const englishClassName = classData ? getEnglishClass(classData.name) : null;
  const savedLevel = useCreationStore((s) => s.data?.level ?? 1);
  const effectiveLevel = characterLevel ?? savedLevel;

  const isPreparerClass = englishClassName ? PREPARER_CLASSES.includes(englishClassName) : false;
  const isWizard = englishClassName === 'wizard';
  const hasSpellcasting = !!classData?.spellcasting;

  const SPELLCASTING_CLASSES: SpellCastingClass[] = [
    'wizard', 'sorcerer', 'bard', 'cleric', 'druid', 'paladin', 'ranger', 'warlock'
  ];
  const spellcastingClass = (englishClassName && SPELLCASTING_CLASSES.includes(englishClassName as SpellCastingClass))
    ? (englishClassName as SpellCastingClass)
    : null;

  const prog = spellcastingClass
    ? getSpellProgression(spellcastingClass, effectiveLevel, 0)
    : null;

  const { data: allSpells, isLoading: spellsLoading } = useSpells(
    hasSpellcasting && englishClassName ? { class: englishClassName } : undefined,
  );

  const cantripsAllowed = prog?.cantrips ?? 0;
  const spellsAllowed = useMemo(() => {
    if (!prog) return 0;
    if (isWizard) return 0;
    return prog.spellsKnown ?? 0;
  }, [prog, isWizard]);

  const wizardSpellbookSize = isWizard ? 6 : 0;

  // Massimo livello di incantesimo che può essere lanciato (basato sugli slot)
  const maxSpellLevel = useMemo(() => {
    if (!prog) return 1;
    let max = 0;
    Object.keys(prog.spellSlots).forEach((lvlStr) => {
      const lvl = Number(lvlStr);
      if (prog.spellSlots[lvl] > 0 && lvl > max) max = lvl;
    });
    if (prog.pactMagic && prog.pactMagic.slots > 0) {
      max = Math.max(max, prog.pactMagic.level);
    }
    return max > 0 ? max : 1;
  }, [prog]);

  const { cantrips, spellsByLevel } = useMemo(() => {
    if (!allSpells) return { cantrips: [] as Spell[], spellsByLevel: {} as Record<number, Spell[]> };
    const cantrips = allSpells.filter((s: Spell) => s.level === 0);
    const spellsByLevel: Record<number, Spell[]> = {};
    for (let lvl = 1; lvl <= maxSpellLevel; lvl++) {
      spellsByLevel[lvl] = allSpells.filter((s: Spell) => s.level === lvl);
    }
    return { cantrips, spellsByLevel };
  }, [allSpells, maxSpellLevel]);

  const selectedCantrips = selected.filter((id) => cantrips.some((c: Spell) => String(c.id) === id));
  const selectedSpells = selected.filter((id) =>
    Object.values(spellsByLevel).flat().some((s: Spell) => String(s.id) === id)
  );

  const filteredCantrips = cantrips.filter((s: Spell) =>
    s.name.toLowerCase().includes(searchCantrips.toLowerCase()),
  );

  const toggle = (spell: Spell, type: 'cantrip' | 'spell') => {
    const idStr = String(spell.id);
    const isSelected = selected.includes(idStr);

    if (mode === 'edit' && existingSpellIds.includes(idStr)) return;

    if (isSelected) {
      const next = selected.filter((id) => id !== idStr);
      setSelected(next);
      onChange?.(next);
      return;
    }

    if (type === 'cantrip') {
      if (selectedCantrips.length >= cantripsAllowed) return;
    } else {
      if (spell.level > maxSpellLevel) return;
      if (isWizard) {
        if (selectedSpells.length >= wizardSpellbookSize) return;
      } else {
        if (selectedSpells.length >= spellsAllowed) return;
      }
    }

    const next = [...selected, idStr];
    setSelected(next);
    onChange?.(next);
  };

  const canProceed = useMemo(() => {
    if (mode === 'edit') return true;
    if (!hasSpellcasting) return true;
    if (isPreparerClass) return true;
    if (cantripsAllowed > 0 && selectedCantrips.length < cantripsAllowed) return false;
    if (isWizard && selectedSpells.length < wizardSpellbookSize) return false;
    if (!isWizard && spellsAllowed > 0 && selectedSpells.length < spellsAllowed) return false;
    return true;
  }, [mode, hasSpellcasting, isPreparerClass, cantripsAllowed, isWizard, wizardSpellbookSize, spellsAllowed, selectedCantrips, selectedSpells]);

  const isLoading = classLoading || spellsLoading;
  if (isLoading) return <Loading />;

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

  if (isPreparerClass) {
    const slotsText = prog
      ? (Object.entries(prog.spellSlots)
          .filter(([, v]) => v > 0)
          .map(([k, v]) => `${v} slot di ${k}° livello`)
          .join(', ') ||
        (prog.pactMagic
          ? `${prog.pactMagic.slots} slot di ${prog.pactMagic.level}° livello (Magia del Patto)`
          : null))
      : null;

    return (
      <>
        <WizardStep
          title="Incantesimi"
          subtitle={`${classData?.name} — Preparazione incantesimi`}
          onBack={onBack}
          onNext={() => onConfirm(selected)}
          nextLabel={mode === 'edit' ? 'Salva modifiche' : undefined}
          backLabel={mode === 'edit' ? 'Annulla' : undefined}
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
                  lockedIds={mode === 'edit' ? existingSpellIds : []}
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
                  <p className="mt-2 font-medium">Slot al livello {effectiveLevel}: {slotsText}</p>
                )}
              </div>
            </div>
          </div>
        </WizardStep>
        <SpellDetailDialog spell={detailSpell} open={detailSpell !== null} onClose={() => setDetailSpell(null)} />
      </>
    );
  }

  return (
    <>
      <WizardStep
        title="Incantesimi"
        subtitle={`${classData?.name} — Scegli i tuoi incantesimi`}
        onBack={onBack}
        onNext={() => onConfirm(selected)}
        nextDisabled={!canProceed}
        nextLabel={mode === 'edit' ? 'Salva modifiche' : undefined}
        backLabel={mode === 'edit' ? 'Annulla' : undefined}
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
                {isWizard ? 'Grimorio' : 'Incantesimi'}: {selectedSpells.length}/{isWizard ? wizardSpellbookSize : spellsAllowed}
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
                lockedIds={mode === 'edit' ? existingSpellIds : []}
              />
            </>
          )}

          {(spellsAllowed > 0 || isWizard) && (
            <div className="space-y-4">
              {Array.from({ length: maxSpellLevel }, (_, i) => i + 1).map((lvl) => {
                const spellsForLevel = spellsByLevel[lvl]?.filter((s) =>
                  s.name.toLowerCase().includes(searchSpells.toLowerCase()),
                ) ?? [];
                if (spellsForLevel.length === 0) return null;

                return (
                  <SpellSection
                    key={`lvl-${lvl}`}
                    title={isWizard ? `Grimorio — livello ${lvl}` : `Incantesimi livello ${lvl}`}
                    icon={<BookOpen className="w-4 h-4" />}
                    selected={selectedSpells}
                    max={isWizard ? wizardSpellbookSize : spellsAllowed}
                    spells={spellsForLevel}
                    onToggle={(s) => toggle(s, 'spell')}
                    onDetail={setDetailSpell}
                    lockedIds={mode === 'edit' ? existingSpellIds : []}
                  />
                );
              })}
            </div>
          )}
        </div>
      </WizardStep>
      <SpellDetailDialog spell={detailSpell} open={detailSpell !== null} onClose={() => setDetailSpell(null)} />
    </>
  );
}

interface SpellSectionProps {
  title: string;
  icon: React.ReactNode;
  spells: Spell[];
  selected: string[];
  max: number;
  lockedIds?: string[];
  onToggle: (spell: Spell) => void;
  onDetail: (spell: Spell) => void;
}

function SpellSection({
  title,
  icon,
  spells,
  selected,
  max,
  lockedIds = [],
  onToggle,
  onDetail,
}: SpellSectionProps) {
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
            const idStr = String(spell.id);
            const isSelected = selected.includes(idStr);
            const isLocked = lockedIds.includes(idStr);
            const selectedInSection = selected.filter((id) =>
              spells.some((s) => String(s.id) === id)
            ).length;
            const isDisabled = isLocked || (!isSelected && selectedInSection >= max);

            return (
              <button
                key={spell.id}
                type="button"
                onClick={() => !isLocked && onToggle(spell)}
                disabled={isDisabled && !isLocked}
                title={isLocked ? 'Incantesimo già conosciuto — rimuovilo dalla scheda del personaggio' : undefined}
                className={cn(
                  'flex items-start gap-2 p-2 rounded-lg border text-left transition-all',
                  isSelected && isLocked
                    ? 'border-amber-300 bg-amber-50/50 text-amber-700 cursor-default'
                    : isSelected
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : isDisabled
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-amber-200 hover:border-amber-400 hover:bg-amber-50/50 text-amber-800',
                )}
              >
                {isLocked
                  ? <Lock className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
                  : <CheckCircle2
                      className={cn(
                        'w-4 h-4 mt-0.5 shrink-0',
                        isSelected ? 'text-amber-600' : 'text-gray-300',
                      )}
                    />
                }
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