export type UserRole = 'VOLUNTEER' | 'APP_USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'PENDING';

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export interface UserNotification {
  id: number;
  message: string;
  is_read: boolean;
  type: 'GENERAL' | 'PROJECT' | 'TASK' | 'TICKET' | 'REWARD' | 'WARNING';
  created_at: string;
}
export interface AppUser {
  id: number;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  points: number;
  first_name: string;
  last_name: string;
  city?: string;
  avatar_url?: string | null;
  joined_organization?: {
    id: number;
    name: string;
  };
  notifications?: UserNotification[];
}

export interface Reward {
  id: number;
  title: string;
  description: string;
  cost_points: number;
  stock: number;
  is_active: boolean;
  created_at: string;
}

export interface ActivityItem {
  id: number;
  title: string;
  starts_at: string;
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
