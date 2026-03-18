'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { AncientScroll } from '@/components/custom/AncientScroll';
import {
  LogOut,
  Key,
  Sword,
  Scroll,
  PlusCircle,
  User as UserIcon
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import Loading from '@/components/custom/Loading';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
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

  if (loading) {
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
    <div className="min-h-screen bg-gradient-to-br from-parchment-100 to-parchment-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header con benvenuto */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-200 rounded-full border-2 border-amber-700 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-amber-900">
                Bentornato, {user.email?.split('@')[0] || 'Avventuriero'}
              </h1>
              <p className="text-amber-600 text-sm">
                Il tuo grimorio personale ti aspetta
              </p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-amber-700 text-amber-700 hover:bg-amber-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Esci
          </Button>
        </div>

        {/* Statistiche rapide e azioni */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Area account */}
          <AncientScroll className="p-6">
            <h2 className="text-xl font-serif font-bold text-amber-900 mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-700" />
              Il Tuo Account
            </h2>

            <div className="space-y-4">
              <div className="p-3 bg-amber-100/50 rounded-lg">
                <p className="text-sm text-amber-600">Email</p>
                <p className="text-amber-900 font-mono">{user.email}</p>
              </div>

              <div className="p-3 bg-amber-100/50 rounded-lg">
                <p className="text-sm text-amber-600">Ultimo accesso</p>
                <p className="text-amber-900">
                  {new Date(user.last_sign_in_at || '').toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <Link href="/reset-password">
                <Button variant="outline" className="w-full border-amber-700 text-amber-700 hover:bg-amber-100">
                  <Key className="w-4 h-4 mr-2" />
                  Cambia Password
                </Button>
              </Link>
            </div>
          </AncientScroll>
          {/* Ultimi personaggi */}
          <AncientScroll className="p-6">
            <h2 className="text-xl font-serif font-bold text-amber-900 mb-4 flex items-center gap-2">
              <Sword className="w-5 h-5 text-amber-700" />
              Ultimi Personaggi
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-amber-100/50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-amber-200 rounded-full border border-amber-700 flex items-center justify-center">
                    <span className="text-lg">🧝</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-amber-900">Eroe {i}</p>
                    <p className="text-xs text-amber-600">Guerriero · Livello 5</p>
                  </div>
                  <span className="text-amber-500 text-sm">Ultima modifica 2h fa</span>
                </div>
              ))}
              <Button variant="ghost" className="w-full mt-2 text-amber-700">
                <PlusCircle className="w-4 h-4 mr-2" />
                Carica altri personaggi
              </Button>
            </div>
          </AncientScroll>


        </div>
        {/* Griglia azioni rapide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/characters">
            <AncientCardContainer className="p-0 m-8 w-64 h-80 transform hover:scale-105 transition-transform">
              <div className="p-4 text-center">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="font-serif font-bold text-amber-900 mb-2">I Miei Personaggi</h3>
                <p className="text-sm text-amber-700">Gestisci i tuoi eroi esistenti</p>
              </div>
            </AncientCardContainer>
          </Link>
          <Link href="/campaigns">
            <AncientCardContainer className="p-0 m-8 w-64 h-80 transform hover:scale-105 transition-transform">
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="p-4 text-center">
                  <div className="text-4xl mb-3">🏰</div>
                  <h3 className="font-serif font-bold text-amber-900 mb-2">Campagne</h3>
                  <p className="text-sm text-amber-700">Le tue avventure in corso</p>
                </div>
              </div>
            </AncientCardContainer>
          </Link>
          <Link href="/create-character">
            <AncientCardContainer className="p-0 m-8 w-64 h-80 transform hover:scale-105 transition-transform">
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="p-4 text-center">
                  <div className="text-4xl mb-3">🎴</div>
                  <h3 className="font-serif font-bold text-amber-900 mb-2">Nuovo Personaggio</h3>
                  <p className="text-sm text-amber-700">Crea un nuovo eroe per la tua avventura</p>
                </div>
              </div>
            </AncientCardContainer>
          </Link>
        </div>
        

        {/* Footer decorativo */}
        <div className="mt-8 text-center text-sm text-amber-500">
          <p className="flex items-center justify-center gap-2">
            <Scroll className="w-4 h-4" />
            Deck of Many Things - Il tuo grimorio digitale
            <Scroll className="w-4 h-4" />
          </p>
        </div>
      </div>
    </div>
  );
}