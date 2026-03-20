'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCreateEquipmentPreset, useUpdateEquipmentPreset } from '@/hooks/mutations/useEquipmentPresetMutations'
import { useClasses } from '@/hooks/queries/useClasses'
import { useItems } from '@/hooks/queries/useItems'
import type { EquipmentPreset, CreateEquipmentPresetDTO } from '@/types/equipment'
import type { PresetFormState, EquipmentItemForm, EquipmentChoiceForm } from '@/types/preset-form'
import {
  createEmptyItem,
  createEmptyChoice,
  normalizeItem,
  normalizeChoice,
} from '@/lib/utils/presetHelpers'

function buildInitialState(initialData?: EquipmentPreset): PresetFormState {
  if (initialData) {
    return {
      id: initialData.id,
      name: initialData.name,
      class_id: String(initialData.class_id),
      description: initialData.description ?? '',
      items: (initialData.items ?? []).map(normalizeItem),
      choices: (initialData.choices ?? []).map(normalizeChoice),
      is_default: initialData.is_default,
    }
  }
  if (typeof window !== 'undefined') {
    const duplicate = sessionStorage.getItem('duplicate-preset')
    if (duplicate) {
      sessionStorage.removeItem('duplicate-preset')
      const parsed = JSON.parse(duplicate) as Partial<PresetFormState>
      return {
        id: parsed.id,
        name: parsed.name ?? '',
        class_id: parsed.class_id ? String(parsed.class_id) : '',
        description: parsed.description ?? '',
        items: (parsed.items ?? []).map(normalizeItem),
        choices: (parsed.choices ?? []).map(normalizeChoice),
        is_default: parsed.is_default ?? false,
      }
    }
  }
  return { name: '', class_id: '', description: '', items: [], choices: [], is_default: false }
}

export function usePresetForm(initialData?: EquipmentPreset) {
  const router = useRouter()
  const { data: classes } = useClasses()
  const { data: items } = useItems()
  const createPreset = useCreateEquipmentPreset()
  const updatePreset = useUpdateEquipmentPreset()

  const [preset, setPreset] = useState<PresetFormState>(() => buildInitialState(initialData))

  const selectedClass = classes?.find((c) => String(c.id) === preset.class_id)

  // ---------- Fixed items ----------
  const addItem = () =>
    setPreset((p) => ({ ...p, items: [...p.items, createEmptyItem()] }))

  const updateItem = (index: number, field: keyof EquipmentItemForm, value: number | string) => {
    setPreset((p) => {
      const newItems = [...p.items]
      newItems[index] = { ...newItems[index], [field]: value }
      if (field === 'item_id') {
        newItems[index].name = items?.find((i) => i.id === value)?.name
      }
      return { ...p, items: newItems }
    })
  }

  const removeItem = (index: number) =>
    setPreset((p) => ({ ...p, items: p.items.filter((_, i) => i !== index) }))

  // ---------- Choices ----------
  const addChoice = () =>
    setPreset((p) => ({ ...p, choices: [...p.choices, createEmptyChoice()] }))

  const updateChoice = (
    index: number,
    field: keyof EquipmentChoiceForm,
    value: number | string | EquipmentItemForm[]
  ) =>
    setPreset((p) => {
      const newChoices = [...p.choices]
      newChoices[index] = { ...newChoices[index], [field]: value }
      return { ...p, choices: newChoices }
    })

  const removeChoice = (index: number) =>
    setPreset((p) => ({ ...p, choices: p.choices.filter((_, i) => i !== index) }))

  const addChoiceItem = (choiceIndex: number) =>
    setPreset((p) => {
      const newChoices = [...p.choices]
      newChoices[choiceIndex] = {
        ...newChoices[choiceIndex],
        items: [...newChoices[choiceIndex].items, createEmptyItem()],
      }
      return { ...p, choices: newChoices }
    })

  const updateChoiceItem = (
    choiceIndex: number,
    itemIndex: number,
    field: keyof EquipmentItemForm,
    value: number | string
  ) =>
    setPreset((p) => {
      const newChoices = [...p.choices]
      const newItems = [...newChoices[choiceIndex].items]
      newItems[itemIndex] = { ...newItems[itemIndex], [field]: value }
      if (field === 'item_id') {
        newItems[itemIndex].name = items?.find((i) => i.id === value)?.name
      }
      newChoices[choiceIndex] = { ...newChoices[choiceIndex], items: newItems }
      return { ...p, choices: newChoices }
    })

  const removeChoiceItem = (choiceIndex: number, itemIndex: number) =>
    setPreset((p) => {
      const newChoices = [...p.choices]
      newChoices[choiceIndex] = {
        ...newChoices[choiceIndex],
        items: newChoices[choiceIndex].items.filter((_, i) => i !== itemIndex),
      }
      return { ...p, choices: newChoices }
    })

  // ---------- Submit ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!preset.name || !preset.class_id) {
      toast.error('Nome e classe sono obbligatori')
      return
    }
    try {
      const payload: CreateEquipmentPresetDTO = {
        name: preset.name,
        class_id: parseInt(preset.class_id, 10),
        description: preset.description || null,
        items: preset.items.map(({ item_id, quantity, name }) => ({ item_id, quantity, name })),
        choices: preset.choices.map(({ description, count, items }) => ({
          description,
          count,
          items: items.map(({ item_id, quantity, name }) => ({ item_id, quantity, name })),
        })),
        is_default: preset.is_default,
      }
      if (preset.id) {
        await updatePreset.mutateAsync({ id: preset.id, ...payload })
        toast.success('Preset aggiornato con successo')
      } else {
        await createPreset.mutateAsync(payload)
        toast.success('Preset creato con successo')
      }
      router.push('/admin/equipment-presets')
    } catch {
      toast.error('Errore durante il salvataggio')
    }
  }

  return {
    preset,
    setPreset,
    classes,
    selectedClass,
    // fixed items
    addItem,
    updateItem,
    removeItem,
    // choices
    addChoice,
    updateChoice,
    removeChoice,
    addChoiceItem,
    updateChoiceItem,
    removeChoiceItem,
    // form
    handleSubmit,
  }
}
