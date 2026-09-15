// components/character/sheet/SkillsDisplay.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { BookOpen, Info, CheckCircle2, Star, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateModifier } from '@/lib/calculations/abilityModifiers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Skill } from '@/types/skill';
import type { AbilityScores, ProficiencyType } from '@/types/character';
import { getItalianAbilityFull } from '@/lib/utils/nameMappers';

interface SkillsDisplayProps {
  information?: boolean;
  /** Numero di colonne della griglia (default: 3) */
  gridCols?: 1 | 2 | 3 | 4;
  /**
   * Titolo interno. Va spento quando il componente vive dentro una tab che si
   * chiama già "Competenze", altrimenti la stessa parola compare due volte.
   */
  showTitle?: boolean;
  skills: Skill[];
  characterSkills: Map<number, ProficiencyType>;
  abilityScores: AbilityScores;
  proficiencyBonus: number;
  className?: string;
}

export function SkillsDisplay({
  skills,
  gridCols = 3,
  characterSkills,
  abilityScores,
  proficiencyBonus,
  information = true,
  showTitle = true,
}: SkillsDisplayProps) {

  /** Segno sempre esplicito: "+3" si legge, "3" no. */
  const formatModifier = (n: number) => (n >= 0 ? `+${n}` : `${n}`);

  const getSkillBonus = (skill: Skill) => {
    const abilityScore = abilityScores[skill.ability as keyof typeof abilityScores] || 10;
    const abilityMod = calculateModifier(abilityScore);
    const proficiency = characterSkills.get(skill.id);

    if (!proficiency || proficiency === 'none') {
      return abilityMod;
    }

    if (proficiency === 'proficient') {
      return abilityMod + proficiencyBonus;
    }

    if (proficiency === 'expertise') {
      return abilityMod + proficiencyBonus * 2;
    }

    if (proficiency === 'half') {
      return abilityMod + Math.floor(proficiencyBonus / 2);
    }

    return abilityMod;
  };

  /**
   * Come si compone il bonus, in parole: "Destrezza +1 + competenza 2".
   * Serve nel tooltip e nel dettaglio, quindi deve essere leggibile da sola.
   */
  const getBonusBreakdown = (skill: Skill) => {
    const abilityScore = abilityScores[skill.ability as keyof typeof abilityScores] || 10;
    const abilityMod = calculateModifier(abilityScore);
    const proficiency = characterSkills.get(skill.id);
    const base = `${getItalianAbilityFull(skill.ability)} ${formatModifier(abilityMod)}`;

    if (!proficiency || proficiency === 'none') return base;
    if (proficiency === 'proficient') return `${base} + competenza ${proficiencyBonus}`;
    if (proficiency === 'expertise') return `${base} + perizia ${proficiencyBonus * 2}`;
    if (proficiency === 'half') {
      return `${base} + mezza competenza ${Math.floor(proficiencyBonus / 2)}`;
    }
    return base;
  };

  const trainedCount = Array.from(characterSkills.values()).filter((v) => v !== 'none').length;
  const expertiseCount = Array.from(characterSkills.values()).filter((v) => v === 'expertise').length;

  return (
    <div className="space-y-4">
      {(showTitle || information) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {showTitle ? (
            <h3 className="flex items-center gap-2 text-xl fantasy-title">
              <Target className="h-5 w-5 text-frame" aria-hidden="true" />
              Competenze
            </h3>
          ) : (
            <span className="eyebrow">Riepilogo competenze</span>
          )}

          {/* La legenda non introduce simboli propri: mostra gli stessi badge
              che si incontrano nelle tessere. Prima annunciava un cerchio
              verde e una stella blu che nelle card non comparivano mai. */}
          {information && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="surface-tile inline-flex items-center gap-1.5 px-2.5 py-1 text-ink">
                <CheckCircle2 className="h-3.5 w-3.5 text-frame" aria-hidden="true" />
                <span className="stat-value text-sm">{trainedCount}</span>
                competenti
              </span>
              {expertiseCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-antique-gold/60 bg-antique-gold/15 px-2.5 py-1 text-frame-deep">
                  <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  <span className="stat-value text-sm">{expertiseCount}</span>
                  con perizia
                </span>
              )}
              <span className="surface-well px-2.5 py-1 text-ink-muted">
                Bonus competenza{' '}
                <strong className="stat-value text-ink-strong">
                  {formatModifier(proficiencyBonus)}
                </strong>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Griglia competenze. `auto-rows-fr` tiene le tessere della stessa riga
          alla stessa altezza anche quando un nome va a capo. */}
      <div
        className={cn(
          'grid auto-rows-fr gap-3',
          gridCols === 1 && 'grid-cols-1',
          gridCols === 2 && 'grid-cols-1 md:grid-cols-2',
          gridCols === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          gridCols === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        )}
      >
        {skills.map((skill) => {
          const proficiency = characterSkills.get(skill.id);
          const isSelected = proficiency && proficiency !== 'none';
          const isExpertise = proficiency === 'expertise';
          const bonus = getSkillBonus(skill);
          const abilityScore = abilityScores[skill.ability as keyof typeof abilityScores] || 10;
          const abilityMod = calculateModifier(abilityScore);

          return (
            <article
              key={skill.id}
              className={cn(
                'group flex items-center justify-between gap-3 rounded-control border p-3',
                'transition-[transform,box-shadow,border-color] duration-200 ease-soft',
                isExpertise
                  ? 'surface-tile border-antique-gold/70 shadow-e2'
                  : isSelected
                    ? 'surface-flat border-antique-gold/45 hover:shadow-e2'
                    : 'surface-flat border-frame/20 hover:border-frame/35 hover:shadow-e2'
              )}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-medium text-ink-strong">{skill.name_it}</span>
                  {/* Un solo linguaggio per lo stato: oro. La perizia è "più"
                      della competenza (bordo pieno + stella), non un'altra
                      categoria con un altro colore. */}
                  {isExpertise ? (
                    <Badge className="gap-1 border-antique-gold/60 bg-antique-gold/20 text-xs text-frame-deep">
                      <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                      Perizia
                    </Badge>
                  ) : isSelected ? (
                    <Badge className="gap-1 border-frame/25 bg-parchment-200/70 text-xs text-ink">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      Competente
                    </Badge>
                  ) : null}
                </div>
                {/* Riga secondaria: solo il dato utile. Prima diceva anche
                    "competenza attiva", che ripeteva il badge qui sopra. */}
                <p className="mt-0.5 text-xs text-ink-muted">
                  {getItalianAbilityFull(skill.ability)}{' '}
                  <span className="stat-value text-xs">{formatModifier(abilityMod)}</span>
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                {/* Il totale è sempre in inchiostro pieno: prima cambiava colore
                    e sugli inesperti (ambra-500 su pergamena) i "+0" non si
                    leggevano. Ora cambia il badge, non la leggibilità. */}
                <span
                  className="stat-value text-2xl"
                  title={`Calcolo: ${getBonusBreakdown(skill)} = ${formatModifier(bonus)}`}
                >
                  {formatModifier(bonus)}
                </span>

                {/* Sempre visibile: prima compariva solo al passaggio del mouse,
                    quindi su tablet e telefono non si scopriva che esistesse. */}
                {skill.description && (
                  <Dialog>
                    <DialogTrigger
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-muted opacity-70 transition-[opacity,background-color,color] duration-200 hover:bg-parchment-200/70 hover:text-ink-strong hover:opacity-100 focus-visible:opacity-100"
                      aria-label={`Dettagli di ${skill.name_it}`}
                    >
                      <Info className="h-4 w-4" aria-hidden="true" />
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl fantasy-title">
                          <BookOpen className="h-4 w-4 text-frame" aria-hidden="true" />
                          {skill.name_it}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="surface-tile text-ink-strong">
                            {getItalianAbilityFull(skill.ability)}
                          </Badge>
                          {isExpertise && (
                            <Badge className="gap-1 border-antique-gold/60 bg-antique-gold/20 text-frame-deep">
                              <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                              Perizia
                            </Badge>
                          )}
                          {isSelected && !isExpertise && (
                            <Badge className="gap-1 border-frame/25 bg-parchment-200/70 text-ink">
                              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                              Competente
                            </Badge>
                          )}
                        </div>

                        <div className="surface-well p-4">
                          <p className="leading-relaxed text-ink">{skill.description}</p>
                        </div>

                        {/* Il calcolo si legge come una frase e poi come numero:
                            prima era una stringa mono con i segni tutti attaccati. */}
                        <div className="space-y-1.5 border-t border-frame/20 pt-3">
                          <p className="eyebrow">Bonus attuale</p>
                          <p className="stat-value text-lg">{formatModifier(bonus)}</p>
                          <p className="text-xs text-ink-muted">{getBonusBreakdown(skill)}</p>
                          <p className="pt-1 text-xs text-ink-muted">
                            Prova di {skill.name_it}:{' '}
                            <span className="stat-value text-xs">
                              1d20 {formatModifier(bonus)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}