// types/spell.ts

// ===========================================
// TIPI DI BASE
// ===========================================

export type SpellSchool = 
  | 'abjuration'      // Abiurazione
  | 'conjuration'      // Evocazione
  | 'divination'       // Divinazione
  | 'enchantment'      // Ammaliamento
  | 'evocation'        // Invocazione
  | 'illusion'         // Illusione
  | 'necromancy'       // Necromanzia
  | 'transmutation';   // Trasmutazione

export type SpellComponent = 'V' | 'S' | 'M';

export type SpellClass = 
  | 'Barbaro'
  | 'Bardo'
  | 'Chierico'
  | 'Druido'
  | 'Guerriero'
  | 'Ladro'
  | 'Mago'
  | 'Monaco'
  | 'Paladino'
  | 'Ranger'
  | 'Stregone'
  | 'Warlock';

export type DamageType = 
  | 'acido'
  | 'contundente'
  | 'freddo'
  | 'fuoco'
  | 'fulmine'
  | 'necrotico'
  | 'perforante'
  | 'psichico'
  | 'radioso'
  | 'tagliente'
  | 'tuono'
  | 'veleno'
  | 'forza';

// ===========================================
// PROPRIETÀ DEGLI INCANTESIMI
// ===========================================

export interface SpellComponents {
  verbal: boolean;
  somatic: boolean;
  material?: string;        // Descrizione della componente materiale
}

export interface SpellDamage {
  dice: string;              // "1d8", "2d6"
  type: DamageType;
  atHigherLevels?: string;   // "+1d8 per livello"
}

export interface Spell {
  id: number;                           // SERIAL PRIMARY KEY
  name: string;                          // Nome incantesimo
  level: number;                          // Livello (0 per trucchetti)
  school: SpellSchool;                    // Scuola di magia
  
  // Lancio
  casting_time: string | null;            // Tempo di lancio
  range: string | null;                   // Gittata
  components: SpellComponents | null;      // Componenti
  duration: string | null;                 // Durata
  
  // Descrizione
  description: string | null;              // Descrizione
  at_higher_levels: string | null;         // Effetti a livelli superiori
  
  // Flag
  ritual: boolean;                         // Se è un rituale
  concentration: boolean;                  // Se richiede concentrazione
  
  // Classi che possono lanciarlo
  classes: string[];                        // Array di nomi classi in italiano
  
  // Metadati
  created_at?: string;                      // Data creazione
  updated_at?: string;                      // Data aggiornamento
}

// ===========================================
// INCANTESIMI CONOSCIUTI DAL PERSONAGGIO
// ===========================================

export interface SpellKnown {
  id: string;                              // UUID PRIMARY KEY
  character_id: string;                     // UUID del personaggio
  spell_id: number;                         // FK verso spells
  prepared: boolean;                         // Se preparato (per classi che preparano)
  spellcasting_ability: 'intelligence' | 'wisdom' | 'charisma';  // Caratteristica per lanciare
  
  // Dati dello spell (popolati dalla relazione)
  spell?: Spell;
  
  created_at?: string;
}

// ===========================================
// SLOT INCANTESIMI
// ===========================================

export interface SpellSlot {
  character_id: string;                     // UUID del personaggio
  spell_level: number;                       // Livello slot (1-9)
  total_slots: number;                        // Slot totali
  used_slots: number;                         // Slot usati
}

export interface SpellSlots {
  level1: SpellSlot;
  level2: SpellSlot;
  level3: SpellSlot;
  level4: SpellSlot;
  level5: SpellSlot;
  level6: SpellSlot;
  level7: SpellSlot;
  level8: SpellSlot;
  level9: SpellSlot;
}

// ===========================================
// DTO PER CREAZIONE/AGGIORNAMENTO
// ===========================================

export interface CreateSpellDTO {
  name: string;
  level: number;
  school: SpellSchool;
  casting_time?: string | null;
  range?: string | null;
  components?: SpellComponents | null;
  duration?: string | null;
  description?: string | null;
  at_higher_levels?: string | null;
  ritual?: boolean;
  concentration?: boolean;
  classes: string[];
}

export interface UpdateSpellDTO extends Partial<CreateSpellDTO> {
  id: number;
}

export interface AddSpellToCharacterDTO {
  character_id: string;
  spell_id: number;
  prepared?: boolean;
  spellcasting_ability: 'intelligence' | 'wisdom' | 'charisma';
}

export interface UpdateSpellSlotDTO {
  character_id: string;
  spell_level: number;
  used_slots: number;
}

// ===========================================
// RISPOSTE API
// ===========================================

export interface SpellsResponse {
  spells: Spell[];
  total: number;
  limit: number | null;
  offset: number;
}

export interface CharacterSpellsResponse {
  spells_known: (SpellKnown & { spell: Spell })[];
  spell_slots: SpellSlots;
  spellcasting_ability: 'intelligence' | 'wisdom' | 'charisma';
  spell_save_dc: number;        // CD tiro salvezza
  spell_attack_bonus: number;    // Bonus attacco incantesimo
}

// ===========================================
// FILTRI
// ===========================================

export interface SpellFilters {
  level?: number;
  school?: SpellSchool;
  class?: string;
  search?: string;
  ritual?: boolean;
  concentration?: boolean;
  limit?: number;
  offset?: number;
}

export interface CharacterSpellFilters {
  character_id: string;
  prepared?: boolean;
  level?: number;
}

// ===========================================
// MAPPE PER TRADUZIONE
// ===========================================

export const SchoolItalianNames: Record<SpellSchool, string> = {
  'abjuration': 'Abiurazione',
  'conjuration': 'Evocazione',
  'divination': 'Divinazione',
  'enchantment': 'Ammaliamento',
  'evocation': 'Invocazione',
  'illusion': 'Illusione',
  'necromancy': 'Necromanzia',
  'transmutation': 'Trasmutazione'
};

export const SchoolEnglishNames: Record<string, SpellSchool> = {
  'Abiurazione': 'abjuration',
  'Evocazione': 'conjuration',
  'Divinazione': 'divination',
  'Ammaliamento': 'enchantment',
  'Invocazione': 'evocation',
  'Illusione': 'illusion',
  'Necromanzia': 'necromancy',
  'Trasmutazione': 'transmutation'
};

// ===========================================
// FUNZIONI UTILITY
// ===========================================

export function getSpellLevelName(level: number): string {
  if (level === 0) return 'Trucchetto';
  if (level === 1) return '1° livello';
  if (level === 2) return '2° livello';
  if (level === 3) return '3° livello';
  return `${level}° livello`;
}

export function isCantrip(level: number): boolean {
  return level === 0;
}

export function getSpellSchoolItalian(school: SpellSchool): string {
  return SchoolItalianNames[school] || school;
}

export function getSpellSchoolEnglish(italianName: string): SpellSchool | undefined {
  return SchoolEnglishNames[italianName];
}