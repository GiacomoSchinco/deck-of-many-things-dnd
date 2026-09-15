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
  Brain,
  Users,
} from 'lucide-react'
import { getItalianClass } from '@/lib/utils/nameMappers'
import { getSchoolMeta, getSpellLevelMeta } from '@/lib/theme/schools'
import type { Spell } from '@/types/spell'
interface SpellDetailDialogProps {
  spell: Spell | null
  open: boolean
  onClose: () => void
}

export default function SpellDetailDialog({ spell, open, onClose }: SpellDetailDialogProps) {
  if (!spell) return null

  const school = getSchoolMeta(spell.school)
  const SchoolIcon = school.icon
  const { icon: LvlIcon, label: levelText } = getSpellLevelMeta(spell.level)

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 pr-8">
            <div className={`p-2 rounded-control border ${school.text} ${school.bg} ${school.border}`}>
              <SchoolIcon className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl fantasy-title">
                {spell.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-0.5 text-ink-muted text-sm font-serif">
                <LvlIcon className="w-4 h-4" />
                <span>{levelText}</span>
                <span className="text-frame/50">•</span>
                <BookOpen className="w-4 h-4" />
                <span>{school.it}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Classi */}
        {spell.classes && spell.classes.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Users className="w-4 h-4 text-frame shrink-0" />
            {spell.classes.map((cls) => (
              <Badge key={cls} className="surface-tile text-ink-strong text-xs">
                {getItalianClass(cls)}
              </Badge>
            ))}
          </div>
        )}

        {/* Statistiche */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="shadow-e1">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-1 text-frame mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs uppercase tracking-wider font-serif">Lancio</span>
              </div>
              <p className="text-ink-strong font-serif text-sm font-medium">{spell.casting_time || '—'}</p>
            </CardContent>
          </Card>
          <Card className="shadow-e1">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-1 text-frame mb-1">
                <Target className="w-3.5 h-3.5" />
                <span className="text-xs uppercase tracking-wider font-serif">Gittata</span>
              </div>
              <p className="text-ink-strong font-serif text-sm font-medium">{spell.range || '—'}</p>
            </CardContent>
          </Card>
          <Card className="shadow-e1">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-1 text-frame mb-1">
                <Hourglass className="w-3.5 h-3.5" />
                <span className="text-xs uppercase tracking-wider font-serif">Durata</span>
              </div>
              <p className="text-ink-strong font-serif text-sm font-medium">{spell.duration || '—'}</p>
            </CardContent>
          </Card>
          <Card className="shadow-e1">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-1 text-frame mb-1">
                <ScrollText className="w-3.5 h-3.5" />
                <span className="text-xs uppercase tracking-wider font-serif">Componenti</span>
              </div>
              <p className="text-ink-strong font-serif text-sm font-medium">{componentStr.text}</p>
              {componentStr.material && (
                <p className="text-xs text-ink-muted mt-0.5">({componentStr.material})</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Badge rituale/concentrazione */}
        {(spell.ritual || spell.concentration) && (
          <div className="flex gap-2">
            {spell.ritual && (
              <Badge className="gap-1 border-frame/30 bg-parchment-200 text-frame-deep">
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                Rituale
              </Badge>
            )}
            {spell.concentration && (
              <Badge className="gap-1 border-antique-gold/40 bg-antique-gold/15 text-frame-deep">
                <Brain className="h-3.5 w-3.5" aria-hidden="true" />
                Concentrazione
              </Badge>
            )}
          </div>
        )}

        {/* Descrizione */}
        <div>
          <div className="relative mb-3">
            <div className="absolute inset-0 flex items-center">
              <div className="divider-ornate w-full" />
            </div>
            <div className="relative flex justify-center">
              <span className="eyebrow bg-parchment-50 px-3">
                Descrizione
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
                <div className="divider-ornate w-full" />
              </div>
              <div className="relative flex justify-center">
                <span className="eyebrow bg-parchment-50 px-3">
                  A Livelli Superiori
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
