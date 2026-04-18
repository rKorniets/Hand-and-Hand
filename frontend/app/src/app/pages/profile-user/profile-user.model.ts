export type UserRole = 'VOLUNTEER' | 'APP_USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'PENDING';

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export interface AppUser {
  id: number;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: Date;
  points: number;
  first_name: string;
  last_name: string;
  city?: string;
  avatar_url?: string;
  joined_organization?: {
    id: number;
    name: string;
  };
}

export interface Reward {
  id: number;
  title: string;
  description: string;
  cost_points: number;
  stock: number;
  is_active: boolean;
  created_at: Date;
}

export interface ActivityItem {
  id: number;
  title: string;
  starts_at: string | Date;
  description: string;
}

export interface FundraisingCampaign {
  id: number;
  title: string;
  description: string;
  volunteer_profile: {
    first_name: string;
    last_name: string;
  };
}

export interface ITicket {
  id: number;
  title: string;
  description: string;
  status: string;
  city?: string;
  created_at: string;
}
