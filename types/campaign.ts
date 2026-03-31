export interface Campaign {
  id: string;
  name: string;
  description: string;
  dungeon_master: string;
  dungeon_master_id?: string;
  characters: { count: number }[];
  created_at?: string;
  created_by?: string;
  [key: string]: unknown;
}
