"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { appMetadata } from "@/lib/metadata";
import AuthButton from "../ui/custom/AuthButton";
import { supabase } from "@/lib/supabase/client";

const navLinks = [
    { href: "/characters", label: "Personaggi" },
    { href: "/campaigns", label: "Campagna" },
    { href: "/weapons", label: "Armi" },
];

export default function Topbar() {
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsLoggedIn(!!session?.user);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session?.user);
        });
        return () => subscription.unsubscribe();
    }, []);

    // Chiude cliccando fuori
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    return (
        <nav className="relative sticky top-0 z-50">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-stone-800" />
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-700/50 via-amber-500 to-amber-700/50" />

            <div className="container mx-auto px-4 py-3 relative" ref={menuRef}>
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="group relative" onClick={() => setOpen(false)}>
                        <div className="absolute inset-0 bg-amber-500/20 blur-lg group-hover:bg-amber-500/30 transition-all duration-300 rounded-lg" />
                        <span className="relative text-2xl font-serif text-amber-100 drop-shadow-lg">
                            {appMetadata.title as string}
                        </span>
                    </Link>

                    {/* Menu desktop */}
                    <ul className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="relative px-4 py-2 text-amber-100 hover:text-amber-50 transition-all duration-300 group inline-flex"
                                >
                                    <span className="relative z-10 font-serif">{link.label}</span>
                                    <span className="absolute inset-0 bg-amber-800/50 border border-amber-700/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300" />
                                </Link>
                            </li>
                        ))}
                        {isLoggedIn && (
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="relative px-4 py-2 text-amber-100 hover:text-amber-50 transition-all duration-300 group inline-flex"
                                >
                                    <span className="relative z-10 font-serif">Dashboard</span>
                                    <span className="absolute inset-0 bg-amber-800/50 border border-amber-700/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300" />
                                </Link>
                            </li>
                        )}
                        <li><AuthButton /></li>
                    </ul>

                    {/* Hamburger → X */}
                    <button
                        className="relative lg:hidden w-10 h-10 rounded-lg border border-amber-700/50 hover:bg-amber-800/50 transition-all duration-300"
                        onClick={() => setOpen((prev) => !prev)}
                        aria-label={open ? "Chiudi menu" : "Apri menu"}
                        aria-expanded={open}
                    >
                        <span className="absolute inset-0 flex items-center justify-center text-amber-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-all duration-300 ${open ? 'rotate-45 scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                {open
                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                }
                            </svg>
                        </span>
                    </button>
                </div>

                {/* Dropdown mobile */}
                <div
                    className={`
                        lg:hidden overflow-hidden transition-all duration-300 ease-in-out
                        ${open ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}
                    `}
                >
                    <div className="bg-gradient-to-b from-amber-900/95 to-stone-900/95 rounded-xl border border-amber-700/40 shadow-xl backdrop-blur-sm">
                        <ul className="flex flex-col p-2">
                            {navLinks.map((link, index) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="flex items-center px-4 py-3 rounded-lg text-amber-100 hover:text-amber-50 hover:bg-amber-800/50 transition-all duration-200 font-serif"
                                    >
                                        {link.label}
                                    </Link>
                                    {index < navLinks.length - 1 && (
                                        <div className="mx-4 border-b border-amber-700/20" />
                                    )}
                                </li>
                            ))}
                            {isLoggedIn && (
                                <>
                                    <div className="mx-4 border-b border-amber-700/20" />
                                    <li>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setOpen(false)}
                                            className="flex items-center px-4 py-3 rounded-lg text-amber-100 hover:text-amber-50 hover:bg-amber-800/50 transition-all duration-200 font-serif"
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                </>
                            )}
                            <div className="mx-4 border-t border-amber-700/30 my-1" />
                            <li className="px-2 py-1">
                                <AuthButton />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

