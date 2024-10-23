export interface CompetitionGame {
  local: string;
  date_game?: Date;
  game_id: number;
  game_name?: string;
}

export interface Competition {
  id: number;
  title: string;
  date_event: Date;
  start_registration: Date;
  end_registration: Date;
  min_participant: number;
  max_participant: number;
  local: string;
  description?: string | null;  
  CompetitionGames?: CompetitionGame[];
  image?: string | null;
  image_name?: string | null;
  regulation?: string | null;
  regulation_name?: string | null;
  created_at: string;
  system_deleted?: boolean | null;
  system_date_deleted?: string | null;
}

export type CompetitionPayload = Omit<
  Competition,
  'id' | 'created_at' | 'system_deleted' | 'system_date_deleted'
>;

export type CompetitionWithoutRegulation = Omit<
  Competition,
  'regulation'
>;

export type CompetitionImages = Pick<
  Competition,
  'id' | 'image'
>;

export type Regulation = Pick<
  Competition,
  'regulation'
>;