export interface Game {
  id: number;
  name: string;
  min_participant: number;
  max_participant: number;
  first_score: number;
  second_score: number;
  third_score: number;
  general_score: number;
  category: number;
  created_at: string;
  system_deleted?: boolean | null;
  system_date_deleted?: string | null;
}

export type GamePayload = Omit<Game, 'id' | 'created_at' | 'system_deleted' | 'system_date_deleted'>;
