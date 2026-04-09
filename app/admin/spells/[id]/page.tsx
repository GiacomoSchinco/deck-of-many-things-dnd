// app/admin/spells/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSpell } from '@/hooks/queries/useSpells';
import { useSpellMutations } from '@/hooks/mutations/useSpellMutations';
import { AncientScroll } from '@/components/custom/AncientScroll';
import Loading from '@/components/custom/Loading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Sparkles,
    BookOpen,
    Clock,
    Target,
    Hourglass,
    Shield,
    Wand2,
    Eye,
    Heart,
    Zap,
    Moon,
    Skull,
    Brain,
    Crown,
    Star,
    ScrollText,
    Users
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getItalianSchool, getItalianClass } from '@/lib/utils/nameMappers';
import { toast } from 'sonner';

// Mappa delle icone per scuola
const schoolIcons: Record<string, { icon: LucideIcon, color: string }> = {
    'abjuration': { icon: Shield, color: 'text-blue-500' },
    'conjuration': { icon: Wand2, color: 'text-purple-500' },
    'divination': { icon: Eye, color: 'text-indigo-500' },
    'enchantment': { icon: Heart, color: 'text-pink-500' },
    'evocation': { icon: Zap, color: 'text-orange-500' },
    'illusion': { icon: Moon, color: 'text-cyan-500' },
    'necromancy': { icon: Skull, color: 'text-gray-500' },
    'transmutation': { icon: Brain, color: 'text-emerald-500' },
};

// Mappa dei livelli
const levelIcons: Record<number, { icon: LucideIcon, label: string }> = {
    0: { icon: Sparkles, label: 'Trucchetto' },
    1: { icon: Star, label: '1° Livello' },
    2: { icon: Star, label: '2° Livello' },
    3: { icon: Star, label: '3° Livello' },
    4: { icon: Star, label: '4° Livello' },
    5: { icon: Star, label: '5° Livello' },
    6: { icon: Crown, label: '6° Livello' },
    7: { icon: Crown, label: '7° Livello' },
    8: { icon: Crown, label: '8° Livello' },
    9: { icon: Crown, label: '9° Livello' },
};

export default function SpellDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const spellId = id ? parseInt(String(id), 10) : null;
    const { data: spell, isLoading } = useSpell(spellId);
    const spellMutations = useSpellMutations();
    const deleteSpell = spellMutations.delete;

    if (isLoading) return <Loading />;
    if (!spell) return <div className="text-center py-12 text-amber-600">Incantesimo non trovato</div>;

    const handleDelete = async () => {
        if (confirm(`Sei sicuro di voler eliminare l'incantesimo "${spell.name}"?`)) {
            try {
                await deleteSpell.mutateAsync(spell.id);
                toast.success('Incantesimo eliminato con successo');
                router.push('/admin/spells');
            } catch {
                toast.error('Errore durante l\'eliminazione');
            }
        }
    };

    const SchoolIcon = schoolIcons[spell.school]?.icon || BookOpen;
    const schoolColor = schoolIcons[spell.school]?.color || 'text-amber-600';
    const LevelIcon = levelIcons[spell.level]?.icon || Star;
    const levelLabel = levelIcons[spell.level]?.label || `${spell.level}° Livello`;

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-5xl">
            {/* Pulsante Torna Indietro */}
            <div className="mb-4">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-amber-600 hover:text-amber-800 hover:bg-amber-100/50"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Torna al catalogo
                </Button>
            </div>

            <AncientScroll variant="rolled">
                {/* Header con titolo e azioni */}
                <div className="relative mb-8">                   
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ">
                        {/* Info principale */}
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${schoolColor} bg-amber-100/80 border border-amber-300 shadow-md`}>
                                <SchoolIcon className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl fantasy-title">
                                    {spell.name}
                                </h1>
                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                    <div className="flex items-center gap-1">
                                        <LevelIcon className="w-4 h-4 text-amber-600" />
                                        <span className="text-amber-700 font-serif">{levelLabel}</span>
                                    </div>
                                    <span className="text-amber-400">•</span>
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4 text-amber-600" />
                                        <span className="text-amber-700 font-serif">{getItalianSchool(spell.school)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Azioni */}
                        <div className="flex gap-2">
                            <Button
                                onClick={() => router.push(`/admin/spells/${id}/edit`)}
                                className="bg-amber-700 hover:bg-amber-800 text-white shadow-md"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Modifica
                            </Button>
                            <Button
                                onClick={handleDelete}
                                variant="outline"
                                className="border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Elimina
                            </Button>
                        </div>
                    </div>

                    {/* Classi disponibili */}
                    <div className="mt-4 pt-2 border-t border-amber-200/50">
                        <div className="flex items-center gap-2 text-amber-600 text-sm">
                            <Users className="w-4 h-4" />
                            <span className="font-serif">Classi:</span>
                        </div>
                        <div className="flex gap-2 flex-wrap mt-1">
                            {spell.classes && spell.classes.length > 0 ? (
                                spell.classes.map((className: string) => (
                                    <Badge key={className} className="bg-amber-100 text-amber-800 border-amber-300 px-3 py-1 text-sm">
                                        {getItalianClass(className)}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-amber-500 italic text-sm">Nessuna classe specifica</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card informazioni principali */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-amber-50/40 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="pt-4 pb-3">
                            <div className="flex items-center gap-2 text-amber-600 mb-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-serif uppercase tracking-wider">Tempo di Lancio</span>
                            </div>
                            <p className="text-amber-900 font-serif text-base font-medium">{spell.casting_time || '—'}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-amber-50/40 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="pt-4 pb-3">
                            <div className="flex items-center gap-2 text-amber-600 mb-2">
                                <Target className="w-4 h-4" />
                                <span className="text-xs font-serif uppercase tracking-wider">Gittata</span>
                            </div>
                            <p className="text-amber-900 font-serif text-base font-medium">{spell.range || '—'}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-amber-50/40 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="pt-4 pb-3">
                            <div className="flex items-center gap-2 text-amber-600 mb-2">
                                <Hourglass className="w-4 h-4" />
                                <span className="text-xs font-serif uppercase tracking-wider">Durata</span>
                            </div>
                            <p className="text-amber-900 font-serif text-base font-medium">{spell.duration || '—'}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-amber-50/40 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="pt-4 pb-3">
                            <div className="flex items-center gap-2 text-amber-600 mb-2">
                                <ScrollText className="w-4 h-4" />
                                <span className="text-xs font-serif uppercase tracking-wider">Componenti</span>
                            </div>
                            <div>
                                <p className="text-amber-900 font-serif text-base font-medium">
                                    {(() => {
                                        const comp = spell.components;
                                        if (!comp) return '—';
                                        if (Array.isArray(comp)) {
                                            const text = comp.join(', ');
                                            return (
                                                <>
                                                    {text}
                                                    {comp.includes('M') && spell.material && (
                                                        <span className="text-xs text-amber-500 block mt-1 font-normal">
                                                            ({spell.material})
                                                        </span>
                                                    )}
                                                </>
                                            );
                                        }
                                        const parts: string[] = [];
                                        if (comp.verbal) parts.push('V');
                                        if (comp.somatic) parts.push('S');
                                        if (comp.material) parts.push('M');
                                        return (
                                            <>
                                                {parts.length ? parts.join(', ') : '—'}
                                                {comp.material && (
                                                    <span className="text-xs text-amber-500 block mt-1 font-normal">
                                                        ({comp.material})
                                                    </span>
                                                )}
                                            </>
                                        );
                                    })()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Badge per rituale e concentrazione */}
                {(spell.ritual || spell.concentration) && (
                    <div className="flex gap-3 mb-8">
                        {spell.ritual && (
                            <Badge className="bg-purple-100 text-purple-700 border-purple-300 px-3 py-1.5 shadow-sm">
                                📖 Rituale
                            </Badge>
                        )}
                        {spell.concentration && (
                            <Badge className="bg-orange-100 text-orange-700 border-orange-300 px-3 py-1.5 shadow-sm">
                                🧠 Concentrazione
                            </Badge>
                        )}
                    </div>
                )}

                {/* Descrizione - con titolo elegante */}
                <div className="mt-6">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-amber-300/30"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-amber-100/80 px-4 py-1 text-amber-700 text-sm font-serif tracking-wider rounded-full">
                                ✦ Descrizione ✦
                            </span>
                        </div>
                    </div>
                    <Card className="bg-amber-50/20 border-amber-200/50 shadow-inner">
                        <CardContent className="pt-6 pb-6">
                            <p className="text-amber-800 whitespace-pre-wrap leading-relaxed font-serif">
                                {spell.description || 'Nessuna descrizione disponibile.'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* A livelli superiori */}
                {spell.at_higher_levels && (
                    <div className="mt-8">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-amber-300/30"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-amber-100/80 px-4 py-1 text-amber-700 text-sm font-serif tracking-wider rounded-full">
                                    ✦ A Livelli Superiori ✦
                                </span>
                            </div>
                        </div>
                        <Card className="bg-amber-50/20 border-amber-200/50 shadow-inner">
                            <CardContent className="pt-6 pb-6">
                                <p className="text-amber-800 whitespace-pre-wrap leading-relaxed font-serif">
                                    {spell.at_higher_levels}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Footer decorativo */}
                <div className="mt-8 pt-4 text-center">
                    <div className="inline-flex items-center gap-2 text-xs text-amber-400/70">
                        <span>✧</span>
                        <span>ID: {spell.id}</span>
                        <span>✧</span>
                        {spell.created_at && (
                            <>
                                <span>Creato: {new Date(spell.created_at).toLocaleDateString('it-IT')}</span>
                                <span>✧</span>
                            </>
                        )}
                    </div>
                </div>
            </AncientScroll>
        </div>
    );
}