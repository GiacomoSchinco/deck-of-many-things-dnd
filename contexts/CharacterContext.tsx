"use client";

import { createContext, useContext } from "react";
import type { Character } from "@/types/character";

interface CharacterContextValue {
  character: Character | null;
  setCharacter: (character: Character | null) => void;
}

export const CharacterContext = createContext<CharacterContextValue>({
  character: null,
  setCharacter: () => {},
});

export function useCharacterContext() {
  return useContext(CharacterContext);
}
