// store/useCreationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CreationData, CreationStep } from '@/types/creation';

interface CreationState {
  currentStep: CreationStep;
  data: Partial<CreationData>;
  _hasHydrated: boolean;

  setStep: (step: CreationStep) => void;
  updateData: (newData: Partial<CreationData>) => void;
  reset: () => void;
  setHasHydrated: (val: boolean) => void;
}

const initialData: Partial<CreationData> = {
  name: '',
  playerName: '',
  alignment: 'Neutrale',
  background: '',
  raceId: null,
  classId: null,
  campaignId: null,
  abilityScores: null,
  skills: [],
  equipment: [],
};

export const useCreationStore = create<CreationState>()(
  persist(
    (set) => ({
      currentStep: 'basic-info',
      data: initialData,
      _hasHydrated: false,

      setStep: (step) => set({ currentStep: step }),

      updateData: (newData) =>
        set((state) => ({ data: { ...state.data, ...newData } })),

      reset: () => set({ currentStep: 'basic-info', data: initialData }),

      setHasHydrated: (val) => set({ _hasHydrated: val }),
    }),
    {
      name: 'dnd-character-creation-draft',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
