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
export function getItalianRace(name: string): string {
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
export function getItalianClass(name: string): string {
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

export function getItalianSchool(name: string): string {
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
export function getItalianItemType(type: string): string {
  return itemTypeItalianNames[type.toLowerCase()] ?? type
}

export const currencyItalianNames: Record<string, string> = {
  'po': "Pezzo d'oro",
  'pa': "Pezzo d'argento",
  'pr': "Pezzo di rame",
  'pe': 'Electrum',
  'mo': 'Moneta',
}

export function getItalianCurrency(c: string): string {
  return currencyItalianNames[c.toLowerCase()] ?? c
}