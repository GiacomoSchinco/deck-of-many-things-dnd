// lib/utils/nameMappers.ts

// ─── RAZZE ────────────────────────────────────────────────────────────────────

/** Italiano → inglese (lowercase, come arriva dal DB / Open5e slug) */
export const raceEnglishNames: Record<string, string> = {
  'Umano':    'human',
  'Elfo':     'elf',
  'Nano':     'dwarf',
  'Halfling': 'halfling',
  'Gnomo':    'gnome',
  'Mezzelfo': 'half-elf',
  'Mezzorco': 'half-orc',
  'Tiefling': 'tiefling',
  'Dragonide':'dragonborn',
}

/** Inglese lowercase → italiano */
export const raceItalianNames: Record<string, string> = {
  'human':     'Umano',
  'elf':       'Elfo',
  'dwarf':     'Nano',
  'halfling':  'Halfling',
  'gnome':     'Gnomo',
  'half-elf':  'Mezzelfo',
  'half-orc':  'Mezzorco',
  'tiefling':  'Tiefling',
  'dragonborn':'Dragonide',
}

/** Restituisce il nome italiano di una razza. Accetta sia inglese lowercase che Title Case. */
export function getItalianRace(name?: string): string {
  if (!name) return ''
  return raceItalianNames[name.toLowerCase()] ?? name
}

/** Restituisce l'inglese lowercase di una razza a partire dal nome italiano. */
export function getEnglishRace(name: string): string {
  return raceEnglishNames[name] ?? name.toLowerCase()
}

// ─── CLASSI ───────────────────────────────────────────────────────────────────

/** Italiano → inglese lowercase */
export const classEnglishNames: Record<string, string> = {
  'Barbaro':  'barbarian',
  'Bardo':    'bard',
  'Chierico': 'cleric',
  'Druido':   'druid',
  'Guerriero':'fighter',
  'Ladro':    'rogue',
  'Mago':     'wizard',
  'Monaco':   'monk',
  'Paladino': 'paladin',
  'Ranger':   'ranger',
  'Stregone': 'sorcerer',
  'Warlock':  'warlock',
}

/** Inglese lowercase → italiano */
export const classItalianNames: Record<string, string> = {
  'barbarian':'Barbaro',
  'bard':     'Bardo',
  'cleric':   'Chierico',
  'druid':    'Druido',
  'fighter':  'Guerriero',
  'rogue':    'Ladro',
  'wizard':   'Mago',
  'monk':     'Monaco',
  'paladin':  'Paladino',
  'ranger':   'Ranger',
  'sorcerer': 'Stregone',
  'warlock':  'Warlock',
}
/** Restituisce il nome italiano di una classe. Accetta inglese lowercase o Title Case. */
export function getItalianClass(name?: string): string {
  if (!name) return ''
  return classItalianNames[name.toLowerCase()] ?? name
}

/** Restituisce l'inglese lowercase di una classe a partire dal nome italiano. */
export function getEnglishClass(name: string): string {
  return classEnglishNames[name] ?? name.toLowerCase()
}

/** Converte un array di classi inglesi in italiano. */
export function getItalianClasses(names: string[]): string[] {
  return names.map(getItalianClass)
}

// ─── SCUOLE DI MAGIA ──────────────────────────────────────────────────────────

export const schoolItalianNames: Record<string, string> = {
  'abjuration':  'Abiurazione',
  'conjuration': 'Evocazione',
  'divination':  'Divinazione',
  'enchantment': 'Ammaliamento',
  'evocation':   'Invocazione',
  'illusion':    'Illusione',
  'necromancy':  'Necromanzia',
  'transmutation':'Trasmutazione',
}

export function getItalianSchool(name?: string): string {
  if (!name) return ''
  return schoolItalianNames[name.toLowerCase()] ?? name
}

export const itemTypeItalianNames: Record<string, string> = {
  'weapon':     'Arma',
  'armor':      'Armatura',
  'gear':       'Equipaggiamento',
  'consumable': 'Consumabile',
  'ammunition': 'Munizione',
  'tool':       'Attrezzo',
  'currency':   'Moneta',
}
export function getItalianItemType(type?: string): string {
  if (!type) return ''
  return itemTypeItalianNames[type.toLowerCase()] ?? type
}

export const currencyItalianNames: Record<string, string> = {
  'po': "Moneta d'Oro",
  'pa': "Moneta di Platino",
  'pr': "Moneta d'Elettro",
  'pe': "Moneta d'Argento",
  'mo': "Moneta di Rame",
}

export function getItalianCurrency(c?: string): string {
  if (!c) return ''
  return currencyItalianNames[c.toLowerCase()] ?? c
}

// ─── RARITÀ ───────────────────────────────────────────────────────────────────

export const rarityItalianNames: Record<string, string> = {
  'common':    'Comune',
  'uncommon':  'Non Comune',
  'rare':      'Raro',
  'very rare': 'Molto Raro',
  'legendary': 'Leggendario',
  'artifact':  'Artefatto',
}

export function getItalianRarity(rarity?: string): string {
  if (!rarity) return ''
  return rarityItalianNames[rarity.toLowerCase()] ?? rarity
}
export const abilityItalianNames: Record<string, string> = {
  'str': 'Forza',
  'dex': 'Destrezza',
  'con': 'Costituzione',
  'int': 'Intelligenza',
  'wis': 'Saggezza',
  'cha': 'Carisma',
}
export function getItalianAbility(abbr?: string): string {
  if (!abbr) return ''
  return abilityItalianNames[abbr.toLowerCase()] ?? abbr
}

/** Chiavi full English → nome italiano */
export const abilityFullItalianNames: Record<string, string> = {
  strength:     'Forza',
  dexterity:    'Destrezza',
  constitution: 'Costituzione',
  intelligence: 'Intelligenza',
  wisdom:       'Saggezza',
  charisma:     'Carisma',
}

/** Chiavi full English → abbreviazione italiana (3 lettere maiuscole) */
export const abilityShortNames: Record<string, string> = {
  strength:     'FOR',
  dexterity:    'DES',
  constitution: 'COS',
  intelligence: 'INT',
  wisdom:       'SAG',
  charisma:     'CAR',
}

export function getItalianAbilityFull(name?: string): string {
  if (!name) return ''
  return abilityFullItalianNames[name.toLowerCase()] ?? name
}

export function getAbilityShort(name?: string): string {
  if (!name) return ''
  return abilityShortNames[name.toLowerCase()] ?? name.slice(0, 3).toUpperCase()
}

/**
 * Array ordinato delle 6 caratteristiche con id, nome italiano e abbreviazione.
 * Usato da AbilityScoresStep, StatDiamond, ecc.
 */
export const ABILITY_LIST: { key: string; label: string; name: string }[] = [
  { key: 'strength',     label: 'FOR', name: 'Forza' },
  { key: 'dexterity',    label: 'DES', name: 'Destrezza' },
  { key: 'constitution', label: 'COS', name: 'Costituzione' },
  { key: 'intelligence', label: 'INT', name: 'Intelligenza' },
  { key: 'wisdom',       label: 'SAG', name: 'Saggezza' },
  { key: 'charisma',     label: 'CAR', name: 'Carisma' },
]

/**
 * Array ordinato delle 6 caratteristiche con id, nome italiano e icona emoji.
 * Usato da LevelUpASIStep, ecc.
 */
export const ABILITY_LIST_ICONS: { id: string; label: string; icon: string }[] = [
  { id: 'strength',     label: 'Forza',        icon: '💪' },
  { id: 'dexterity',    label: 'Destrezza',    icon: '🏃' },
  { id: 'constitution', label: 'Costituzione', icon: '❤️' },
  { id: 'intelligence', label: 'Intelligenza', icon: '🧠' },
  { id: 'wisdom',       label: 'Saggezza',     icon: '🕯️' },
  { id: 'charisma',     label: 'Carisma',      icon: '👑' },
]

/** I 9 allineamenti D&D in italiano. */
export const ALIGNMENTS: string[] = [
  'Legale Buono',
  'Neutrale Buono',
  'Caotico Buono',
  'Legale Neutrale',
  'Neutrale',
  'Caotico Neutrale',
  'Legale Malvagio',
  'Neutrale Malvagio',
  'Caotico Malvagio',
]