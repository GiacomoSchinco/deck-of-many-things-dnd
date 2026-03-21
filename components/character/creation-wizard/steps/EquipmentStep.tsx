// components/character/creation-wizard/steps/EquipmentStep.tsx
'use client';

import { useState, useMemo } from 'react';
import { useEquipmentPresets } from '@/hooks/queries/useEquipmentPresets';
import { useItems } from '@/hooks/queries/useItems';
import type {
  EquipmentPreset as ApiEquipmentPreset,
  EquipmentItem as ApiEquipmentItem,
  EquipmentChoice as ApiEquipmentChoice,
} from '@/types/equipment';
import { Button } from '@/components/ui/button';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import { Check, Package, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Loading from '@/components/custom/Loading';
import { WizardStep } from '../WizardStep';

/** EquipmentItem con name sempre valorizzato (dopo il mapping). */
interface EquipmentItem extends ApiEquipmentItem {
  name: string;
}

/** EquipmentChoice arricchita con selectedItems per la selezione locale. */
interface EquipmentChoice extends Omit<ApiEquipmentChoice, 'items'> {
  items: EquipmentItem[];
  selectedItems?: EquipmentItem[];
}

/** Preset mappato: items e choices con nomi sempre presenti. */
type MappedPreset = Omit<ApiEquipmentPreset, 'items' | 'choices'> & {
  items: EquipmentItem[];
  choices: EquipmentChoice[];
};

interface EquipmentStepProps {
  classId: number;
  onConfirm: (selectedItems: EquipmentItem[]) => void;
  onChange?: (selectedItems: EquipmentItem[]) => void;
  initialSelectedItems?: EquipmentItem[];
  onBack: () => void;
}

export function EquipmentStep({ classId, onConfirm, onChange, initialSelectedItems, onBack }: EquipmentStepProps) {
  const { data: presets, isLoading: presetsLoading, error: presetsError } = useEquipmentPresets(classId);
  const { data: items } = useItems();

  // Calcola il preset una volta
  const selectedPreset = useMemo<MappedPreset | null>(() => {
    if (!presets || presets.length === 0 || !items) return null;
    const defaultPreset = presets.find(p => p.is_default) ?? presets[0];

    const mapItem = (it: ApiEquipmentItem): EquipmentItem => {
      const itemDetails = items.find(i => i.id === it.item_id);
      return {
        item_id: it.item_id,
        quantity: it.quantity,
        name: itemDetails?.name ?? it.name ?? 'Oggetto sconosciuto',
      };
    };

    const mappedItems: EquipmentItem[] = (defaultPreset.items ?? []).map(mapItem);

    const mappedChoices: EquipmentChoice[] = (defaultPreset.choices ?? []).map(
      (c: ApiEquipmentChoice) => ({
        description: c.description,
        count: c.count,
        items: c.items.map(mapItem),
        selectedItems: [],
      })
    );

    return { ...defaultPreset, items: mappedItems, choices: mappedChoices };
  }, [presets, items]);

  // Calcola la selezione iniziale UNA VOLTA (useMemo, senza useEffect)
  const initialSelection = useMemo(() => {
    if (!selectedPreset?.choices || !initialSelectedItems?.length) return {};
    
    const newSelectionMap: Record<number, EquipmentItem[]> = {};
    
    selectedPreset.choices.forEach((choice, idx) => {
      const selectedForThisChoice = initialSelectedItems.filter(savedItem => 
        choice.items.some(choiceItem => choiceItem.item_id === savedItem.item_id)
      );
      const limitedSelection = selectedForThisChoice.slice(0, choice.count);
      newSelectionMap[idx] = limitedSelection;
    });
    
    return newSelectionMap;
  }, [selectedPreset, initialSelectedItems]);

  // Stato per modifiche manuali — inizializzato una sola volta usando la selezione iniziale
  const [selectionMap, setSelectionMap] = useState<Record<number, EquipmentItem[]>>(() => initialSelection);

  const choices = useMemo<EquipmentChoice[]>(() => {
    if (!selectedPreset?.choices) return [];
    return selectedPreset.choices.map((choice, idx) => ({
      ...choice,
      selectedItems: selectionMap[idx] ?? [],
    }));
  }, [selectedPreset, selectionMap]);

  const [isConfirming, setIsConfirming] = useState(false);

  const updateChoiceSelection = (choiceIndex: number, item: EquipmentItem) => {
    const choice = choices[choiceIndex];
    if (!choice) return;
    const currentSelected = choice.selectedItems ?? [];
    const isAlreadySelected = currentSelected.some(s => s.item_id === item.item_id);
    
    let newSelected: EquipmentItem[];
    if (choice.count === 1) {
      newSelected = isAlreadySelected ? [] : [item];
    } else {
      if (isAlreadySelected) {
        newSelected = currentSelected.filter(s => s.item_id !== item.item_id);
      } else if (currentSelected.length < choice.count) {
        newSelected = [...currentSelected, item];
      } else {
        toast.warning(`Puoi selezionare al massimo ${choice.count} oggetto/i per "${choice.description}"`);
        return;
      }
    }

    const newSelectionMap = { ...selectionMap, [choiceIndex]: newSelected };
    setSelectionMap(newSelectionMap);

    if (onChange) {
      // Costruisci l'elenco completo in base alla nuova mappa di selezione per evitare incoerenze
      const allChoiceItems = (selectedPreset?.choices ?? []).map((_, i) => newSelectionMap[i] ?? []).flat();
      const allItems: EquipmentItem[] = [
        ...(selectedPreset?.items ?? []),
        ...allChoiceItems,
      ];
      onChange(allItems);
    }
  };

  const handleConfirm = () => {
    setIsConfirming(true);
    
    const allItems: EquipmentItem[] = [];
    
    if (selectedPreset?.items) {
      allItems.push(...selectedPreset.items);
    }
    
    choices.forEach(choice => {
      if (choice.selectedItems && choice.selectedItems.length > 0) {
        allItems.push(...choice.selectedItems);
      }
    });
    
    onConfirm(allItems);
  };

  const isChoiceComplete = (choice: EquipmentChoice) => {
    return (choice.selectedItems?.length || 0) === choice.count;
  };

  const allChoicesComplete = choices.length === 0 || choices.every(isChoiceComplete);

  if (presetsLoading) {
    return <Loading />;
  }

  if (presetsError) {
    return (
      <AncientCardContainer className="p-6 text-center">
        <p className="text-red-500">Errore nel caricamento dell&apos;equipaggiamento</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          Torna indietro
        </Button>
      </AncientCardContainer>
    );
  }

  if (!selectedPreset) {
    return (
      <div className="text-center py-12">
        <p className="text-amber-700">Nessun preset di equipaggiamento trovato per questa classe</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          Torna indietro
        </Button>
      </div>
    );
  }

  return (
    <WizardStep
      title="⚔️ Equipaggiamento Iniziale"
      subtitle="Scegli l'equipaggiamento con cui iniziare l'avventura"
      onBack={onBack}
      onNext={handleConfirm}
      nextDisabled={!allChoicesComplete || isConfirming}
      nextLoading={isConfirming}
      nextLabel={isConfirming ? 'Salvataggio...' : 'Conferma Equipaggiamento →'}
    >
      {/* Oggetti fissi */}
      {selectedPreset.items && selectedPreset.items.length > 0 && (
        <AncientCardContainer className="p-4">
          <h3 className="font-serif font-bold text-amber-900 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Equipaggiamento base (tutti lo ricevono)
          </h3>
          <div className="space-y-2">
            {selectedPreset.items.map((item: EquipmentItem, idx: number) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-amber-50 rounded">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-amber-900">
                  {item.name}
                  {item.quantity > 1 && <span className="ml-1 text-sm text-amber-600">x{item.quantity}</span>}
                </span>
              </div>
            ))}
          </div>
        </AncientCardContainer>
      )}

      {/* Scelte */}
      {choices.map((choice, idx) => {
        const isSingle = choice.count === 1;
        const isComplete = isChoiceComplete(choice);
        
        return (
          <AncientCardContainer key={idx} className="p-4">
            <h3 className="font-serif font-bold text-amber-900 mb-3 flex items-center justify-between">
              <span>
                {choice.description}
                {isSingle && <span className="text-sm font-normal text-amber-500 ml-2">(scegline una)</span>}
                {!isSingle && <span className="text-sm font-normal text-amber-500 ml-2">(scegline {choice.count})</span>}
              </span>
              <span className={cn(
                "text-sm font-normal px-2 py-0.5 rounded",
                isComplete ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-600"
              )}>
                {choice.selectedItems?.length || 0}/{choice.count} selezionati
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {choice.items.map((item, itemIdx) => {
                const isSelected = choice.selectedItems?.some(s => s.item_id === item.item_id);
                
                return (
                  <div
                    key={itemIdx}
                    onClick={() => updateChoiceSelection(idx, item)}
                    className={cn(
                      'p-3 rounded-lg cursor-pointer transition-all border-2 relative',
                      isSelected 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-amber-900/20 hover:border-amber-700 bg-parchment-50'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className={cn(
                          "font-medium",
                          isSelected ? "text-amber-900" : "text-amber-800"
                        )}>
                          {item.name}
                          {item.quantity > 1 && (
                            <span className="ml-1 text-sm text-amber-600">x{item.quantity}</span>
                          )}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="bg-green-500 rounded-full p-0.5 ml-2 flex-shrink-0">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Indicatore per selezione singola */}
                    {isSingle && isSelected && (
                      <div className="absolute -top-2 -right-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateChoiceSelection(idx, item);
                          }}
                          className="bg-red-500 rounded-full p-0.5 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </AncientCardContainer>
        );
      })}
    </WizardStep>
  );
}