import { verification_status_enum } from '@prisma/client';

export class CreateOrganizationProfileDto {
  user_id: number;
  name: string;
  description: string;
  // Optional: if omitted, the service will default this to verification_status_enum.PENDING
  verification_status?: verification_status_enum;
  official_docs_url?: string;
  contact_phone: string;
  contact_email: string;
  location_id?: number;
}
