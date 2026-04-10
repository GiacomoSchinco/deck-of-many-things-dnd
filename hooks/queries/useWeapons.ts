import { useQuery } from "@tanstack/react-query";
import type { WeaponProperty, DamageType, Open5eWeapon, WeaponsResponse } from '@/types/weapon';

export type { WeaponProperty, DamageType, Open5eWeapon, WeaponsResponse };

async function fetchWeapons(): Promise<WeaponsResponse> {
  const res = await fetch("/api/weapons");
  if (!res.ok) throw new Error("Errore caricamento armi");
  return res.json();
}

export function useWeapons() {
  return useQuery({
    queryKey: ['weapons'],
    queryFn: fetchWeapons,
    staleTime: 1000 * 60 * 5,
  });
}
