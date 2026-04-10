'use client'

import React from 'react'
import { ItemPicker } from '@/components/custom/ItemPicker'
import type { Item } from '@/types/item'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ItemRowProps {
  value: number
  name?: string
  quantity: number
  onSelect: (item: Pick<Item, 'id' | 'name'>) => void
  onQuantityChange: (q: number) => void
  onRemove: () => void
  placeholder?: string
  showDetails?: boolean
  buttonVariant?: 'default' | 'compact' | 'minimal'
  className?: string
}

export default function ItemRow({
  value,
  name,
  quantity,
  onSelect,
  onQuantityChange,
  onRemove,
  placeholder = 'Seleziona oggetto',
  showDetails = true,
  buttonVariant = 'compact',
  className = ''
}: ItemRowProps) {
  return (
    <div className={cn('flex gap-2 items-end bg-amber-50 p-3 rounded', className)}>
      <ItemPicker
        value={value}
        name={name}
        onSelect={onSelect}
        type="all"
        placeholder={placeholder}
        showDetails={showDetails}
        buttonVariant={buttonVariant}
        className="flex-1"
      />

      <div className="w-24">
        <Label className="text-xs">Quantità</Label>
        <Input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="text-red-500"
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  )
}
