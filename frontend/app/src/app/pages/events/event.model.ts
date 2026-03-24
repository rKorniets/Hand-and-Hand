export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

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
}
