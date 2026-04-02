import { OrgLocation  } from './location.model';

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
}
