"use client";
import AncientCardStack from "@/components/custom/AncientCardStack";
import { AntiqueButton } from "@/components/custom/AntiqueButton";

export default function NotFound() {
    return (
        <main className="min-h-screen p-4 mt-10">
            <div className="container mx-auto flex flex-col items-center mt-10"> {/* Aggiungi flex e items-center qui */}
                <div className="max-w-3xl mx-auto text-center">
                    {/* 404 grande in stile antico */}
                    <AncientCardStack animation="animate-float" cardSize="md" stackCount={10}>
                        <div className="relative h-full flex flex-col items-center justify-center p-4">
                            <div className="absolute top-8 left-0 right-0 text-center">
                                <span className="text-7xl font-serif font-bold text-amber-800/80">
                                    404
                                </span>
                                <div className=" m-3 text-xl font-serif font-bold text-amber-800/80">
                                    Pagina Smarrita
                                </div>
                            </div>
                            <div className="absolute bottom-8 left-0 right-0 text-center">
                                <p className="text-amber-700 font-serif italic text-sm">
                                    &ldquo;Non è dove, ma quando...&rdquo;
                                </p>
                                <p className="text-amber-600 font-serif text-xs mt-1">
                                    - Mago Merlino
                                </p>
                            </div>
                        </div>
                    </AncientCardStack>
                </div>
            </div>
            {/* Contenuto della pagina */}
            <div className="container mx-auto">
                <div className="max-w-3xl mx-auto text-center">          
                    {/* Linea decorativa */}
                    <div className="flex items-center justify-center gap-4 mb-8 mt-8">
                        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
                        <span className="text-3xl text-amber-700">⚔️</span>
                        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
                    </div>
                    {/* Descrizione */}
                    <p className="text-xl md:text-2xl text-amber-800 mb-6 font-serif italic">
                                                La pergamena che cerchi non esiste in questo regno.
                        Forse è stata distrutta da un drago, o forse non è mai esistita.
                        Ma non temere, avventuriero, ci sono altre terre da esplorare!...
                    </p>
                    {/* Suggerimenti in stile pergamena 
                    <AncientScroll className="max-w-xl mx-auto mb-12">
                        <h3 className="text-2xl font-serif text-amber-900 mb-4 flex items-center justify-center gap-2">
                            <span>🔍</span>
                            Suggerimenti dell&apos;Eremita
                            <span>📜</span>
                        </h3>
                        <ul className="space-y-3 text-left">
                            <li className="flex items-start gap-3 text-amber-800">
                                <span className="text-amber-700 font-bold text-xl shrink-0">1.</span>
                                <span className="font-serif">Controlla che l&apos;indirizzo sia scritto correttamente nel tuo grimorio</span>
                            </li>
                            <li className="flex items-start gap-3 text-amber-800">
                                <span className="text-amber-700 font-bold text-xl shrink-0">2.</span>
                                <span className="font-serif">La pagina potrebbe essere stata spostata in un&apos;altra dimensione</span>
                            </li>
                            <li className="flex items-start gap-3 text-amber-800">
                                <span className="text-amber-700 font-bold text-xl shrink-0">3.</span>
                                <span className="font-serif">Forse hai sbagliato libro degli incantesimi (URL)</span>
                            </li>
                            <li className="flex items-start gap-3 text-amber-800">
                                <span className="text-amber-700 font-bold text-xl shrink-0">4.</span>
                                <span className="font-serif">Il mago potrebbe aver lanciato un incantesimo di occultamento</span>
                            </li>
                        </ul>
                    </AncientScroll>*/}
                    {/* Pulsanti di azione */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <AntiqueButton size="md" href="/" variant="primary" className="px-10 py-4">
                            <span className="flex items-center justify-center gap-4 text-amber-100">
                                Torna all&apos;Avventura
                            </span>
                        </AntiqueButton>
                        <AntiqueButton size="md" onClick={() => window.history.back()} variant="secondary" className="px-8 py-4">
                            <span className="flex items-center gap-2">
                          
                                Torna al Sentiero Precedente
                            </span>
                        </AntiqueButton>
                    </div>
                </div>
            </div>
        </main>
    );
}