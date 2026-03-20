// Tipi form-specifici per equipment preset (includono localKey per React list keys)

export interface EquipmentItemForm {
  localKey: string
  item_id: number
  quantity: number
  name?: string
}

export interface EquipmentChoiceForm {
  localKey: string
  description: string
  items: EquipmentItemForm[]
  count: number
}

export interface PresetFormState {
  id?: number
  name: string
  class_id: string
  description: string
  items: EquipmentItemForm[]
  choices: EquipmentChoiceForm[]
  is_default: boolean
}

// Tipi input per la normalizzazione (da EquipmentPreset → PresetFormState)
export interface EquipmentItemInput {
  localKey?: string
  item_id?: number
  quantity?: number
  name?: string
}

export interface EquipmentChoiceInput {
  localKey?: string
  description?: string
  items?: EquipmentItemInput[]
  count?: number
}
