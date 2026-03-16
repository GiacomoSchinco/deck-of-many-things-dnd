// app/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AncientCardContainer from '@/components/ui/custom/AncientCardContainer';
import { Sword, Scroll, Users, Dice6 } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen parchment-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Sfondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-8xl text-amber-900">⚔️</div>
          <div className="absolute bottom-20 right-10 text-8xl text-amber-900">🛡️</div>
          <div className="absolute top-40 right-40 text-6xl text-amber-900">🎲</div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo/Titolo */}
            <AncientCardContainer className="inline-block p-8 mb-8">
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-amber-900 mb-4">
                🃏 Deck of Many Things
              </h1>
              <p className="text-xl text-amber-700 italic">
                &ldquo;Il destino è nelle carte&rdquo;
              </p>
            </AncientCardContainer>

            {/* Descrizione */}
            <p className="text-lg text-amber-800 mb-12 max-w-2xl mx-auto">
              Gestisci le tue schede personaggio di D&D 5e in modo semplice e intuitivo.
              Crea eroi, segui le loro avventure e tira i dadi con stile.
            </p>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/create-character">
                <Button size="lg" className="bg-amber-700 hover:bg-amber-800 text-amber-50 text-lg px-8">
                  <Sword className="mr-2 h-5 w-5" />
                  Crea il tuo Eroe
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-amber-700 text-amber-700 hover:bg-amber-100 text-lg px-8">
                  <Users className="mr-2 h-5 w-5" />
                  I Miei Personaggi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-serif text-center text-amber-900 mb-12">
          Perché Sceglierci
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <AncientCardContainer className="p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">🎴</div>
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-2">
              Carte Antiche
            </h3>
            <p className="text-amber-700">
              Un&apos;interfaccia unica che sembra di avere un mazzo di carte antiche tra le mani.
            </p>
          </AncientCardContainer>

          {/* Feature 2 */}
          <AncientCardContainer className="p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">📜</div>
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-2">
              Schede Complete
            </h3>
            <p className="text-amber-700">
              Tutto ciò che serve per il tuo personaggio: statistiche, inventario, incantesimi e note.
            </p>
          </AncientCardContainer>

          {/* Feature 3 */}
          <AncientCardContainer className="p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">🎲</div>
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-2">
              Tiri Automatici
            </h3>
            <p className="text-amber-700">
              Tira i dadi direttamente dalla scheda, con tutti i bonus già calcolati.
            </p>
          </AncientCardContainer>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <AncientCardContainer className="p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif text-amber-900 mb-4">
            Pronto a Iniziare l&apos;Avventura?
          </h2>
          <p className="text-lg text-amber-700 mb-8">
            Crea il tuo primo personaggio e inizia a giocare!
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-amber-700 text-amber-700">
                Accedi
              </Button>
            </Link>
            <Link href="/create-character">
              <Button className="bg-amber-700 hover:bg-amber-800 text-amber-50">
                Crea Personaggio
              </Button>
            </Link>
          </div>
        </AncientCardContainer>
      </div>

      {/* Footer */}
      <footer className="border-t border-amber-900/20 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-amber-600">
          <p className="flex items-center justify-center gap-2">
            <Dice6 className="h-4 w-4" />
            Deck of Many Things - Gestione Schede D&D 5e
            <Dice6 className="h-4 w-4" />
          </p>
          <p className="text-sm mt-2">
            &copy; {new Date().getFullYear()} - Tutti i personaggi sono persi nelle loro avventure
          </p>
        </div>
      </footer>
    </main>
  );
}