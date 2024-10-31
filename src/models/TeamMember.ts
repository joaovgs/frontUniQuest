export interface TeamMember {
  id: number;
  user_id: number;
  team_id: number;
  user_name: string;
  team_name: string;
  password?: string;
}

export type TeamMemberPayload = Omit<
  TeamMember,
  'id' | 'user_id' | 'user_name' | 'team_name'
>;

