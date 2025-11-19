import React from 'react';
import { useTranslation } from 'react-i18next';
import { FutureIcon, DocumentIcon, SparklesIcon, ChartBarIcon, CheckIcon, BanknotesIcon, ClipboardDocumentListIcon } from './icons';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    return (
        <div className="animate-fade-in flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 dark:opacity-5 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-sky-500 blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 rounded-full bg-purple-500 blur-3xl"></div>
                </div>
                
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 text-sm font-semibold mb-8 animate-bounce-slow">
                        <SparklesIcon className="w-4 h-4" />
                        <span>{t('landing.features.ai.title')}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
                        {t('landing.hero.title')}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                        {t('landing.hero.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button 
                            onClick={onStart}
                            className="px-8 py-4 bg-sky-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-sky-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ring-4 ring-sky-500/20"
                        >
                            {t('landing.hero.cta')}
                        </button>
                        <button 
                            className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-lg font-bold rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            {t('landing.hero.secondaryCta')}
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            {t('landing.features.title')}
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                                <FutureIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('landing.features.speed.title')}</h3>
                            <p className="text-slate-600 dark:text-slate-400">{t('landing.features.speed.desc')}</p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                                <SparklesIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('landing.features.ai.title')}</h3>
                            <p className="text-slate-600 dark:text-slate-400">{t('landing.features.ai.desc')}</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                                <ClipboardDocumentListIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('landing.features.docs.title')}</h3>
                            <p className="text-slate-600 dark:text-slate-400">{t('landing.features.docs.desc')}</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-6 text-orange-600 dark:text-orange-400">
                                <DocumentIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('landing.features.export.title')}</h3>
                            <p className="text-slate-600 dark:text-slate-400">{t('landing.features.export.desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-24 bg-slate-50 dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
                 <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            {t('landing.howItWorks.title')}
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Connector Line (Hidden on Mobile) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                             {/* Step 1 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 bg-white dark:bg-slate-900 border-4 border-sky-500 rounded-full flex items-center justify-center text-2xl font-bold text-slate-900 dark:text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    1
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('landing.howItWorks.step1')}</h3>
                                <p className="text-slate-600 dark:text-slate-400 max-w-xs">{t('landing.howItWorks.step1Desc')}</p>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 bg-white dark:bg-slate-900 border-4 border-sky-500 rounded-full flex items-center justify-center text-2xl font-bold text-slate-900 dark:text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    2
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('landing.howItWorks.step2')}</h3>
                                <p className="text-slate-600 dark:text-slate-400 max-w-xs">{t('landing.howItWorks.step2Desc')}</p>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 bg-white dark:bg-slate-900 border-4 border-sky-500 rounded-full flex items-center justify-center text-2xl font-bold text-slate-900 dark:text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    3
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('landing.howItWorks.step3')}</h3>
                                <p className="text-slate-600 dark:text-slate-400 max-w-xs">{t('landing.howItWorks.step3Desc')}</p>
                            </div>
                        </div>
                    </div>
                 </div>
            </section>
            
            {/* CTA Footer */}
            <section className="py-20 bg-slate-900 dark:bg-black text-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 max-w-2xl mx-auto">Ready to optimize your organization?</h2>
                    <button 
                        onClick={onStart}
                        className="px-10 py-4 bg-sky-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-sky-500 hover:shadow-sky-500/30 transform hover:-translate-y-1 transition-all duration-200"
                    >
                        {t('landing.hero.cta')}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;