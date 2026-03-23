// app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import { DndIcon } from '@/components/icons/DndIcon';
import {
  Sword,
  Users,
  Dice6,
  LogIn,
  UserPlus,
  Sparkles,
  Crown
} from 'lucide-react';
import { useEffect, useState } from 'react';
export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Effetto parallax per lo sfondo
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX / 100, y: e.clientY / 100 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen parchment-bg relative overflow-hidden">
      {/* Sfondo animato con gradienti mobili */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(218,165,32,0.1) 0%, rgba(139,69,19,0.05) 50%, transparent 80%)`,
        }}
      />
      {/* background logo removed to avoid nested fill images; main logo below is used */}
      {/* Elementi fluttuanti decorativi */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-8xl text-amber-900/5 animate-float">⚔️</div>
        <div className="absolute bottom-20 right-10 text-8xl text-amber-900/5 animate-float delay-200">🛡️</div>
        <div className="absolute top-1/3 right-1/4 text-6xl text-amber-900/5 animate-float delay-400">🎲</div>
        <div className="absolute bottom-1/3 left-1/4 text-6xl text-amber-900/5 animate-float delay-600">📜</div>
        <div className="absolute top-2/3 left-10 text-4xl text-amber-900/5 animate-pulse">♠</div>
        <div className="absolute bottom-1/4 right-10 text-4xl text-amber-900/5 animate-pulse delay-300">♣</div>
      </div>

      <div className="container mx-auto px-4 py-2 md:py-2 relative z-10">
        {/* Header Hero con logo */}
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo e titolo */}
          <div className="relative mb-8">
            <Image
              src="/images/logo.png"
              alt="Deck of Many Things Logo"
              width={1200}
              height={420}
              className="mx-auto object-contain p-4 md:p-8 drop-shadow-2xl w-full max-w-6xl"
              priority
            />
          </div>
          {/* Descrizione */}
          <p className="text-base md:text-lg text-amber-800 mb-10 max-w-2xl mx-auto leading-relaxed">
            Gestisci le tue schede personaggio di D&D 5e in modo semplice e intuitivo.
            Crea eroi leggendari, segui le loro avventure e tira i dadi con stile.
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/create-character" className="group">
              <Button
                size="lg"
                className="bg-amber-700 hover:bg-amber-800 text-amber-50 text-base md:text-lg px-6 md:px-10 py-5 md:py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
              >
                <Sword className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Crea il tuo Eroe
                <Sparkles className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-amber-700 text-amber-700 hover:bg-amber-100 text-base md:text-lg px-6 md:px-10 py-5 md:py-6 h-auto shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Users className="mr-2 h-5 w-5" />
                Entra nella Taverna
              </Button>
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="flex gap-4 justify-center text-sm">
            <Link href="/login" className="text-amber-600 hover:text-amber-800 flex items-center gap-1 transition-colors group">
              <LogIn className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Accedi
            </Link>
            <span className="text-amber-300">|</span>
            <Link href="/register" className="text-amber-600 hover:text-amber-800 flex items-center gap-1 transition-colors group">
              <UserPlus className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              Registrati
            </Link>
          </div>
        </div>

        {/* Feature Cards con hover animato */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-amber-900 mb-12">
            Perché Sceglierci
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon="🎴"
              title="Carte Antiche"
              description="Un'interfaccia unica che sembra di avere un mazzo di carte tra le mani"
              delay={0}
            />
            <FeatureCard
              icon="📜"
              title="Schede Complete"
              description="Tutto ciò che serve: statistiche, inventario, incantesimi e note"
              delay={100}
            />
            <FeatureCard
              icon="🎲"
              title="Tiri Automatici"
              description="Tira i dadi direttamente dalla scheda con tutti i bonus calcolati"
              delay={200}
            />
            <FeatureCard
              icon="⚔️"
              title="Level Up"
              description="Gestisci la progressione del personaggio con pochi click"
              delay={300}
            />
          </div>
        </div>

        {/* Campagne in evidenza - con immagini */}
        <div className="mt-20">
          <AncientCardContainer className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-serif text-amber-900 mb-8 text-center">
              Campagne in Corso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CampaignCard
                name="La Miniera Perduta di Phandelver"
                dm="Master1"
                players={4}
                level="1-5"
                icon="🏔️"
              />
              <CampaignCard
                name="La Maledizione di Strahd"
                dm="Master2"
                players={5}
                level="3-10"
                icon="🌙"
              />
            </div>
          </AncientCardContainer>
        </div>

        {/* CTA Finale */}
        <div className="mt-20">
          <AncientCardContainer className="p-8 md:p-12 text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              <DndIcon name="dice-twenty-faces-twenty" size={48} className="text-amber-500 animate-spin-slow" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-amber-900 mb-4">
              Pronto a Iniziare l&apos;Avventura?
            </h2>
            <p className="text-amber-700 mb-8">
              Crea il tuo primo personaggio e unisciti a centinaia di altri avventurieri!
            </p>
            <Link href="/create-character">
              <Button size="lg" className="bg-amber-700 hover:bg-amber-800 text-amber-50 text-lg px-8 md:px-12 py-5 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <Crown className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Inizia Ora
              </Button>
            </Link>
          </AncientCardContainer>
        </div>

        {/* Footer */}
        <footer className="border-t border-amber-900/20 py-8 mt-16">
          <div className="text-center text-amber-600">
            <p className="flex items-center justify-center gap-2 flex-wrap">
              <Dice6 className="h-4 w-4" />
              Deck of Many Things - Gestione Schede D&D 5e
              <Dice6 className="h-4 w-4" />
            </p>
            <p className="text-sm mt-2 text-amber-500">
              &copy; {new Date().getFullYear()} - Tutti i personaggi sono persi nelle loro avventure
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}

// Componenti helper con animazioni
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string; delay: number }) {

  return (


    <AncientCardContainer size='md'>
      <div className="h-full flex flex-col relative">
        <div className={`text-6xl mb-4 text-center`}>
          {icon}
        </div>
        <div className="flex justify-center pt-0 z-10 text-center">
          <div className="text-2xl text-center">{title}</div>
        </div>

        <div className="flex-1 flex items-center justify-center z-10 text-center">
          {description}
        </div>
      </div>

    </AncientCardContainer>

  );
}

function CampaignCard({ name, dm, players, level, icon }: { name: string; dm: string; players: number; level: string; icon: string }) {
  return (
    <div className="group bg-amber-100/30 p-5 rounded-xl border border-amber-900/20 hover:bg-amber-100/60 transition-all duration-300 hover:shadow-lg cursor-pointer hover:border-amber-700/50">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{icon}</span>
        <h4 className="font-serif font-bold text-amber-900 text-lg group-hover:text-amber-800">
          {name}
        </h4>
      </div>
      <div className="flex flex-wrap justify-between text-sm text-amber-700 gap-2">
        <span className="flex items-center gap-1">
          <span className="text-amber-500">🎭</span> DM: {dm}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-amber-500">👥</span> {players} giocatori
        </span>
        <span className="flex items-center gap-1">
          <span className="text-amber-500">📊</span> Livelli {level}
        </span>
      </div>
    </div>
  );
}