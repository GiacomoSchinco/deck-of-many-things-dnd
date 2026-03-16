// hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    
    const updateMatches = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    media.addEventListener('change', updateMatches);
    
    return () => {
      media.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return matches;
}