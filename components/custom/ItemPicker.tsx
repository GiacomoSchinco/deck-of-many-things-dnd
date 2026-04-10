// components/ui/ItemPicker.tsx
'use client';

import { useState } from 'react';
import { useItems , useItem } from '@/hooks/queries/useItems';
import type {
  Item,
  ItemType,
  PickerItemData,
} from '@/types/item';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  X,
  ChevronDown,
  Check,
  Package,
  Weight,
  Coins,
  Grid2x2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ItemPropertiesDetail } from '@/components/custom/ItemPropertiesDetail';
import { cn } from '@/lib/utils';

// Estensione locale per il filtro 'all' (non presente in ItemType del catalogo)
type ItemTypeFilter = ItemType | 'all';

interface ItemPickerProps {
  value?: number | null;
  name?: string;
  onSelect: (item: PickerItemData) => void;
  type?: ItemTypeFilter;
  placeholder?: string;
  disabled?: boolean;
  showDetails?: boolean;
  className?: string;
  buttonVariant?: 'default' | 'compact' | 'minimal';
}


const typeLabels: Record<ItemTypeFilter, string> = {
  weapon: '⚔️ Armi',
  armor: '🛡️ Armature',
  gear: '🎒 Equipaggiamento',
  consumable: '🧪 Consumabili',
  ammunition: '🏹 Munizioni',
  tool: '🔧 Attrezzi',
  currency: '💰 Valuta',
  all: '📦 Tutti'
};

const typeIcons: Record<ItemTypeFilter, string> = {
  weapon: '⚔️',
  armor: '🛡️',
  gear: '🎒',
  consumable: '🧪',
  ammunition: '🏹',
  tool: '🔧',
  currency: '💰',
  all: '📦'
};

export function ItemPicker({
  value,
  name,
  onSelect,
  type = 'all' as ItemTypeFilter,
  placeholder = 'Seleziona un oggetto...',
  disabled = false,
  showDetails = true,
  className = '',
  buttonVariant = 'default'
}: ItemPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [itemType, setItemType] = useState<ItemTypeFilter>(type);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const { data: items, isLoading } = useItems({
    type: itemType === 'all' ? undefined : (itemType as ItemType),
    search: search || undefined,
  });

  // Fetch the item by id when a value is provided (e.g. editing an existing preset).
  // Use the shared `useItem` hook which handles caching and staleTime.
  const { data: fetchedItem, isLoading: isLoadingItem } = useItem(value);

  // Priority: user just selected something > fetched by id > known name (from form state) > placeholder
  // When value is null/0, ignore selectedItem (optimistic state no longer relevant)
  const displayItem = (value == null || value === 0)
    ? null
    : selectedItem ?? fetchedItem ?? (name ? { id: value, name, type: 'all' } as unknown as Item : null);

  // True when an item_id is set but we're still waiting for the data
  const isLoadingDisplay = !!value && !displayItem && isLoadingItem;

  const handleSelect = (item: Item) => {
    setSelectedItem(item);
    onSelect({
      id: item.id,
      name: item.name,
      type: item.type,
      weight: item.weight,
      value: item.value,
      currency: item.currency,
      description: item.description ?? null,
      properties: (item.properties as Record<string, unknown> | null | undefined) ?? null,
    });
    setOpen(false);
  };

  const clearSelection = () => {
    setSelectedItem(null);
    onSelect({ id: 0, name: '', type: '', weight: 0, value: 0, currency: 'po' });
  };

  const resetFilters = () => {
    setSearch('');
    setItemType(type);
  };

  const buttonStyles = {
    default: 'p-2 border-2 border-amber-900/30 rounded-lg cursor-pointer hover:border-amber-700 transition-colors bg-parchment-50',
    compact: 'p-1.5 border border-amber-900/20 rounded cursor-pointer hover:bg-amber-100 transition-colors text-sm',
    minimal: 'p-1 text-amber-700 hover:text-amber-900 cursor-pointer'
  };

  if (disabled) {
    return (
      <div className={cn('p-2 bg-amber-100/50 rounded-lg text-amber-600', className)}>
              {displayItem?.name || placeholder}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <div
            className={cn(buttonStyles[buttonVariant], 'flex items-center justify-between cursor-pointer')}
          >
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {displayItem && (
                  <span className="text-lg">{typeIcons[displayItem.type] || '📦'}</span>
                )}
                <span className={displayItem ? 'text-amber-900 font-medium' : isLoadingDisplay ? 'text-amber-400 animate-pulse' : 'text-amber-500'}>
                  {displayItem?.name || (isLoadingDisplay ? 'Caricamento...' : placeholder)}
                </span>
                {displayItem && showDetails && (
                  <Badge variant="outline" className="text-xs ml-1">
                    {typeLabels[displayItem.type as ItemTypeFilter] || displayItem.type}
                  </Badge>
                )}
              </div>
              {showDetails && displayItem && 'properties' in displayItem && displayItem.properties && (
                <ItemPropertiesDetail item={displayItem as Item} className="pointer-events-none" />
              )}
            </div>
            {displayItem ? (
              <div
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                className="p-1 hover:bg-amber-200 rounded-full"
                aria-label="Rimuovi oggetto"
              >
                <X className="w-3 h-3 text-amber-600" />
              </div>
            ) : (
              <ChevronDown className="w-4 h-4 text-amber-700" />
            )}
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-4xl w-[90vw] h-[85vh] p-0 overflow-hidden bg-parchment-100 border-2 border-amber-900/30">
          {/* Layout: flex colonna che riempie il modal */}
          <div className="flex flex-col flex-1 min-h-0">

            {/* Header - fisso in cima */}
            <div className="flex-shrink-0 p-5 border-b border-amber-200 bg-amber-100/50">
              <div className="flex items-center gap-2 text-amber-900 text-xl font-semibold">
                <Grid2x2 className="w-5 h-5" />
                Seleziona un oggetto
                <span className="text-sm font-normal text-amber-600 ml-2">
                  {items?.length ? `${items.length} oggetti disponibili` : ''}
                </span>
              </div>
            </div>

            {/* Filtri - fisso sotto l'header */}
            <div className="flex-shrink-0 bg-parchment-100 p-5 pb-3 border-b border-amber-200/50">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
                  <Input
                    placeholder="Cerca oggetto per nome..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 py-2.5 text-base"
                    autoFocus
                  />
                </div>

                <div className="w-56">
                  <Select value={itemType} onValueChange={(v) => setItemType(v as ItemTypeFilter)}>
                    <SelectTrigger className="py-2.5">
                      <SelectValue placeholder="Tipo oggetto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">📦 Tutti</SelectItem>
                      <SelectItem value="weapon">⚔️ Armi</SelectItem>
                      <SelectItem value="armor">🛡️ Armature</SelectItem>
                      <SelectItem value="gear">🎒 Equipaggiamento</SelectItem>
                      <SelectItem value="consumable">🧪 Consumabili</SelectItem>
                      <SelectItem value="ammunition">🏹 Munizioni</SelectItem>
                      <SelectItem value="tool">🔧 Attrezzi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(search || itemType !== (type as ItemTypeFilter)) && (
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="px-4"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Resetta
                  </Button>
                )}
              </div>
            </div>

            {/* Lista scorrevole - occupa tutto lo spazio rimasto */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-3">
              <div className="space-y-2 pr-1">
                {isLoading ? (
                  <div className="text-center py-16 text-amber-600">
                    <div className="animate-pulse text-lg">Caricamento oggetti...</div>
                  </div>
                ) : items?.length === 0 ? (
                  <div className="text-center py-16 text-amber-500">
                    <Package className="w-16 h-16 mx-auto mb-3 opacity-30" />
                    <p className="text-lg">Nessun oggetto trovato</p>
                    <p className="text-sm mt-1">Prova a modificare i filtri di ricerca</p>
                  </div>
                ) : (
                  items?.map((item: Item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={cn(
                        'p-4 hover:bg-amber-100 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-amber-300 hover:shadow-md',
                        (displayItem?.id === item.id || value === item.id) && 'bg-amber-200/70 border-amber-700 shadow-sm'
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-amber-900 text-base">
                              {item.name}
                            </span>
                            <Badge variant="outline" className="text-xs bg-amber-50">
                              {typeLabels[item.type] || item.type}
                            </Badge>
                            {item.rarity && item.rarity !== 'common' && (
                              <Badge className={cn(
                                'text-xs',
                                item.rarity === 'uncommon' && 'bg-green-100 text-green-800',
                                item.rarity === 'rare' && 'bg-blue-100 text-blue-800',
                                item.rarity === 'very rare' && 'bg-purple-100 text-purple-800',
                                item.rarity === 'legendary' && 'bg-orange-100 text-orange-800'
                              )}>
                                {item.rarity === 'uncommon' && '🔹 Non comune'}
                                {item.rarity === 'rare' && '✨ Raro'}
                                {item.rarity === 'very rare' && '⭐ Molto raro'}
                                {item.rarity === 'legendary' && '👑 Leggendario'}
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-amber-600 mt-1 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                          {/* Proprietà specifiche per tipo (danno, CA, effetto...) */}
                          {showDetails && item.properties && (
                            <ItemPropertiesDetail item={item} />
                          )}
                          {showDetails && (
                            <div className="flex gap-4 mt-2 text-xs text-amber-500">
                              {item.weight > 0 && (
                                <span className="flex items-center gap-1">
                                  <Weight className="w-3 h-3" />
                                  {item.weight} kg
                                </span>
                              )}
                              {item.value > 0 && (
                                <span className="flex items-center gap-1">
                                  <Coins className="w-3 h-3" />
                                  {item.value} {item.currency || 'po'}
                                </span>
                              )}
                              {item.requires_attunement && (
                                <span className="text-purple-500">🔗 Richiede sintonia</span>
                              )}
                            </div>
                          )}
                        </div>
                        {(displayItem?.id === item.id || value === item.id) && (
                          <div className="ml-3 bg-green-500 rounded-full p-1">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 bg-parchment-100 border-t border-amber-200 p-4 flex justify-between items-center">
              <div className="text-sm text-amber-600">
                {items?.length ? (
                  <>
                    <span className="font-semibold text-amber-800">{items.length}</span> oggetti trovati
                    {search && <span className="ml-1">per <span className="italic">&ldquo;{search}&rdquo;</span></span>}
                    {itemType !== 'all' && (
                      <span className="ml-1">
                        di tipo <span className="font-medium">{typeLabels[itemType].replace(/^[^ ]+ /, '')}</span>
                      </span>
                    )}
                  </>
                ) : (
                  'Nessun oggetto trovato'
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="text-amber-700 border-amber-600 hover:bg-amber-100"
              >
                Chiudi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}