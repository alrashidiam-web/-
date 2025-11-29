import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, SparklesIcon } from './icons';

const About: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="animate-fade-in bg-white dark:bg-slate-900 min-h-screen">
             <div className="relative py-20 bg-slate-900 dark:bg-black overflow-hidden border-b border-slate-800">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500 via-slate-900 to-black"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-sky-400 text-xs font-semibold mb-6 border border-slate-700">
                        <SparklesIcon className="w-4 h-4" />
                        <span>{t('about.badge')}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">{t('about.hero.title')}</h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">{t('about.hero.subtitle')}</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-l-4 border-sky-500 px-4">{t('about.mission.title')}</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                            {t('about.mission.desc')}
                        </p>
                        <div className="space-y-4">
                            {['expertAI', 'dataDriven', 'secure'].map((item) => (
                                <div key={item} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <CheckCircleIcon className="w-6 h-6 text-sky-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t(`about.mission.points.${item}.title`)}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t(`about.mission.points.${item}.desc`)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl opacity-20 blur-lg"></div>
                        <div className="relative bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl">
                             <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6">
                                <SparklesIcon className="w-6 h-6" />
                             </div>
                             <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('about.story.title')}</h3>
                             <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                {t('about.story.desc')}
                             </p>
                             <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-700">
                                <div className="text-center">
                                    <span className="block text-3xl font-bold text-slate-900 dark:text-white">10k+</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t('about.stats.reports')}</span>
                                </div>
                                <div className="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
                                <div className="text-center">
                                    <span className="block text-3xl font-bold text-slate-900 dark:text-white">99%</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t('about.stats.satisfaction')}</span>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default About;