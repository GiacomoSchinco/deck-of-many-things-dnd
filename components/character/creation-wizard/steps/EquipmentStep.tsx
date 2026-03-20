// components/character/creation-wizard/steps/EquipmentStep.tsx
'use client';

import { useState, useEffect } from 'react';
import { useEquipmentPresets } from '@/hooks/queries/useEquipmentPresets';
import { useItems } from '@/hooks/queries/useItems';
import { Button } from '@/components/ui/button';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import { Check, Package, Shield, Sword, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface EquipmentItem {
  item_id: number;
  quantity: number;
  name: string;
}

interface EquipmentChoice {
  description: string;
  items: EquipmentItem[];
  count: number;
  selectedItems?: EquipmentItem[];
}

interface EquipmentStepProps {
  classId: number;
  onConfirm: (selectedItems: EquipmentItem[]) => void;
  onBack: () => void;
}

export function EquipmentStep({ classId, onConfirm, onBack }: EquipmentStepProps) {
  const { data: presets, isLoading: presetsLoading, error: presetsError } = useEquipmentPresets(classId);
  const { data: items } = useItems();
  const [selectedPreset, setSelectedPreset] = useState<any>(null);
  const [choices, setChoices] = useState<EquipmentChoice[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (presets && presets.length > 0 && items) {
      const defaultPreset = presets.find(p => p.is_default) || presets[0];
      setSelectedPreset(defaultPreset);
      
      if (defaultPreset?.choices) {
        const initializedChoices = defaultPreset.choices.map((choice: any) => ({
          ...choice,
          items: choice.items.map((item: any) => {
            const itemDetails = items.find(i => i.id === item.item_id);
            return {
              ...item,
              name: itemDetails?.name || item.name || 'Oggetto sconosciuto'
            };
          }),
          selectedItems: []
        }));
        setChoices(initializedChoices);
      }
    }
  }, [presets, items]);

  const updateChoiceSelection = (choiceIndex: number, item: EquipmentItem) => {
    const newChoices = [...choices];
    const choice = newChoices[choiceIndex];
    const currentSelected = choice.selectedItems || [];
    
    // Verifica se l'item è già selezionato
    const isAlreadySelected = currentSelected.some(s => s.item_id === item.item_id);
    
    if (choice.count === 1) {
      // Selezione singola: se clicchi sullo stesso, deseleziona
      if (isAlreadySelected) {
        choice.selectedItems = [];
      } else {
        choice.selectedItems = [item];
      }
    } else {
      // Selezione multipla
      if (isAlreadySelected) {
        // Deseleziona
        choice.selectedItems = currentSelected.filter(s => s.item_id !== item.item_id);
      } else {
        // Aggiungi se non si è raggiunto il limite
        if (currentSelected.length < choice.count) {
          choice.selectedItems = [...currentSelected, item];
        } else {
          toast.warning(`Puoi selezionare al massimo ${choice.count} oggetto/i per "${choice.description}"`);
          return;
        }
      }
    }
    
    setChoices(newChoices);
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
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-700 mx-auto mb-4" />
        <p className="text-amber-700">Caricamento equipaggiamento...</p>
      </div>
    );
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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-amber-900 mb-2">
          ⚔️ Equipaggiamento Iniziale
        </h2>
        <p className="text-amber-700 text-sm">
          Scegli l&apos;equipaggiamento con cui iniziare l&apos;avventura
        </p>
      </div>

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
                <span className="text-amber-900">{item.name}</span>
                {item.quantity > 1 && (
                  <span className="text-sm text-amber-600">x{item.quantity}</span>
                )}
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
                        <div className="flex items-center gap-2">
                          {item.name.includes('Spada') && <Sword className="w-4 h-4 text-amber-700" />}
                          {item.name.includes('Armatura') && <Shield className="w-4 h-4 text-amber-700" />}
                          <span className={cn(
                            "font-medium",
                            isSelected ? "text-amber-900" : "text-amber-800"
                          )}>
                            {item.name}
                          </span>
                        </div>
                        {item.quantity > 1 && (
                          <span className="text-xs text-amber-600">x{item.quantity}</span>
                        )}
                      </div>
                      {isSelected && (
                        <div className="bg-green-500 rounded-full p-0.5">
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

      {/* Pulsanti navigazione */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-amber-700 text-amber-700"
        >
          ← Indietro
        </Button>
        
        <Button
          onClick={handleConfirm}
          disabled={!allChoicesComplete || isConfirming}
          className="bg-amber-700 hover:bg-amber-800 text-amber-50 disabled:opacity-50"
        >
          {isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvataggio...
            </>
          ) : (
            'Conferma Equipaggiamento →'
          )}
        </Button>
      </div>
    </div>
  );
}