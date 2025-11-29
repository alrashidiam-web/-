
export interface BusinessData {
  organization_name: string;
  legal_form: string;
  sector: string;
  size: string;
  company_location: string;
  key_departments: string;
  current_accounting_system: string;
  operational_processes_overview: string;
  detail_level: 'summary' | 'detailed' | 'comprehensive';
  target_audience?: string;
  custom_chart_of_accounts?: string;
  custom_cost_centers?: string;
  custom_strengths?: string;
  custom_weaknesses?: string;
  custom_opportunities?: string;
  custom_threats?: string;
  competitors?: Competitor[];
}

export interface Competitor {
  name: string;
  market_share: string;
  strengths: string;
  weaknesses: string;
}

export type AnalysisResponse = string;

export interface HierarchyNode {
  name: string;
  children?: HierarchyNode[];
}

export interface SavedReport {
  id: string;
  date: string; // ISO string
  organizationName: string;
  analysis: AnalysisResponse;
  businessData: BusinessData; 
  rating?: number;
  comment?: string;
  userId?: string; // Owner ID from Supabase
}

export interface Template {
  key: string;
  name: string;
  description: string;
  data: Partial<BusinessData>;
}

export type ManualType = 'financial_policies' | 'financial_sops' | 'admin_sops';

export interface User {
  id: string;
  email: string;
  aud: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_status: string;
  is_admin?: boolean; 
  created_at?: string;
}

export interface KPIBenchmark {
  kpi: string;
  companyValue: number;
  industryAverage: number;
  unit: string;
  explanation: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  is_published?: boolean;
}

export interface FAQItem {
  id: string;
  question_ar: string;
  answer_ar: string;
  question_en: string;
  answer_en: string;
  display_order: number;
}

export interface AppSettings {
  linkedin_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  contact_email?: string;
  maintenance_mode?: string; // "true" or "false"
  enable_registration?: string; // "true" or "false"
  stripe_public_key?: string;
  [key: string]: string | undefined;
}