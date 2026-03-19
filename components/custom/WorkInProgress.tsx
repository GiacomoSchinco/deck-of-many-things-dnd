"use client"

import AncientCardStack from "@/components/custom/AncientCardStack";
import { AntiqueButton } from "@/components/custom/AntiqueButton";

export default function WorkInProgress() {
    return (
        <div className="flex flex-col items-center gap-8 py-10">
            <AncientCardStack animation="animate-float" cardSize="md" stackCount={10}>
                <div className="relative h-full flex flex-col items-center justify-center p-4">
                    <h1 className="text-3xl font-serif text-amber-900 mb-3 text-center">
                        Work in Progress
                    </h1>
                    <div className="text-7xl mb-4 filter drop-shadow-lg">
                        🏗️
                    </div>
                    <p className="text-amber-700 text-sm italic mt-2 text-center">
                        La gilda dei costruttori è al lavoro
                    </p>
                </div>
            </AncientCardStack>

            {/* Linea decorativa */}
            <div className="flex items-center justify-center gap-4">
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
                <span className="text-3xl text-amber-700">⚔️</span>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
            </div>

            <p className="max-w-xl text-center text-xl text-amber-800 font-serif italic">
                I nostri mastri nani stanno ancora battendo il ferro. Presto emergerà un&apos;opera degna del martello di Moradin!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <AntiqueButton href="/" variant="primary" className="px-10 py-4">
                    Torna all&apos;Avventura
                </AntiqueButton>
                <AntiqueButton onClick={() => window.history.back()} variant="secondary" className="px-8 py-4">
                    Torna al Sentiero Precedente
                </AntiqueButton>
            </div>
        </div>
    );
}
