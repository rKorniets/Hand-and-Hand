export type UserRole = 'VOLUNTEER' | 'ORGANIZATION' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'PENDING' | 'APP_USER';

export interface AppUser {
  id: number;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  created_at: Date;
  points: number;
  first_name: string;
  last_name: string;
  city?: string;
}

export interface Reward {
  id: number;
  title: string;
  description: string;
  threshold_points: number;
  is_active: boolean;
  created_at: Date;
}

export interface ActivityItem {
  id: number;
  title: string;
  starts_at: string | Date;
  description: string;
  location: string;
}
