export class CreateVolunteerProfileDto {
  user_id: number;
  display_name: string;
  phone: string;
  bio: string;
  skills_text?: string;
  rating?: number;
  is_verified: boolean;
}
