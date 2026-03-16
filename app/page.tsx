// app/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AncientCardContainer from '@/components/ui/custom/AncientCardContainer';
import { DndIcon } from '@/components/ui/icons/DndIcon';
import { 
  Sword, 
  Users, 
  Dice6, 
  LogIn,
  UserPlus
} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen parchment-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Sfondo decorativo con dadi fluttuanti */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-8xl text-amber-900 animate-float">⚔️</div>
          <div className="absolute bottom-20 right-10 text-8xl text-amber-900 animate-float delay-200">🛡️</div>
          <div className="absolute top-40 right-40 text-6xl text-amber-900 animate-float delay-400">🎲</div>
          <div className="absolute bottom-40 left-40 text-6xl text-amber-900 animate-float">📜</div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo/Title con effetto carta */}
            <AncientCardContainer className="inline-block p-8 mb-8 transform hover:scale-105 transition-transform">
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-amber-900 mb-4">
                🃏 Deck of Many Things
              </h1>
              <DndIcon name="dice-twenty-faces-twenty" size={24} className="text-amber-500" />
              <p className="text-xl text-amber-700 italic">
                &ldquo;Il destino è nelle carte&rdquo;
              </p>
            </AncientCardContainer>

            {/* Descrizione */}
            <p className="text-lg text-amber-800 mb-8 max-w-2xl mx-auto">
              Gestisci le tue schede personaggio di D&D 5e in modo semplice e intuitivo. 
              Crea eroi leggendari, segui le loro avventure e tira i dadi con stile.
            </p>

            {/* Call to Action principali */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/create-character">
                <Button size="lg" className="bg-amber-700 hover:bg-amber-800 text-amber-50 text-lg px-8 w-full sm:w-auto">
                  <Sword className="mr-2 h-5 w-5" />
                  Crea il tuo Eroe
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-amber-700 text-amber-700 hover:bg-amber-100 text-lg px-8 w-full sm:w-auto">
                  <Users className="mr-2 h-5 w-5" />
                  Entra nella Taverna
                </Button>
              </Link>
            </div>

            {/* Auth buttons per non loggati */}
            <div className="flex gap-3 justify-center text-sm">
              <Link href="/login" className="text-amber-700 hover:text-amber-900 flex items-center gap-1">
                <LogIn className="h-4 w-4" /> Accedi
              </Link>
              <span className="text-amber-300">|</span>
              <Link href="/register" className="text-amber-700 hover:text-amber-900 flex items-center gap-1">
                <UserPlus className="h-4 w-4" /> Registrati
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon="🎴"
            title="Carte Antiche"
            description="Un'interfaccia unica che sembra di avere un mazzo di carte tra le mani"
          />
          <FeatureCard
            icon="📜"
            title="Schede Complete"
            description="Tutto ciò che serve: statistiche, inventario, incantesimi e note"
          />
          <FeatureCard
            icon="🎲"
            title="Tiri Automatici"
            description="Tira i dadi direttamente dalla scheda con tutti i bonus calcolati"
          />
          <FeatureCard
            icon="⚔️"
            title="Level Up"
            description="Gestisci la progressione del personaggio con pochi click"
          />
        </div>
      </div>

      {/* Campagne in evidenza */}
      <div className="container mx-auto px-4 py-12">
        <AncientCardContainer className="p-8">
          <h2 className="text-2xl font-serif text-amber-900 mb-6 text-center">
            Campagne in Corso
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CampaignCard
              name="La Miniera Perduta di Phandelver"
              dm="Master1"
              players={4}
              level="1-5"
            />
            <CampaignCard
              name="La Maledizione di Strahd"
              dm="Master2"
              players={5}
              level="3-10"
            />
          </div>
        </AncientCardContainer>
      </div>

      {/* CTA Finale */}
      <div className="container mx-auto px-4 py-16">
        <AncientCardContainer className="p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif text-amber-900 mb-4">
            Pronto a Iniziare l&apos;Avventura?
          </h2>
          <p className="text-lg text-amber-700 mb-8">
            Crea il tuo primo personaggio e unisciti a centinaia di altri avventurieri!
          </p>
          <Link href="/create-character">
            <Button size="lg" className="bg-amber-700 hover:bg-amber-800 text-amber-50 text-lg px-10">
              Inizia Ora
            </Button>
          </Link>
        </AncientCardContainer>
      </div>

      {/* Footer */}
      <footer className="border-t border-amber-900/20 py-8 mt-8">
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

// Componenti helper
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <AncientCardContainer className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-serif font-bold text-amber-900 mb-2">
        {title}
      </h3>
      <p className="text-amber-700 text-sm">
        {description}
      </p>
    </AncientCardContainer>
  );
}

function CampaignCard({ name, dm, players, level }: { name: string; dm: string; players: number; level: string }) {
  return (
    <div className="bg-amber-100/50 p-4 rounded-lg border border-amber-900/20 hover:bg-amber-200/50 transition-colors">
      <h4 className="font-serif font-bold text-amber-900">{name}</h4>
      <div className="flex justify-between text-sm text-amber-700 mt-2">
        <span>DM: {dm}</span>
        <span>{players} giocatori</span>
        <span>Livelli {level}</span>
      </div>
    </div>
  );
}