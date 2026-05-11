import {
  organization_membership_request_direction_enum as MembershipDirection,
  organization_membership_request_status_enum as MembershipStatus,
  user_role_enum as UserRole,
} from '@prisma/client';
export { MembershipDirection, MembershipStatus, UserRole };

export interface OrgEvent {
  id: number;
  title: string;
  starts_at: string | Date | null;
  description?: string;
  location?: string;
  img?: string;
}

export interface FundraisingCampaign {
  id: number;
  title: string;
  description: string;
  organizer?: string;
  img?: string;
  bank_link?: string;
  organization_profile?: {
    name: string;
  };
}

export interface Member {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  role?: string;
  avatar_url?: string;
}

export interface OrgReport {
  id: number;
  title: string;
  type: string;
  published_at: string;
  file_url?: string;
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
  description: string;
  mission: string;
  category?: string;
  contact_phone: string;
  contact_email: string;
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  official_docs_url?: string;
  location_id?: number;
  location?: OrgLocation;
  created_at: string | Date;
  events?: OrgEvent[];
  fundraising_campaigns?: FundraisingCampaign[];
  members?: Member[];
  reports?: OrgReport[];
}

export interface OrganizationProfileResponse {
  members: Member[];
}
