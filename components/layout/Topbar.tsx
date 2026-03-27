"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { appMetadata } from "@/lib/metadata";
import AuthButton from "../custom/AuthButton";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { 
  LayoutDashboard, 
  Users, 
  Swords, 
  LogOut,
  Shield,
  ChevronDown,
  UserCircle,
  Menu,
  X
} from "lucide-react";
import Image from "next/image";

const navLinks = [
    { href: "/characters", label: "Personaggi", icon: Users },
    { href: "/campaigns", label: "Campagna", icon: Swords },
];

const adminLinks = [
    { href: "/admin/", label: "Pannello amministratore", icon: Shield }
];

export default function Topbar() {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsLoggedIn(!!session?.user);
            setUser(session?.user || null);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session?.user);
            setUser(session?.user || null);
        });
        return () => subscription.unsubscribe();
    }, []);

    // Chiude menu mobile cliccando fuori
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
                setMobileMenuOpen(false);
            }
        };
        if (mobileMenuOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [mobileMenuOpen]);

    // Chiude menu utente cliccando fuori
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        if (userMenuOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [userMenuOpen]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
    };
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

            <div className="container mx-auto px-4 py-3 relative">
                <div className="flex justify-between items-center">
                    {/* Logo - sempre a sinistra */}
                    <Link href="/" className="group relative" onClick={() => setMobileMenuOpen(false)}>
                        <div className="absolute inset-0 bg-amber-500/20 blur-lg group-hover:bg-amber-500/30 transition-all duration-300 rounded-lg" />
                        <span className="relative text-xl md:text-2xl font-serif text-amber-100 drop-shadow-lg">
                            {appMetadata.title as string}
                        </span>
                    </Link>

                    {/* Desktop Navigation - solo su desktop */}
                    <div className="hidden lg:flex items-center gap-1">
                        {isLoggedIn && navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative px-4 py-2 text-amber-100 hover:text-amber-50 transition-all duration-300 group inline-flex items-center gap-2"
                                >
                                    <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative z-10 font-serif">{link.label}</span>
                                    <span className="absolute inset-0 bg-amber-800/50 border border-amber-700/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300" />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Section - Admin + User Menu (desktop) / User Menu + Hamburger (mobile) */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Admin Link - solo desktop */}
                        {isLoggedIn && adminLinks.length > 0 && (
                            <div className="hidden lg:block">
                                {adminLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="relative px-3 py-2 text-amber-300 hover:text-amber-100 transition-all duration-300 group inline-flex items-center gap-1.5 text-sm"
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="font-serif hidden xl:inline">Admin</span>
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300" />
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        {/* User Menu con Avatar - visibile sia desktop che mobile */}
                        {isLoggedIn ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-1 md:gap-2 group focus:outline-none"
                                    aria-label="Menu utente"
                                >
                                    {/* Avatar */}
                                    <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-400/50 shadow-lg hover:shadow-amber-500/20 transition-all duration-300 group-hover:scale-105">
                                        <div className="absolute inset-0 rounded-full bg-amber-500/20 group-hover:bg-amber-500/30 transition-all" />
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            {user?.user_metadata?.avatar_url ? (
                                                <Image
                                                    src={user.user_metadata.avatar_url}
                                                    alt="Avatar"
                                                    fill
                                                    className="rounded-full object-cover"
                                                />
                                            ) : (
                                                <UserCircle className="w-5 h-5 md:w-6 md:h-6 text-amber-100" />
                                            )}
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-amber-300 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown menu utente */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-gradient-to-b from-amber-800 to-stone-800 rounded-xl border border-amber-600/40 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                        {/* Header con info utente */}
                                        <div className="px-4 py-3 border-b border-amber-700/50 bg-amber-900/30">
                                            <p className="text-amber-100 text-sm font-serif truncate">
                                                {user?.email || "Utente"}
                                            </p>
                                            <p className="text-amber-400/70 text-xs mt-0.5">
                                                Avventuriero
                                            </p>
                                        </div>

                                        {/* Link Dashboard */}
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-amber-100 hover:bg-amber-700/50 transition-all duration-200 group"
                                        >
                                            <LayoutDashboard className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                                            <span className="font-serif">Dashboard</span>
                                        </Link>

                                        {/* Separatore */}
                                        <div className="mx-3 border-t border-amber-700/30 my-1" />

                                        {/* Admin Link mobile (mostrato solo nel menu utente) */}
                                        {adminLinks.map((link) => {
                                            const Icon = link.icon;
                                            return (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-amber-300 hover:bg-amber-700/50 transition-all duration-200 group lg:hidden"
                                                >
                                                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                    <span className="font-serif text-sm">{link.label}</span>
                                                </Link>
                                            );
                                        })}

                                        {/* Logout */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-amber-300 hover:bg-amber-700/50 transition-all duration-200 group border-t border-amber-700/30"
                                        >
                                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            <span className="font-serif">Esci</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <AuthButton />
                        )}

                        {/* Hamburger menu - solo mobile, posizionato DOPO l'avatar */}
                        <button
                            className="relative lg:hidden w-8 h-8 md:w-10 md:h-10 rounded-lg border border-amber-700/50 hover:bg-amber-800/50 transition-all duration-300 flex items-center justify-center"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label={mobileMenuOpen ? "Chiudi menu" : "Apri menu"}
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? (
                                <X className="w-4 h-4 md:w-5 md:h-5 text-amber-200" />
                            ) : (
                                <Menu className="w-4 h-4 md:w-5 md:h-5 text-amber-200" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <div
                    ref={mobileMenuRef}
                    className={`
                        lg:hidden overflow-hidden transition-all duration-300 ease-in-out
                        ${mobileMenuOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}
                    `}
                >
                    <div className="bg-gradient-to-b from-amber-900/95 to-stone-900/95 rounded-xl border border-amber-700/40 shadow-xl backdrop-blur-sm">
                        <ul className="flex flex-col p-2">
                            {isLoggedIn && navLinks.map((link, index) => {
                                const Icon = link.icon;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-amber-100 hover:text-amber-50 hover:bg-amber-800/50 transition-all duration-200 font-serif"
                                        >
                                            <Icon className="w-5 h-5 text-amber-400" />
                                            {link.label}
                                        </Link>
                                        {index < navLinks.length - 1 && (
                                            <div className="mx-4 border-b border-amber-700/20" />
                                        )}
                                    </li>
                                );
                            })}
                            
                            {isLoggedIn && adminLinks.length > 0 && (
                                <>
                                    <div className="mx-4 border-b border-amber-700/20" />
                                    {adminLinks.map((link) => {
                                        const Icon = link.icon;
                                        return (
                                            <li key={link.href}>
                                                <Link
                                                    href={link.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-amber-300 hover:text-amber-50 hover:bg-amber-800/50 transition-all duration-200 font-serif"
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    {link.label}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </>
                            )}
                            
                            {/* Dashboard link per mobile (opzionale, già nel menu utente) */}
                            {isLoggedIn && (
                                <>
                                    <div className="mx-4 border-b border-amber-700/20" />
                                    <li>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-amber-100 hover:text-amber-50 hover:bg-amber-800/50 transition-all duration-200 font-serif"
                                        >
                                            <LayoutDashboard className="w-5 h-5 text-amber-400" />
                                            Dashboard
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}