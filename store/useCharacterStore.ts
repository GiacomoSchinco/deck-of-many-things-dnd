// store/useCharacterStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character } from '@/types/character';

interface CharacterState {
  currentCharacter: Character | null;
  characters: Character[];
  loading: boolean;
  
  setCurrentCharacter: (character: Character | null) => void;
  setCharacters: (characters: Character[]) => void;
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
      currentCharacter: null,
      characters: [],
      loading: false,
      
      setCurrentCharacter: (character) => 
        set({ currentCharacter: character }),
      
      setCharacters: (characters) => 
        set({ characters }),
      
      addCharacter: (character) =>
        set((state) => ({ 
          characters: [...state.characters, character] 
        })),
      
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
      
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'character-storage',
      partialize: (state) => ({ 
        characters: state.characters,
        currentCharacter: state.currentCharacter 
      }),
    }
  )
);