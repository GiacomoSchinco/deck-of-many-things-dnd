"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DataTable from './DataTable';
import type { InventoryItem } from '@/types/inventory';
import { useInventoryMutations } from '@/hooks/mutations/useInventoryMutations';
import { toast } from 'sonner';
import { getItalianItemType } from '@/lib/utils/nameMappers';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
type Props = {
  items?: InventoryItem[];
  onRowClick?: (item: InventoryItem) => void;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (item: InventoryItem) => void;
  pagination?: boolean;
  hideType?: boolean;
};

export default function InventoryTable({ items = [], onRowClick, onEdit, onDelete, pagination, hideType = false }: Props) {
  const [localData, setLocalData] = useState<Record<string, unknown>[]>(() => (items as unknown as Record<string, unknown>[]));
  const params = useParams();
  const routeCharacterId = params?.characterId as string | undefined;
  const characterIdForMutations = routeCharacterId ?? (items?.[0]?.character_id as string | undefined) ?? undefined;
  const inventoryMutations = useInventoryMutations(characterIdForMutations ?? null);

  useEffect(() => { Promise.resolve().then(() => setLocalData(items as unknown as Record<string, unknown>[])); }, [items]);

  function DeleteButton({ row }: { row: Record<string, unknown> }) {
    const id = String(row['id'] ?? '')
    const name = String(row['item_name'] ?? 'oggetto')
    const [confirming, setConfirming] = useState(false)

    const handleDelete = async () => {
      if (!id) return
      setLocalData((prev) => prev.filter((r) => String(r['id'] ?? '') !== id))
      try {
        if (inventoryMutations?.delete) {
          await inventoryMutations.delete.mutateAsync(id)
          toast.success(`«${name}» rimosso dall'inventario`)
        }
        if (onDelete) onDelete(row as unknown as InventoryItem)
      } catch (e) {
        console.error('Errore delete inventory:', e)
        setLocalData(items as unknown as Record<string, unknown>[])
        toast.error('Errore eliminazione oggetto')
      }
    }

    if (confirming) {
      return (
        <div className="flex items-center gap-1">
          <Button size="sm" variant="destructive" onClick={() => { void handleDelete() }}>Conferma</Button>
          <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>Annulla</Button>
        </div>
      )
    }

    return (
      <Button
        size="sm"
        variant="ghost"
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={() => setConfirming(true)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    )
  }

  function QuantityEditor({ row }: { row: Record<string, unknown> }) {
    const id = String(row['id'] ?? '')
    const baseQty = Number(row['quantity'] ?? 0)
    const [value, setValue] = useState<number>(baseQty)
    const [dirty, setDirty] = useState(false)

    // reset when source changes
    useEffect(() => { setValue(baseQty); setDirty(false); }, [baseQty])

    const apply = async () => {
      const newQty = Math.max(1, Math.trunc(Number(value)))
      if (!id) {
        console.error('Attempted to update inventory row without id', { row })
        toast.error('ID riga mancante — impossibile aggiornare')
        return
      }
      const prev = localData
      setLocalData((prevData) => prevData.map((r) => (String(r['id'] ?? '') === id ? { ...r, quantity: newQty } : r)))
      try {
        if (inventoryMutations?.update) {
          await inventoryMutations.update.mutateAsync({ id, data: { quantity: newQty } })
          toast.success('Quantità aggiornata')
        } else {
          toast.success('Aggiornamento locale')
        }
        if (onEdit) {
          const updated = { ...(row as Record<string, unknown>), quantity: newQty } as unknown as InventoryItem
          onEdit(updated)
        }
        setDirty(false)
      } catch (e) {
        console.error('Errore update inventory quantity:', e)
        setLocalData(prev)
        toast.error('Errore salvataggio quantità')
      }
    }

    const cancel = () => { setValue(baseQty); setDirty(false) }

    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          className="w-20"
          value={String(value)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => { const v = Number(e.target.value || 1); setValue(Math.max(1, Math.trunc(v))); setDirty(Math.trunc(v) !== baseQty) }}
        />
        {dirty ? (
          <div className="flex gap-2">
            <Button size="sm" onClick={apply}>Applica</Button>
            <Button size="sm" variant="ghost" onClick={cancel}>Annulla</Button>
          </div>
        ) : null}
      </div>
    )
  }
  return (
    <DataTable
      initialData={localData}
      columns={[
        { key: 'item_name', label: 'Nome' },
        {
          key: 'quantity', label: 'Quantità',
          render: (_v, row) => <QuantityEditor row={row as Record<string, unknown>} />,
        },
        ...(!hideType ? [{ key: 'item_type', label: 'Tipo', render: (v: unknown) => getItalianItemType(String(v ?? '')) }] : []),
        {
          key: 'info', label: 'Info',
          render: (_v, row) => {
            const p = (row?.['properties'] ?? {}) as Record<string, unknown> | undefined;
            if (!p) return '—';

            // Weapon: damage + damageType + properties
            if (p.itemType === 'weapon') {
              const parts: string[] = [];
              if (p.damage) parts.push(String(p.damage));
              if (p.damageType) parts.push(String(p.damageType));
              if (Array.isArray(p.properties) && p.properties.length) parts.push((p.properties as string[]).join(', '));
              return parts.length ? parts.join(' · ') : '—';
            }

            // Armor: CA, type, +DES, FOR
            if (p.itemType === 'armor') {
              const parts: string[] = [];
              if (p.armorClass) parts.push(`CA ${String(p.armorClass)}`);
              if (p.armorType) parts.push(String(p.armorType));
              if (p.addsDexModifier) parts.push('+DES');
              if (p.strengthRequirement) parts.push(`FOR ${String(p.strengthRequirement)}+`);
              return parts.length ? parts.join(' · ') : '—';
            }

            // Generic: join properties array
            if (Array.isArray(p.properties) && p.properties.length) return (p.properties as string[]).join(', ');
            return '—';
          },
        },
        {
          key: 'description', label: 'Descrizione',
          render: (v, row) => {
            const p = (row?.['properties'] ?? {}) as Record<string, unknown> | undefined;
            const base = String(v ?? '');
            const parts: string[] = [];

            // Avoid duplicating damage/damageType in description (they have their own column now)
            if (p?.itemType === 'weapon') {
              if (Array.isArray(p.properties)) parts.push(...(p.properties as string[]));
            } else if (p?.itemType === 'armor') {
              // Armor-specific: don't duplicate armor props (they have their own column)
              // keep description as-is
            } else {
              if (Array.isArray(p?.properties)) parts.push(...(p!.properties as string[]));
            }

            return base + (parts.length ? ` (${parts.join(' · ')})` : '');
          },
        },
        { key: 'weight', label: 'Peso' },
        {
          key: 'equipped', label: 'Equipaggiato',
          render: (_v, row) => {
            const id = String((row as Record<string, unknown>)['id'] ?? '');
            const current = Boolean((row as Record<string, unknown>)['equipped']);

            const toggle = async () => {
              const newVal = !current;
              // optimistic update
              const prev = localData;
              setLocalData((prevData) => prevData.map((r) => (String(r['id'] ?? '') === id ? { ...r, equipped: newVal } : r)));

              // call mutation if available
              try {
                if (inventoryMutations?.update) {
                  await inventoryMutations.update.mutateAsync({ id, data: { equipped: newVal } });
                  toast.success('Stato equipaggiato aggiornato');
                } else {
                  // no mutation available — still notify caller
                  toast.success('Aggiornamento locale');
                }
                // notify caller if provided
                if (onEdit) {
                  const updated = { ...(row as Record<string, unknown>), equipped: newVal } as unknown as InventoryItem;
                  onEdit(updated);
                }
              } catch (e) {
                // rollback
                console.error('Errore update inventory equipped:', e);
                setLocalData(prev);
                toast.error('Errore salvataggio equipaggiamento');
              }
            };

            return (
              <label className="inline-flex items-center gap-2">
                <Checkbox checked={current} onCheckedChange={() => { void toggle(); }} />
              </label>
            );
          },
        },
        {
          key: 'actions', label: '',
          render: (_v, row) => <DeleteButton row={row as Record<string, unknown>} />,
        },
      ]}
      onRowClick={onRowClick ? (_, row) => onRowClick(row as unknown as InventoryItem) : undefined}
      onEdit={onEdit ? (_, row) => onEdit(row as unknown as InventoryItem) : undefined}
      onDelete={onDelete ? (_, row) => onDelete(row as unknown as InventoryItem) : undefined}
      pagination={pagination}
    />
  );
}
