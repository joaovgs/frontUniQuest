export interface Team {
  id: number;
  competition_id: number;
  name: string;
  status?: number | null;
  password?: string;
  is_private: number;
  leader_user_id: number;
  created_at: string;
  system_deleted?: boolean | null;
  system_date_deleted?: Date | null;
  members_count?: number;
  min_participant?: number;
  max_participant?: number;
  message?: string;
}

export type TeamPayload = Omit<
  Team,
  'id' | 'leader_user_id' | 'members_count' | 'max_participant' | 'created_at' | 'system_deleted' | 'system_date_deleted' | 'message'
>;

export type TeamStatusPayload = {
  status: number;
  message?: string;
};


