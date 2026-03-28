// app/page.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Sword,
  Users,
  LogIn,
  UserPlus,
  Sparkles,
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
      </div>
    </main>
  );
}