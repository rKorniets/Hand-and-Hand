export type UserRole = 'VOLUNTEER' | 'APP_USER' | 'ORGANIZATION';
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
  link?: string;
  type: 'GENERAL' | 'PROJECT' | 'TASK' | 'TICKET' | 'REWARD' | 'WARNING' | 'ORGANIZATION_INVITE';
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
  organization?: {
    id: number;
    name: string;
  };
  volunteer_profile?: {
    id: number;
    display_name: string;
    bio: string;
    skills_text: string | null;
    rating: number | null;
    is_verified: boolean;
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
  type?: string;
  condition_count?: number;
}

export interface FundraisingCampaign {
  id: number;
  title: string;
  description: string;
  image_url?: string | null;
  volunteer_profile?: {
    id: number;
    user_id: number;
    display_name: string;
    first_name?: string;
    last_name?: string;
    app_user?: {
      id: number;
      first_name: string;
      last_name: string;
    };
  } | null;
  organization_profile?: {
    id: number;
    name: string;
  } | null;
}

export interface ITicket {
  id: number;
  title: string;
  description: string;
  status: string;
  city?: string;
  created_at: string;
}

export interface UpcomingRegistration {
  id: number;
  status: 'PENDING' | 'ACCEPTED';
  created_at: string;
  project: {
    id: number;
    title: string;
    image_url: string | null;
    starts_at: string | null;
    ends_at: string | null;
    location: { city: string; address: string } | null;
    category: { id: number; name: string } | null;
    organization_profile: { id: number; name: string; logo_url: string | null };
  };
}

export interface PastRegistration {
  id: number;
  status: 'ACCEPTED';
  created_at: string;
  project: {
    id: number;
    title: string;
    image_url: string | null;
    starts_at: string | null;
    ends_at: string | null;
    location: { city: string; address: string } | null;
    category: { id: number; name: string } | null;
    organization_profile: { id: number; name: string; logo_url: string | null };
  };
}
