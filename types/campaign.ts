export interface Campaign {
  id: string;
  name: string;
  description: string;
  dungeon_master: string;
  characters: { count: number };
}
