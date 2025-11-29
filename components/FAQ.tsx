
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, InfoIcon } from './icons';
import { getFAQs } from '../services/supabaseService';
import type { FAQItem } from '../types';

const FAQ: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [faqs, setFaqs] = useState<{q: string, a: string}[]>([]);
    const [loading, setLoading] = useState(true);

    const toggle = (index: number) => setOpenIndex(openIndex === index ? null : index);
    const isAr = i18n.language.startsWith('ar');

    useEffect(() => {
        const loadFaqs = async () => {
            try {
                const dbFaqs = await getFAQs();
                if (dbFaqs && dbFaqs.length > 0) {
                    // Map DB FAQItem to UI structure based on language
                    setFaqs(dbFaqs.map(item => ({
                        q: isAr ? item.question_ar : item.question_en,
                        a: isAr ? item.answer_ar : item.answer_en
                    })));
                } else {
                    // Fallback to i18n
                    setFaqs(t('faq.items', { returnObjects: true }) as Array<{ q: string, a: string }>);
                }
            } catch (e) {
                setFaqs(t('faq.items', { returnObjects: true }) as Array<{ q: string, a: string }>);
            } finally {
                setLoading(false);
            }
        };
        loadFaqs();
    }, [i18n.language, t]);

    if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="animate-fade-in bg-slate-50 dark:bg-slate-900 min-h-screen py-16">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="text-center mb-12">
                     <div className="inline-block p-3 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full mb-4">
                        <InfoIcon className="w-6 h-6" />
                     </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{t('faq.title')}</h1>
                    <p className="text-slate-600 dark:text-slate-400">{t('faq.subtitle')}</p>
                </div>
                
                <div className="space-y-4">
                    {faqs.map((item, index) => (
                        <div 
                            key={index} 
                            className={`bg-white dark:bg-slate-800 rounded-xl border transition-all duration-300 overflow-hidden ${openIndex === index ? 'border-sky-500 shadow-md ring-1 ring-sky-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-slate-600'}`}
                        >
                            <button 
                                onClick={() => toggle(index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className="font-bold text-lg text-slate-800 dark:text-white pr-4">{item.q}</span>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-sky-100 dark:bg-sky-900/30 text-sky-600' : 'text-slate-500'}`}>
                                    <ChevronDownIcon className="w-5 h-5" />
                                </div>
                            </button>
                            <div 
                                className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-6 pb-6 pt-0 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-dashed border-slate-100 dark:border-slate-700 mt-2 pt-4">
                                    {item.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-12 text-center bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="font-bold text-slate-900 dark:text-white mb-2">{t('faq.moreQuestions')}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('faq.contactSupport')}</p>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">
                        {t('contact.title')} &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
};
export default FAQ;
