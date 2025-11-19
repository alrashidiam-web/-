import type { Template } from '../types';

export const getTemplates = (t: (key: string) => string): Template[] => [
  {
    key: 'ecommerce_startup',
    name: t('inputForm.templates.ecommerce_startup_name'),
    description: t('inputForm.templates.ecommerce_startup_description'),
    data: {
      sector: 'E-commerce & Retail',
      size: '1-15 employees',
      company_location: 'Global (Remote)',
      key_departments: 'Marketing, Customer Support, Operations/Logistics, Product Management',
      current_accounting_system: 'Excel Spreadsheets and Shopify Payments reporting',
      operational_processes_overview: 'The business operates a dropshipping model. Customer orders are received via Shopify. Marketing team runs social media ads. Customer support handles inquiries via email. Logistics are managed by a third-party provider. Inventory is not held.',
      target_audience: 'Founders & Investors',
    }
  },
  {
    key: 'manufacturing_company',
    name: t('inputForm.templates.manufacturing_company_name'),
    description: t('inputForm.templates.manufacturing_company_description'),
    data: {
      sector: 'Industrial Manufacturing',
      size: '150 employees',
      company_location: 'Dammam, Saudi Arabia',
      key_departments: 'Production, Quality Control, Supply Chain, R&D, Sales',
      current_accounting_system: 'SAP Business One',
      operational_processes_overview: 'Raw materials are sourced from various suppliers and stored in our warehouse. The production line operates in two shifts, involving assembly and finishing. The Quality Control team inspects products at multiple stages. Finished goods are packaged and distributed to wholesalers. The process is tracked using an internal ERP system.',
      target_audience: 'Board of Directors & Senior Management',
    }
  },
  {
    key: 'service_business',
    name: t('inputForm.templates.service_business_name'),
    description: t('inputForm.templates.service_business_description'),
    data: {
      sector: 'Professional Services / Consultancy',
      size: '40 employees',
      company_location: 'Dubai, UAE',
      key_departments: 'Client Services, Business Development, Project Management, HR & Finance',
      current_accounting_system: 'QuickBooks Online',
      operational_processes_overview: 'New clients are acquired through referrals and online marketing. The business development team creates proposals. Once signed, a project manager is assigned who builds a team of consultants. The team collaborates with the client to deliver the service, with regular check-ins and reporting. Invoicing is done at project milestones.',
      target_audience: 'Department Heads & Project Managers',
    }
  }
];