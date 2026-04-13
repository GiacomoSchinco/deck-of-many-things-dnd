// components/custom/Footer.tsx
import Link from "next/link";
import { appMetadata } from "@/lib/metadata";
import { 
  Dice6, 
  Heart, 
  Github, 
  Twitter, 
  Mail, 
  MapPin, 
  Clock,
  Shield,
  BookOpen,
  Users,
  Sword,
  Crown,
  Gem
} from "lucide-react";

const footerLinks = {
  esplora: [
    { href: "/characters", label: "Personaggi", icon: Users },
    { href: "/campaigns", label: "Campagne", icon: BookOpen },
    { href: "/weapons", label: "Armi & Equipaggiamento", icon: Sword },
    { href: "/dashboard", label: "Dashboard", icon: Crown },
  ],
  risorse: [
    { href: "/about", label: "Chi Siamo" },
    { href: "/guide", label: "Guide e Manuali" },
    { href: "/credits", label: "Ringraziamenti" },
    { href: "/faq", label: "Domande Frequenti" },
  ],
  legali: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Termini di Servizio" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/contacts", label: "Contatti" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto">
      {/* Sfondo principale */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-amber-900 to-stone-900" />
      
      {/* Texture pergamena */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      {/* Bordo decorativo superiore */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
      
      {/* Pattern di carte fluttuanti (decorativo) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute -top-10 -left-10 text-8xl rotate-12">♠</div>
        <div className="absolute -bottom-10 -right-10 text-8xl -rotate-12">♣</div>
        <div className="absolute top-1/3 right-20 text-6xl">♥</div>
        <div className="absolute bottom-1/3 left-20 text-6xl">♦</div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Sezione principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo e descrizione */}
          <div className="space-y-4">
            <Link href="/" className="group relative inline-block">
              <div className="absolute inset-0 bg-amber-500/20 blur-lg group-hover:bg-amber-500/30 transition-all duration-300 rounded-lg" />
              <span className="relative text-2xl font-serif text-amber-100 drop-shadow-lg">
                {appMetadata.title as string}
              </span>
            </Link>
            <p className="text-amber-200/80 text-sm leading-relaxed">
              Gestisci le tue schede personaggio di D&D 5e in modo semplice e intuitivo.
              Crea eroi leggendari, segui le loro avventure e tira i dadi con stile.
            </p>
            <div className="flex gap-3 pt-2">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-100 transition-all duration-300 hover:scale-110"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-100 transition-all duration-300 hover:scale-110"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="mailto:info@example.com" 
                className="text-amber-300 hover:text-amber-100 transition-all duration-300 hover:scale-110"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Link Esplora */}
          <div>
            <h3 className="text-amber-100 font-serif text-lg mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-400" />
              Esplora
            </h3>
            <ul className="space-y-2">
              {footerLinks.esplora.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-amber-200/80 hover:text-amber-100 transition-all duration-300 text-sm"
                    >
                      <Icon className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:translate-x-1 transition-transform">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Risorse */}
          <div>
            <h3 className="text-amber-100 font-serif text-lg mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-400" />
              Risorse
            </h3>
            <ul className="space-y-2">
              {footerLinks.risorse.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-amber-200/80 hover:text-amber-100 transition-all duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info e contatti */}
          <div>
            <h3 className="text-amber-100 font-serif text-lg mb-4 flex items-center gap-2">
              <Gem className="h-4 w-4 text-amber-400" />
              Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-amber-200/80 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-400" />
                <span>Un mondo di avventure<br />Ovunque tu sia</span>
              </li>
              <li className="flex items-center gap-2 text-amber-200/80 text-sm">
                <Clock className="h-4 w-4 text-amber-400" />
                <span>Sempre pronto per la tua prossima sessione</span>
              </li>
              <li className="flex items-center gap-2 text-amber-200/80 text-sm">
                <Dice6 className="h-4 w-4 text-amber-400" />
                <span>D&D 5e | SRD Compatibile</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Separatore decorativo */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-amber-700/30" />
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-br from-amber-900 to-stone-900 px-4 py-1 rounded-full">
              <div className="flex items-center gap-2 text-amber-400/60 text-xs">
                <span>⚔️</span>
                <span>✧</span>
                <span>🛡️</span>
                <span>✧</span>
                <span>🎲</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="text-amber-200/60 text-center md:text-left">
            <p className="flex items-center gap-2 justify-center md:justify-start">
              <Dice6 className="h-3.5 w-3.5" />
              &copy; {year} {appMetadata.title as string}
              <span className="hidden md:inline">•</span>
              <br className="md:hidden" />
              Tutti i diritti riservati
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {footerLinks.legali.map((link, index) => (
              <span key={link.href} className="flex items-center gap-2">
                <Link
                  href={link.href}
                  className="text-amber-200/60 hover:text-amber-100 transition-colors duration-300 text-xs"
                >
                  {link.label}
                </Link>
                {index < footerLinks.legali.length - 1 && (
                  <span className="text-amber-700/50">|</span>
                )}
              </span>
            ))}
          </div>

          <div className="text-amber-200/60 text-xs flex items-center gap-1">
            <Heart className="h-3 w-3 text-amber-400 fill-amber-400/30" />
            <span>Fatto con passione per gli avventurieri</span>
          </div>
        </div>
      </div>
    </footer>
  );
}