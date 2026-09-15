// components/items/itemOptions.ts
//
// Tabelle di opzioni del form oggetto.
//
// Erano definite dentro `ItemForm.tsx` insieme alla UI, quindi non erano
// riusabili da `ItemPicker` (che infatti si era ricopiato `typeLabels` e
// `TYPE_ICONS` a mano) e ogni modifica a un'etichetta italiana andava fatta in
// due posti.
//
// Niente emoji: sono decorazioni tipografiche, non iconografia (regola di
// progetto). Le caselle che mostravano un'emoji ora mostrano un'icona lucide
// oppure nient'altro, quando l'icona era identica per tutte le voci.
import {
  ArrowUpDown,
  Brain,
  CloudLightning,
  Coins,
  Droplet,
  Dumbbell,
  Flame,
  FlaskConical,
  Hammer,
  Package,
  Shield,
  Skull,
  Snowflake,
  Sun,
  Sword,
  Target,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import { getItalianItemType, getItalianRarity, getItalianCurrency, rarityTextColors } from '@/lib/utils/nameMappers';
import type { CurrencyType, DamageType, ItemType, Rarity } from '@/types/item';

export interface Option<T extends string> {
  value: T;
  label: string;
}

export const ITEM_TYPE_OPTIONS: { value: ItemType; label: string; icon: LucideIcon }[] = [
  { value: 'weapon',     label: getItalianItemType('weapon'),     icon: Sword },
  { value: 'armor',      label: getItalianItemType('armor'),      icon: Shield },
  { value: 'gear',       label: getItalianItemType('gear'),       icon: Package },
  { value: 'consumable', label: getItalianItemType('consumable'), icon: FlaskConical },
  { value: 'ammunition', label: getItalianItemType('ammunition'), icon: ArrowUpDown },
  { value: 'tool',       label: getItalianItemType('tool'),       icon: Wrench },
  { value: 'currency',   label: getItalianItemType('currency'),   icon: Coins },
];

export const RARITY_OPTIONS: { value: Rarity; label: string; color: string }[] = [
  { value: 'common',    label: getItalianRarity('common'),    color: rarityTextColors['common'] },
  { value: 'uncommon',  label: getItalianRarity('uncommon'),  color: rarityTextColors['uncommon'] },
  { value: 'rare',      label: getItalianRarity('rare'),      color: rarityTextColors['rare'] },
  { value: 'very rare', label: getItalianRarity('very rare'), color: rarityTextColors['very rare'] },
  { value: 'legendary', label: getItalianRarity('legendary'), color: rarityTextColors['legendary'] },
  { value: 'artifact',  label: getItalianRarity('artifact'),  color: rarityTextColors['artifact'] },
];

/** Il codice (`po`, `pa`, …) è la sigla mostrata accanto al valore numerico. */
export const CURRENCY_OPTIONS: { value: CurrencyType; label: string }[] = [
  { value: 'po', label: getItalianCurrency('po') },
  { value: 'pa', label: getItalianCurrency('pa') },
  { value: 'pr', label: getItalianCurrency('pr') },
  { value: 'pe', label: getItalianCurrency('pe') },
  { value: 'mo', label: getItalianCurrency('mo') },
];

/**
 * Icone per tipo di danno.
 *
 * Prima erano emoji (spada, arco, martello, fiamma…): rendono in modo diverso
 * su ogni piattaforma e non seguono il colore del tema.
 */
export const DAMAGE_TYPE_OPTIONS: { value: DamageType; label: string; icon: LucideIcon }[] = [
  { value: 'tagliente',   label: 'Tagliente',   icon: Sword },
  { value: 'perforante',  label: 'Perforante',  icon: Target },
  { value: 'contundente', label: 'Contundente', icon: Hammer },
  { value: 'acido',       label: 'Acido',       icon: FlaskConical },
  { value: 'freddo',      label: 'Freddo',      icon: Snowflake },
  { value: 'fuoco',       label: 'Fuoco',       icon: Flame },
  { value: 'fulmine',     label: 'Fulmine',     icon: Zap },
  { value: 'necrotico',   label: 'Necrotico',   icon: Skull },
  { value: 'psichico',    label: 'Psichico',    icon: Brain },
  { value: 'radioso',     label: 'Radioso',     icon: Sun },
  { value: 'veleno',      label: 'Veleno',      icon: Droplet },
  { value: 'tuono',       label: 'Tuono',       icon: CloudLightning },
  { value: 'forza',       label: 'Forza',       icon: Dumbbell },
];

export const DAMAGE_DICE_OPTIONS: Option<string>[] = [
  '1d4', '1d6', '1d8', '1d10', '1d12', '2d4', '2d6', '2d8', '3d6', '4d6',
].map((value) => ({ value, label: value }));

export const VERSATILE_DICE_OPTIONS: Option<string>[] = [
  '1d8', '1d10', '1d12', '2d6',
].map((value) => ({ value, label: value }));

export const WEAPON_PROPERTY_OPTIONS: { value: string; label: string; description: string }[] = [
  { value: 'accurata',  label: 'Accurata',    description: '+1 al tiro per colpire' },
  { value: 'leggera',   label: 'Leggera',     description: 'Può essere impugnata con due armi' },
  { value: 'lancio',    label: 'Lancio',      description: 'Può essere lanciata' },
  { value: 'versatile', label: 'Versatile',   description: 'Può essere usata a due mani per danno maggiore' },
  { value: 'pesante',   label: 'Pesante',     description: 'Richiede Forza 13 o superiore' },
  { value: 'a due mani', label: 'A due mani', description: 'Richiede entrambe le mani' },
  { value: 'portata',   label: 'Portata',     description: 'Colpisce a 3 metri di distanza' },
  { value: 'carica',    label: 'Carica',      description: 'Richiede tempo per ricaricare' },
  { value: 'munizioni', label: 'Munizioni',   description: 'Richiede munizioni' },
];
