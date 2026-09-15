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
    BookOpen,
    Clock,
    Target,
    Hourglass,
    Brain,
    ScrollText,
    Users
} from 'lucide-react';
import { getItalianClass } from '@/lib/utils/nameMappers';
import { getSchoolMeta, getSpellLevelMeta } from '@/lib/theme/schools';
import { toast } from 'sonner';

// Icona e colore della scuola e del livello arrivano da `lib/theme/schools.ts`:
// prima questo file ne aveva una copia con colori diversi da quelli usati
// nella lista e nelle card.

export default function SpellDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const spellId = id ? parseInt(String(id), 10) : null;
    const { data: spell, isLoading } = useSpell(spellId);
    const spellMutations = useSpellMutations();
    const deleteSpell = spellMutations.delete;

    if (isLoading) return <Loading />;
    if (!spell) return <div className="text-center py-12 text-ink-muted">Incantesimo non trovato</div>;

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

    const school = getSchoolMeta(spell.school);
    const SchoolIcon = school.icon;
    const { icon: LevelIcon, label: levelLabel } = getSpellLevelMeta(spell.level);

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-5xl">
            {/* Pulsante Torna Indietro */}
            <div className="mb-4">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
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
                            <div className={`p-3 rounded-full border shadow-e2 ${school.text} ${school.bg} ${school.border}`}>
                                <SchoolIcon className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl fantasy-title">
                                    {spell.name}
                                </h1>
                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                    <div className="flex items-center gap-1">
                                        <LevelIcon className="w-4 h-4 text-frame" />
                                        <span className="text-ink-muted font-serif">{levelLabel}</span>
                                    </div>
                                    <span className="text-frame/50">•</span>
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4 text-frame" />
                                        <span className={`font-serif ${school.text}`}>{school.it}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Azioni */}
                        <div className="flex gap-2">
                            <Button
                                onClick={() => router.push(`/admin/spells/${id}/edit`)}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Modifica
                            </Button>
                            <Button
                                onClick={handleDelete}
                                variant="destructive"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Elimina
                            </Button>
                        </div>
                    </div>

                    {/* Classi disponibili */}
                    <div className="mt-4 pt-2 border-t border-frame/20">
                        <div className="flex items-center gap-2 text-ink-muted text-sm">
                            <Users className="w-4 h-4" />
                            <span className="font-serif">Classi:</span>
                        </div>
                        <div className="flex gap-2 flex-wrap mt-1">
                            {spell.classes && spell.classes.length > 0 ? (
                                spell.classes.map((className: string) => (
                                    <Badge key={className} className="surface-tile text-ink-strong px-3 py-1 text-sm">
                                        {getItalianClass(className)}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-ink-muted italic text-sm">Nessuna classe specifica</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card informazioni principali */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card interactive className="shadow-e1">
                        <CardContent className="pt-4 pb-3">
                            <div className="flex items-center gap-2 text-frame mb-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-serif uppercase tracking-wider">Tempo di Lancio</span>
                            </div>
                            <p className="text-ink-strong font-serif text-base font-medium">{spell.casting_time || '—'}</p>
                        </CardContent>
                    </Card>

                    <Card interactive className="shadow-e1">
                        <CardContent className="pt-4 pb-3">
                            <div className="flex items-center gap-2 text-frame mb-2">
                                <Target className="w-4 h-4" />
                                <span className="text-xs font-serif uppercase tracking-wider">Gittata</span>
                            </div>
                            <p className="text-ink-strong font-serif text-base font-medium">{spell.range || '—'}</p>
                        </CardContent>
                    </Card>

                    <Card interactive className="shadow-e1">
                        <CardContent className="pt-4 pb-3">
                            <div className="flex items-center gap-2 text-frame mb-2">
                                <Hourglass className="w-4 h-4" />
                                <span className="text-xs font-serif uppercase tracking-wider">Durata</span>
                            </div>
                            <p className="text-ink-strong font-serif text-base font-medium">{spell.duration || '—'}</p>
                        </CardContent>
                    </Card>

                    <Card interactive className="shadow-e1">
                        <CardContent className="pt-4 pb-3">
                            <div className="flex items-center gap-2 text-frame mb-2">
                                <ScrollText className="w-4 h-4" />
                                <span className="text-xs font-serif uppercase tracking-wider">Componenti</span>
                            </div>
                            <div>
                                <p className="text-ink-strong font-serif text-base font-medium">
                                    {(() => {
                                        const comp = spell.components;
                                        if (!comp) return '—';
                                        if (Array.isArray(comp)) {
                                            const text = comp.join(', ');
                                            return (
                                                <>
                                                    {text}
                                                    {comp.includes('M') && spell.material && (
                                                        <span className="text-xs text-ink-muted block mt-1 font-normal">
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
                                                    <span className="text-xs text-ink-muted block mt-1 font-normal">
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
                            <Badge className="gap-1 border-school-illusion/35 bg-school-illusion/10 text-school-illusion px-3 py-1.5">
                                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                                Rituale
                            </Badge>
                        )}
                        {spell.concentration && (
                            <Badge className="gap-1 border-antique-gold/40 bg-antique-gold/15 text-frame-deep px-3 py-1.5">
                                <Brain className="h-3.5 w-3.5" aria-hidden="true" />
                                Concentrazione
                            </Badge>
                        )}
                    </div>
                )}

                {/* Descrizione - con titolo elegante */}
                <div className="mt-6">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="divider-ornate w-full" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="eyebrow bg-parchment-50 px-3">
                                Descrizione
                            </span>
                        </div>
                    </div>
                    <Card inset className="shadow-none">
                        <CardContent className="pt-6 pb-6">
                            <p className="text-ink whitespace-pre-wrap leading-relaxed font-serif">
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
                                <div className="divider-ornate w-full" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="eyebrow bg-parchment-50 px-3">
                                    A Livelli Superiori
                                </span>
                            </div>
                        </div>
                        <Card inset className="shadow-none">
                            <CardContent className="pt-6 pb-6">
                                <p className="text-ink whitespace-pre-wrap leading-relaxed font-serif">
                                    {spell.at_higher_levels}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Footer decorativo */}
                <div className="mt-8 pt-4 text-center">
                    <div className="inline-flex items-center gap-2 text-xs text-ink-muted">
                        <span className="ornament-diamond w-1.5 h-1.5" aria-hidden="true" />
                        <span>ID: {spell.id}</span>
                        <span className="ornament-diamond w-1.5 h-1.5" aria-hidden="true" />
                        {spell.created_at && (
                            <>
                                <span>Creato: {new Date(spell.created_at).toLocaleDateString('it-IT')}</span>
                                <span className="ornament-diamond w-1.5 h-1.5" aria-hidden="true" />
                            </>
                        )}
                    </div>
                </div>
            </AncientScroll>
        </div>
    );
}