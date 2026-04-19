// components/character/sheet/Spellbook.tsx
'use client';

import { useState } from 'react';
import { useCharacterSpells, useCharacterSpellSlots, useCharacterPreparedSpells } from '@/hooks/queries/useSpells';
import { useAddCharacterSpells, useRemoveCharacterSpells, useAddPreparedSpells, useRemovePreparedSpells, usePatchSpellSlot, useLongRestSpellSlots } from '@/hooks/mutations/useCharacterSpellMutations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SpellsStep } from '@/components/character/creation-wizard/steps/SpellsStep';
import SpellDetailDialog from '@/components/custom/SpellDetailDialog';
import SpellSlotsManager from '@/components/custom/SpellSlotsManager';
import { getItalianSchool, schoolBadgeColors } from '@/lib/utils/nameMappers';
import { BookOpen, Trash, Check, Sparkles, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { Spell, SpellKnown, PreparedSpell, SpellSlot } from '@/types/spell';

interface SpellbookProps {
  characterId: string;
  classId: number;
  characterLevel: number;
  intelligenceScore?: number;
  wisdomScore?: number;
  charismaScore?: number;
  isPreparer?: boolean;
  onSpellsChange?: () => void;
}



export default function Spellbook({
  characterId,
  classId,
  characterLevel,
  intelligenceScore = 10,
  isPreparer = false,
  onSpellsChange,
}: SpellbookProps) {
  const [managing, setManaging] = useState(false);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);

  const { data: spellsKnown, isLoading } = useCharacterSpells(characterId);
  const { data: spellSlots } = useCharacterSpellSlots(characterId);
  const { data: preparedSpells } = useCharacterPreparedSpells(isPreparer ? characterId : null);
  const addSpells = useAddCharacterSpells();
  const removeSpells = useRemoveCharacterSpells();
  const addPrepared = useAddPreparedSpells();
  const removePrepared = useRemovePreparedSpells();
  const patchSlot = usePatchSpellSlot();
  const longRest = useLongRestSpellSlots();

  const existingSpellIds = (spellsKnown ?? []).map((sk: SpellKnown) => String(sk.spell_id));
  const preparedSpellIds = new Set((preparedSpells ?? []).map((p: PreparedSpell) => p.spell_id));

  const handleSaveSpells = async (selectedIds: string[]) => {
    try {
      const toAdd = selectedIds.filter((id: string) => !existingSpellIds.includes(id)).map(Number);
      const toRemove = existingSpellIds.filter((id: string) => !selectedIds.includes(id)).map(Number);
      if (toAdd.length > 0) await addSpells.mutateAsync({ characterId, spellIds: toAdd });
      if (toRemove.length > 0) await removeSpells.mutateAsync({ characterId, spellIds: toRemove });
      setManaging(false);
      onSpellsChange?.();
      toast.success('Incantesimi aggiornati');
    } catch { /* gestito dal global onError */ }
  };

  const handleRemoveSpell = async (knownId: string, spellName: string) => {
    try {
      await removeSpells.mutateAsync({ characterId, knownIds: [knownId] });
      toast.success(`${spellName} rimosso`);
      onSpellsChange?.();
    } catch { /* gestito dal global onError */ }
  };

  const handleTogglePrepared = async (spellId: number, currentlyPrepared: boolean) => {
    try {
      if (currentlyPrepared) {
        await removePrepared.mutateAsync({ characterId, spellIds: [spellId] });
        toast.success('Incantesimo rimosso dai preparati');
      } else {
        await addPrepared.mutateAsync({ characterId, spellIds: [spellId] });
        toast.success('Incantesimo preparato!');
      }
    } catch { /* gestito dal global onError */ }
  };

  if (isLoading) {
    return <p className="text-amber-700 text-center py-4">Caricamento incantesimi...</p>;
  }

  const cantrips = (spellsKnown ?? []).filter((sk: SpellKnown) => sk.spell?.level === 0);
  const leveledSpells = (spellsKnown ?? []).filter((sk: SpellKnown) => (sk.spell?.level ?? 0) > 0);
  const byLevel: Record<number, SpellKnown[]> = {};

  for (const sk of leveledSpells) {
    const lvl = sk.spell?.level ?? 1;
    if (!byLevel[lvl]) byLevel[lvl] = [];
    byLevel[lvl].push(sk);
  }

  type SlotEntry = { level: number; total: number; used: number };
  const slotsForManager: SlotEntry[] = (spellSlots as SpellSlot[] ?? []).map((slot: SpellSlot) => ({
    level: slot.spell_level,
    total: slot.total_slots,
    used: slot.used_slots,
  }));

  // Testo descrittivo per l'header (cantrip e spell separati come nel dialog)
  const knownSummary = [
    cantrips.length > 0 ? `${cantrips.length} trucchett${cantrips.length !== 1 ? 'i' : 'o'}` : null,
    leveledSpells.length > 0 ? `${leveledSpells.length} incantesim${leveledSpells.length !== 1 ? 'i' : 'o'}` : null,
  ].filter(Boolean).join(' · ') || 'Nessun incantesimo';

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-amber-700">
            {knownSummary}
            {isPreparer && (
              <span className="ml-2 text-amber-500">
                · {preparedSpellIds.size} preparat{preparedSpellIds.size !== 1 ? 'i' : 'o'}
              </span>
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-amber-300 text-amber-800 hover:bg-amber-50"
          onClick={() => setManaging(true)}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Gestisci Incantesimi
        </Button>
      </div>

      {/* Spell Slots Manager */}
      {spellSlots && spellSlots.length > 0 && (
        <SpellSlotsManager
          slots={slotsForManager}
          onUpdate={async (updatedSlots) => {
            // Trova lo slot che è cambiato e invia il PATCH
            for (const updated of updatedSlots) {
              const current = slotsForManager.find(s => s.level === updated.level);
              if (current && current.used !== updated.used) {
                await patchSlot.mutateAsync({
                  characterId,
                  spell_level: updated.level,
                  used_slots: updated.used,
                });
              }
            }
          }}
          onLongRest={async () => {
            await longRest.mutateAsync({
              characterId,
              slots: slotsForManager.map(s => ({ spell_level: s.level, total_slots: s.total })),
            });
            toast.success('Riposo lungo completato — slot ripristinati');
          }}
          showRefresh
        />
      )}

      {/* Lista incantesimi */}
      {(!spellsKnown || spellsKnown.length === 0) ? (
        <p className="text-amber-700 text-center py-8">Nessun incantesimo conosciuto</p>
      ) : (
        <div className="space-y-6 mt-4">
          {/* Cantrips */}
          {cantrips.length > 0 && (
            <section>
              <h4 className="text-md fantasy-title mb-2 pb-1 border-b border-amber-200 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Trucchetti
              </h4>
              <div className="space-y-2">
                {cantrips.map((sk: SpellKnown) => sk.spell && (
                  <SpellRow
                    key={sk.id}
                    spell={sk.spell}
                    onView={setSelectedSpell}
                    onDelete={() => handleRemoveSpell(sk.id, sk.spell?.name ?? 'incantesimo')}
                    isPrepared={false}
                    showPrepare={false}
                    onTogglePrepare={() => {}}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Leveled spells */}
          {Object.keys(byLevel)
            .map(Number)
            .sort((a, b) => a - b)
            .map((lvl) => (
              <section key={lvl}>
                <div className="flex justify-between items-baseline mb-2 pb-1 border-b border-amber-200">
                  <h4 className="text-md fantasy-title">
                    Livello {lvl}
                  </h4>
                  {/* Mostra slot disponibili per questo livello */}
                  {slotsForManager.find(s => s.level === lvl) && (
                    <span className="text-xs text-amber-600">
                      Slot: {slotsForManager.find(s => s.level === lvl)?.used || 0}/
                      {slotsForManager.find(s => s.level === lvl)?.total || 0}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {byLevel[lvl].map((sk: SpellKnown) => sk.spell && (
                    <SpellRow
                      key={sk.id}
                      spell={sk.spell}
                      onView={setSelectedSpell}
                      onDelete={() => handleRemoveSpell(sk.id, sk.spell?.name ?? 'incantesimo')}
                      isPrepared={preparedSpellIds.has(sk.spell_id)}
                      showPrepare={isPreparer && (sk.spell?.level ?? 0) > 0}
                      onTogglePrepare={() => handleTogglePrepared(sk.spell_id, preparedSpellIds.has(sk.spell_id))}
                    />
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}

      {/* Dialog gestione incantesimi */}
      <Dialog open={managing} onOpenChange={setManaging}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-serif text-amber-900">Gestisci Incantesimi</DialogTitle>
          </DialogHeader>
          <SpellsStep
            classId={classId}
            characterLevel={characterLevel}
            intelligenceScore={intelligenceScore}
            mode="edit"
            existingSpellIds={existingSpellIds}
            initialSelectedSpells={existingSpellIds}
            onBack={() => setManaging(false)}
            onConfirm={handleSaveSpells}
          />
        </DialogContent>
      </Dialog>

      {/* Dettaglio incantesimo */}
      <SpellDetailDialog
        spell={selectedSpell}
        open={selectedSpell !== null}
        onClose={() => setSelectedSpell(null)}
      />
    </>
  );
}

// Componente riga incantesimo con tasto PREPARA
function SpellRow({
  spell,
  onView,
  onDelete,
  isPrepared,
  showPrepare,
  onTogglePrepare,
}: {
  spell: Spell;
  onView: (spell: Spell) => void;
  onDelete: () => void;
  isPrepared: boolean;
  showPrepare: boolean;
  onTogglePrepare: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const schoolKey = spell.school;
  const schoolColor = schoolBadgeColors[schoolKey] ?? 'bg-gray-100 text-gray-800';

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleting(true);
    await onDelete();
    setDeleting(false);
  };

  return (
    <div
      onClick={() => onView(spell)}
      className="w-full p-3 bg-amber-50 rounded-lg border border-amber-100 hover:bg-amber-100 hover:border-amber-300 transition-colors cursor-pointer flex items-start justify-between"
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-amber-900">{spell.name}</span>
          <Badge className={`text-xs ${schoolColor}`}>{getItalianSchool(spell.school)}</Badge>
          {spell.ritual && <Badge className="text-xs bg-emerald-100 text-emerald-800">Rituale</Badge>}
          {spell.concentration && <Badge className="text-xs bg-orange-100 text-orange-800">Concentrazione</Badge>}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-amber-700 mt-1">
          {spell.casting_time && <span>⏱ {spell.casting_time}</span>}
          {spell.range && <span>🎯 {spell.range}</span>}
          {spell.duration && <span>⏳ {spell.duration}</span>}
        </div>
      </div>

      <div className="flex items-center gap-1 ml-4" onClick={(e) => e.stopPropagation()}>
        {/* Tasto PREPARA - visibile solo per classi che preparano incantesimi */}
        {showPrepare && (
          <Button
            size="sm"
            variant={isPrepared ? "default" : "outline"}
            className={cn(
              "h-7 px-2 text-xs",
              isPrepared 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "border-amber-300 text-amber-700 hover:bg-amber-100"
            )}
            onClick={onTogglePrepare}
          >
            {isPrepared ? <Check className="w-3 h-3 mr-1" /> : <Star className="w-3 h-3 mr-1" />}
            {isPrepared ? "Preparato" : "Prepara"}
          </Button>
        )}
        
        {/* Tasto ELIMINA */}
        <Button
          size="icon"
          variant="ghost"
          onClick={handleDelete}
          disabled={deleting}
          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

// Utility per cn (se non hai già importato)
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}