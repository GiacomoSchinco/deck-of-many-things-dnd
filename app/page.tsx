// app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button-variants';
import {
  LogIn,
  ScrollText,
  Shield,
  Sparkles,
  Sword,
  UserPlus,
  Users,
  Wand2,
} from 'lucide-react';
import { CursorGlow } from '@/components/custom/CursorGlow';
import { cn } from '@/lib/utils';

/** Punti di forza mostrati sotto l'hero: danno sostanza alla landing. */
const FEATURES = [
  {
    icon: ScrollText,
    title: 'Schede sempre complete',
    text: 'Caratteristiche, tiri salvezza, abilità, equipaggiamento e incantesimi in un unico posto.',
  },
  {
    icon: Wand2,
    title: 'Progressione guidata',
    text: 'Wizard di creazione e di level up che applicano le regole di D&D 5e al posto tuo.',
  },
  {
    icon: Users,
    title: 'Campagne condivise',
    text: 'Master e giocatori nella stessa taverna, con i personaggi sempre allineati.',
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Alone che segue il puntatore: custom property CSS via rAF, nessun re-render */}
      <CursorGlow />

      {/* Decorazioni di sfondo: icone vettoriali a bassa opacità al posto delle emoji */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <Sword className="absolute top-10 left-[4%] h-24 w-24 rotate-12 text-frame/10" />
        <Shield className="absolute right-[6%] bottom-16 h-28 w-28 -rotate-6 text-frame/10" />
        <Sparkles className="absolute top-1/3 right-[10%] h-14 w-14 rotate-12 text-frame/10" />
        <ScrollText className="absolute bottom-1/4 left-[8%] h-16 w-16 -rotate-12 text-frame/10" />
      </div>

      <div className="relative z-10">
        {/* Il logo contiene già il wordmark: l'h1 resta per screen reader e SEO */}
        <h1 className="sr-only">Deck of Many Things — gestione schede personaggio D&amp;D 5e</h1>

        <section className="flex flex-col items-center pt-2 text-center">
          <Image
            src="/images/logo.png"
            alt="Deck of Many Things"
            width={1200}
            height={420}
            priority
            className="w-full max-w-3xl object-contain drop-shadow-2xl"
          />

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink">
            Crea eroi leggendari, tieni traccia di equipaggiamento e incantesimi, e porta la tua
            campagna in una taverna dove tutto resta allineato.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/create-character"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'h-12 px-7 text-base shadow-raised transition-transform hover:-translate-y-0.5'
              )}
            >
              <Sword className="mr-2 h-5 w-5" />
              Crea il tuo Eroe
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'h-12 border-2 px-7 text-base'
              )}
            >
              <Users className="mr-2 h-5 w-5" />
              Entra nella Taverna
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm">
            <Link href="/login" className="inline-flex items-center gap-1.5 font-medium">
              <LogIn className="h-4 w-4" />
              Accedi
            </Link>
            <span className="text-frame/40" aria-hidden="true">•</span>
            <Link href="/register" className="inline-flex items-center gap-1.5 font-medium">
              <UserPlus className="h-4 w-4" />
              Registrati
            </Link>
          </div>
        </section>

        <hr className="divider-ornate my-14" />

        <section aria-label="Funzionalità principali" className="grid gap-5 pb-8 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="panel p-6 text-left">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-frame/40 bg-frame-deep text-parchment-100 shadow-raised">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 mb-2 text-lg">{title}</h2>
              <p className="text-sm leading-relaxed text-ink-muted">{text}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}