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

/** Classi Tailwind per i badge delle scuole di magia (badge pill). */
export const schoolBadgeColors: Record<string, string> = {
  abjuration:    'bg-blue-100 text-blue-800',
  conjuration:   'bg-amber-100 text-amber-800',
  divination:    'bg-purple-100 text-purple-800',
  enchantment:   'bg-pink-100 text-pink-800',
  evocation:     'bg-red-100 text-red-800',
  illusion:      'bg-teal-100 text-teal-800',
  necromancy:    'bg-gray-800 text-gray-100',
  transmutation: 'bg-indigo-100 text-indigo-800',
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

// ─── COLORI PER TIPO OGGETTO ──────────────────────────────────────────────────

/** Colori testo Tailwind per icone del tipo oggetto (usato in ItemCard). */
export const itemTypeIconColors: Record<string, string> = {
  weapon:     'text-red-800',
  armor:      'text-blue-800',
  gear:       'text-amber-800',
  consumable: 'text-green-800',
  ammunition: 'text-yellow-800',
  tool:       'text-purple-800',
  currency:   'text-amber-600',
}

/** Colori bordo Tailwind per gruppi inventario (usato in InventoryGrouped). */
export const itemTypeBorderColors: Record<string, string> = {
  weapon:     'border-red-800/30 hover:border-red-700/50',
  armor:      'border-blue-800/30 hover:border-blue-700/50',
  gear:       'border-amber-800/30 hover:border-amber-700/50',
  consumable: 'border-green-800/30 hover:border-green-700/50',
  ammunition: 'border-yellow-800/30 hover:border-yellow-700/50',
  tool:       'border-purple-800/30 hover:border-purple-700/50',
  currency:   'border-amber-600/30 hover:border-amber-500/50',
}

// ─── COLORI PER RARITÀ ────────────────────────────────────────────────────────

/** Colori testo Tailwind per badge rarità (usato in ItemCard, ItemForm). */
export const rarityTextColors: Record<string, string> = {
  common:     'text-gray-500',
  uncommon:   'text-green-600',
  rare:       'text-blue-600',
  'very rare':'text-purple-600',
  legendary:  'text-orange-600',
  artifact:   'text-red-600',
}