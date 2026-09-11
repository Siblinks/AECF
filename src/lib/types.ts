export interface Ward {
  id: string;
  name: string;
  district: string;
  created_at: string;
}

export interface Indigene {
  id: string;
  user_id: string | null;
  full_name: string;
  phone: string;
  email: string | null;
  ward_id: string | null;
  qualification: string | null;
  field_of_study: string | null;
  discipline: string | null;
  employment_status: string | null;
  company: string | null;
  profession_title: string | null;
  skills: string[];
  volunteer_areas: string[];
  in_public_directory: boolean;
  avatar_url: string | null;
  verified: boolean;
  flagged: boolean;
  created_at: string;
}

export interface PublicIndigene {
  id: string;
  full_name: string;
  profession_title: string | null;
  ward_id: string | null;
  industry: string | null;
  skills: string[];
  avatar_url: string | null;
  verified: boolean;
  created_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  category: string;
  published: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string | null;
  ward_id: string | null;
  sector: string;
  status: string;
  progress: number;
  start_date: string | null;
  target_date: string | null;
  created_at: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  update_text: string;
  created_at: string;
}

export interface IndigeneWithWard extends Indigene {
  wards?: Ward | null;
}

export interface PublicIndigeneWithWard extends PublicIndigene {
  wards?: Ward | null;
}
