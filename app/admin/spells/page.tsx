// app/admin/spells/page.tsx
'use client';

import AncientContainer from "@/components/custom/AncientContainer";
import DataTable from "@/components/custom/DataTable";
import Loading from "@/components/custom/Loading";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useSpells } from "@/hooks/queries/useSpells";
import { SPELL_LEVEL_ORDER, SPELL_SCHOOL_ORDER, SPELL_SCHOOLS, getSchoolMeta, getSpellLevelMeta } from "@/lib/theme/schools";
import { Axe, BookOpen, Cross, Crosshair, Flame, Hand, Leaf, Music, Plus, ScrollText, Shield, Sparkles, Sword, Swords, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// Opzioni per i livelli degli incantesimi
const levelOptions = SPELL_LEVEL_ORDER.map((level) => {
  const meta = getSpellLevelMeta(level);
  return { value: String(level), label: meta.label, icon: meta.icon };
});

// Opzioni per le scuole di magia — nome, icona e colore da `lib/theme/schools`.
// Prima questo file aveva una propria mappa di colori, diversa da quella di
// SpellCard e SpellDetailDialog: la stessa scuola cambiava colore da pagina a
// pagina.
const schoolOptions = SPELL_SCHOOL_ORDER.map((value) => ({
  value,
  label: SPELL_SCHOOLS[value].it,
  icon: SPELL_SCHOOLS[value].icon,
  color: SPELL_SCHOOLS[value].text,
}));

// Opzioni per le classi. Le emoji sono state sostituite da icone: erano
// l'ultimo residuo nel progetto e non ereditano colore né dimensione.
const classOptions = [
  { value: 'barbarian', label: 'Barbaro', icon: Axe },
  { value: 'bard', label: 'Bardo', icon: Music },
  { value: 'cleric', label: 'Chierico', icon: Cross },
  { value: 'druid', label: 'Druido', icon: Leaf },
  { value: 'fighter', label: 'Guerriero', icon: Sword },
  { value: 'monk', label: 'Monaco', icon: Hand },
  { value: 'paladin', label: 'Paladino', icon: Shield },
  { value: 'ranger', label: 'Ranger', icon: Crosshair },
  { value: 'rogue', label: 'Ladro', icon: Swords },
  { value: 'sorcerer', label: 'Stregone', icon: Sparkles },
  { value: 'warlock', label: 'Warlock', icon: Flame },
  { value: 'wizard', label: 'Mago', icon: BookOpen },
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
      // Costruisce l'oggetto senza proprietà undefined per mantenere
      // la query key stabile e non generare fetch inutili
      const filters: { search?: string; level?: string; school?: string; class?: string } = {};
      if (query.trim())   filters.search = query.trim();
      if (levelQuery)     filters.level  = levelQuery;
      if (schoolQuery)    filters.school = schoolQuery;
      if (classQuery)     filters.class  = classQuery;
      setDebouncedFilters(filters);
    }, 500);
    return () => clearTimeout(t);
  }, [query, levelQuery, schoolQuery, classQuery]);

  const { data: spells, isLoading, isFetching, isError } = useSpells(
    debouncedFilters,
    { keepPrevious: true }
  );
  
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
                    const ClsIcon = sel.icon;
                    return (<><ClsIcon className="w-4 h-4 text-frame" /><span>{sel.label}</span></>);
                  })()}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" label="Tutte le classi">Tutte le classi</SelectItem>
              {classOptions.map(opt => {
                const ClsIcon = opt.icon;
                return (
                  <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                    <div className="flex items-center gap-2">
                      <ClsIcon className="w-4 h-4 text-frame" />
                      <span>{opt.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Contatore risultati + indicatore di ricerca in corso */}
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          {isFetching && <Loader2 className="w-3 h-3 animate-spin" />}
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
            const { icon: LvlIcon, label } = getSpellLevelMeta(Number(v));
            return <span className="flex items-center gap-1"><LvlIcon className="w-3 h-3" /> {label}</span>;
          },
          school: (v) => {
            const school = getSchoolMeta(String(v || ''));
            const Icon = school.icon;
            return (
              <span className={`flex items-center gap-1 ${school.text}`}>
                <Icon className="w-3 h-3" />
                {school.it}
              </span>
            );
          },
          ritual: (v) => v ? <span className="text-school-illusion">Rituale</span> : null,
          concentration: (v) => v ? <span className="text-antique-gold">Concentrazione</span> : null,
        }}
        onRowClick={(id) => router.push(`/admin/spells/${id}`)}
        pagination
      />
    </AncientContainer>
  );
}