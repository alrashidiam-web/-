export interface BusinessData {
  organization_name: string;
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

// The detailed response structure is no longer needed. The AI will return a single formatted string.
export type AnalysisResponse = string;

// The old HierarchyNode is no longer used in the output.
export interface HierarchyNode {
  name: string;
  children?: HierarchyNode[];
}


export interface SavedReport {
  id: string;
  date: string;
  organizationName: string;
  analysis: AnalysisResponse;
  businessData: BusinessData; // Persist the original input data
}

export interface Template {
  key: string;
  name: string;
  description: string;
  data: Partial<BusinessData>;
}

export type ManualType = 'financial_policies' | 'financial_sops' | 'admin_sops';

export interface BubbleUser {
  _id: string;
  email: string;
  is_logged_in: boolean;
}
