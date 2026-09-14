'use client';

import { useEffect, useRef } from 'react';

/**
 * Alone caldo che segue il puntatore.
 *
 * Perché un componente a sé: la pagina resta un Server Component (zero JS di
 * pagina) e questo è l'unico pezzo interattivo. La posizione viene scritta
 * come custom property CSS dentro un requestAnimationFrame, quindi il
 * movimento non provoca alcun re-render di React.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Utenti touch o con riduzione del movimento: nessun effetto.
    const media = window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)');
    if (media.matches) return;

    let frame = 0;

    const handleMove = (event: PointerEvent) => {
      if (frame) return; // un solo aggiornamento per frame
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.setProperty('--mx', `${(event.clientX / window.innerWidth) * 100}%`);
        el.style.setProperty('--my', `${(event.clientY / window.innerHeight) * 100}%`);
      });
    };

    window.addEventListener('pointermove', handleMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handleMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'radial-gradient(560px circle at var(--mx, 50%) var(--my, 30%), rgba(184, 134, 11, 0.16), transparent 65%)',
      }}
    />
  );
}
