import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: 'en' | 'ar') => {
    i18n.changeLanguage(lng);
  };
  
  const currentLanguage = i18n.language.startsWith('ar') ? 'ar' : 'en';

  return (
    <div className="flex items-center space-x-2 rounded-full bg-slate-200 dark:bg-slate-700 p-1 self-start">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
          currentLanguage === 'en'
            ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-600/50'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('ar')}
        className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
          currentLanguage === 'ar'
            ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-600/50'
        }`}
      >
        AR
      </button>
    </div>
  );
};

export default LanguageSwitcher;