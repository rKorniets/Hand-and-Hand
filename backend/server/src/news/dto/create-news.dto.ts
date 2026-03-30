export class CreateNewsDto {
  title: string;
  description: string;
  main_content: string;
  image_url: string;
  created_by?: number;
  is_pinned: boolean;
}
