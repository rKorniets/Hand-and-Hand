export interface ItemFun {
  id: number;
  organization_profile_id: number;
  title: string;
  description: string;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
  image_url: string;

  organization_profile: {
    id: number;
    name: string;
  };

  tasks: {
    id: number;
    location: {
      city: string;
      address: string;
      region: string;
    };
  }[];
}
