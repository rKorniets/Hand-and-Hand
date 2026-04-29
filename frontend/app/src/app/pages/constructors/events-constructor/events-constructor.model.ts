export type project_status_enum = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface CreateProjectPayload {
  organization_profile_id: number;
  title: string;
  description: string;
  main_content?: string;
  status?: project_status_enum;
  starts_at?: string;
  ends_at?: string;
  time?: string;
  application_deadline?: string;
  what_volunteers_will_do?: string;
  why_its_important?: string;
  partners?: string;
  image_url?: string;
  category_id?: number;
  participants?: number;
  location?: {
    city: string;
    address: string;
    region: string;
  };
}

export interface Project {
  id: number;
  organization_profile_id: number;
  title: string;
  description: string;
  main_content: string | null;
  status: project_status_enum;
  starts_at: string | null;
  ends_at: string | null;
  time: string | null;
  application_deadline: string | null;
  what_volunteers_will_do: string | null;
  why_its_important: string | null;
  partners: string | null;
  image_url: string | null;
  category_id: number | null;
  location: {
    city: string;
    address: string;
    region: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
}
