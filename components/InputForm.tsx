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
type FormErrors = Partial<Record<'organization_name' | 'sector' | 'size' | 'company_location' | 'key_departments' | 'current_accounting_system' | 'operational_processes_overview', string>>;

const initialFormData: BusinessData = {
    organization_name: '',
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
      'sector',
      'size',
      'company_location',
      'key_departments',
      'operational_processes_overview',
    ];

    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = t(`inputForm.${field.replace(/_([a-z])/g, (g) => g[1].toUpperCase())}.required`);
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
        const key = fieldName.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
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
    const baseClasses = "w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border rounded-md shadow-sm focus:outline-none transition-colors";
    const errorClasses = "border-red-500 focus:border-red-500 focus:ring-red-500";
    const normalClasses = "border-slate-300 dark:border-slate-600 focus:border-sky-500 focus:ring-sky-500";
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
    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('inputForm.templates.title')}</h3>
            <button
                onClick={handleClearForm}
                className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                >
                <XCircleIcon className="w-4 h-4" />
                {t('inputForm.templates.clearSelection')}
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => {
            const Icon = templateIcons[template.key];
            return (
              <button
                key={template.key}
                type="button"
                onClick={() => handleSelectTemplate(template)}
                className={`text-left p-4 rounded-lg border-2 transition-all duration-200 transform hover:-translate-y-1 ${activeTemplate === template.key ? 'bg-sky-50 dark:bg-sky-900/50 border-sky-500 shadow-lg' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 hover:border-sky-400'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                    {Icon && <Icon className={`w-6 h-6 ${activeTemplate === template.key ? 'text-sky-500' : 'text-slate-500 dark:text-slate-400'}`} />}
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{template.name}</h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{template.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">{t('inputForm.title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="organization_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('inputForm.orgName.label')}</label>
              <input type="text" name="organization_name" id="organization_name" required value={formData.organization_name} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('organization_name')} />
              {errors.organization_name ? (<p className="mt-1 text-xs text-red-500">{errors.organization_name}</p>) : (<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.orgName.help')}</p>)}
            </div>
            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('inputForm.sector.label')}</label>
              <input type="text" name="sector" id="sector" required value={formData.sector} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('sector')} />
              {errors.sector ? (<p className="mt-1 text-xs text-red-500">{errors.sector}</p>) : (<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.sector.help')}</p>)}
            </div>
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('inputForm.size.label')}</label>
              <input type="text" name="size" id="size" required value={formData.size} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('size')} />
              {errors.size ? (<p className="mt-1 text-xs text-red-500">{errors.size}</p>) : (<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.size.help')}</p>)}
            </div>
             <div>
              <label htmlFor="company_location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('inputForm.companyLocation.label')}</label>
              <input type="text" name="company_location" id="company_location" required value={formData.company_location} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('company_location')} />
              {errors.company_location ? (<p className="mt-1 text-xs text-red-500">{errors.company_location}</p>) : (<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.companyLocation.help')}</p>)}
            </div>
          </div>
           <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('inputForm.accountingSystem.label')}</label>
              <div className="flex border-b border-slate-200 dark:border-slate-700 text-sm">
                  <button type="button" onClick={() => setAccountingInputMode('text')} className={`px-4 py-2 -mb-px border-b-2 ${accountingInputMode === 'text' ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>{t('inputForm.accountingSystem.manualInput')}</button>
                  <button type="button" onClick={() => setAccountingInputMode('file')} className={`px-4 py-2 -mb-px border-b-2 ${accountingInputMode === 'file' ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>{t('inputForm.accountingSystem.fileUpload')}</button>
              </div>
              {accountingInputMode === 'text' ? (<input type="text" name="current_accounting_system" id="current_accounting_system" required value={formData.current_accounting_system} onChange={handleChange} onBlur={handleBlur} className={`${getInputClasses('current_accounting_system')} rounded-t-none`} />) : (<div className={`flex items-center justify-center w-full h-[42px] px-3 bg-slate-50 dark:bg-slate-700 border border-t-0 rounded-b-md shadow-sm ${errors.current_accounting_system ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}>
                  {accountingFileName ? (<div className="flex items-center justify-between w-full text-sm"> <span className="text-slate-700 dark:text-slate-200 truncate">{accountingFileName}</span> <button type="button" onClick={handleRemoveFile} className="p-1 text-slate-400 hover:text-red-500"> <TrashIcon className="w-4 h-4" /> </button> </div>) : (<label htmlFor="current_accounting_system_file" className="cursor-pointer flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-800"> <UploadIcon className="w-5 h-5"/> <span className="text-sm font-semibold">{t('inputForm.accountingSystem.chooseFile')}</span> <input type="file" id="current_accounting_system_file" onChange={handleFileChange} accept=".txt,.csv,.md,.json" className="hidden" /> </label>)}
                  </div>)}
              {errors.current_accounting_system ? (<p className="mt-1 text-xs text-red-500">{errors.current_accounting_system}</p>) : (<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.accountingSystem.help')}</p>)}
            </div>
          <div>
            <label htmlFor="key_departments" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('inputForm.keyDepartments.label')}</label>
            <input type="text" name="key_departments" id="key_departments" required value={formData.key_departments} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('key_departments')} />
            {errors.key_departments ? (<p className="mt-1 text-xs text-red-500">{errors.key_departments}</p>) : (<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.keyDepartments.help')}</p>)}
          </div>
          <div>
            <label htmlFor="target_audience" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('inputForm.targetAudience.label')}</label>
            <input type="text" name="target_audience" id="target_audience" value={formData.target_audience || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border rounded-md shadow-sm focus:outline-none transition-colors border-slate-300 dark:border-slate-600 focus:border-sky-500 focus:ring-sky-500" placeholder={t('inputForm.targetAudience.placeholder')} />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.targetAudience.help')}</p>
          </div>
          <div>
            <label htmlFor="operational_processes_overview" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('inputForm.operationalProcesses.label')}</label>
            <textarea name="operational_processes_overview" id="operational_processes_overview" required value={formData.operational_processes_overview} onChange={handleChange} onBlur={handleBlur} rows={5} className={getInputClasses('operational_processes_overview')}></textarea>
            {errors.operational_processes_overview ? (<p className="mt-1 text-xs text-red-500">{errors.operational_processes_overview}</p>) : (<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.operationalProcesses.help')}</p>)}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('inputForm.detailLevel.label')}</label>
            <div className="space-y-3">
              <div className="flex items-center p-3 rounded-md border border-slate-300 dark:border-slate-600 has-[:checked]:bg-sky-50 has-[:checked]:border-sky-500 dark:has-[:checked]:bg-sky-900/50 dark:has-[:checked]:border-sky-500 transition-all">
                <input id="detail-comprehensive" name="detail_level" type="radio" value="comprehensive" checked={formData.detail_level === 'comprehensive'} onChange={handleChange} className="h-4 w-4 text-sky-600 border-slate-300 focus:ring-sky-500" />
                <div className="ms-3 text-sm">
                  <label htmlFor="detail-comprehensive" className="font-bold text-slate-900 dark:text-slate-100">{t('inputForm.detailLevel.comprehensive.title')}</label>
                  <p className="text-xs font-normal text-slate-500 dark:text-slate-400">{t('inputForm.detailLevel.comprehensive.description')}</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-md border border-slate-300 dark:border-slate-600 has-[:checked]:bg-sky-50 has-[:checked]:border-sky-500 dark:has-[:checked]:bg-sky-900/50 dark:has-[:checked]:border-sky-500 transition-all">
                <input id="detail-detailed" name="detail_level" type="radio" value="detailed" checked={formData.detail_level === 'detailed'} onChange={handleChange} className="h-4 w-4 text-sky-600 border-slate-300 focus:ring-sky-500" />
                <div className="ms-3 text-sm">
                  <label htmlFor="detail-detailed" className="font-bold text-slate-900 dark:text-slate-100">{t('inputForm.detailLevel.detailed.title')}</label>
                  <p className="text-xs font-normal text-slate-500 dark:text-slate-400">{t('inputForm.detailLevel.detailed.description')}</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-md border border-slate-300 dark:border-slate-600 has-[:checked]:bg-sky-50 has-[:checked]:border-sky-500 dark:has-[:checked]:bg-sky-900/50 dark:has-[:checked]:border-sky-500 transition-all">
                <input id="detail-summary" name="detail_level" type="radio" value="summary" checked={formData.detail_level === 'summary'} onChange={handleChange} className="h-4 w-4 text-sky-600 border-slate-300 focus:ring-sky-500" />
                <div className="ms-3 text-sm">
                  <label htmlFor="detail-summary" className="font-bold text-slate-900 dark:text-slate-100">{t('inputForm.detailLevel.summary.title')}</label>
                  <p className="text-xs font-normal text-slate-500 dark:text-slate-400">{t('inputForm.detailLevel.summary.description')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300">
              <span>{showAdvanced ? t('inputForm.advanced.hide') : t('inputForm.advanced.show')}</span>
              <ChevronDownIcon className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {showAdvanced && (<div className="pt-4 border-t border-slate-200 dark:border-slate-700 animate-fade-in"> <div className="space-y-6 p-4 rounded-md bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-900"> <div> <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-3">{t('inputForm.advanced.strategicTitle')}</h4> <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2 mb-3">{t('inputForm.advanced.strategicHelp')}</p> <div className="space-y-4"> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label htmlFor="custom_strengths" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{t('inputForm.advanced.swot.strengths')}</label> <textarea name="custom_strengths" id="custom_strengths" value={formData.custom_strengths} onChange={handleChange} rows={2} className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.swot.strengthsPlaceholder')}></textarea> </div> <div> <label htmlFor="custom_weaknesses" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{t('inputForm.advanced.swot.weaknesses')}</label> <textarea name="custom_weaknesses" id="custom_weaknesses" value={formData.custom_weaknesses} onChange={handleChange} rows={2} className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.swot.weaknessesPlaceholder')}></textarea> </div> <div> <label htmlFor="custom_opportunities" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{t('inputForm.advanced.swot.opportunities')}</label> <textarea name="custom_opportunities" id="custom_opportunities" value={formData.custom_opportunities} onChange={handleChange} rows={2} className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.swot.opportunitiesPlaceholder')}></textarea> </div> <div> <label htmlFor="custom_threats" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{t('inputForm.advanced.swot.threats')}</label> <textarea name="custom_threats" id="custom_threats" value={formData.custom_threats} onChange={handleChange} rows={2} className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.swot.threatsPlaceholder')}></textarea> </div> </div> <div> <h5 className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('inputForm.advanced.competitors.title')}</h5> <div className="space-y-4"> {(formData.competitors || []).map((competitor, index) => (<div key={index} className="p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700/50 relative"> <button type="button" onClick={() => handleRemoveCompetitor(index)} className="absolute top-2 left-2 p-1 text-slate-400 hover:text-red-500" aria-label={t('inputForm.advanced.competitors.remove')}> <TrashIcon className="w-4 h-4" /> </button> <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2"> <div> <label htmlFor={`competitor_name_${index}`} className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t('inputForm.advanced.competitors.name')}</label> <input type="text" id={`competitor_name_${index}`} value={competitor.name} onChange={(e) => handleCompetitorChange(index, 'name', e.target.value)} className="w-full px-2 py-1 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.competitors.namePlaceholder')} /> </div> <div> <label htmlFor={`market_share_${index}`} className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t('inputForm.advanced.competitors.marketShare')}</label> <input type="text" id={`market_share_${index}`} value={competitor.market_share} onChange={(e) => handleCompetitorChange(index, 'market_share', e.target.value)} className="w-full px-2 py-1 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.competitors.marketSharePlaceholder')} /> </div> <div className="md:col-span-2"> <label htmlFor={`strengths_${index}`} className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t('inputForm.advanced.swot.strengths')}</label> <textarea id={`strengths_${index}`} value={competitor.strengths} onChange={(e) => handleCompetitorChange(index, 'strengths', e.target.value)} rows={2} className="w-full px-2 py-1 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.competitors.strengthsPlaceholder')}></textarea> </div> <div className="md:col-span-2"> <label htmlFor={`weaknesses_${index}`} className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t('inputForm.advanced.swot.weaknesses')}</label> <textarea id={`weaknesses_${index}`} value={competitor.weaknesses} onChange={(e) => handleCompetitorChange(index, 'weaknesses', e.target.value)} rows={2} className="w-full px-2 py-1 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.competitors.weaknessesPlaceholder')}></textarea> </div> </div> </div>))} <button type="button" onClick={handleAddCompetitor} className="flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 py-2"> <PersonPlusIcon className="w-5 h-5" /> <span>{t('inputForm.advanced.competitors.add')}</span> </button> </div> <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.advanced.competitors.help')}</p> </div> </div> </div> <div className="pt-4 border-t border-sky-200 dark:border-sky-800"> <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-3">{t('inputForm.advanced.financialTitle')}</h4> <div className="space-y-4"> <div> <label htmlFor="custom_chart_of_accounts" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('inputForm.advanced.chartOfAccounts.label')}</label> <textarea name="custom_chart_of_accounts" id="custom_chart_of_accounts" value={formData.custom_chart_of_accounts} onChange={handleChange} rows={3} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.chartOfAccounts.placeholder')}></textarea> <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.advanced.chartOfAccounts.help')}</p> </div> <div> <label htmlFor="custom_cost_centers" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('inputForm.advanced.costCenters.label')}</label> <textarea name="custom_cost_centers" id="custom_cost_centers" value={formData.custom_cost_centers} onChange={handleChange} rows={3} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder={t('inputForm.advanced.costCenters.placeholder')}></textarea> <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('inputForm.advanced.costCenters.help')}</p> </div> </div> </div> </div> </div>)}
          <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700 gap-4">
             <button type="button" onClick={onViewHistory} className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg shadow-sm hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isAuthenticated} title={!isAuthenticated ? t('inputForm.buttons.historyDisabledTooltip') : undefined}> <HistoryIcon className="w-5 h-5" /> <span>{t('inputForm.buttons.history')}</span> </button>
            <button id="generate-analysis-button" type="submit" className="px-8 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition-transform transform hover:scale-105">
              {t('inputForm.buttons.analyze')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputForm;