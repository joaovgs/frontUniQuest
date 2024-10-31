interface AllAgainstAllPlacement {
  id: number;
  match_id: number;
  team_id: number;
  position: number;
  score: number;
  team_name: string;
}

export interface AllAgainstAllMatch {
  id: number;
  competition_id: number;
  game_id: number;
  game_name: string;
  round: number;
  AllAgainstAllPlacement: AllAgainstAllPlacement[];
}

export type AllAgainstAllMatchPayload = {
  competition_id: number;
  game_id: number;
  number_of_rounds: number;
  teams: number[];
};

export type PlacementsPayload = {
  team_id: number;
  position: number;
}
