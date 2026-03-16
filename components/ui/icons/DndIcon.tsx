export type DndIconName =
  | 'cubes'
  | 'd4'
  | 'd10'
  | 'd12'
  | 'dice-eight-faces-eight'
  | 'dice-fire'
  | 'dice-shield'
  | 'dice-six-faces-one'
  | 'dice-six-faces-two'
  | 'dice-six-faces-three'
  | 'dice-six-faces-four'
  | 'dice-six-faces-five'
  | 'dice-six-faces-six'
  | 'dice-target'
  | 'dice-twenty-faces-one'
  | 'dice-twenty-faces-twenty'
  | 'inverted-dice-1'
  | 'inverted-dice-2'
  | 'inverted-dice-3'
  | 'inverted-dice-4'
  | 'inverted-dice-5'
  | 'inverted-dice-6'
  | 'perspective-dice-five'
  | 'perspective-dice-four'
  | 'perspective-dice-one'
  | 'perspective-dice-six'
  | 'perspective-dice-six-faces-five'
  | 'perspective-dice-six-faces-four'
  | 'perspective-dice-six-faces-one'
  | 'perspective-dice-six-faces-random'
  | 'perspective-dice-six-faces-six'
  | 'perspective-dice-six-faces-three'
  | 'perspective-dice-six-faces-two'
  | 'perspective-dice-three'
  | 'perspective-dice-two'
  | 'rolling-dice-cup'
  | 'rolling-dices'
  | 'rule-book';

interface DndIconProps {
  /** Nome del file SVG (senza .svg) */
  name: DndIconName;
  /** Dimensione in px (default: 24) */
  size?: number;
  /**
   * Classi Tailwind extra.
   * Il COLORE si controlla con `text-*`, es: "text-amber-500"
   * La DIMENSIONE si controlla con il prop `size` oppure `w-* h-*`
   */
  className?: string;
  /** Aria label per accessibilità */
  'aria-label'?: string;
}

/**
 * Icona D&D da `/public/icon/*.svg`
 *
 * Il colore segue la proprietà CSS `color` → usa classi Tailwind `text-*`
 *
 * @example
 * <DndIcon name="dice-twenty-faces-twenty" size={48} className="text-amber-500" />
 * <DndIcon name="rule-book" size={32} className="text-red-700" />
 */
export function DndIcon({ name, size = 24, className, 'aria-label': ariaLabel }: DndIconProps) {
  return (
    <span
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      className={className}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        backgroundColor: 'currentColor',
        maskImage: `url('/icon/${name}.svg')`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url('/icon/${name}.svg')`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
    />
  );
}
