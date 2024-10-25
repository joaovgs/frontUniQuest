export interface DirectConfrontationMatch {
  id: number;
  competition_id: number;
  game_id: number;
  game_name: string;
  round: number;
  match: number;
  team1_id?: number | null;
  team1_name?: string | null;
  team2_id?: number | null;
  team2_name?: string | null;
  winner_team_id?: number | null;
  winner_team_name?: string | null;
}

export type DirectConfrontationMatchPayload = {
  competition_id: number;
  game_id: number;
  teams: number[];
};
