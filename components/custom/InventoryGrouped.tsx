"use client";

import React, { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ItemPicker } from '@/components/custom/ItemPicker';
import { useInventoryMutations } from '@/hooks/mutations/useInventoryMutations';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Package, Shield, Swords, FlaskConical, Wrench, Coins, ArrowUpDown } from 'lucide-react';
import InventoryTable from './InventoryTable';
import type { InventoryItem } from '@/types/inventory';
import { getItalianItemType } from '@/lib/utils/nameMappers';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type PendingItem = { item_id: number; name: string; quantity: number };

type Props = {
  items?: InventoryItem[];
  onRowClick?: (item: InventoryItem) => void;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (item: InventoryItem) => void;
};

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_ORDER = ['weapon', 'armor', 'gear', 'consumable', 'ammunition', 'tool', 'currency'];

const TYPE_ICONS: Record<string, React.ElementType> = {
  weapon: Swords, armor: Shield, gear: Package,
  consumable: FlaskConical, ammunition: ArrowUpDown, tool: Wrench, currency: Coins,
};

const TYPE_COLORS: Record<string, string> = {
  weapon:     'border-red-800/30 hover:border-red-700/50',
  armor:      'border-blue-800/30 hover:border-blue-700/50',
  gear:       'border-amber-800/30 hover:border-amber-700/50',
  consumable: 'border-green-800/30 hover:border-green-700/50',
  ammunition: 'border-yellow-800/30 hover:border-yellow-700/50',
  tool:       'border-purple-800/30 hover:border-purple-700/50',
  currency:   'border-amber-600/30 hover:border-amber-500/50',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InventoryGrouped({ items = [], onRowClick, onEdit, onDelete }: Props) {
  const groups = items.reduce<Record<string, InventoryItem[]>>((acc, it) => {
    const t = (it as any).type ?? 'gear';
    (acc[t] ??= []).push(it);
    return acc;
  }, {});

  const types = Object.keys(groups).sort(
    (a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b)
  );

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <AddItemsModal characterIdFromItems={items[0]?.character_id} />
      </div>

      {types.length === 0 ? (
        <div className="text-center py-12 bg-amber-50/30 rounded-lg border border-amber-200">
          <Package className="w-12 h-12 mx-auto text-amber-400 mb-3 opacity-50" />
          <p className="text-amber-600 text-sm font-serif">Nessun oggetto nell&apos;inventario</p>
          <p className="text-amber-400 text-xs mt-1">La tua bisaccia è vuota...</p>
        </div>
      ) : (
        <Accordion className="space-y-3">
          {types.map((t) => {
            const Icon = TYPE_ICONS[t] ?? Package;
            return (
              <AccordionItem
                value={t} key={t}
                className={cn(
                  'rounded-lg border bg-gradient-to-br from-amber-50/80 to-amber-100/40',
                  'overflow-hidden transition-all duration-300 data-[state=open]:shadow-md',
                  TYPE_COLORS[t],
                )}
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-amber-900/5 group transition-all duration-200">
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <div className="p-2 rounded-lg bg-amber-900/10 border border-amber-700/20 group-hover:scale-110 transition-transform duration-200">
                      <Icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-serif font-bold text-amber-900 text-lg">
                      {getItalianItemType(t)}
                      <span className="ml-2 text-xs text-amber-600/70 font-normal">({groups[t].length})</span>
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-0">
                  <div className="border-t border-amber-700/20 pt-4 mt-2">
                    <InventoryTable items={groups[t]} onRowClick={onRowClick} onEdit={onEdit} onDelete={onDelete} pagination hideType />
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}

// ─── Add Items Modal ──────────────────────────────────────────────────────────

function AddItemsModal({ characterIdFromItems }: { characterIdFromItems?: string }) {
  const params = useParams();
  const characterId = (params?.characterId as string | undefined) ?? characterIdFromItems ?? null;
  const { create } = useInventoryMutations(characterId);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedName, setSelectedName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState<PendingItem[]>([]);

  const handleClose = useCallback(() => {
    setSelectedId(null);
    setSelectedName('');
    setQuantity(1);
    setPending([]);
    setOpen(false);
  }, []);

  const addToPending = useCallback(() => {
    if (!selectedId) return toast.error('Seleziona prima un oggetto');
    setPending((prev) => {
      const existing = prev.find((p) => p.item_id === selectedId);
      if (existing) return prev.map((p) => p.item_id === selectedId ? { ...p, quantity: p.quantity + quantity } : p);
      return [...prev, { item_id: selectedId, name: selectedName, quantity }];
    });
    setSelectedId(null);
    setSelectedName('');
    setQuantity(1);
  }, [selectedId, selectedName, quantity]);

  const removePending = useCallback(
    (id: number) => setPending((prev) => prev.filter((p) => p.item_id !== id)),
    []
  );

  const updateQty = useCallback(
    (id: number, q: number) => setPending((prev) => prev.map((p) => p.item_id === id ? { ...p, quantity: Math.max(1, Math.trunc(q)) } : p)),
    []
  );

  const handleAddAll = useCallback(async () => {
    if (!pending.length) return toast.error('Aggiungi almeno un oggetto alla lista');
    try {
      // Il server farà il lookup dal catalogo — mandiamo solo item_id + quantity
      await create.mutateAsync({
        characterId,
        items: pending.map(({ item_id, quantity }) => ({ item_id, quantity })),
      });
      toast.success("Oggetti aggiunti all'inventario");
      handleClose();
    } catch (e) {
      console.error(e);
      toast.error('Errore aggiunta oggetti');
    }
  }, [pending, create, characterId, handleClose]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={
          <Button variant="outline" className="text-amber-800 border-amber-700/30 hover:bg-amber-100">
            Aggiungi oggetto
          </Button>
        } />
      <DialogContent className="max-w-2xl w-[90vw]">
        <div className="p-4 space-y-4">
          <h3 className="text-lg font-semibold text-amber-900">Aggiungi oggetti</h3>

          <ItemPicker
            value={selectedId}
            onSelect={(it) => { setSelectedId(it.id); setSelectedName(it.name); }}
            placeholder="Cerca e seleziona un oggetto"
            buttonVariant="default"
          />

          <div className="flex items-center gap-3">
            <div className="w-40">
              <label className="text-xs text-amber-600 block mb-1">Quantità</label>
              {/* <Input type="number" value={String(quantity)} onChange={(e) => setQuantity(Math.max(1, Math.trunc(Number(e.target.value || 1))))} /> */}
            </div>
            <div className="flex-1" />
            <Button onClick={addToPending} disabled={!selectedId}>Aggiungi alla lista</Button>
          </div>

          <div>
            <h4 className="text-sm font-medium text-amber-800 mb-2">Da aggiungere ({pending.length})</h4>
            {pending.length === 0 ? (
              <p className="text-sm text-amber-500">Nessun oggetto nella lista</p>
            ) : (
              <div className="space-y-2">
                {pending.map((p) => (
                  <div key={p.item_id} className="flex items-center gap-3 p-2 rounded border bg-amber-50/50">
                    <span className="flex-1 font-medium text-amber-900">{p.name}</span>
                    <div className="w-24">
                      <Input type="number" value={String(p.quantity)} onChange={(e) => updateQty(p.item_id, Number(e.target.value || 1))} />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removePending(p.item_id)}>Rimuovi</Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-amber-200">
            <Button variant="outline" onClick={handleClose}>Chiudi</Button>
            <Button onClick={() => { void handleAddAll(); }} disabled={!pending.length}>
              Aggiungi tutti ({pending.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}