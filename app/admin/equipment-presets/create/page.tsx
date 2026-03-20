'use client'

import { useRouter } from 'next/navigation'
import type { EquipmentPreset } from '@/types/equipment'
import { usePresetForm } from '@/hooks/usePresetForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Save } from 'lucide-react'
import { getItalianClass } from '@/lib/utils/nameMappers'
import ItemRow from '@/components/custom/ItemRow'
import ChoiceGroup from '@/components/custom/ChoiceGroup'

interface Props {
  initialData?: EquipmentPreset
}

export default function CreateEquipmentPresetPage({ initialData }: Props) {
  const router = useRouter()
  const {
    preset,
    setPreset,
    classes,
    selectedClass,
    addItem,
    updateItem,
    removeItem,
    addChoice,
    updateChoice,
    removeChoice,
    addChoiceItem,
    updateChoiceItem,
    removeChoiceItem,
    handleSubmit,
  } = usePresetForm(initialData)

  return (
    <div className="container mx-auto p-6">
      <div className="p-6">
        <h1 className="text-2xl font-serif font-bold text-amber-900 mb-6">
          {preset.id ? '✏️ Modifica Preset' : '✨ Nuovo Preset'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Base info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nome del preset *</Label>
              <Input
                value={preset.name}
                onChange={(e) => setPreset((p) => ({ ...p, name: e.target.value }))}
                placeholder="Es. Equipaggiamento Guerriero"
                required
              />
            </div>

            <div>
              <Label>Classe *</Label>
              <Select
                value={preset.class_id}
                onValueChange={(value: string | null) =>
                  setPreset((p) => ({ ...p, class_id: value ?? '' }))
                }
              >
                <SelectTrigger>
                  <SelectValue>
                    {selectedClass ? getItalianClass(selectedClass.name) : 'Seleziona classe'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {classes?.map((cls) => (
                    <SelectItem key={cls.id} value={String(cls.id)}>
                      {getItalianClass(cls.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Descrizione (opzionale)</Label>
            <Input
              value={preset.description}
              onChange={(e) => setPreset((p) => ({ ...p, description: e.target.value }))}
              placeholder="Breve descrizione del preset"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={preset.is_default}
              onCheckedChange={(checked) => setPreset((p) => ({ ...p, is_default: checked as boolean }))}
            />
            <Label htmlFor="is_default" className="cursor-pointer">
              Imposta come preset predefinito per questa classe
            </Label>
          </div>

          {/* ---- Fixed items (Oggetti fissi) ---- */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-serif font-bold text-amber-900">
                Oggetti fissi (tutti li prendono)
              </h2>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi oggetto
              </Button>
            </div>

            {preset.items.map((item, index) => (
              <ItemRow
                key={item.localKey}
                value={item.item_id}
                name={item.name}
                quantity={item.quantity}
                onSelect={(selected) => {
                  updateItem(index, 'item_id', selected.id)
                  updateItem(index, 'name', selected.name)
                }}
                onQuantityChange={(q) => updateItem(index, 'quantity', q)}
                onRemove={() => removeItem(index)}
                placeholder="Seleziona oggetto"
                showDetails={true}
                buttonVariant="compact"
              />
            ))}
          </div>

          {/* ---- Choices (Scelte) ---- */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-serif font-bold text-amber-900">
                Scelte (l&apos;utente può selezionare)
              </h2>
              <Button type="button" onClick={addChoice} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi gruppo di scelta
              </Button>
            </div>

            {preset.choices.map((choice, cIndex) => (
              <ChoiceGroup
                key={choice.localKey}
                choice={choice}
                onChangeChoice={(field, value) => updateChoice(cIndex, field, value)}
                onAddItem={() => addChoiceItem(cIndex)}
                onUpdateItem={(itemIndex, field, value) => updateChoiceItem(cIndex, itemIndex, field, value)}
                onRemoveItem={(itemIndex) => removeChoiceItem(cIndex, itemIndex)}
                onRemoveChoice={() => removeChoice(cIndex)}
              />
            ))}
          </div>

          {/* ---- Form actions ---- */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/equipment-presets')}
            >
              Annulla
            </Button>
            <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
              <Save className="w-4 h-4 mr-2" />
              Salva Preset
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}