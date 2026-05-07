export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export enum ProjectRegistrationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface EventLocation {
  city: string;
  address: string;
  region: string;
}

export interface OrganizationProfile {
  id: number;
  name: string;
  email?: string;
  city?: string;
  mission?: string;
  logo_url?: string;
}

export interface EventCategory {
  id: number;
  name: string;
}

export interface EventVolunteer {
  id: number;
  full_name: string;
  avatar_url?: string;
}

export interface NewEvent {
  id: number;
  title: string;
  description: string;
  main_content: string | null;
  status: ProjectStatus;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
  what_volunteers_will_do?: string;
  why_its_important?: string;
  time?: string;
  application_deadline?: string;
  partners?: string;
  image_url?: string;
  participants: number;
  registered_count: number;
  location?: EventLocation;
  organization_profile?: OrganizationProfile;
  category?: EventCategory;
  volunteers?: EventVolunteer[];
}

export interface ProjectRegistration {
  id: number;
  project_id: number;
  user_id: number;
  status: ProjectRegistrationStatus;
  created_at: string;
  reviewed_at?: string | null;
  reviewed_by?: number | null;
  attempt_count: number;
  app_user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    city?: string;
    volunteer_profile?: { avatar_url?: string };
  };
}
