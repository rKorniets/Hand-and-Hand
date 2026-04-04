import { OrgLocation } from './location.model';

export interface OrgEvent {
  id: number;
  title: string;
  date: string;
  description?: string;
  location: string;
  img: string;
}

export interface FundraisingCampaign {
  id: number;
  title: string;
  description: string;
  organizer: string;
  img: string;
  bank_link?: string;
}

// export interface OrgMember {
//   id: number;
//   name: string;
//   role?: string;
//   avatar?: string;
// }

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
  events?: OrgEvent[];
  fundraising_campaigns?: FundraisingCampaign[];
  //members?: OrgMember[];
}
