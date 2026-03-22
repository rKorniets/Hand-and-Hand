import { project_status_enum } from '@prisma/client';

export class CreateProjectDto {
  organization_profile_id: number;
  title: string;
  description: string;
  status: project_status_enum;
  starts_at: string;
  ends_at: string;
}
