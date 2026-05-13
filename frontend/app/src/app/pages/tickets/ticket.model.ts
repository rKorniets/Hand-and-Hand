export type TicketStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface TicketLocation {
  id: number;
  address: string;
  city: string;
  region: string;
}

export interface TicketAuthor {
  id: number;
  first_name: string | null;
  last_name: string | null;
  role: string;
}

export interface TicketTask {
  id: number;
  title: string;
  description: string;
  status: string;
  difficulty: TaskDifficulty;
  points_reward_base: number;
  deadline: string | null;
  created_at: string;
  project?: {
    id: number;
    organization_profile_id: number;
  };
}

export interface TicketItem {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  file_url: string | null;
  user_id: number | null;
  location_id: number | null;
  app_user: TicketAuthor | null;
  location: TicketLocation | null;
  task: TicketTask[];
}

export interface CreateTaskFromTicketDto {
  project_id: number;
  ticket_id: number;
  title: string;
  description: string;
  difficulty: TaskDifficulty;
  points_reward_base: number;
  location_id?: number;
  deadline?: string;
}
