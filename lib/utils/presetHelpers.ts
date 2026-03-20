import type {
  EquipmentItemForm,
  EquipmentChoiceForm,
  EquipmentItemInput,
  EquipmentChoiceInput,
} from '@/types/preset-form'

export function createLocalKey(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function createEmptyItem(): EquipmentItemForm {
  return {
    localKey: createLocalKey('item'),
    item_id: 0,
    quantity: 1,
  }
}

export function createEmptyChoice(): EquipmentChoiceForm {
  return {
    localKey: createLocalKey('choice'),
    description: '',
    items: [],
    count: 1,
  }
}

export function normalizeItem(item: EquipmentItemInput): EquipmentItemForm {
  return {
    localKey: item.localKey ?? createLocalKey('item'),
    item_id: item.item_id ?? 0,
    quantity: item.quantity ?? 1,
    name: item.name,
  }
}

export function normalizeChoice(choice: EquipmentChoiceInput): EquipmentChoiceForm {
  return {
    localKey: choice.localKey ?? createLocalKey('choice'),
    description: choice.description ?? '',
    items: (choice.items ?? []).map(normalizeItem),
    count: choice.count ?? 1,
  }
}
