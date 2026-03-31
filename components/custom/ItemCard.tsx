// components/custom/ItemCard.tsx
'use client';

import React from 'react';
import AncientCardContainer from './AncientCardContainer';
import { cn } from '@/lib/utils';
import {
  Shield,
  ArrowUpDown,
  Weight,
  Sparkles,
  Clock,
  Heart,
  Zap
  ,
  Info
} from 'lucide-react';
import { DndIcon } from '../icons/DndIcon';
import { getItalianItemType, getItalianRarity } from '@/lib/utils/nameMappers';
import type { Item, WeaponProperties, ArmorProperties, ConsumableProperties, AmmunitionProperties } from '@/types/item';

// Estende Item per supportare anche campi dell'inventario (quantity, equipped)
type ItemLike = Item & { quantity?: number; equipped?: boolean };

interface ItemCardProps {
  item: ItemLike;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  size?: 'sm' | 'md' | 'lg';
}
const TYPE_COLORS: Record<string, string> = {
  weapon:     'text-red-800',
  armor:      'text-blue-800',
  gear:       'text-amber-800',
  consumable: 'text-green-800',
  ammunition: 'text-yellow-800',
  tool:       'text-purple-800',
  currency:   'text-amber-600',
};
const rarityColors: Record<string, string> = {
  common: 'text-gray-500',
  uncommon: 'text-green-600',
  rare: 'text-blue-600',
  'very rare': 'text-purple-600',
  legendary: 'text-orange-600',
  artifact: 'text-red-600',
};

export default function ItemCard({ item, showActions = false, onEdit, onDelete, size = 'md' }: ItemCardProps) {
  const rarityColor = rarityColors[item.rarity] || 'text-gray-500';
  const [showDesc, setShowDesc] = React.useState(false);

  // Helper per formattare le proprietà specifiche in base al tipo
  const renderSpecificProperties = () => {
    const props = item.properties;
    if (!props) return null;

    switch (item.type) {
      case 'weapon': {
        const weapon = props as WeaponProperties;
        return (
          <div className="space-y-1 mt-2">
            <div className="flex items-center gap-2 text-xs text-amber-700">
              <Zap className="w-3 h-3" />
              <span>Danno: {weapon.damage || '—'} {weapon.damageType ? `(${weapon.damageType})` : ''}</span>
              {weapon.versatileDamage && <span>(versatile: {weapon.versatileDamage})</span>}
            </div>
            {weapon.properties && weapon.properties.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {weapon.properties.map(prop => (
                  <span key={prop} className="text-xs bg-amber-100 px-1.5 py-0.5 rounded text-amber-800">{prop}</span>
                ))}
              </div>
            )}
            {weapon.magicBonus && weapon.magicBonus > 0 && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Sparkles className="w-3 h-3" />
                <span>+{weapon.magicBonus} magico</span>
              </div>
            )}
          </div>
        );
      }
      case 'armor': {
        const armor = props as ArmorProperties;
        return (
          <div className="space-y-1 mt-2">
            <div className="flex items-center gap-2 text-xs text-amber-700">
              <Shield className="w-3 h-3" />
              <span>CA: {armor.armorClass}</span>
              {armor.addsDexModifier && <span>+ Mod. DES</span>}
              {armor.maxDexBonus && <span>(max +{armor.maxDexBonus})</span>}
            </div>
            {armor.stealthDisadvantage && (
              <span className="text-xs bg-red-100 px-1.5 py-0.5 rounded text-red-800">Svantaggio Furtività</span>
            )}
            {armor.magicBonus && armor.magicBonus > 0 && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Sparkles className="w-3 h-3" />
                <span>+{armor.magicBonus} magico</span>
              </div>
            )}
          </div>
        );
      }
      case 'consumable': {
        const consumable = props as ConsumableProperties;
        return (
          <div className="space-y-1 mt-2">
            <div className="flex items-start gap-2 text-xs text-amber-700">
              <Heart className="w-3 h-3 mt-0.5" />
              <span>{consumable.effect || 'Effetto non specificato'}</span>
            </div>
            {consumable.duration && (
              <div className="flex items-center gap-2 text-xs text-amber-600">
                <Clock className="w-3 h-3" />
                <span>Durata: {consumable.duration}</span>
              </div>
            )}
          </div>
        );
      }
      case 'ammunition': {
        const ammo = props as AmmunitionProperties;
        return (
          <div className="space-y-1 mt-2">
            <div className="flex items-center gap-2 text-xs text-amber-700">
              <ArrowUpDown className="w-3 h-3" />
              <span>{ammo.ammunitionType || 'Munizione'}</span>
              {ammo.quantity && <span>×{ammo.quantity}</span>}
            </div>
            {ammo.damageBonus && (
              <span className="text-xs text-green-600">+{ammo.damageBonus} danno</span>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  // Dimensioni responsive


  return (
    <AncientCardContainer size={size}>
        {/* Quantity badge top-right */}
        {item.quantity !== undefined && item.quantity > 1 && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center justify-center w-9 h-9 text-xs font-semibold bg-white text-amber-700 border border-amber-200 rounded-full shadow-sm">×{item.quantity}</span>
          </div>
        )}

        {/* Description button top-left + modal */}
        {item.description && (
          <>
            <div className="absolute top-4 left-4 z-10">
              <button
                onClick={() => setShowDesc(true)}
                aria-label="Mostra descrizione"
                className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold bg-white text-amber-700 border border-amber-200 rounded-full shadow-sm"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            {showDesc && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40" onClick={() => setShowDesc(false)} />
                <div className="bg-white p-4 rounded-lg max-w-lg mx-4 z-10 shadow-lg border border-amber-100">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-sm font-semibold text-amber-900">{item.name}</h3>
                    <button onClick={() => setShowDesc(false)} className="text-xs text-amber-600 hover:underline">Chiudi</button>
                  </div>
                  <div className="mt-3 text-sm text-amber-700 whitespace-pre-wrap">{item.description}</div>
                </div>
              </div>
            )}
          </>
        )}
        {/* Header: nome centrato, rarità a dx, sintonizzazione a dx */}
        <div className="border-b-2 border-amber-700/30 text-center">
          <h2 className="text-lg font-bold text-amber-900 font-serif leading-tight">{item.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
            {item.rarity && (
              <span className={cn('text-xs font-medium', rarityColor)}>{getItalianRarity(item.rarity)}</span>
            )}
            {item.requires_attunement && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Sintonizzazione</span>
            )}
          </div>
        </div>

        {/* Icona tipo centrata */}
        <div className="flex flex-col items-center justify-center mt-3 gap-1">
          <DndIcon size={40} name={item.type} className={TYPE_COLORS[item.type]} />
          <span className="text-xs text-amber-600 font-medium">{getItalianItemType(item.type)}</span>
          {item.category && (
            <span className="text-xs text-amber-400 italic">{item.category}</span>
          )}
        </div>

        {/* Stats: peso (valore nascosto temporaneamente) */}
        <div className={cn('grid gap-2 mt-3 grid-cols-1')}>
          <div className="bg-amber-50/50 p-1.5 rounded text-center flex flex-col items-center gap-0.5">
            <Weight className="w-3 h-3 text-amber-500" />
            <span className="text-xs text-amber-800">{item.weight} kg</span>
          </div>
        </div>

        {/* Proprietà specifiche (danno, CA, ecc.) */}
        {item.type !== "ammunition" && renderSpecificProperties()}

        {/* moved description above to keep card symmetric */}

        {/* Azioni opzionali (modifica/elimina) */}
        {showActions && (
          <div className="flex justify-center gap-2 mt-4 pt-2 border-t border-amber-200">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-3 py-1 text-xs bg-amber-700 text-amber-100 rounded hover:bg-amber-800 transition-colors"
              >
                Modifica
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-3 py-1 text-xs bg-red-700 text-white rounded hover:bg-red-800 transition-colors"
              >
                Elimina
              </button>
            )}
          </div>
        )}

        {/* Effetto hover decorativo */}
        <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-amber-400/30 rounded-xl transition-all duration-300" />
     
    </AncientCardContainer>
  );
}