// types/equipment.ts

export interface EquipmentItem {
  item_id: number;
  quantity: number;
  name?: string;        // Opzionale, per visualizzazione
}

export interface EquipmentChoice {
  description: string;           // "Scegli la tua arma principale"
  items: EquipmentItem[];         // Opzioni disponibili
  count: number;                  // Quante scegliere (default 1)
  min?: number;                   // Minimo selezionabile
  max?: number;                   // Massimo selezionabile
}

export interface EquipmentPreset {
  id: number;
  name: string;                    // "Equipaggiamento Guerriero"
  class_id: number;                 // ID della classe
  class_name?: string;              // Popolato dalla relazione
  description: string | null;
  items: EquipmentItem[];           // Oggetti fissi (tutti li prendono)
  choices: EquipmentChoice[];       // Scelte opzionali
  is_default: boolean;              // Preset predefinito per la classe
  created_at?: string;
  updated_at?: string;
}

// DTO per creare un nuovo preset
export interface CreateEquipmentPresetDTO {
  name: string;
  class_id: number;
  description?: string | null;
  items: EquipmentItem[];
  choices?: EquipmentChoice[];
  is_default?: boolean;
}

// DTO per aggiornare un preset
export interface UpdateEquipmentPresetDTO extends Partial<CreateEquipmentPresetDTO> {
  id: number;
}

// Risposta API
export interface EquipmentPresetsResponse {
  presets: EquipmentPreset[];
  total: number;
}