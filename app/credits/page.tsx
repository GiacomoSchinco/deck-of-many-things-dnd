// app/credits/page.tsx
import Link from 'next/link';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink, ArrowLeft } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function CreditsPage() {
  const authors = [
    {
      name: 'Lorc',
      site: 'http://lorcblog.blogspot.com',
    },
    {
      name: 'Delapouite',
      site: 'https://delapouite.com',
    },
    {
      name: 'John Colburn',
      site: 'http://ninmunanmu.com',
    },
    {
      name: 'sbed',
      site: 'http://opengameart.org',
    },
    {
      name: 'DarkZaitzev',
      site: 'http://darkzaitzev.deviantart.com',
    },
    {
      name: 'Skoll',
      site: 'https://game-icons.net',
    },
  ];

  return (
    <PageWrapper
      withContainer={false}
      title="Crediti"
      subtitle="Fatto con ❤️ e tanti dadi 🎲"
      action={
        <Link href="/">
          <Button variant="ghost" className="text-amber-700 hover:text-amber-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla Home
          </Button>
        </Link>
      }
    >
      <div className="not-prose space-y-6">
        {/* Icone principali */}
        <AncientCardContainer className="p-8 mb-8">
          <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">🎴</span> Game Icons
          </h2>
          
          <p className="text-amber-800 mb-6 leading-relaxed">
            Tutte le icone utilizzate in questo progetto provengono da{' '}
            <a 
              href="https://game-icons.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-700 underline hover:text-amber-900 inline-flex items-center gap-1"
            >
              game-icons.net <ExternalLink className="h-3 w-3" />
            </a>
            , un archivio meraviglioso di icone gratuite per giochi.
          </p>

          <div className="bg-amber-100/50 p-4 rounded-lg border border-amber-900/20">
            <p className="text-sm text-amber-800 font-mono">
              Game icons provided by https://game-icons.net
            </p>
          </div>
        </AncientCardContainer>

        {/* Autori */}
        <AncientCardContainer className="p-8 mb-8">
          <h2 className="text-2xl font-serif font-bold text-amber-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">✍️</span> Autori
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {authors.map((author) => (
              <div 
                key={author.name} 
                className="flex items-start gap-3 p-4 bg-amber-100/30 rounded-lg border border-amber-900/10 hover:bg-amber-100/50 transition-colors"
              >

                <div className="flex-1">
                  <h3 className="font-serif font-bold text-amber-900">
                    {author.name}
                  </h3>
                  <a 
                    href={author.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-amber-700 hover:text-amber-900 inline-flex items-center gap-1"
                  >
                    {author.site} <ExternalLink className="h-3 w-3" />
                  </a>

                </div>
              </div>
            ))}
          </div>
        </AncientCardContainer>

        {/* Licenza */}
        <AncientCardContainer className="p-8 mb-8">
          <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">📋</span> Licenza
          </h2>

          <div className="space-y-4 text-amber-800">
            <p>
              Le icone sono distribuite sotto licenza{' '}
              <strong>Creative Commons CC BY 3.0</strong> salvo dove diversamente indicato.
            </p>

            <div className="bg-amber-100/50 p-4 rounded-lg border border-amber-900/20 font-mono text-sm">
              <p>License: Creative Commons CC BY 3.0 unless stated CC0.</p>
              <p className="mt-2 text-xs text-amber-600">
                Ciò significa che puoi utilizzare, condividere e modificare le icone 
                purché venga dato credito agli autori originali.
              </p>
            </div>

            <p className="text-sm">
              Per maggiori informazioni, visita{' '}
              <a 
                href="https://creativecommons.org/licenses/by/3.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 underline hover:text-amber-900 inline-flex items-center gap-1"
              >
                Creative Commons CC BY 3.0 <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </AncientCardContainer>

        {/* Ringraziamenti extra */}
        <AncientCardContainer className="p-8">
          <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">🙏</span> Ringraziamenti Speciali
          </h2>

          <ul className="space-y-2 text-amber-800">
            <li className="flex items-start gap-2">
              <span className="text-amber-700">•</span>
              <span>Alla comunità di D&D 5e per l&apos;ispirazione</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-700">•</span>
              <span>Agli sviluppatori di Next.js, Supabase e TanStack</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-700">•</span>
              <span>A tutti i playtester che hanno rotto le schede (e i dadi)</span>
            </li>
          </ul>

          <div className="mt-6 text-center text-sm text-amber-600">
            <p>
              Deck of Many Things è un progetto fan-made non ufficiale.
              D&D e tutte le proprietà correlate sono di Wizards of the Coast.
            </p>
          </div>
        </AncientCardContainer>

        {/* Footer della pagina crediti */}
        <div className="text-center mt-8 text-sm text-amber-500">
          <p>
            📜 Creato con cura per gli avventurieri di tutto il mondo •{' '}
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}