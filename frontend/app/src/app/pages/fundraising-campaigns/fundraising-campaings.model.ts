export interface FundraisingCampaignItem {
  id: number;
  organization_profile_id: number;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  status: string;
  created_at: string;
  start_at: string;
  end_at: string;
  updated_at: string;
  bank_link: string;
  image_url: string;

  organization_profile?: {
    title: string;
  };

  volunteer_profile?: {
    first_name: string;
    last_name: string;
  };
}
