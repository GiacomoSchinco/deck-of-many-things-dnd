// components/character/sheet/CombatStatsCard.tsx
'use client';

import { useCombatStats } from '@/hooks/queries/useCombatStats';
import { useUpdateCombatStats } from '@/hooks/mutations/useCombatStatsMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function CombatStatsCard({ characterId }: { characterId: string }) {
  const { data: stats, isLoading } = useCombatStats(characterId);
  const updateStats = useUpdateCombatStats(characterId);
  const [hp, setHp] = useState(stats?.current_hp);

  const handleDamage = (amount: number) => {
    const newHp = Math.max(0, stats.current_hp - amount);
    updateStats.mutate({ 
      ...stats, 
      current_hp: newHp,
      temp_hp: stats.temp_hp 
    });
  };

  const handleHeal = (amount: number) => {
    const newHp = Math.min(stats.max_hp, stats.current_hp + amount);
    updateStats.mutate({ ...stats, current_hp: newHp });
  };

  if (isLoading) return <div>Caricamento...</div>;

  return (
    <div>
      <div>HP: {stats.current_hp}/{stats.max_hp}</div>
      <div>CA: {stats.armor_class}</div>
      <div>Velocità: {stats.speed}</div>
      
      <Button onClick={() => handleDamage(5)}>Subisci 5 danni</Button>
      <Button onClick={() => handleHeal(5)}>Cura 5 PF</Button>
    </div>
  );
}