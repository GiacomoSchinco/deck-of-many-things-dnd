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
// PROPRIETÀ SPECIFICHE PER TIPO
// ===========================================

export interface WeaponProperties {
  itemType: 'weapon';
  damage: string;                    // "1d8", "2d6"
  damageType: DamageType;
  range?: {
    normal: number;                  // gittata normale in metri
    long?: number;                   // gittata lunga in metri
  };
  properties?: string[];             // ['accurata', 'versatile', 'pesante']
  versatileDamage?: string;          // "1d10" per armi versatili
  magicBonus?: number;               // +1, +2, +3
}

export interface ArmorProperties {
  itemType: 'armor';
  armorClass: number;                // CA base
  armorType: 'light' | 'medium' | 'heavy' | 'shield';
  addsDexModifier?: boolean;         // se aggiunge modificatore DES
  maxDexBonus?: number;              // max DES applicabile (armature medie)
  stealthDisadvantage?: boolean;
  strengthRequirement?: number;
  magicBonus?: number;               // +1, +2, +3
}

export interface AmmunitionProperties {
  itemType: 'ammunition';
  ammunitionType: 'arrow' | 'bolt' | 'bullet' | 'needle';
  damageBonus?: number;              // bonus al danno
  magicBonus?: number;               // +1, +2, +3
  quantity?: number;                 // quantità per confezione
}

export interface ConsumableProperties {
  itemType: 'consumable';
  effect: string;                    // effetto principale
  duration?: string;                 // durata
  uses?: number;                     // utilizzi rimasti
  usesMax?: number;                  // utilizzi massimi
  recharge?: 'short' | 'long' | 'dawn' | 'dusk';
}

export interface ToolProperties {
  itemType: 'tool';
  toolType?: string;                 // tipo specifico
  skill?: string;                    // abilità associata
  proficiency?: boolean;             // se richiede competenza
}

export interface GearProperties {
  itemType: 'gear';
  capacity?: number;                 // capacità in kg (per contenitori)
}

export interface CurrencyProperties {
  itemType: 'currency';
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

export interface CreateInventoryItemDTO {
  character_id: string;
  item_id?: number | null;               // Se null, è oggetto personalizzato
  name: string;
  type: ItemType;
  quantity?: number;
  weight: number;
  equipped?: boolean;
  description?: string | null;
  notes?: string | null;
  value?: number | null;
  currency?: CurrencyType | null;
  properties?: ItemProperties | null;
}

export interface UpdateInventoryItemDTO extends Partial<CreateInventoryItemDTO> {
  id: string;
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