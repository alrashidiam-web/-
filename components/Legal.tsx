import React from 'react';
import { useTranslation } from 'react-i18next';

interface LegalProps {
    type: 'privacy' | 'terms';
}

const Legal: React.FC<LegalProps> = ({ type }) => {
    const { t } = useTranslation();
    
    // Simulate current date for last updated
    const lastUpdated = new Date().toLocaleDateString();

    return (
        <div className="animate-fade-in bg-white dark:bg-slate-900 min-h-screen py-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-700">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t(`legal.${type}.title`)}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {t('legal.lastUpdated')}: {lastUpdated}
                    </p>
                </div>
                
                <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
                     <div dangerouslySetInnerHTML={{ __html: t(`legal.${type}.content`) }} />
                </div>
            </div>
        </div>
    );
};
export default Legal;