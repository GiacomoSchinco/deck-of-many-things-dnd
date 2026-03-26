// lib/utils/itemProperties.ts
import { 
  WeaponProperties, 
  ArmorProperties, 
  AmmunitionProperties,
  ConsumableProperties,
  ToolProperties,
  GearProperties,
  CurrencyProperties
} from '@/types/item';

// Type guard per armi
export function isWeapon(properties: unknown): properties is WeaponProperties {
  const p = properties as Record<string, unknown> | null;
  return !!(p && (p as Record<string, unknown>)['itemType'] === 'weapon');
}

// Type guard per armature
export function isArmor(properties: unknown): properties is ArmorProperties {
  const p = properties as Record<string, unknown> | null;
  return !!(p && (p as Record<string, unknown>)['itemType'] === 'armor');
}

// Type guard per munizioni
export function isAmmunition(properties: unknown): properties is AmmunitionProperties {
  const p = properties as Record<string, unknown> | null;
  return !!(p && (p as Record<string, unknown>)['itemType'] === 'ammunition');
}

// Type guard per consumabili
export function isConsumable(properties: unknown): properties is ConsumableProperties {
  const p = properties as Record<string, unknown> | null;
  return !!(p && (p as Record<string, unknown>)['itemType'] === 'consumable');
}

// Type guard per attrezzi
export function isTool(properties: unknown): properties is ToolProperties {
  const p = properties as Record<string, unknown> | null;
  return !!(p && (p as Record<string, unknown>)['itemType'] === 'tool');
}

// Type guard per equipaggiamento
export function isGear(properties: unknown): properties is GearProperties {
  const p = properties as Record<string, unknown> | null;
  return !!(p && (p as Record<string, unknown>)['itemType'] === 'gear');
}

// Type guard per monete
export function isCurrency(properties: unknown): properties is CurrencyProperties {
  const p = properties as Record<string, unknown> | null;
  return !!(p && (p as Record<string, unknown>)['itemType'] === 'currency');
}

// Funzione per formattare il danno
export function formatDamage(properties: WeaponProperties): string {
  let text = `Danno: ${properties.damage} ${properties.damageType}`;
  if (properties.versatileDamage) {
    text += ` (versatile: ${properties.versatileDamage})`;
  }
  if (properties.range) {
    text += `, gittata: ${properties.range.normal}/${properties.range.long} m`;
  }
  if (properties.properties.length > 0) {
    text += `, proprietà: ${properties.properties.join(', ')}`;
  }
  return text;
}

// Funzione per formattare l'armatura
export function formatArmor(properties: ArmorProperties): string {
  let text = `CA: ${properties.armorClass}`;
  if (properties.addsDexModifier) {
    text += ` + Mod. Destrezza`;
    if (properties.maxDexBonus) {
      text += ` (max +${properties.maxDexBonus})`;
    }
  }
  if (properties.stealthDisadvantage) {
    text += `, svantaggio su Furtività`;
  }
  if (properties.strengthRequirement) {
    text += `, richiede Forza ${properties.strengthRequirement}`;
  }
  return text;
}

// Funzione per formattare il consumabile
export function formatConsumable(properties: ConsumableProperties): string {
  let text = `Effetto: ${properties.effect}`;
  if (properties.duration) {
    text += `, durata: ${properties.duration}`;
  }
  if (properties.damage) {
    text += `, danno: ${properties.damage}`;
  }
  if (properties.healing) {
    text += `, cura: ${properties.healing}`;
  }
  return text;
}

// Funzione per ottenere la descrizione formattata delle proprietà
export function getFormattedProperties(properties: unknown): string {
  if (!properties) return '';
  const p = properties as Record<string, unknown>;

  if (isWeapon(p)) {
    return formatDamage(p);
  }

  if (isArmor(p)) {
    return formatArmor(p);
  }

  if (isConsumable(p)) {
    return formatConsumable(p);
  }

  if (isAmmunition(p)) {
    const ammo = p as AmmunitionProperties;
    return `${ammo.ammunitionType}, quantità: ${ammo.quantity}`;
  }

  if (isTool(p)) {
    const t = p as ToolProperties;
    return `${t.toolType}`;
  }

  if (isGear(p) && (p as GearProperties).capacity) {
    const g = p as GearProperties;
    return `Capacità: ${g.capacity} kg`;
  }

  return '';
}