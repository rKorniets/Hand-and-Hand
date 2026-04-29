export type ticket_status_enum = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';
export type ticket_priority_enum = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CreateRequestPayload {
  title: string;
  description: string;
  category_ids?: number[];
  file_url?: string;
  location?: {
    city: string;
    address: string;
    region: string;
  };
}

export interface Request {
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

export interface Category {
  id: number;
  name: string;
}
