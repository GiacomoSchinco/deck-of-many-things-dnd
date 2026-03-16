"use client";
import { useState } from "react";
import Link from "next/link";
import { appMetadata } from "@/lib/metadata";
import { Button } from "../ui/button";

const navLinks = [
    { href: "/characters", label: "Personaggi" },
    { href: "/campaigns", label: "Campagna" },
    { href: "/weapons", label: "Armi" },
];

export default function Topbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="relative sticky top-0 z-50">
            {/* Effetto texture per tutta la navbar */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-stone-800" />
            <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}
            />

            {/* Bordo inferiore decorativo */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-700/50 via-amber-500 to-amber-700/50" />
            
            {/* Contenuto navbar */}
            <div className="container mx-auto px-4 py-3 relative">
                <div className="flex justify-between items-center">
                    {/* Logo con stile antico */}
                    <Link href="/" className="group relative">
                        <div className="absolute inset-0 bg-amber-500/20 blur-lg group-hover:bg-amber-500/30 transition-all duration-300 rounded-lg" />
                        <div className="relative flex items-center gap-3">
                            {/* Icona semi carte */}

                            <span className="text-2xl font-serif text-amber-100 drop-shadow-lg">
                                {appMetadata.title as string}
                            </span>

                        </div>
                    </Link>

                    {/* Menu desktop */}
                    <ul className="hidden lg:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="relative px-4 py-2 text-amber-100 hover:text-amber-50 transition-all duration-300 group"
                                >
                                    {/* Effetto hover pergamena */}
                                    <span className="relative z-10 font-serif">{link.label}</span>
                                    <span className="absolute inset-0 bg-amber-800/50 border border-amber-700/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300" />
                                </Link>
                            </li>
                        ))}
                        
                        {/* Separatore decorativo */}

                        
                        {/* Componente Login con stile antico */}
                        <li>
                            <Button variant="outline" className="border-amber-700 text-amber-100 hover:bg-amber-800/50 transition-all duration-300">
                                Login
                            </Button>
                        </li>
                    </ul>

                    {/* Bottone menu mobile con stile antico */}
                    <button
                        className="relative lg:hidden w-10 h-10 rounded-lg border border-amber-700/50 hover:bg-amber-800/50 transition-all duration-300 group"
                        onClick={() => setOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                    >
                        <div className="absolute inset-0 bg-amber-500/10 group-hover:bg-amber-500/20 rounded-lg transition-colors" />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mx-auto text-amber-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Menu mobile con stile antico */}
                {open && (
                    <div className="absolute top-full left-0 right-0 mt-2 mx-4 lg:hidden animate-slideDown">
                        {/* Sfondo menu mobile */}
                        <div className="relative bg-gradient-to-br from-amber-900 to-stone-800 rounded-xl border-2 border-amber-700/50 shadow-2xl overflow-hidden">
                            {/* Texture sfondo */}
                            <div 
                                className="absolute inset-0 opacity-10 pointer-events-none"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'repeat',
                                }}
                            />
                            
                            {/* Contenuto menu */}
                            <ul className="relative flex flex-col p-2">
                                {navLinks.map((link, index) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="flex items-center gap-3 px-4 py-3 text-amber-100 hover:text-amber-50 hover:bg-amber-800/50 rounded-lg transition-all duration-300 group"
                                            onClick={() => setOpen(false)}
                                        >
                                            <span className="font-serif flex-1">{link.label}</span>
                                        </Link>
                                        {index < navLinks.length - 1 && (
                                            <div className="mx-4 border-b border-amber-700/30" />
                                        )}
                                    </li>
                                ))}
                                
                                {/* Separatore */}
                                <div className="my-2 border-t border-amber-700/30" />
                                
                                {/* Login nel menu mobile */}
                            <Button variant="outline" className="border-amber-700 text-amber-100 hover:bg-amber-800/50 transition-all duration-300">
                                Login
                            </Button>
                                
                                {/* Semi decorativi in fondo */}

                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </nav>
    );
}