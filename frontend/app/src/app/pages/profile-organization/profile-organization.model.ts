export type ReportType = 'фінансовий' | 'результати' | 'активності' | 'інше' | string;

export interface ActivityItem {
  id: number;
  title: string;
  starts_at: string | Date;
  description: string;
  location: string;
}

export interface FundraisingCampaign {
  id: number;
  title: string;
  description: string;
  organization_profile: {
    name: string;
  };
}

export interface OrgMember {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url?: string;
}

export enum ProjectRegistrationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface ProjectRegistration {
  id: number;
  project_id: number;
  user_id: number;
  status: ProjectRegistrationStatus;
  reviewed_at?: string | Date;
  created_at: string | Date;
  user?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export interface OrgNotification {
  id: number;
  message: string;
  is_read: boolean;
  type: 'GENERAL' | 'PROJECT' | 'TASK' | 'TICKET' | 'REWARD' | 'WARNING' | 'REGISTRATION';
  created_at: string;
  registration_data?: ProjectRegistration;
  organization_id: number;
  project_id?: number;
  user_id?: number;
}
export interface Organization {
  id: number;
  user_id: number;
  name: string;
  description: string;
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  official_docs_url?: string;
  registration_id?: number;
  contact_phone: string;
  contact_email: string;
  location_id?: number;
  location?: OrgLocation;
  created_at: string | Date;
  mission: string;
  category?: string;
  events?: ActivityItem[];
  fundraising_campaigns?: FundraisingCampaign[];
  members?: OrgMember[];
  notifications?: OrgNotification[];
}

export interface OrgLocation {
  id: number;
  lat?: number;
  lng?: number;
  address: string;
  region?: string;
  city: string;
}

export interface Report {
  id: number;
  organization_profile_id: number;
  project_id?: number | null;
  title: string;
  type: ReportType;
  file_url: string;
  published_at: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
}
