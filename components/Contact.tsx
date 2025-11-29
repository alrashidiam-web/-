import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckIcon, BuildingOffice2Icon } from './icons';

const Contact: React.FC = () => {
    const { t } = useTranslation();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send data to an API
        setTimeout(() => setSubmitted(true), 500);
    };

    return (
        <div className="animate-fade-in bg-slate-50 dark:bg-slate-900 min-h-screen py-16">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{t('contact.title')}</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                     <div className="md:col-span-1 space-y-6">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-sky-500 transition-colors">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t('contact.email')}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('contact.emailDesc')}</p>
                            <a href="mailto:support@strategic-advisor.ai" className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">support@strategic-advisor.ai</a>
                        </div>
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-sky-500 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <BuildingOffice2Icon className="w-5 h-5 text-slate-400" />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('contact.office')}</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('contact.address')}</p>
                        </div>
                     </div>

                     <div className="md:col-span-2">
                        {submitted ? (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in-up">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 dark:text-green-400 mb-6">
                                    <CheckIcon className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t('contact.success.title')}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-8">{t('contact.success.msg')}</p>
                                <button 
                                    onClick={() => setSubmitted(false)} 
                                    className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    {t('contact.success.reset')}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 p-8 md:p-10 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('contact.form.name')}</label>
                                        <input type="text" required className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all" placeholder={t('contact.form.namePlaceholder')} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('contact.form.email')}</label>
                                        <input type="email" required className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all" placeholder={t('contact.form.emailPlaceholder')} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('contact.form.subject')}</label>
                                    <select className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all">
                                        <option>{t('contact.form.subjects.general')}</option>
                                        <option>{t('contact.form.subjects.support')}</option>
                                        <option>{t('contact.form.subjects.sales')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('contact.form.message')}</label>
                                    <textarea rows={5} required className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all resize-none" placeholder={t('contact.form.messagePlaceholder')}></textarea>
                                </div>
                                <button type="submit" className="w-full py-4 bg-sky-600 text-white font-bold text-lg rounded-xl hover:bg-sky-700 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                    {t('contact.form.submit')}
                                </button>
                            </form>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};
export default Contact;