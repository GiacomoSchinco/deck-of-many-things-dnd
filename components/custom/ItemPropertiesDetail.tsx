// components/custom/ItemPropertiesDetail.tsx
// Componente riutilizzabile che mostra le proprietà specifiche di un Item
// in base al suo tipo (arma, armatura, consumabile, ecc.)
// Usato in: ItemPicker, card inventario, scheda personaggio, ecc.

import type {
  Item,
  WeaponProperties,
  ArmorProperties,
  AmmunitionProperties,
  ConsumableProperties,
  CurrencyProperties,
  ToolProperties,
  GearProperties,
} from '@/types/item';
import {
  Sword,
  Shield,
  Zap,
  FlaskConical,
  Wrench,
  Coins,
} from 'lucide-react';

interface ItemPropertiesDetailProps {
  item: Item;
  /** Classe CSS aggiuntiva per il container */
  className?: string;
}

export function ItemPropertiesDetail({ item, className }: ItemPropertiesDetailProps) {
  const p = item.properties;
  if (!p) return null;

  const base = `flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs${className ? ` ${className}` : ''}`;

  if (p.itemType === 'weapon') {
    const w = p as WeaponProperties;
    return (
      <div className={base}>
        <span className="flex items-center gap-1 text-red-600 font-medium">
          <Sword className="w-3 h-3" />
          {w.damage} {w.damageType}
          {w.versatileDamage && (
            <span className="text-amber-600 ml-1">({w.versatileDamage} versatile)</span>
          )}
        </span>
        {w.magicBonus && w.magicBonus > 0 && (
          <span className="text-purple-600 font-medium">+{w.magicBonus} magico</span>
        )}
        {w.range && (
          <span className="text-amber-500">
            🏹 {w.range.normal}m{w.range.long ? `/${w.range.long}m` : ''}
          </span>
        )}
        {w.properties && w.properties.length > 0 && (
          <span className="text-amber-400">{w.properties.join(', ')}</span>
        )}
      </div>
    );
  }

  if (p.itemType === 'armor') {
    const a = p as ArmorProperties;
    return (
      <div className={base}>
        <span className="flex items-center gap-1 text-blue-600 font-medium">
          <Shield className="w-3 h-3" />
          CA {a.armorClass}
          {a.addsDexModifier && (
            <span className="text-amber-500 ml-1">
              + DES{a.maxDexBonus !== undefined ? ` (max ${a.maxDexBonus})` : ''}
            </span>
          )}
        </span>
        <span className="text-amber-400 capitalize">{a.armorType}</span>
        {a.magicBonus && a.magicBonus > 0 && (
          <span className="text-purple-600 font-medium">+{a.magicBonus} magico</span>
        )}
        {a.stealthDisadvantage && (
          <span className="text-red-400">⚠️ Svantaggio furtività</span>
        )}
        {a.strengthRequirement && (
          <span className="text-orange-500">FOR {a.strengthRequirement}+</span>
        )}
      </div>
    );
  }

  if (p.itemType === 'ammunition') {
    const a = p as AmmunitionProperties;
    return (
      <div className={base}>
        <span className="flex items-center gap-1 text-amber-600">
          <Zap className="w-3 h-3" />
          {a.ammunitionType}
        </span>
        {a.quantity && <span className="text-amber-500">x{a.quantity}</span>}
        {a.damageBonus && (
          <span className="text-red-500">+{a.damageBonus} danno</span>
        )}
        {a.magicBonus && a.magicBonus > 0 && (
          <span className="text-purple-600 font-medium">+{a.magicBonus} magico</span>
        )}
      </div>
    );
  }

  if (p.itemType === 'currency') {
    const c = p as CurrencyProperties;
    return (
      <div className={base}>
        <span className="flex items-center gap-1 text-amber-600">
          <Coins className="w-3 h-3" />
          {c.symbol}
        </span>
        <span className="text-amber-500">Valore base: {c.valueInCopper} cp</span>
      </div>
    );
  }

  if (p.itemType === 'consumable') {
    const c = p as ConsumableProperties;
    return (
      <div className={base}>
        <span className="flex items-center gap-1 text-green-600">
          <FlaskConical className="w-3 h-3" />
          {c.effect}
        </span>
        {c.duration && <span className="text-amber-500">⏱ {c.duration}</span>}
        {c.usesMax && (
          <span className="text-amber-500">
            {(c.charges ?? c.usesMax)}/{c.usesMax} usi
          </span>
        )}
      </div>
    );
  }

  if (p.itemType === 'tool') {
    const t = p as ToolProperties;
    return (
      <div className={base}>
        <span className="flex items-center gap-1 text-amber-600">
          <Wrench className="w-3 h-3" />
          {t.toolType ?? 'Attrezzo'}
        </span>
        {t.skill && <span className="text-amber-500">Abilità: {t.skill}</span>}
        {t.proficiency && <span className="text-blue-500">Richiede competenza</span>}
      </div>
    );
  }

  if (p.itemType === 'gear') {
    const g = p as GearProperties;
    if (!g.capacity) return null;
    return (
      <div className={`mt-2 text-xs text-amber-500${className ? ` ${className}` : ''}`}>
        📦 Capacità: {g.capacity} kg
      </div>
    );
  }

  return null;
}
