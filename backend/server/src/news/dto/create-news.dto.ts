export class CreateNewsDto {
  title: string;
  description?: string;
  main_content?: string;
  image_url?: string;
  is_pinned?: boolean;
  created_by?: number;
}
