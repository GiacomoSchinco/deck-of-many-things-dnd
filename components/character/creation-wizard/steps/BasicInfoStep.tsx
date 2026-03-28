// components/character/creation-wizard/steps/BasicInfoStep.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreationData } from '../hooks/useCharacterCreation';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import { Plus, Minus } from 'lucide-react';
import { WizardStep } from '../WizardStep';

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

const LEVELS = Array.from({ length: 20 }, (_, i) => i + 1);

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
    level: initialData?.level || 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Il nome del personaggio è obbligatorio';
    }

    if (!formData.background.trim()) {
      newErrors.background = 'Il background è obbligatorio';
    }

    const levelNum = Number(formData.level);
    if (isNaN(levelNum) || levelNum < 1 || levelNum > 20) {
      newErrors.level = 'Il livello deve essere compreso tra 1 e 20';
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
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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

        {/* Livello */}
        <div className="space-y-2">
          <Label htmlFor="level" className="text-amber-900">
            Livello
          </Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => setFormData({ ...formData, level: Math.max(1, Number(formData.level) - 1) })}
              aria-label="Decrementa livello"
              className="px-2 py-1"
            >
              <Minus className="w-4 h-4" />
            </Button>

            <div
              id="level"
              role="status"
              aria-live="polite"
              className={"px-3 py-2 border rounded text-center min-w-[64px] " + (errors.level ? 'border-red-500' : '')}
            >
              <span className="font-medium">{formData.level}</span>
            </div>

            <Button
              type="button"
              onClick={() => setFormData({ ...formData, level: Math.min(20, Number(formData.level) + 1) })}
              aria-label="Incrementa livello"
              className="px-2 py-1"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {errors.level && <p className="text-sm text-red-500">{errors.level}</p>}
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
            placeholder="Es. Nobile, Artigiano, Eremita"
            className={errors.background ? 'border-red-500' : ''}
          />
          {errors.background && <p className="text-sm text-red-500">{errors.background}</p>}
        </div>

        {/* Anteprima */}
        {formData.name && (
          <AncientCardContainer className="mt-6 p-4 text-center">
            <p className="text-sm text-amber-700 mb-2">Anteprima</p>
            <p className="text-lg font-serif text-amber-900">
              {formData.name}
            </p>
            <p className="text-xs text-amber-600">
              {formData.background} · {formData.alignment} · Livello {formData.level}
            </p>
            {formData.playerName && (
              <p className="text-xs text-amber-600">
                Giocato da: {formData.playerName}
              </p>
            )}
          </AncientCardContainer>
        )}
      </div>

      <p className="text-xs text-center text-amber-500 mt-4">
        * Nome e Background sono obbligatori
      </p>
    </WizardStep>
  );
}