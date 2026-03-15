// store/useCharacterStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Tipo minimale per iniziare
export interface Character {
  id: string
  name: string
  raceId: number
  classId: number
  level: number
  abilityScores: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  createdAt: string
}

interface CharacterState {
  characters: Character[]
  currentCharacter: Character | null
  loading: boolean
  
  // Azioni
  addCharacter: (character: Character) => void
  setCurrentCharacter: (character: Character | null) => void
  updateCharacter: (id: string, updates: Partial<Character>) => void
  deleteCharacter: (id: string) => void
  clearCharacters: () => void
  setLoading: (loading: boolean) => void
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
      characters: [],
      currentCharacter: null,
      loading: false,

      addCharacter: (character) =>
        set((state) => ({
          characters: [...state.characters, character]
        })),

      setCurrentCharacter: (character) =>
        set({ currentCharacter: character }),

      updateCharacter: (id, updates) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
          currentCharacter: state.currentCharacter?.id === id
            ? { ...state.currentCharacter, ...updates }
            : state.currentCharacter
        })),

      deleteCharacter: (id) =>
        set((state) => ({
          characters: state.characters.filter((c) => c.id !== id),
          currentCharacter: state.currentCharacter?.id === id
            ? null
            : state.currentCharacter
        })),

      clearCharacters: () =>
        set(() => ({
          characters: [],
          currentCharacter: null,
        })),

      setLoading: (loading) => set({ loading })
    }),
    {
      name: 'dnd-characters-storage', // nome nel localStorage
    }
  )
)