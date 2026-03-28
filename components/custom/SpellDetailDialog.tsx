'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Clock,
  Target,
  Hourglass,
  ScrollText,
  BookOpen,
  Shield,
  Wand2,
  Eye,
  Heart,
  Zap,
  Moon,
  Skull,
  Brain,
  Sparkles,
  Star,
  Crown,
  Users,
} from 'lucide-react'
import { getItalianSchool, getItalianClass } from '@/lib/utils/nameMappers'
import type { Spell, SpellSchool } from '@/types/spell'

const schoolIcons: Record<SpellSchool, { icon: React.ElementType; color: string }> = {
  abjuration:   { icon: Shield,  color: 'text-blue-500' },
  conjuration:  { icon: Wand2,   color: 'text-purple-500' },
  divination:   { icon: Eye,     color: 'text-indigo-500' },
  enchantment:  { icon: Heart,   color: 'text-pink-500' },
  evocation:    { icon: Zap,     color: 'text-orange-500' },
  illusion:     { icon: Moon,    color: 'text-cyan-500' },
  necromancy:   { icon: Skull,   color: 'text-gray-500' },
  transmutation:{ icon: Brain,   color: 'text-emerald-500' },
}

const levelLabel = (level: number) => {
  if (level === 0) return 'Trucchetto'
  return `${level}° Livello`
}

const LevelIcon = (level: number) => level >= 6 ? Crown : level === 0 ? Sparkles : Star

interface SpellDetailDialogProps {
  spell: Spell | null
  open: boolean
  onClose: () => void
}

export default function SpellDetailDialog({ spell, open, onClose }: SpellDetailDialogProps) {
  if (!spell) return null

  const schoolInfo = schoolIcons[spell.school]
  const SchoolIcon = schoolInfo?.icon ?? BookOpen
  const schoolColor = schoolInfo?.color ?? 'text-amber-600'
  const LvlIcon = LevelIcon(spell.level)

  const componentStr = (() => {
    const comp = spell.components as unknown as { verbal?: boolean; somatic?: boolean; material?: string } | string[] | null
    if (!comp) return { text: '—', material: null }
    if (Array.isArray(comp)) {
      return { text: comp.join(', '), material: null }
    }
    const parts: string[] = []
    if (comp.verbal) parts.push('V')
    if (comp.somatic) parts.push('S')
    if (comp.material) parts.push('M')
    return { text: parts.length ? parts.join(', ') : '—', material: typeof comp.material === 'string' ? comp.material : null }
  })()

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-amber-50/95">
        <DialogHeader>
          <div className="flex items-center gap-3 pr-8">
            <div className={`p-2 rounded-lg ${schoolColor} bg-amber-100 border border-amber-300`}>
              <SchoolIcon className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-serif font-bold text-amber-900">
                {spell.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-0.5 text-amber-700 text-sm font-serif">
                <LvlIcon className="w-4 h-4" />
                <span>{levelLabel(spell.level)}</span>
                <span className="text-amber-400">•</span>
                <BookOpen className="w-4 h-4" />
                <span>{getItalianSchool(spell.school)}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Classi */}
        {spell.classes && spell.classes.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Users className="w-4 h-4 text-amber-600 shrink-0" />
            {spell.classes.map((cls) => (
              <Badge key={cls} className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                {getItalianClass(cls)}
              </Badge>
            ))}
          </div>
        )}

        {/* Statistiche */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="bg-amber-50/40 border-amber-200">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-1 text-amber-600 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs uppercase tracking-wider font-serif">Lancio</span>
              </div>
              <p className="text-amber-900 font-serif text-sm font-medium">{spell.casting_time || '—'}</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50/40 border-amber-200">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-1 text-amber-600 mb-1">
                <Target className="w-3.5 h-3.5" />
                <span className="text-xs uppercase tracking-wider font-serif">Gittata</span>
              </div>
              <p className="text-amber-900 font-serif text-sm font-medium">{spell.range || '—'}</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50/40 border-amber-200">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-1 text-amber-600 mb-1">
                <Hourglass className="w-3.5 h-3.5" />
                <span className="text-xs uppercase tracking-wider font-serif">Durata</span>
              </div>
              <p className="text-amber-900 font-serif text-sm font-medium">{spell.duration || '—'}</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50/40 border-amber-200">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-1 text-amber-600 mb-1">
                <ScrollText className="w-3.5 h-3.5" />
                <span className="text-xs uppercase tracking-wider font-serif">Componenti</span>
              </div>
              <p className="text-amber-900 font-serif text-sm font-medium">{componentStr.text}</p>
              {componentStr.material && (
                <p className="text-xs text-amber-500 mt-0.5">({componentStr.material})</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Badge rituale/concentrazione */}
        {(spell.ritual || spell.concentration) && (
          <div className="flex gap-2">
            {spell.ritual && (
              <Badge className="bg-purple-100 text-purple-700 border-purple-300">📖 Rituale</Badge>
            )}
            {spell.concentration && (
              <Badge className="bg-orange-100 text-orange-700 border-orange-300">🧠 Concentrazione</Badge>
            )}
          </div>
        )}

        {/* Descrizione */}
        <div>
          <div className="relative mb-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-300/40" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-amber-50/95 px-3 text-amber-600 text-xs font-serif tracking-wider">
                ✦ Descrizione ✦
              </span>
            </div>
          </div>
          <p className="text-amber-800 whitespace-pre-wrap leading-relaxed font-serif text-sm">
            {spell.description || 'Nessuna descrizione disponibile.'}
          </p>
        </div>

        {/* A livelli superiori */}
        {spell.at_higher_levels && (
          <div>
            <div className="relative mb-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-amber-300/40" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-amber-50/95 px-3 text-amber-600 text-xs font-serif tracking-wider">
                  ✦ A Livelli Superiori ✦
                </span>
              </div>
            </div>
            <p className="text-amber-800 whitespace-pre-wrap leading-relaxed font-serif text-sm">
              {spell.at_higher_levels}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
