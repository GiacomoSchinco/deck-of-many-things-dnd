"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Legge la sessione dalla cache locale (sincrono, nessun flash)
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Ascolta cambiamenti di autenticazione
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = () => {
        router.push('/login');
    };
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    const handleDashboard = () => {
        router.push('/dashboard');
    };

    // Stato di caricamento
    if (loading) {
        return (
            <div className="w-20 h-10 bg-amber-800/30 animate-pulse rounded-lg" />
        );
    }

    // Utente NON loggato → mostra Login
    if (!user) {
        return (
            <button
                onClick={handleLogin}
                className="relative px-4 py-2 text-amber-100 hover:text-amber-50 transition-all duration-300 group w-full lg:w-auto"
            >
                {/* Versione desktop */}
                <span className="hidden lg:flex relative z-10 items-center justify-center gap-2 font-serif">
                    Login
                </span>
                
                {/* Versione mobile */}
                <span className="lg:hidden relative z-10 flex items-center gap-3 font-serif">
                    <span className="flex-1 text-left">Login</span>
                </span>
                
                {/* Effetti hover */}
                <span className="absolute inset-0 bg-amber-800/50 border-2 border-amber-700/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute inset-0 border border-amber-700/30 rounded-lg" />
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-300 group-hover:w-full transition-all duration-300" />
            </button>
        );
    }

    // Utente LOGGATO → mostra nome cliccabile che porta a dashboard
    return (
        <div className="flex items-center gap-2">
            {/* Pulsante Logout (opzionale, se vuoi tenerlo) */}
            
            <button
                onClick={handleLogout}
                className="relative px-3 py-2 text-amber-100 hover:text-amber-50 transition-all duration-300 group"
                title="Logout"
            >
                <span className="flex-1 text-left">Logout</span>
                <span className="absolute inset-0 bg-amber-800/30 border-2 border-amber-700/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
        </div>
    );
}
