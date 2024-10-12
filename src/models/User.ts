export interface User {
  id: number;
  name: string;
  email: string;
  role: number;
  created_at: string;
  system_deleted?: boolean | null;
  system_date_deleted?: string | null;
}

export type UserPayload = Omit<User, 'id' | 'created_at' | 'system_deleted' | 'system_date_deleted'>;
