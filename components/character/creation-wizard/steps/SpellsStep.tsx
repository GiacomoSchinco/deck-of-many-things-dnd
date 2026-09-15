// components/character/creation-wizard/steps/SpellsStep.tsx
'use client';

import { useState, useMemo } from 'react';
import { useClass } from '@/hooks/queries/useClasses';
import { useSpells } from '@/hooks/queries/useSpells';
import { getSpellProgression, SpellCastingClass, SPELLCASTING_CLASSES, PREPARER_CLASSES } from '@/lib/rules/spellcasting';
import { getEnglishClass } from '@/lib/utils/nameMappers';
import { getSchoolMeta } from '@/lib/theme/schools';
import { SelectableCard } from '@/components/ui/selectable-card';
import { useCreationStore } from '@/store/useCreationStore';
import { WizardStep } from '../WizardStep';
import Loading from '@/components/custom/Loading';
import { Badge } from '@/components/ui/badge';
import { SpellDetailButton } from '@/components/shared/SpellDetailButton';
import { SpellSearchInput } from '@/components/shared/SpellSearchInput';
import { SpellFlagBadges } from '@/components/shared/SpellSummary';
import { useSpellDetailDialog } from '@/hooks/useSpellDetailDialog';
import { cn, filterByName } from '@/lib/utils';
import { Sparkles, BookOpen, Info, Lock } from 'lucide-react';
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




export function SpellsStep({
  classId,
  // intelligenceScore: accettato per compatibilità ma non usato internamente
  // existingSpellIds: accettato per compatibilità ma non usato (nessun lock in edit mode)
  mode = 'create',
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
  const { openDetail, dialogProps: spellDialogProps } = useSpellDetailDialog();

  const englishClassName = classData ? getEnglishClass(classData.name) : null;
  const savedLevel = useCreationStore((s) => s.data?.level ?? 1);
  const effectiveLevel = characterLevel ?? savedLevel;

  const isPreparerClass = englishClassName ? (PREPARER_CLASSES as readonly string[]).includes(englishClassName) : false;
  const isWizard = englishClassName === 'wizard';
  const hasSpellcasting = !!classData?.spellcasting;

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

  const wizardSpellbookSize = isWizard
    ? (mode === 'create'
        ? 6  // Al livello 1: 6 spell nel grimorio di partenza
        : 6 + Math.max(0, effectiveLevel - 1) * 2)  // Livello N: 6 + 2*(N-1) attesi
    : 0;

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

  const filteredCantrips = filterByName<Spell>(cantrips, searchCantrips);

  const toggle = (spell: Spell, type: 'cantrip' | 'spell') => {
    const idStr = String(spell.id);
    const isSelected = selected.includes(idStr);

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
                <SpellSearchInput
                  value={searchCantrips}
                  onChange={setSearchCantrips}
                  placeholder="Cerca trucchetti..."
                />
                <SpellSection
                title={mode === 'edit' ? `Trucchetti conosciuti (max ${cantripsAllowed})` : `Trucchetti — scegli ${cantripsAllowed}`}
                  icon={<Sparkles className="w-4 h-4" />}
                  selected={selectedCantrips}
                  max={cantripsAllowed}
                  spells={filteredCantrips}
                  onToggle={(s) => toggle(s, 'cantrip')}
                  onDetail={openDetail}
                  lockedIds={[]}
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
        <SpellDetailDialog {...spellDialogProps} />
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
          <SpellSearchInput value={searchSpells} onChange={setSearchSpells} />
          <div className="flex gap-3 text-sm flex-wrap">
            {cantripsAllowed > 0 && (
              <span className={cn(
                'px-2 py-0.5 rounded-full font-medium',
                selectedCantrips.length === cantripsAllowed
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700',
              )}>
                Trucchetti: {selectedCantrips.length}/{cantripsAllowed}
              </span>
            )}
            {(spellsAllowed > 0 || isWizard) && (
              <span className={cn(
                'px-2 py-0.5 rounded-full font-medium',
                selectedSpells.length >= (isWizard ? wizardSpellbookSize : spellsAllowed)
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
              <SpellSearchInput
                value={searchCantrips}
                onChange={setSearchCantrips}
                placeholder="Cerca trucchetti..."
                className="mb-2"
              />
              <SpellSection
                title={mode === 'edit' ? `Trucchetti conosciuti (max ${cantripsAllowed})` : `Trucchetti — scegli ${cantripsAllowed}`}
                icon={<Sparkles className="w-4 h-4" />}
                selected={selectedCantrips}
                max={cantripsAllowed}
                spells={filteredCantrips}
                onToggle={(s) => toggle(s, 'cantrip')}
                onDetail={openDetail}
                lockedIds={[]}
              />
            </>
          )}

          {(spellsAllowed > 0 || isWizard) && (
            <div className="space-y-4">
              {Array.from({ length: maxSpellLevel }, (_, i) => i + 1).map((lvl) => {
                const spellsForLevel = filterByName<Spell>(spellsByLevel[lvl] ?? [], searchSpells);
                if (spellsForLevel.length === 0) return null;

                return (
                  <SpellSection
                    key={`lvl-${lvl}`}
                    title={mode === 'edit'
                      ? `Incantesimi livello ${lvl}`
                      : (isWizard ? `Grimorio — livello ${lvl}` : `Incantesimi livello ${lvl}`)}
                    icon={<BookOpen className="w-4 h-4" />}
                    selected={selectedSpells}
                    max={isWizard ? wizardSpellbookSize : spellsAllowed}
                    spells={spellsForLevel}
                    onToggle={(s) => toggle(s, 'spell')}
                    onDetail={openDetail}
                    lockedIds={[]}
                  />
                );
              })}
            </div>
          )}
        </div>
      </WizardStep>
      <SpellDetailDialog {...spellDialogProps} />
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
              <div key={spell.id} className="flex items-stretch gap-1.5">
                <SelectableCard
                  multiple
                  size="sm"
                  selected={isSelected}
                  disabled={isDisabled}
                  onClick={() => onToggle(spell)}
                  className="flex flex-1 items-start gap-2"
                >
                  {isLocked && (
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink-strong">{spell.name}</span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-1">
                      {spell.school && (
                        <Badge className={cn('text-xs py-0 h-4', getSchoolMeta(spell.school).badge)}>
                          {getSchoolMeta(spell.school).it}
                        </Badge>
                      )}
                      <SpellFlagBadges spell={spell} variant="compact" />
                      {isLocked && <span className="text-xs text-ink-muted">già conosciuto</span>}
                    </span>
                  </span>
                </SelectableCard>

                {/* Il comando "dettagli" sta FUORI dall'area selezionabile: prima
                    era annidato dentro di essa (comando dentro comando: HTML non
                    valido, click ambiguo, illecito per gli screen reader). */}
                <SpellDetailButton spellName={spell.name} onOpen={() => onDetail(spell)} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SpellsStep;