import {
  organization_membership_request_direction_enum as MembershipDirection,
  organization_membership_request_status_enum as MembershipStatus,
  user_role_enum as UserRole,
  notification_organization_type_enum,
} from '@prisma/client';

export { MembershipDirection, MembershipStatus, UserRole };

export type ReportType = 'фінансовий' | 'результати' | 'активності' | 'інше' | string;

export interface UserMinInfo {
  id: number;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
}

export interface RegistrationData {
  id: number;
  user_id: number;
  status: MembershipStatus;
  organization_id?: number;
  attempt_count?: number;
  created_at: string | Date;
  user?: UserMinInfo;
}

export interface OrgNotification {
  id: number;
  organization_id: number;
  message: string;
  is_read: boolean;
  type: notification_organization_type_enum;
  project_id?: number;
  user_id?: number;
  created_at: string;
  registration_data?: RegistrationData | null;
}

export interface ActivityItem {
  id: number;
  title: string;
  starts_at: string | Date | null;
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
  email?: string;
  city?: string;
}

export interface OrgLocation {
  id: number;
  lat?: number;
  lng?: number;
  address: string;
  region?: string;
  city: string;
}

export interface Organization {
  id: number;
  user_id: number;
  name: string;
  city?: string;
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

export interface Report {
  id: number;
  organization_profile_id: number;
  project_id?: number | null;
  title: string;
  type: ReportType;
  file_url: string;
  description: string;
  published_at: string | Date;
  created_at: string | Date;
}
export interface MembershipRequest {
  id: number;
  user_id: number;
  organization_id: number;
  status: MembershipStatus;
  direction: MembershipDirection;
  attempt_count: number;
}
