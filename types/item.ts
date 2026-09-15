// types/item.ts

// ===========================================
// TIPI DI BASE
// ===========================================

export type ItemType = 
  | 'weapon'      // Armi
  | 'armor'       // Armature
  | 'gear'        // Equipaggiamento generico
  | 'consumable'  // Consumabili (pozioni, cibo)
  | 'ammunition'  // Munizioni
  | 'tool'        // Attrezzi
  | 'currency';   // Monete

export type Rarity = 
  | 'common' 
  | 'uncommon' 
  | 'rare' 
  | 'very rare' 
  | 'legendary' 
  | 'artifact';

export type CurrencyType = 'po' | 'pa' | 'pr' | 'pe' | 'mo';

export type DamageType = 
  | 'tagliente' 
  | 'perforante' 
  | 'contundente'
  | 'acido'
  | 'freddo'
  | 'fuoco'
  | 'fulmine'
  | 'necrotico'
  | 'psichico'
  | 'radioso'
  | 'veleno'
  | 'tuono'
  | 'forza';

// ===========================================
// ===========================================
// PROPRIETÀ SPECIFICHE PER TIPO
// ===========================================

// Proprietà base per tutti gli oggetti
export interface BaseItemProperties {
  itemType: string;
  description?: string;
  special?: string[];
  magicBonus?: number;
}

// Proprietà per le armi
export interface WeaponDamageEntry {
  dice: string;        // es. "1d6"
  type: DamageType;    // es. "fuoco"
}

export interface WeaponProperties extends BaseItemProperties {
  itemType: 'weapon';
  damage: string;           // es. "1d8"
  damageType: DamageType;
  damageAbility?: 'strength' | 'dexterity' | null; // statistica che scala il danno
  extraDamage?: WeaponDamageEntry[]; // danni aggiuntivi (es. 1d6 fuoco)
  properties: string[];     // es. ["versatile", "leggera", "pesante"]
  versatileDamage?: string; // es. "1d10"
  range?: {
    normal: number;         // metri
    long?: number;
  };
  ammunition?: boolean;
  loading?: boolean;
  finesse?: boolean;
  heavy?: boolean;
  light?: boolean;
  reach?: boolean;
  special?: string[];
}

// Proprietà per le armature
export interface ArmorProperties extends BaseItemProperties {
  itemType: 'armor';
  armorClass: number;
  armorType: 'light' | 'medium' | 'heavy' | 'shield';
  addsDexModifier?: boolean;
  maxDexBonus?: number;     // per armature medie
  stealthDisadvantage?: boolean;
  strengthRequirement?: number;
}

// Proprietà per le munizioni
export interface AmmunitionProperties extends BaseItemProperties {
  itemType: 'ammunition';
  ammunitionType: 'arrow' | 'bolt' | 'bullet';
  quantity: number;
  magicBonus?: number;
  damageBonus?: string;
  specialEffect?: string;
}

// Proprietà per i consumabili
export interface ConsumableProperties extends BaseItemProperties {
  itemType: 'consumable';
  effect: string;
  duration?: string;
  savingThrow?: {
    ability: string;
    dc: number;
  };
  damage?: string;
  healing?: string;
  charges?: number;
  recharge?: string;
  usesMax?: number;
}

// Proprietà per gli attrezzi
export interface ToolProperties extends BaseItemProperties {
  itemType: 'tool';
  toolType: string;
  skill?: string;
  proficiency?: boolean;
  uses?: number;
}

// Proprietà per l'equipaggiamento generico
export interface GearProperties extends BaseItemProperties {
  itemType: 'gear';
  capacity?: number;
  material?: string;
  uses?: number;
}

// Proprietà per le monete
export interface CurrencyProperties extends BaseItemProperties {
  itemType: 'currency';
  valueInCopper: number;
  symbol: string;
}

// ===========================================
// UNIONE DI TUTTE LE PROPRIETÀ
// ===========================================

export type ItemProperties = 
  | WeaponProperties
  | ArmorProperties
  | AmmunitionProperties
  | ConsumableProperties
  | ToolProperties
  | GearProperties
  | CurrencyProperties;

// ===========================================
// ITEM (TABELLA ITEMS - CATALOGO)
// ===========================================

export interface Item {
  id: number;                          // SERIAL PRIMARY KEY
  name: string;                        // Nome oggetto
  type: ItemType;                      // Tipo
  weight: number;                       // Peso in kg
  value: number;                        // Valore in monete
  currency: CurrencyType;               // Tipo moneta (default 'po')
  rarity: Rarity;                       // Rarità
  requires_attunement: boolean;         // Se richiede sintonia
  category: string | null;              // Categoria specifica
  description: string | null;           // Descrizione
  properties: ItemProperties | null;    // Proprietà specifiche
  created_at?: string;                  // Data creazione
  updated_at?: string;                  // Data aggiornamento
}

/** Dati passati al callback onSelect di ItemPicker */
export type PickerItemData = {
  id: number;
  name: string;
  type: string;
  weight: number;
  value: number;
  currency: string;
  description?: string | null;
  properties?: Record<string, unknown> | null;
};

// ===========================================
// INVENTORY (TABELLA INVENTORY - POSSESSO)
// ===========================================

export interface InventoryItem {
  id: string;                          // UUID PRIMARY KEY
  character_id: string;                 // UUID del personaggio
  item_id: number | null;               // FK verso items (opzionale)
  name: string;                         // Nome (copiato o personalizzato)
  type: ItemType;                       // Tipo
  quantity: number;                      // Quantità posseduta
  weight: number;                        // Peso per unità
  equipped: boolean;                     // Se equipaggiato
  description: string | null;            // Descrizione
  notes: string | null;                  // Note personali
  value: number | null;                  // Valore (opzionale)
  currency: CurrencyType | null;         // Tipo moneta
  properties: ItemProperties | null;     // Proprietà (eventuali modifiche)
  created_at?: string;                   // Data inserimento
}

// ===========================================
// DTO PER CREAZIONE/AGGIORNAMENTO
// ===========================================

export interface CreateItemDTO {
  name: string;
  type: ItemType;
  weight: number;
  value: number;
  currency?: CurrencyType;
  rarity?: Rarity;
  requires_attunement?: boolean;
  category?: string | null;
  description?: string | null;
  properties?: ItemProperties | null;
}

export interface UpdateItemDTO extends Partial<CreateItemDTO> {
  id: number;
}

// ===========================================
// RISPOSTE API
// ===========================================

export interface ItemsResponse {
  items: Item[];
  total: number;
  limit: number | null;
  offset: number;
}

export interface InventoryResponse {
  items: InventoryItem[];
  total: number;
  totalWeight: number;                   // Peso totale dell'inventario
}

// ===========================================
// FILTRI
// ===========================================

export interface ItemFilters {
  type?: ItemType | 'all';
  search?: string;
  rarity?: Rarity;
  minValue?: number;
  maxValue?: number;
  limit?: number;
  offset?: number;
}

export interface InventoryFilters {
  character_id: string;
  type?: ItemType;
  equipped?: boolean;
  search?: string;
}
