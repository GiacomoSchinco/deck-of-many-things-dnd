"use client";
import AncientCardStack from "./AncientCardStack";

export default function Loading() {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="relative">
                <AncientCardStack animation="animate-float" cardSize="md" stackCount={3}>
                    {/* Contenuto personalizzato per la carta superiore */}
                    <div className="relative h-full flex flex-col items-center justify-center p-4">
                        <div className="w-16 h-16 border-4 border-amber-700 border-t-amber-900 rounded-full animate-spin mb-4" />
                        <p className="text-amber-900 font-serif text-center text-lg">Mescolando le carte...</p>
                        <p className="text-amber-700 text-sm italic mt-2">il destino si sta compiendo</p>
                    </div>
                </AncientCardStack>
            </div>
        </main>
    );
}