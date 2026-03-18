// lib/nameMappers.ts
// Mappe nomi italiani → inglese per razze
export const raceEnglishNames: Record<string, string> = {
  'Umano': 'human',
  'Elfo': 'elf',
  'Nano': 'dwarf',
  'Halfling': 'halfling',
  'Gnomo': 'gnome',
  'Mezzelfo': 'half-elf',
  'Mezzorco': 'half-orc',
  'Tiefling': 'tiefling',
  'Dragonide': 'dragonborn',
};

// Mappe nomi italiani → inglese per classi
export const classEnglishNames: Record<string, string> = {
  'Barbaro': 'barbarian',
  'Bardo': 'bard',
  'Chierico': 'cleric',
  'Druido': 'druid',
  'Guerriero': 'fighter',
  'Ladro': 'rogue',
  'Mago': 'wizard',
  'Monaco': 'monk',
  'Paladino': 'paladin',
  'Ranger': 'ranger',
  'Stregone': 'sorcerer',
  'Warlock': 'warlock',
};

// Funzione per ottenere il nome inglese
export function getEnglishName(name: string, type: 'race' | 'class'): string {
  if (type === 'race') {
    return raceEnglishNames[name] || name.toLowerCase();
  } else {
    return classEnglishNames[name] || name.toLowerCase();
  }
}