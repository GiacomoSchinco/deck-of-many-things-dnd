// components/character/creation-wizard/steps/SelectionStep.tsx
'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Search, X } from 'lucide-react';
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
  /** Icona del tipo di scelta (razza/classe): usata nel titolo e nei risultati di ricerca. */
  icon: React.ComponentType<{ className?: string }>;
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
  icon: Icon,
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
        <p className="text-destructive">Errore: {error?.message || emptyDataText}</p>
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
      icon={Icon}
      onBack={onBack}
      onNext={handleConfirm}
      nextDisabled={!selectedId}
      nextLabel={nextLabel}
    >
      {/* Ricerca per nome */}
      <div className="relative mx-auto w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 pr-9"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            aria-label="Cancella la ricerca"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition-colors hover:text-ink-strong"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {searchResults.length > 0 && (
          <div className="panel absolute z-10 mt-1 w-full overflow-hidden">
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
                  className="flex w-full items-center gap-2 border-b border-frame/15 px-4 py-2 text-left text-sm text-ink transition-colors last:border-0 hover:bg-parchment-200/60"
                >
                  <Icon className="h-4 w-4 shrink-0 text-frame" />
                  {getItalianName(item.name)}
                  {selectedId === item.id && (
                    <Check className="ml-auto h-4 w-4 text-success" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {search.trim() && searchResults.length === 0 && (
          <p className="panel-inset absolute mt-1 w-full py-2 text-center text-sm text-ink-muted">
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
