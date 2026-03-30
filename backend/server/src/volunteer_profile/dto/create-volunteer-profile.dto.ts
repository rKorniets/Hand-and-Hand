export class CreateVolunteerProfileDto {
  user_id: number;
  display_name: string;
  phone: string;
  bio: string;
  skills_text?: string;
  rating?: number;
  // Optional: defaults to false in createVolunteerProfile() when omitted
  is_verified?: boolean;
}
