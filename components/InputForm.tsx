
import React, { useState, useMemo } from 'react';
import type { BusinessData, Competitor, Template } from '../types';
import { HistoryIcon, ChevronDownIcon, UploadIcon, TrashIcon, PersonPlusIcon, ShoppingCartIcon, WrenchScrewdriverIcon, BuildingOffice2Icon, XCircleIcon } from './icons';
import { useTranslation } from 'react-i18next';
import { getTemplates } from '../services/templates';

interface InputFormProps {
  onAnalyze: (data: BusinessData) => void;
  onViewHistory: () => void;
  hasHistory: boolean;
  isAuthenticated: boolean;
}

// Define the shape of the errors object for validation
type FormErrors = Partial<Record<'organization_name' | 'legal_form' | 'sector' | 'size' | 'company_location' | 'key_departments' | 'current_accounting_system' | 'operational_processes_overview', string>>;

const initialFormData: BusinessData = {
    organization_name: '',
    legal_form: '',
    sector: '',
    size: '',
    company_location: '',
    key_departments: '',
    current_accounting_system: '',
    operational_processes_overview: '',
    detail_level: 'comprehensive',
    target_audience: '',
    custom_chart_of_accounts: '',
    custom_cost_centers: '',
    custom_strengths: '',
    custom_weaknesses: '',
    custom_opportunities: '',
    custom_threats: '',
    competitors: [],
};

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, onViewHistory, hasHistory, isAuthenticated }) => {
  const { t } = useTranslation();
  const templates = useMemo(() => getTemplates(t), [t]);

  const [formData, setFormData] = useState<BusinessData>(initialFormData);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [accountingInputMode, setAccountingInputMode] = useState<'text' | 'file'>('text');
  const [accountingFileName, setAccountingFileName] = useState<string>('');
  const [fileReadStatus, setFileReadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  const fieldLabels: Record<keyof FormErrors, string> = useMemo(() => ({
    organization_name: t('inputForm.orgName.label'),
    legal_form: t('inputForm.legalForm.label'),
    sector: t('inputForm.sector.label'),
    size: t('inputForm.size.label'),
    company_location: t('inputForm.companyLocation.label'),
    key_departments: t('inputForm.keyDepartments.label'),
    current_accounting_system: t('inputForm.accountingSystem.label'),
    operational_processes_overview: t('inputForm.operationalProcesses.label'),
  }), [t]);
  
  const templateIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    ecommerce_startup: ShoppingCartIcon,
    manufacturing_company: WrenchScrewdriverIcon,
    service_business: BuildingOffice2Icon,
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const requiredFields: (keyof FormErrors)[] = [
      'organization_name',
      'legal_form',
      'sector',
      'size',
      'company_location',
      'key_departments',
      'operational_processes_overview',
    ];

    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        const key = field === 'legal_form' ? 'legalForm' : field.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        newErrors[field] = t(`inputForm.${key}.required`);
      }
    });

    // Specific validation for 'current_accounting_system'
    if (accountingInputMode === 'file') {
        if (fileReadStatus !== 'success') {
          newErrors.current_accounting_system = t('inputForm.accountingSystem.fileRequired');
        } else if (!formData.current_accounting_system.trim()) { // Check for empty file content after successful read
          newErrors.current_accounting_system = t('inputForm.accountingSystem.fileEmpty');
        }
    } else { // 'text' mode
        if (!formData.current_accounting_system.trim()) {
          newErrors.current_accounting_system = t('inputForm.accountingSystem.required');
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSelectTemplate = (template: Template) => {
    setErrors({});
    setFormData(prev => ({ ...initialFormData, ...template.data, organization_name: prev.organization_name }));
    setActiveTemplate(template.key);
  };
  
  const handleClearForm = () => {
    setErrors({});
    setFormData(initialFormData);
    setActiveTemplate(null);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof BusinessData;
    
    // De-select template when user starts customizing
    if (activeTemplate) {
        setActiveTemplate(null);
    }

    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    // Clear the error for the field being edited
    if (errors[fieldName as keyof FormErrors]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldName as keyof FormErrors];
        return newErrors;
      });
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormErrors;

    // Only validate required fields that are in our labels map
    if (fieldName in fieldLabels) {
      if (!value.trim()) {
        const key = fieldName === 'legal_form' ? 'legalForm' : fieldName.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        setErrors(prev => ({...prev, [fieldName]: t(`inputForm.${key}.required`)}));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, current_accounting_system: t('inputForm.accountingSystem.fileSizeError') }));
            setAccountingFileName('');
            setFileReadStatus('error');
            const fileInput = document.getElementById('current_accounting_system_file') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            return;
        }
        
        setAccountingFileName(t('inputForm.accountingSystem.readingFile'));
        setFileReadStatus('idle');
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          setFormData((prev) => ({ ...prev, current_accounting_system: text }));
          setAccountingFileName(file.name);
          setFileReadStatus('success');
          if (errors.current_accounting_system) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.current_accounting_system;
                return newErrors;
            });
          }
        };
        reader.onerror = () => {
          setErrors(prev => ({ ...prev, current_accounting_system: t('inputForm.accountingSystem.fileReadError') }));
          setAccountingFileName('');
          setFormData(prev => ({ ...prev, current_accounting_system: '' }));
          setFileReadStatus('error');
        };
        reader.readAsText(file);
      }
    };

    const handleRemoveFile = () => {
        setFormData(prev => ({ ...prev, current_accounting_system: '' }));
        setAccountingFileName('');
        setFileReadStatus('idle');
        const fileInput = document.getElementById('current_accounting_system_file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAnalyze(formData);
    }
  };

  const getInputClasses = (field: keyof FormErrors) => {
    const baseClasses = "w-full px-4 py-3 bg-white dark:bg-slate-900 border rounded-lg shadow-sm focus:outline-none transition-all duration-200 placeholder-slate-400";
    const errorClasses = "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900";
    const normalClasses = "border-slate-300 dark:border-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-900/50 hover:border-slate-400 dark:hover:border-slate-500";
    return `${baseClasses} ${errors[field] ? errorClasses : normalClasses}`;
  };

  const handleCompetitorChange = (index: number, field: keyof Competitor, value: string) => {
    const updatedCompetitors = [...(formData.competitors || [])];
    updatedCompetitors[index] = { ...updatedCompetitors[index], [field]: value };
    setFormData(prev => ({ ...prev, competitors: updatedCompetitors }));
  };

  const handleAddCompetitor = () => {
    const newCompetitor: Competitor = { name: '', market_share: '', strengths: '', weaknesses: '' };
    setFormData(prev => ({ ...prev, competitors: [...(prev.competitors || []), newCompetitor] }));
  };

  const handleRemoveCompetitor = (index: number) => {
    setFormData(prev => ({ ...prev, competitors: (prev.competitors || []).filter((_, i) => i !== index) }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-5xl mx-auto">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-sky-500 rounded-full inline-block"></span>
                {t('inputForm.templates.title')}
            </h3>
            <button
                onClick={handleClearForm}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-full"
                >
                <XCircleIcon className="w-4 h-4" />
                {t('inputForm.templates.clearSelection')}
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {templates.map((template) => {
            const Icon = templateIcons[template.key];
            const isActive = activeTemplate === template.key;
            return (
              <button
                key={template.key}
                type="button"
                onClick={() => handleSelectTemplate(template)}
                className={`text-start p-5 rounded-xl border-2 transition-all duration-300 transform ${
                    isActive 
                    ? 'bg-sky-50/80 dark:bg-sky-900/30 border-sky-500 shadow-md scale-[1.02]' 
                    : 'bg-white dark:bg-slate-700/30 border-slate-200 dark:border-slate-600 hover:border-sky-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:-translate-y-1'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-sky-100 dark:bg-sky-800 text-sky-600 dark:text-sky-300' : 'bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-300'}`}>
                        {Icon && <Icon className="w-6 h-6" />}
                    </div>
                    <h4 className={`font-bold ${isActive ? 'text-sky-700 dark:text-sky-300' : 'text-slate-800 dark:text-slate-100'}`}>{template.name}</h4>
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{template.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 text-center">{t('inputForm.title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="organization_name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('inputForm.orgName.label')}</label>
              <input type="text" name="organization_name" id="organization_name" required value={formData.organization_name} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('organization_name')} placeholder={t('inputForm.orgName.label')} />
              {errors.organization_name ? (<p className="mt-1.5 text-xs text-red-500 font-medium">{errors.organization_name}</p>) : (<p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.orgName.help')}</p>)}
            </div>
            <div>
              <label htmlFor="legal_form" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('inputForm.legalForm.label')}</label>
              <input type="text" name="legal_form" id="legal_form" required value={formData.legal_form} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('legal_form')} placeholder={t('inputForm.legalForm.placeholder')} />
              {errors.legal_form ? (<p className="mt-1.5 text-xs text-red-500 font-medium">{errors.legal_form}</p>) : (<p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.legalForm.help')}</p>)}
            </div>
            <div>
              <label htmlFor="sector" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('inputForm.sector.label')}</label>
              <input type="text" name="sector" id="sector" required value={formData.sector} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('sector')} placeholder={t('inputForm.sector.label')} />
              {errors.sector ? (<p className="mt-1.5 text-xs text-red-500 font-medium">{errors.sector}</p>) : (<p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.sector.help')}</p>)}
            </div>
            <div>
              <label htmlFor="size" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('inputForm.size.label')}</label>
              <input type="text" name="size" id="size" required value={formData.size} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('size')} placeholder={t('inputForm.size.label')} />
              {errors.size ? (<p className="mt-1.5 text-xs text-red-500 font-medium">{errors.size}</p>) : (<p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.size.help')}</p>)}
            </div>
             <div>
              <label htmlFor="company_location" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('inputForm.companyLocation.label')}</label>
              <input type="text" name="company_location" id="company_location" required value={formData.company_location} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('company_location')} placeholder={t('inputForm.companyLocation.label')} />
              {errors.company_location ? (<p className="mt-1.5 text-xs text-red-500 font-medium">{errors.company_location}</p>) : (<p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.companyLocation.help')}</p>)}
            </div>
          </div>
           
           {/* Accounting System Section with Tabs */}
           <div className="bg-slate-50 dark:bg-slate-700/30 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t('inputForm.accountingSystem.label')}</label>
              <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => setAccountingInputMode('text')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${accountingInputMode === 'text' ? 'bg-white dark:bg-slate-600 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-200 dark:border-slate-500' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>{t('inputForm.accountingSystem.manualInput')}</button>
                  <button type="button" onClick={() => setAccountingInputMode('file')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${accountingInputMode === 'file' ? 'bg-white dark:bg-slate-600 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-200 dark:border-slate-500' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>{t('inputForm.accountingSystem.fileUpload')}</button>
              </div>
              
              {accountingInputMode === 'text' ? (
                  <input type="text" name="current_accounting_system" id="current_accounting_system" required value={formData.current_accounting_system} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('current_accounting_system')} placeholder="e.g., SAP, QuickBooks, Excel" />
                ) : (
                  <div className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors ${errors.current_accounting_system ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                      {accountingFileName ? (
                          <div className="flex items-center gap-3 p-2 bg-sky-50 dark:bg-sky-900/30 rounded-lg border border-sky-100 dark:border-sky-800">
                              <span className="text-sm font-medium text-sky-700 dark:text-sky-300 truncate max-w-[200px]">{accountingFileName}</span> 
                              <button type="button" onClick={handleRemoveFile} className="p-1 text-slate-400 hover:text-red-500 transition-colors"> <TrashIcon className="w-5 h-5" /> </button> 
                          </div>
                        ) : (
                          <label htmlFor="current_accounting_system_file" className="flex flex-col items-center justify-center w-full h-full cursor-pointer"> 
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadIcon className="w-8 h-8 mb-3 text-slate-400"/>
                                <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold text-sky-600 dark:text-sky-400">{t('inputForm.accountingSystem.chooseFile')}</span></p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">TXT, CSV, JSON (MAX. 5MB)</p>
                            </div>
                            <input type="file" id="current_accounting_system_file" onChange={handleFileChange} accept=".txt,.csv,.md,.json" className="hidden" /> 
                          </label>
                        )}
                  </div>
                )}
              {errors.current_accounting_system ? (<p className="mt-2 text-xs text-red-500 font-medium">{errors.current_accounting_system}</p>) : (<p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.accountingSystem.help')}</p>)}
            </div>

          <div>
            <label htmlFor="key_departments" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('inputForm.keyDepartments.label')}</label>
            <input type="text" name="key_departments" id="key_departments" required value={formData.key_departments} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('key_departments')} />
            {errors.key_departments ? (<p className="mt-1.5 text-xs text-red-500 font-medium">{errors.key_departments}</p>) : (<p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.keyDepartments.help')}</p>)}
          </div>
          
          <div>
            <label htmlFor="target_audience" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('inputForm.targetAudience.label')}</label>
            <input type="text" name="target_audience" id="target_audience" value={formData.target_audience || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-900/50 focus:border-sky-500 transition-all placeholder-slate-400" placeholder={t('inputForm.targetAudience.placeholder')} />
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.targetAudience.help')}</p>
          </div>
          
          <div>
            <label htmlFor="operational_processes_overview" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('inputForm.operationalProcesses.label')}</label>
            <textarea name="operational_processes_overview" id="operational_processes_overview" required value={formData.operational_processes_overview} onChange={handleChange} onBlur={handleBlur} rows={5} className={getInputClasses('operational_processes_overview')}></textarea>
            {errors.operational_processes_overview ? (<p className="mt-1.5 text-xs text-red-500 font-medium">{errors.operational_processes_overview}</p>) : (<p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.operationalProcesses.help')}</p>)}
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-700/20 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t('inputForm.detailLevel.label')}</label>
            <div className="space-y-3">
              <div className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${formData.detail_level === 'comprehensive' ? 'bg-sky-50 border-sky-500 dark:bg-sky-900/30' : 'bg-white border-slate-300 dark:bg-slate-800 dark:border-slate-600 hover:border-sky-300'}`}>
                <div className="flex items-center h-5">
                    <input id="detail-comprehensive" name="detail_level" type="radio" value="comprehensive" checked={formData.detail_level === 'comprehensive'} onChange={handleChange} className="w-4 h-4 text-sky-600 border-slate-300 focus:ring-sky-500" />
                </div>
                <div className="ms-3 text-sm">
                  <label htmlFor="detail-comprehensive" className="font-bold text-slate-900 dark:text-slate-100 cursor-pointer">{t('inputForm.detailLevel.comprehensive.title')}</label>
                  <p className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-1">{t('inputForm.detailLevel.comprehensive.description')}</p>
                </div>
              </div>
              <div className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${formData.detail_level === 'detailed' ? 'bg-sky-50 border-sky-500 dark:bg-sky-900/30' : 'bg-white border-slate-300 dark:bg-slate-800 dark:border-slate-600 hover:border-sky-300'}`}>
                <div className="flex items-center h-5">
                    <input id="detail-detailed" name="detail_level" type="radio" value="detailed" checked={formData.detail_level === 'detailed'} onChange={handleChange} className="w-4 h-4 text-sky-600 border-slate-300 focus:ring-sky-500" />
                </div>
                <div className="ms-3 text-sm">
                  <label htmlFor="detail-detailed" className="font-bold text-slate-900 dark:text-slate-100 cursor-pointer">{t('inputForm.detailLevel.detailed.title')}</label>
                  <p className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-1">{t('inputForm.detailLevel.detailed.description')}</p>
                </div>
              </div>
              <div className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${formData.detail_level === 'summary' ? 'bg-sky-50 border-sky-500 dark:bg-sky-900/30' : 'bg-white border-slate-300 dark:bg-slate-800 dark:border-slate-600 hover:border-sky-300'}`}>
                <div className="flex items-center h-5">
                    <input id="detail-summary" name="detail_level" type="radio" value="summary" checked={formData.detail_level === 'summary'} onChange={handleChange} className="w-4 h-4 text-sky-600 border-slate-300 focus:ring-sky-500" />
                </div>
                <div className="ms-3 text-sm">
                  <label htmlFor="detail-summary" className="font-bold text-slate-900 dark:text-slate-100 cursor-pointer">{t('inputForm.detailLevel.summary.title')}</label>
                  <p className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-1">{t('inputForm.detailLevel.summary.description')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{showAdvanced ? t('inputForm.advanced.hide') : t('inputForm.advanced.show')}</span>
              <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${showAdvanced ? 'rotate-180 text-sky-500' : ''}`} />
            </button>
          </div>
          
          {showAdvanced && (<div className="pt-2 animate-fade-in"> <div className="space-y-8 p-6 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-inner"> 
            
            {/* SWOT Section */}
            <div> 
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
                    {t('inputForm.advanced.strategicTitle')}
                </h4> 
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('inputForm.advanced.strategicHelp')}</p> 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> 
                    <div> <label htmlFor="custom_strengths" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">{t('inputForm.advanced.swot.strengths')}</label> <textarea name="custom_strengths" id="custom_strengths" value={formData.custom_strengths} onChange={handleChange} rows={2} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" placeholder={t('inputForm.advanced.swot.strengthsPlaceholder')}></textarea> </div> 
                    <div> <label htmlFor="custom_weaknesses" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">{t('inputForm.advanced.swot.weaknesses')}</label> <textarea name="custom_weaknesses" id="custom_weaknesses" value={formData.custom_weaknesses} onChange={handleChange} rows={2} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" placeholder={t('inputForm.advanced.swot.weaknessesPlaceholder')}></textarea> </div> 
                    <div> <label htmlFor="custom_opportunities" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">{t('inputForm.advanced.swot.opportunities')}</label> <textarea name="custom_opportunities" id="custom_opportunities" value={formData.custom_opportunities} onChange={handleChange} rows={2} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder={t('inputForm.advanced.swot.opportunitiesPlaceholder')}></textarea> </div> 
                    <div> <label htmlFor="custom_threats" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">{t('inputForm.advanced.swot.threats')}</label> <textarea name="custom_threats" id="custom_threats" value={formData.custom_threats} onChange={handleChange} rows={2} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" placeholder={t('inputForm.advanced.swot.threatsPlaceholder')}></textarea> </div> 
                </div> 
            </div>

            {/* Competitors Section */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6"> 
                <h5 className="block text-base font-bold text-slate-800 dark:text-slate-200 mb-4">{t('inputForm.advanced.competitors.title')}</h5> 
                <div className="space-y-4"> 
                    {(formData.competitors || []).map((competitor, index) => (
                        <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 relative shadow-sm hover:shadow-md transition-shadow"> 
                            <button type="button" onClick={() => handleRemoveCompetitor(index)} className="absolute top-2 left-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" aria-label={t('inputForm.advanced.competitors.remove')}> <TrashIcon className="w-4 h-4" /> </button> 
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8 md:pl-0"> 
                                <div className="md:col-span-1 md:ml-8"> <label htmlFor={`competitor_name_${index}`} className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t('inputForm.advanced.competitors.name')}</label> <input type="text" id={`competitor_name_${index}`} value={competitor.name} onChange={(e) => handleCompetitorChange(index, 'name', e.target.value)} className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.competitors.namePlaceholder')} /> </div> 
                                <div> <label htmlFor={`market_share_${index}`} className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t('inputForm.advanced.competitors.marketShare')}</label> <input type="text" id={`market_share_${index}`} value={competitor.market_share} onChange={(e) => handleCompetitorChange(index, 'market_share', e.target.value)} className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.competitors.marketSharePlaceholder')} /> </div> 
                                <div className="md:col-span-2"> <label htmlFor={`strengths_${index}`} className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t('inputForm.advanced.swot.strengths')}</label> <textarea id={`strengths_${index}`} value={competitor.strengths} onChange={(e) => handleCompetitorChange(index, 'strengths', e.target.value)} rows={2} className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.competitors.strengthsPlaceholder')}></textarea> </div> 
                                <div className="md:col-span-2"> <label htmlFor={`weaknesses_${index}`} className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t('inputForm.advanced.swot.weaknesses')}</label> <textarea id={`weaknesses_${index}`} value={competitor.weaknesses} onChange={(e) => handleCompetitorChange(index, 'weaknesses', e.target.value)} rows={2} className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.competitors.weaknessesPlaceholder')}></textarea> </div> 
                            </div> 
                        </div>
                    ))} 
                    <button type="button" onClick={handleAddCompetitor} className="flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 py-2 px-4 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors border border-dashed border-sky-300 dark:border-sky-700 w-full justify-center"> <PersonPlusIcon className="w-5 h-5" /> <span>{t('inputForm.advanced.competitors.add')}</span> </button> 
                </div> 
            </div> 
            
            {/* Financial Customization */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6"> 
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-emerald-500 rounded-full"></span>
                    {t('inputForm.advanced.financialTitle')}
                </h4> 
                <div className="grid grid-cols-1 gap-6"> 
                    <div> <label htmlFor="custom_chart_of_accounts" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('inputForm.advanced.chartOfAccounts.label')}</label> <textarea name="custom_chart_of_accounts" id="custom_chart_of_accounts" value={formData.custom_chart_of_accounts} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.chartOfAccounts.placeholder')}></textarea> </div> 
                    <div> <label htmlFor="custom_cost_centers" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('inputForm.advanced.costCenters.label')}</label> <textarea name="custom_cost_centers" id="custom_cost_centers" value={formData.custom_cost_centers} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.costCenters.placeholder')}></textarea> </div> 
                </div> 
            </div> 
          </div></div>)}

          <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-700 gap-4">
             <button type="button" onClick={onViewHistory} className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl shadow-sm hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isAuthenticated} title={!isAuthenticated ? t('inputForm.buttons.historyDisabledTooltip') : undefined}> <HistoryIcon className="w-5 h-5" /> <span>{t('inputForm.buttons.history')}</span> </button>
            <button id="generate-analysis-button" type="submit" className="w-full sm:w-auto px-10 py-3.5 bg-sky-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-sky-700 hover:shadow-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all transform hover:-translate-y-0.5">
              {t('inputForm.buttons.analyze')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputForm;