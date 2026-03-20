'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash } from 'lucide-react'
import ItemRow from '@/components/custom/ItemRow'
import type { EquipmentItemForm, EquipmentChoiceForm } from '@/types/preset-form'

interface Props {
  choice: EquipmentChoiceForm
  onChangeChoice: (field: keyof EquipmentChoiceForm, value: string | number | EquipmentItemForm[]) => void
  onAddItem: () => void
  onUpdateItem: (itemIndex: number, field: keyof EquipmentItemForm, value: number | string) => void
  onRemoveItem: (itemIndex: number) => void
  onRemoveChoice: () => void
}

export default function ChoiceGroup({
  choice,
  onChangeChoice,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onRemoveChoice,
}: Props) {
  return (
    <div className="border-2 border-amber-200 p-4 rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-amber-800">Gruppo scelta</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onRemoveChoice} className="text-red-500">
          <Trash className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Descrizione</Label>
          <Input
            value={choice.description}
            onChange={(e) => onChangeChoice('description', e.target.value)}
            placeholder="Es. Scegli la tua arma principale"
          />
        </div>
        <div>
          <Label>Quante scegliere</Label>
          <Input
            type="number"
            min={1}
            value={choice.count}
            onChange={(e) => onChangeChoice('count', parseInt(e.target.value) || 1)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Opzioni</Label>
          <Button type="button" size="sm" variant="outline" onClick={onAddItem}>
            <Plus className="w-3 h-3 mr-1" />
            Aggiungi opzione
          </Button>
        </div>

        {choice.items.map((cItem, iIndex) => (
          <ItemRow
            key={cItem.localKey}
            value={cItem.item_id}
            name={cItem.name}
            quantity={cItem.quantity}
            onSelect={(selected) => onUpdateItem(iIndex, 'item_id', selected.id)}
            onQuantityChange={(q) => onUpdateItem(iIndex, 'quantity', q)}
            onRemove={() => onRemoveItem(iIndex)}
            placeholder="Seleziona oggetto"
            showDetails={true}
            buttonVariant="compact"
          />
        ))}
      </div>
    </div>
  )
}
