export type ticket_status_enum = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';
export type ticket_priority_enum = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  category_id: number;
  priority?: ticket_priority_enum;
  file_url?: string;
  location?: {
    city: string;
    address: string;
    region: string;
    lat?: number;
    lng?: number;
  };
}

export interface Ticket {
  id: number;
  user_id: number | null;
  volunteer_profile_id: number | null;
  title: string;
  description: string;
  status: ticket_status_enum;
  priority: ticket_priority_enum;
  file_url: string | null;
  location_id: number | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}
