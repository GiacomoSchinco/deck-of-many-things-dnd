// components/character/creation-wizard/steps/BasicInfoStep.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreationData } from '../hooks/useCharacterCreation';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import { WizardStep } from '../WizardStep';

// Lista allineamenti D&D
const ALIGNMENTS = [
  'Legale Buono',
  'Neutrale Buono',
  'Caotico Buono',
  'Legale Neutrale',
  'Neutrale',
  'Caotico Neutrale',
  'Legale Malvagio',
  'Neutrale Malvagio',
  'Caotico Malvagio',
];

interface BasicInfoStepProps {
  initialData?: Partial<CreationData>;
  onNext: (data: Partial<CreationData>) => void;
}

export function BasicInfoStep({ initialData, onNext }: BasicInfoStepProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    playerName: initialData?.playerName || '',
    alignment: initialData?.alignment || 'Neutrale',
    background: initialData?.background || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Il nome del personaggio è obbligatorio';
    }

    if (!formData.background) {
      newErrors.background = 'Seleziona un background';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext(formData);
  };

  return (
    <WizardStep
      title="🎴 Info Personaggio"
      subtitle="Completa i dati base del tuo eroe"
      asForm
      onFormSubmit={handleSubmit}
      nextLabel="Avanti: Scegli Razza →"
    >
      <div className="space-y-4">
        {/* Nome Personaggio */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-amber-900">
            Nome del Personaggio <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            maxLength={100}
            placeholder="Es. Gimli Figlio di Glóin"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Nome Giocatore */}
        <div className="space-y-2">
          <Label htmlFor="playerName" className="text-amber-900">
            Nome del Giocatore
          </Label>
          <Input
            id="playerName"
            value={formData.playerName}
            onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
            maxLength={100}
            placeholder="Es. Mario Rossi"
          />
          <p className="text-xs text-amber-600">
            Lascia vuoto per usare il nome del tuo account
          </p>
        </div>

        {/* Allineamento */}
        <div className="space-y-2">
          <Label htmlFor="alignment" className="text-amber-900">
            Allineamento
          </Label>
          <Select
            value={formData.alignment}
            onValueChange={(value) => setFormData({ ...formData, alignment: value ?? 'Neutrale' })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleziona allineamento" />
            </SelectTrigger>
            <SelectContent>
              {ALIGNMENTS.map((alignment) => (
                <SelectItem key={alignment} value={alignment}>
                  {alignment}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Background */}
        <div className="space-y-2">
          <Label htmlFor="background" className="text-amber-900">
            Background <span className="text-red-500">*</span>
          </Label>
          <Input
            id="background"
            value={formData.background}
            onChange={(e) => setFormData({ ...formData, background: e.target.value })}
            maxLength={100}
            placeholder="Es. Gimli Figlio di Glóin"
            className={errors.background ? 'border-red-500' : ''}
          />
          {errors.background && (
            <p className="text-sm text-red-500">{errors.background}</p>
          )}
        </div>

        {/* Anteprima */}
        {formData.name && (
          <AncientCardContainer className="mt-6 p-4 text-center">
            <p className="text-sm text-amber-700 mb-2">Anteprima</p>
            <p className="text-lg font-serif text-amber-900">
              {formData.name}
            </p>
            <p className="text-xs text-amber-600">
              {formData.background} · {formData.alignment}
            </p>
            {formData.playerName && (
              <p className="text-xs text-amber-600">
                Giocato da: {formData.playerName}
              </p>
            )}
          </AncientCardContainer>
        )}


      </div>

      {/* Note decorative */}
      <p className="text-xs text-center text-amber-500 mt-4">
        * Nome e Background sono obbligatori
      </p>
    </WizardStep>
  );
}