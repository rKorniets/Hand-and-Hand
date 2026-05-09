export interface NewsItem {
  id: number;
  title: string;
  image_url?: string;
  created_at: string;
  is_pinned: boolean;
  description: string;
  main_content: string;
  organization?: {
    id: number;
    name: string;
  };
}
