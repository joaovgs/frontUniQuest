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
  system_date_deleted?: Date | null;
}

export type GamePayload = Omit<Game, 'id' | 'created_at' | 'system_deleted' | 'system_date_deleted'>;

export interface GameDetails {
  id: number;
  local: string;
  date_game: string;
  competition_id: number;
  game_id: number;
  game_name: string;
  game_category: number;
}