"use client";

import React, { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ItemPicker } from '@/components/custom/ItemPicker';
import { useInventoryMutations } from '@/hooks/mutations/useInventoryMutations';

type PendingItem = { item_id: number; name: string; quantity: number };

export default function AddItemsModal({ characterIdFromItems }: { characterIdFromItems?: string }) {
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
      /* toast gestito dal global onError in providers.tsx */
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
