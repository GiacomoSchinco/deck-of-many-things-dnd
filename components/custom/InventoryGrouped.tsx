"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Package, Shield, Swords, FlaskConical, Wrench, Coins, ArrowUpDown } from 'lucide-react';
import AddItemsModal from './AddItemsModal';
import InventoryTable from './InventoryTable';
import type { InventoryItem } from '@/types/inventory';
import { getItalianItemType } from '@/lib/utils/nameMappers';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

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
    const t = (it as InventoryItem).type ?? 'gear';
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