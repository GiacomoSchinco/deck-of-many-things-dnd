// app/admin/spells/page.tsx
'use client';

import AncientContainer from "@/components/custom/AncientContainer";
import DataTable from "@/components/custom/DataTable";
import Loading from "@/components/custom/Loading";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useSpells } from "@/hooks/queries/useSpells";
import type { Spell } from '@/types/spell';
import { getItalianSchool, getItalianClass } from "@/lib/utils/nameMappers";
import { Plus, BookOpen, Wand2, ScrollText, Sparkles, Crown, Flame, Shield, Eye, Heart, Moon, Zap, Skull, Brain, Star } from "lucide-react";
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// Opzioni per i livelli degli incantesimi
const levelOptions = [
  { value: '0', label: 'Trucchetto', icon: Sparkles },
  { value: '1', label: '1° Livello', icon: Star },
  { value: '2', label: '2° Livello', icon: Star },
  { value: '3', label: '3° Livello', icon: Star },
  { value: '4', label: '4° Livello', icon: Star },
  { value: '5', label: '5° Livello', icon: Star },
  { value: '6', label: '6° Livello', icon: Crown },
  { value: '7', label: '7° Livello', icon: Crown },
  { value: '8', label: '8° Livello', icon: Crown },
  { value: '9', label: '9° Livello', icon: Crown },
];

// Opzioni per le scuole di magia
const schoolOptions = [
  { value: 'abjuration', label: 'Abiurazione', icon: Shield, color: 'text-blue-500' },
  { value: 'conjuration', label: 'Evocazione', icon: Wand2, color: 'text-purple-500' },
  { value: 'divination', label: 'Divinazione', icon: Eye, color: 'text-indigo-500' },
  { value: 'enchantment', label: 'Ammaliamento', icon: Heart, color: 'text-pink-500' },
  { value: 'evocation', label: 'Invocazione', icon: Zap, color: 'text-orange-500' },
  { value: 'illusion', label: 'Illusione', icon: Moon, color: 'text-cyan-500' },
  { value: 'necromancy', label: 'Necromanzia', icon: Skull, color: 'text-gray-500' },
  { value: 'transmutation', label: 'Trasmutazione', icon: Brain, color: 'text-emerald-500' },
];

// Opzioni per le classi
const classOptions = [
  { value: 'barbarian', label: 'Barbaro', icon: '💪' },
  { value: 'bard', label: 'Bardo', icon: '🎵' },
  { value: 'cleric', label: 'Chierico', icon: '✝️' },
  { value: 'druid', label: 'Druido', icon: '🌿' },
  { value: 'fighter', label: 'Guerriero', icon: '⚔️' },
  { value: 'monk', label: 'Monaco', icon: '🥋' },
  { value: 'paladin', label: 'Paladino', icon: '🛡️' },
  { value: 'ranger', label: 'Ranger', icon: '🏹' },
  { value: 'rogue', label: 'Ladro', icon: '🗡️' },
  { value: 'sorcerer', label: 'Stregone', icon: '✨' },
  { value: 'warlock', label: 'Warlock', icon: '🔮' },
  { value: 'wizard', label: 'Mago', icon: '📚' },
];

export default function SpellsPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [levelQuery, setLevelQuery] = useState('');
  const [schoolQuery, setSchoolQuery] = useState('');
  const [classQuery, setClassQuery] = useState('');
  const [debouncedFilters, setDebouncedFilters] = useState<{ 
    search?: string; 
    level?: string;
    school?: string;
    class?: string;
  }>({});

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedFilters({
        search: query?.trim() ? query.trim() : undefined,
        level: levelQuery?.trim() ? levelQuery.trim() : undefined,
        school: schoolQuery?.trim() ? schoolQuery.trim() : undefined,
        class: classQuery?.trim() ? classQuery.trim() : undefined,
      });
    }, 300);
    return () => clearTimeout(t);
  }, [query, levelQuery, schoolQuery, classQuery]);

  const { data: spells, isLoading, isError } = useSpells(debouncedFilters);
  
  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center text-red-600 p-8">Errore nel caricamento degli incantesimi.</div>;

  return (
    <AncientContainer 
      title="Catalogo Incantesimi" 
      subtitle="Esplora l'ampia collezione di incantesimi SRD in italiano, perfetti per maghi, chierici, stregoni e tutti gli altri incantatori!" 
      icon={BookOpen}
      action={
        <Button 
          onClick={() => router.push('/admin/spells/create')}
          className="bg-amber-700 hover:bg-amber-800 text-white shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuovo Incantesimo
        </Button>
      }
    >
      {/* Filtri */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap gap-2">
          {/* Ricerca per nome */}
          <Input 
            placeholder="Cerca incantesimo..." 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            className="flex-1 min-w-[200px]"
          />
          
          {/* Filtro per livello */}
          <Select value={levelQuery ?? ''} onValueChange={(v) => setLevelQuery(v || '')}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Livello">
                <div className="flex items-center gap-2">
                  {(() => {
                    const sel = levelOptions.find(t => t.value === levelQuery);
                    if (!sel) return (<><Sparkles className="w-4 h-4" /><span>Livello</span></>);
                    const Icon = sel.icon;
                    return (<><Icon className="w-4 h-4" /><span>{sel.label}</span></>);
                  })()}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" label="Tutti i livelli">Tutti i livelli</SelectItem>
              {levelOptions.map(opt => {
                const Icon = opt.icon;
                return (
                  <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{opt.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Filtro per scuola */}
          <Select value={schoolQuery ?? ''} onValueChange={(v) => setSchoolQuery(v || '')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Scuola">
                <div className="flex items-center gap-2">
                  {(() => {
                    const sel = schoolOptions.find(t => t.value === schoolQuery);
                    if (!sel) return (<><BookOpen className="w-4 h-4" /><span>Scuola</span></>);
                    const Icon = sel.icon;
                    return (<><Icon className={`w-4 h-4 ${sel.color}`} /><span>{sel.label}</span></>);
                  })()}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" label="Tutte le scuole">Tutte le scuole</SelectItem>
              {schoolOptions.map(opt => {
                const Icon = opt.icon;
                return (
                  <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${opt.color}`} />
                      <span>{opt.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Filtro per classe */}
          <Select value={classQuery ?? ''} onValueChange={(v) => setClassQuery(v || '')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Classe">
                <div className="flex items-center gap-2">
                  {(() => {
                    const sel = classOptions.find(t => t.value === classQuery);
                    if (!sel) return (<><ScrollText className="w-4 h-4" /><span>Classe</span></>);
                    return (<><span>{sel.icon}</span><span>{sel.label}</span></>);
                  })()}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" label="Tutte le classi">Tutte le classi</SelectItem>
              {classOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                  <div className="flex items-center gap-2">
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Contatore risultati */}
        <div className="text-sm text-amber-600">
          {spells?.length || 0} incantesimi trovati
        </div>
      </div>

      {/* Tabella incantesimi */}
      <DataTable
        initialData={(spells ?? []) as unknown as Record<string, unknown>[]}
        visibleColumns={['name', 'level', 'school', 'range', 'duration']}
        labels={{
          name: 'Nome',
          level: 'Livello',
          school: 'Scuola',
          range: 'Gittata',
          duration: 'Durata',
        }}
        customRenderers={{
          level: (v) => {
            const level = Number(v);
            if (level === 0) return <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Trucchetto</span>;
            return <span>{level}° Livello</span>;
          },
          school: (v) => {
            const school = String(v || '');
            const schoolInfo = schoolOptions.find(s => s.value === school);
            const Icon = schoolInfo?.icon || BookOpen;
            return (
              <span className={`flex items-center gap-1 ${schoolInfo?.color || ''}`}>
                <Icon className="w-3 h-3" />
                {getItalianSchool(school)}
              </span>
            );
          },
          ritual: (v) => v ? <span className="text-purple-600">✓ Rituale</span> : null,
          concentration: (v) => v ? <span className="text-orange-600">✓ Concentrazione</span> : null,
        }}
        onRowClick={(id) => router.push(`/admin/spells/${id}`)}
        pagination
      />
    </AncientContainer>
  );
}