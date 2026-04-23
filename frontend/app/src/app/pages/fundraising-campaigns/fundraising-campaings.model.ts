export interface FundraisingCampaignItem {
  id: number;
  title: string;
  description: string;
  main_content: string;
  goal_amount: number | string;
  current_amount: number | string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

  jar_link: string;
  jar_id: string | null;
  image_url: string | null;

  created_at: string;
  updated_at: string;
  start_at: string | null;
  end_at: string | null;

  organization_profile_id: number | null;
  volunteer_profile_id: number | null;

  organization_profile?: {
    name: string;
  };

  volunteer_profile?: {
    display_name: string;
  };
}
