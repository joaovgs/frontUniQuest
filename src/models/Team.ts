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
  max_participant?: number;
}

export type TeamPayload = Omit<
  Team,
  'id' | 'members_count' | 'max_participant' | 'created_at' | 'system_deleted' | 'system_date_deleted'
>;

