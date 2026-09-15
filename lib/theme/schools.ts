/**
 * Identità visiva delle scuole di magia — unica fonte.
 *
 * Prima esistevano cinque mappe indipendenti (`nameMappers.schoolBadgeColors`,
 * `SpellCard.schoolConfig`, `SpellDetailDialog.schoolIcons`,
 * `admin/spells.schoolOptions`, `admin/spells/[id].schoolIcons`) che
 * assegnavano tre colori diversi alla stessa scuola: la stessa evocazione era
 * ambra in un file, viola in un altro, indaco in un terzo.
 *
 * Ora il colore vive in un token (`--color-school-*` in `globals.css`) e le
 * classi nascono da qui. Le stringhe sono letterali di proposito: Tailwind non
 * può generare utility da nomi costruiti a runtime.
 */
import {
  Brain,
  Eye,
  Heart,
  Moon,
  Shield,
  Skull,
  Sparkles,
  Wand2,
  Zap,
  Crown,
  Star,
  type LucideIcon,
} from "lucide-react"

import { SchoolItalianNames, type SpellSchool } from "@/types/spell"

export interface SchoolMeta {
  /** Nome italiano della scuola */
  it: string
  icon: LucideIcon
  /** Colore di testo/icona */
  text: string
  /** Fondo tenue dello stesso colore */
  bg: string
  /** Bordo tenue dello stesso colore */
  border: string
  /** Classi pronte per un Badge */
  badge: string
  /** Pallino/pastiglia piena */
  dot: string
}

type SchoolStyle = Omit<SchoolMeta, "it" | "icon">

const STYLE: Record<SpellSchool, SchoolStyle> = {
  abjuration: {
    text: "text-school-abjuration",
    bg: "bg-school-abjuration/10",
    border: "border-school-abjuration/35",
    badge: "bg-school-abjuration/10 text-school-abjuration border-school-abjuration/35",
    dot: "bg-school-abjuration",
  },
  conjuration: {
    text: "text-school-conjuration",
    bg: "bg-school-conjuration/10",
    border: "border-school-conjuration/35",
    badge: "bg-school-conjuration/10 text-school-conjuration border-school-conjuration/35",
    dot: "bg-school-conjuration",
  },
  divination: {
    text: "text-school-divination",
    bg: "bg-school-divination/10",
    border: "border-school-divination/35",
    badge: "bg-school-divination/10 text-school-divination border-school-divination/35",
    dot: "bg-school-divination",
  },
  enchantment: {
    text: "text-school-enchantment",
    bg: "bg-school-enchantment/10",
    border: "border-school-enchantment/35",
    badge: "bg-school-enchantment/10 text-school-enchantment border-school-enchantment/35",
    dot: "bg-school-enchantment",
  },
  evocation: {
    text: "text-school-evocation",
    bg: "bg-school-evocation/10",
    border: "border-school-evocation/35",
    badge: "bg-school-evocation/10 text-school-evocation border-school-evocation/35",
    dot: "bg-school-evocation",
  },
  illusion: {
    text: "text-school-illusion",
    bg: "bg-school-illusion/10",
    border: "border-school-illusion/35",
    badge: "bg-school-illusion/10 text-school-illusion border-school-illusion/35",
    dot: "bg-school-illusion",
  },
  necromancy: {
    text: "text-school-necromancy",
    bg: "bg-school-necromancy/10",
    border: "border-school-necromancy/35",
    badge: "bg-school-necromancy/10 text-school-necromancy border-school-necromancy/35",
    dot: "bg-school-necromancy",
  },
  transmutation: {
    text: "text-school-transmutation",
    bg: "bg-school-transmutation/10",
    border: "border-school-transmutation/35",
    badge: "bg-school-transmutation/10 text-school-transmutation border-school-transmutation/35",
    dot: "bg-school-transmutation",
  },
}

const ICON: Record<SpellSchool, LucideIcon> = {
  abjuration: Shield,
  conjuration: Wand2,
  divination: Eye,
  enchantment: Heart,
  evocation: Zap,
  illusion: Moon,
  necromancy: Skull,
  transmutation: Brain,
}

export const SPELL_SCHOOLS = Object.fromEntries(
  (Object.keys(STYLE) as SpellSchool[]).map((key) => [
    key,
    { it: SchoolItalianNames[key], icon: ICON[key], ...STYLE[key] },
  ])
) as Record<SpellSchool, SchoolMeta>

/** Ordine canonico per filtri e menu a tendina */
export const SPELL_SCHOOL_ORDER = Object.keys(SPELL_SCHOOLS) as SpellSchool[]

/** Stile neutro per scuole sconosciute o dati incompleti */
export const UNKNOWN_SCHOOL: SchoolMeta = {
  it: "Sconosciuta",
  icon: Sparkles,
  text: "text-ink-muted",
  bg: "bg-parchment-200/60",
  border: "border-frame/25",
  badge: "bg-parchment-200/60 text-ink-muted border-frame/25",
  dot: "bg-ink-muted",
}

export function getSchoolMeta(school?: string | null): SchoolMeta {
  if (!school) return UNKNOWN_SCHOOL
  return SPELL_SCHOOLS[school.toLowerCase() as SpellSchool] ?? UNKNOWN_SCHOOL
}

// ─── LIVELLI ─────────────────────────────────────────────────────────────────

export interface SpellLevelMeta {
  icon: LucideIcon
  label: string
}

const LEVEL_ICONS: LucideIcon[] = [
  Sparkles, // trucchetto
  Star,
  Star,
  Star,
  Star,
  Star,
  Crown, // dal 6° in su l'incantesimo è "alto"
  Crown,
  Crown,
  Crown,
]

/** Etichetta e icona del livello. Era replicato in tre file identici. */
export function getSpellLevelMeta(level: number): SpellLevelMeta {
  const safe = Math.max(0, Math.min(9, level))
  return {
    icon: LEVEL_ICONS[safe],
    label: safe === 0 ? "Trucchetto" : `${safe}° Livello`,
  }
}

export const SPELL_LEVEL_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
