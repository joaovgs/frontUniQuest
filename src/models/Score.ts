export interface Score {
  game_id: number;
  game_name: string;
  score: number;  
}

export interface Ranking {
  team_id: number;
  team_name: string;
  scores: Score[];
  total_score: number;
}
