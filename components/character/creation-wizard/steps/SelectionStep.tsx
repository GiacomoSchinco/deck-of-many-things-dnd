// components/character/creation-wizard/steps/SelectionStep.tsx
'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { RaceClassCard } from '@/components/custom/RaceClassCard';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import Loading from '@/components/custom/Loading';
import { WizardStep } from '../WizardStep';
import CardSwiper, { type CardSwiperEntry } from '@/components/custom/CardSwiper';

interface SelectionStepProps<T extends { id: number; name: string }> {
  data: T[] | undefined;
  isLoading: boolean;
  error: Error | null | undefined;
  initialId?: number | null;
  type: 'race' | 'class';
  title: string;
  subtitle: string;
  nextLabel: string;
  searchPlaceholder: string;
  noResultsText: string;
  emptyDataText: string;
  searchEmoji: string;
  getItalianName: (name: string) => string;
  onBack: () => void;
  onSelect: (id: number) => void;
  renderDetails: (item: T) => ReactNode;
}

export function SelectionStep<T extends { id: number; name: string }>({
  data,
  isLoading,
  error,
  initialId,
  type,
  title,
  subtitle,
  nextLabel,
  searchPlaceholder,
  noResultsText,
  emptyDataText,
  searchEmoji,
  getItalianName,
  onBack,
  onSelect,
  renderDetails,
}: SelectionStepProps<T>) {
  const [selectedId, setSelectedId] = useState<number | null>(initialId ?? null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [gotoIndex, setGotoIndex] = useState<number | undefined>(undefined);

  const selectedItem = data?.[currentIndex];

  const searchResults = search.trim()
    ? (data ?? []).filter(item => {
        const q = search.toLowerCase();
        return item.name.toLowerCase().includes(q) || getItalianName(item.name).toLowerCase().includes(q);
      })
    : [];

  const items: CardSwiperEntry[] = (data ?? []).map(item => ({
    id: item.id,
    node: (
      <RaceClassCard
        id={item.id}
        name={item.name}
        type={type}
        isSelected={selectedId === item.id}
        onSelect={() => setSelectedId(item.id)}
        size="md"
      />
    ),
    label: item.name,
  }));

  const handleConfirm = () => {
    if (selectedId) onSelect(selectedId);
  };

  if (isLoading) return <Loading />;

  if (error || !selectedItem) {
    return (
      <AncientCardContainer className="p-6 text-center">
        <p className="text-red-500">Errore: {error?.message || emptyDataText}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
          Riprova
        </Button>
      </AncientCardContainer>
    );
  }

  return (
    <WizardStep
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      onNext={handleConfirm}
      nextDisabled={!selectedId}
      nextLabel={nextLabel}
    >
      {/* Ricerca per nome */}
      <div className="relative w-full max-w-sm mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-amber-700 pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-md border-2 border-amber-700/50 bg-amber-50/80 text-amber-900 placeholder-amber-500 text-sm focus:outline-none focus:border-amber-700"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 text-amber-600 hover:text-amber-900">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-amber-50 border-2 border-amber-700/40 rounded-md shadow-lg overflow-hidden">
            {searchResults.map(item => {
              const idx = (data ?? []).findIndex(d => d.id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    setCurrentIndex(idx);
                    setGotoIndex(idx);
                    setSearch('');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-amber-900 hover:bg-amber-200 border-b border-amber-200 last:border-0 flex items-center gap-2"
                >
                  <span className="text-amber-600">{searchEmoji}</span>
                  {getItalianName(item.name)}
                  {selectedId === item.id && <span className="ml-auto text-emerald-700 text-xs font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        )}

        {search.trim() && searchResults.length === 0 && (
          <p className="absolute mt-1 w-full text-center text-sm text-amber-600 bg-amber-50 border border-amber-300 rounded-md py-2">
            {noResultsText}
          </p>
        )}
      </div>

      {/* Carosello CardSwiper */}
      <div className="flex justify-center">
        <CardSwiper
          items={items}
          initialIndex={Math.max(0, (data ?? []).findIndex(d => d.id === initialId))}
          activeIndex={gotoIndex}
          size="md"
          showLabel={false}
          onSelect={(entry) => {
            const idx = (data ?? []).findIndex(d => d.id === entry.id);
            if (idx >= 0) setCurrentIndex(idx);
          }}
        />
      </div>

      {/* Dettagli dell'elemento corrente */}
      <AncientCardContainer className="mt-6 p-6">
        <div className="space-y-4">
          {renderDetails(selectedItem)}
        </div>
      </AncientCardContainer>
    </WizardStep>
  );
}
