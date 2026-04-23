export type CategoryContext = 'news' | 'organizations' | 'fundraising' | 'projects';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface FilterConfig {
  showSearch?: boolean;
  showStatus?: boolean;
  showDateRange?: boolean;
  showCity?: boolean;
  categoryContext?: CategoryContext;
}

export interface FilterState {
  search: string;
  categories: string[];
  status: string[];
  dateFrom: string;
  dateTo: string;
  city: string;
}
