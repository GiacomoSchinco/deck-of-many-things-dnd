"use client"

import Link from "next/link";

import AncientCardStack from "@/components/custom/AncientCardStack";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Construction, Sword } from "lucide-react";

export default function WorkInProgress() {
    return (
        <div className="flex flex-col items-center gap-8 py-10">
            <AncientCardStack animation="animate-float" cardSize="md" stackCount={10}>
                <div className="relative h-full flex flex-col items-center justify-center p-4">
                    <h1 className="text-3xl font-serif text-amber-900 mb-3 text-center">
                        Work in Progress
                    </h1>
                    <div className="mb-4 text-frame/70">
                        <Construction className="h-16 w-16" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <p className="text-amber-700 text-sm italic mt-2 text-center">
                        La gilda dei costruttori è al lavoro
                    </p>
                </div>
            </AncientCardStack>

            {/* Linea decorativa */}
            <div className="flex items-center justify-center gap-4">
                <div className="h-px w-20 bg-frame/40" />
                <Sword className="h-6 w-6 text-frame" aria-hidden="true" />
                <div className="h-px w-20 bg-frame/40" />
            </div>

            <p className="max-w-xl text-center text-xl text-amber-800 font-serif italic">
                I nostri mastri nani stanno ancora battendo il ferro. Presto emergerà un&apos;opera degna del martello di Moradin!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
                    Torna all&apos;Avventura
                </Link>
                <Button variant="outline" size="lg" onClick={() => window.history.back()}>
                    Torna al Sentiero Precedente
                </Button>
            </div>
        </div>
    );
}
