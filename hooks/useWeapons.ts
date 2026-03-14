import { useQuery } from "@tanstack/react-query";

export interface WeaponProperty {
  property: {
    name: string;
    type: string | null;
    url: string;
    desc: string;
  };
  detail: string | null;
}

export interface DamageType {
  name: string;
  key: string;
  url: string;
}

export interface Open5eWeapon {
  name: string;
  damage_dice?: string;
  damage_type?: DamageType;
  properties?: WeaponProperty[];
  range?: number;
  long_range?: number;
  is_simple: boolean;
  is_improvised: boolean;
  distance_unit?: string;
}

export interface WeaponsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Open5eWeapon[];
}

async function fetchWeapons(): Promise<WeaponsResponse> {
  const res = await fetch("/api/weapons");
  if (!res.ok) throw new Error("Errore caricamento armi");
  return res.json();
}

export function useWeapons() {
  return useQuery({
    queryKey: ["weapons"],
    queryFn: fetchWeapons,
    staleTime: 1000 * 60 * 5,
  });
}
