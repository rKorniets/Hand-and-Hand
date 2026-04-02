import { verification_status_enum } from '@prisma/client';

export class CreateOrganizationProfileDto {
  user_id: number;
  name: string;
  edrpou: string;
  description?: string;
  verification_status?: verification_status_enum;
  official_docs_url?: string;
  contact_phone?: string;
  contact_email?: string;
  location_id?: number;
}
