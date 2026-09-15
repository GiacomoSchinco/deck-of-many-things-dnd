'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import { AncientScroll } from '@/components/custom/AncientScroll';
import {
  LogOut,
  Key,
  Sword,
  Users,
  Crown,
  User,
  PlusCircle
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import Loading from '@/components/custom/Loading';
import { useMyRecentCharacters } from '@/hooks/queries/useCharacter';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { cn } from '@/lib/utils';

type DashboardCharacter = {
  id: string;
  name: string;
  level?: number;
  class?: string | null;
  classes?: { name?: string } | null;
};

export default function DashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { data: characters, isLoading: isCharactersLoading } = useMyRecentCharacters();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Carica utente corrente al mount
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setLoading(false);
    });

    // Rimane in ascolto dei cambi di sessione
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading || isCharactersLoading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AncientScroll className="p-8 text-center">
          <h2 className="text-2xl font-serif text-amber-900 mb-4">Accesso Richiesto</h2>
          <p className="text-amber-700 mb-6">Devi essere loggato per accedere alla dashboard</p>
          <Link href="/login">
            <Button className="bg-amber-700 hover:bg-amber-800">
              Vai al Login
            </Button>
          </Link>
        </AncientScroll>
      </div>
    );
  }

  return (
    <PageWrapper
      withContainer={false}
      title={`Bentornato, ${user.email?.split('@')[0] || 'Avventuriero'}`}
      subtitle="Il tuo grimorio personale ti aspetta"
      action={
        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-amber-700 text-amber-700 hover:bg-amber-100"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Esci
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Statistiche rapide e azioni */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Area account */}
          <AncientScroll className="p-6 h-full">
            <h2 className="text-xl fantasy-title mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-700" />
              Il Tuo Account
            </h2>

            <div className="space-y-4">
              <div className="panel-inset p-3">
                <p className="fantasy-label text-sm">Email</p>
                <p className="font-mono text-ink-strong">{user.email}</p>
              </div>

              <div className="panel-inset p-3">
                <p className="fantasy-label text-sm">Ultimo accesso</p>
                <p className="text-ink-strong">
                  {new Date(user.last_sign_in_at || '').toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <Link
                href="/reset-password"
                className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
              >
                <Key className="mr-2 h-4 w-4" />
                Cambia Password
              </Link>
            </div>
          </AncientScroll>
          {/* Personaggi */}
          <AncientScroll className="p-6 h-full">
            <h2 className="text-xl fantasy-title mb-4 flex items-center gap-2">
              <Sword className="w-5 h-5 text-amber-700" />
              Personaggi
            </h2>
            <div className="space-y-3">
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {characters?.map((character: DashboardCharacter) => (
                  <div key={character?.id} className="surface-tile interactive-quiet flex items-center gap-3 p-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-frame/40 bg-parchment-200 text-frame-deep shadow-emboss">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-ink-strong">{character?.name}</p>
                      <p className="text-xs text-ink-muted">{character?.classes?.name ?? character?.class ?? ''} · Livello {character?.level}</p>
                    </div>
                    <Link
                      href={`/characters/${character?.id}`}
                      className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                    >
                      Visualizza
                    </Link>
                  </div>
                ))}
                </div>
                <Link
                  href="/characters"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium"
                >
                  Vedi tutti i personaggi
                  <Sword className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </AncientScroll>


        </div>
        {/* Griglia azioni rapide */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Link href="/characters" className="group">
            <AncientCardContainer className="h-56 transition-transform duration-300 group-hover:-translate-y-1">
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <span className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full border border-frame/40 bg-frame-deep text-parchment-100 shadow-raised">
                  <Users className="h-6 w-6" />
                </span>
                <h3 className="fantasy-title mb-2">I Miei Personaggi</h3>
                <p className="text-sm text-ink-muted">Gestisci i tuoi eroi esistenti</p>
              </div>
            </AncientCardContainer>
          </Link>
          <Link href="/campaigns" className="group">
            <AncientCardContainer className="h-56 transition-transform duration-300 group-hover:-translate-y-1">
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <span className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full border border-frame/40 bg-frame-deep text-parchment-100 shadow-raised">
                  <Crown className="h-6 w-6" />
                </span>
                <h3 className="fantasy-title mb-2">Campagne</h3>
                <p className="text-sm text-ink-muted">Le tue avventure in corso</p>
              </div>
            </AncientCardContainer>
          </Link>
          <Link href="/create-character" className="group">
            <AncientCardContainer className="h-56 transition-transform duration-300 group-hover:-translate-y-1">
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <span className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full border border-frame/40 bg-frame-deep text-parchment-100 shadow-raised">
                  <PlusCircle className="h-6 w-6" />
                </span>
                <h3 className="fantasy-title mb-2">Nuovo Personaggio</h3>
                <p className="text-sm text-ink-muted">Crea un nuovo eroe per la tua avventura</p>
              </div>
            </AncientCardContainer>
          </Link>
        </div>
        

        {/* Footer decorativo */}
        <div className="mt-8 flex items-center justify-center gap-3 opacity-60">
          <span className="h-px w-10 bg-frame/40" />
          <span className="ornament-diamond h-1.5 w-1.5" />
          <span className="text-sm text-ink-muted">Il tuo grimorio digitale</span>
          <span className="ornament-diamond h-1.5 w-1.5" />
          <span className="h-px w-10 bg-frame/40" />
        </div>
      </div>
    </PageWrapper>
  );
}