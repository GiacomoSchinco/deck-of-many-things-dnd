// components/custom/ItemCard.tsx
'use client';

import React from 'react';
import AncientCardContainer from './AncientCardContainer';
import { cn } from '@/lib/utils';
import { 
  Sword, 
  Shield, 
  Package, 
  FlaskConical, 
  ArrowUpDown, 
  Wrench, 
  Coins,
  Weight,
  DollarSign,
  Sparkles,
  Clock,
  Heart,
  Zap
} from 'lucide-react';
import { getItalianItemType, getItalianRarity, getItalianCurrency } from '@/lib/utils/nameMappers';
import type { Item, WeaponProperties, ArmorProperties, ConsumableProperties, AmmunitionProperties } from '@/types/item';

interface ItemCardProps {
  item: Item;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const typeIcons: Record<string, React.ElementType> = {
  weapon: Sword,
  armor: Shield,
  gear: Package,
  consumable: FlaskConical,
  ammunition: ArrowUpDown,
  tool: Wrench,
  currency: Coins,
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
  const Icon = typeIcons[item.type] || Package;
  const rarityColor = rarityColors[item.rarity] || 'text-gray-500';

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
  const sizeClasses = {
    sm: 'max-w-[200px]',
    md: 'max-w-[280px]',
    lg: 'max-w-[350px]',
  };

  return (
    <div className={cn("group", sizeClasses[size])}>
      <AncientCardContainer className="w-full h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative h-full flex flex-col p-4">
          {/* Header con icona e tipo */}
          <div className="flex items-center justify-between border-b-2 border-amber-700/30 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100/50">
                <Icon className="w-5 h-5 text-amber-700" />
              </div>
              <h2 className="text-lg font-bold text-amber-900 font-serif truncate">{item.name}</h2>
            </div>
            {item.requires_attunement && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Sintonizzazione</span>
            )}
          </div>

          {/* Rarità e tipo */}
          <div className="flex justify-between items-center mt-2 text-xs">
            <span className={cn("font-medium", rarityColor)}>{getItalianRarity(item.rarity)}</span>
            <span className="text-amber-600">{getItalianItemType(item.type)}</span>
          </div>

          {/* Peso e Valore */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-amber-50/50 p-1.5 rounded text-center flex items-center justify-center gap-1">
              <Weight className="w-3 h-3 text-amber-600" />
              <span className="text-xs text-amber-800">{item.weight} kg</span>
            </div>
            <div className="bg-amber-50/50 p-1.5 rounded text-center flex items-center justify-center gap-1">
              <DollarSign className="w-3 h-3 text-amber-600" />
              <span className="text-xs text-amber-800">{item.value} {getItalianCurrency(item.currency)}</span>
            </div>
          </div>

          {/* Categoria (opzionale) */}
          {item.category && (
            <div className="mt-2 text-center">
              <span className="text-xs text-amber-500 italic">{item.category}</span>
            </div>
          )}

          {/* Proprietà specifiche (danno, CA, ecc.) */}
          {renderSpecificProperties()}

          {/* Descrizione (limitata a 3 righe) */}
          {item.description && (
            <div className="mt-3 flex-1">
              <p className="text-xs text-amber-700 line-clamp-3 leading-relaxed">{item.description}</p>
            </div>
          )}

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
        </div>
      </AncientCardContainer>
    </div>
  );
}