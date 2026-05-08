export interface OrgEvent {
  id: number;
  title: string;
  starts_at: string;
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
export enum MembershipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface MembershipRequest {
  id: number;
  user_id: number;
  organization_id: number;
  status: MembershipStatus;
  rejection_count: number;
}
export enum UserRole {
  APP_USER = 'APP_USER',
  VOLUNTEER = 'VOLUNTEER',
  ORGANIZATION = 'ORGANIZATION',
  ADMIN = 'ADMIN',
}
