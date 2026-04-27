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

export interface Organization {
  id: number;
  user_id: number;
  name: string;
  description: string;
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  official_docs_url?: string;
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
