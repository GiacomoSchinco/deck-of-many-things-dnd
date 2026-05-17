// store/useLevelUpStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type LevelUpData = {
  hpGain: number;
  hpMethod: string;
  rolledValue: number | null;
  asiType?: 'increase' | 'feat';
  increaseType?: 'single' | 'double';
  selectedStat?: string;
  secondStat?: string;
  changes?: Record<string, number>;
  newSpells: string[];
  swapFrom?: string;
  swapTo?: string;
};

interface LevelUpState {
  characterId: string | null;
  step: number;
  data: LevelUpData;
  hasHydrated: boolean;

  setCharacterId: (id: string) => void;
  setStep: (step: number) => void;
  updateData: (newData: Partial<LevelUpData>) => void;
  reset: () => void;
  setHasHydrated: (val: boolean) => void;
}

const initialData: LevelUpData = {
  hpGain: 0,
  hpMethod: 'average',
  rolledValue: null,
  newSpells: [],
};

export const useLevelUpStore = create<LevelUpState>()(
  persist(
    immer((set) => ({
      characterId: null,
      step: 0,
      data: initialData,
      hasHydrated: false,

      setCharacterId: (id) => set((state) => { state.characterId = id; }),

      setStep: (step) => set((state) => { state.step = step; }),

      updateData: (newData) =>
        set((state) => { Object.assign(state.data, newData); }),

      reset: () => set((state) => {
        state.characterId = null;
        state.step = 0;
        state.data = initialData;
      }),

      setHasHydrated: (val) => set((state) => { state.hasHydrated = val; }),
    })),
    {
      name: 'dnd-level-up-draft',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
