
import React, { useState, useEffect, useCallback, type ErrorInfo, type ReactNode } from 'react';
import type { BusinessData, SavedReport, User, UserProfile, AppSettings } from './types';
import { generateAnalysis } from './services/geminiService';
import { supabase, getReports, createReport, deleteReport as removeReport, signOut, getUserProfile, getAppSettings } from './services/supabaseService';
import InputForm from './components/InputForm';
import AnalysisDisplay from './components/AnalysisDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Tour from './components/Tour';
import SavedReports from './components/SavedReports';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import Pricing from './components/Pricing';
import About from './components/About';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Legal from './components/Legal';
import Blog from './components/Blog';
import AdminDashboard from './components/AdminDashboard';
import { LogoIcon, LinkedInIcon, TwitterIcon, InstagramIcon, YouTubeIcon, WrenchScrewdriverIcon } from './components/icons';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';

type View = 'landing' | 'form' | 'loading' | 'analysis' | 'history' | 'error' | 'pricing' | 'about' | 'contact' | 'faq' | 'privacy' | 'terms' | 'blog' | 'admin';

// Error Boundary Component
interface ErrorBoundaryProps {
  children?: ReactNode;
  onReset: () => void;
  t: (key: string) => string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.props.onReset();
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const { t } = this.props;
      return (
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-4">{t('app.errorBoundary.title')}</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            {t('app.errorBoundary.message')}
          </p>
          <button
            onClick={this.handleReset}
            className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition-colors"
          >
            {t('app.errorBoundary.reset')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [currentBusinessData, setCurrentBusinessData] = useState<BusinessData | null>(null);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [currentView, setCurrentView] = useState<View>('landing');
  const [error, setError] = useState<string | null>(null);
  const [showTour, setShowTour] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isReportsLoading, setIsReportsLoading] = useState(false);
  const [appSettings, setAppSettings] = useState<AppSettings>({});

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingView, setPendingView] = useState<View | null>(null);

  // --- SEO Logic ---
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);

    // Dynamic Title & Meta Description based on View
    const getSeoData = () => {
        switch (currentView) {
            case 'landing': return { title: t('seo.landing.title'), desc: t('seo.landing.desc') };
            case 'pricing': return { title: t('seo.pricing.title'), desc: t('seo.pricing.desc') };
            case 'about': return { title: t('seo.about.title'), desc: t('seo.about.desc') };
            case 'contact': return { title: t('seo.contact.title'), desc: t('seo.contact.desc') };
            case 'faq': return { title: t('seo.faq.title'), desc: t('seo.faq.desc') };
            case 'blog': return { title: t('seo.blog.title'), desc: t('seo.blog.desc') };
            case 'form': return { title: t('seo.form.title'), desc: t('seo.form.desc') };
            case 'analysis': return { title: t('seo.analysis.title'), desc: t('seo.analysis.desc') };
            case 'history': return { title: t('savedReports.title'), desc: t('seo.form.desc') };
            case 'admin': return { title: t('admin.title'), desc: 'Admin Dashboard' };
            default: return { title: t('app.title'), desc: t('app.subtitle') };
        }
    };

    const seo = getSeoData();
    document.title = `${seo.title} | ${t('app.title')}`;
    
    // Update Description Meta
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', seo.desc);
    } else {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = seo.desc;
        document.head.appendChild(meta);
    }

    // Update Canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    const baseUrl = "https://strategic-advisor-gpt.com";
    const path = currentView === 'landing' ? '' : `/${currentView}`;
    if (canonicalLink) {
        canonicalLink.setAttribute('href', `${baseUrl}${path}`);
    }

  }, [i18n.language, i18n, t, currentView]);


  // Initialize App Data (Settings & Auth)
  useEffect(() => {
    // Fetch Global Settings
    getAppSettings().then(setAppSettings);

    if (!supabase) return;

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user as unknown as User || null;
      setCurrentUser(user);
      if (user) fetchProfile(user.id);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user as unknown as User || null;
      setCurrentUser(user);
      
      if (user) {
          loadReports();
          fetchProfile(user.id);
          setIsAuthModalOpen(false);
          if (pendingView) {
              setCurrentView(pendingView);
              setPendingView(null);
          }
      } else {
          setSavedReports([]);
          setUserProfile(null);
          // If in admin view and logged out, redirect
          if (currentView === 'admin') setCurrentView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, [pendingView, currentView]); 

  const loadReports = async () => {
      setIsReportsLoading(true);
      try {
          const reports = await getReports();
          setSavedReports(reports);
      } catch (err) {
          console.error("Failed to load reports:", err);
      } finally {
          setIsReportsLoading(false);
      }
  };

  const fetchProfile = async (userId: string) => {
    const profile = await getUserProfile(userId);
    // Temp: If no profile in DB, create mock one for UI logic
    if (!profile) {
        // Mocking admin based on email for demo purposes if DB profile missing
        // In real app, this comes strictly from DB RLS
        const isAdmin = currentUser?.email?.includes('admin'); 
        setUserProfile({ id: userId, email: currentUser?.email || '', subscription_tier: 'free', subscription_status: 'active', is_admin: isAdmin });
    } else {
        setUserProfile(profile);
    }
  };

  // Trigger tour logic
  useEffect(() => {
      if (currentView === 'form') {
        const tourCompleted = localStorage.getItem('enterpriseArchitectTourCompleted');
        if (!tourCompleted) {
            setTimeout(() => setShowTour(true), 500);
        }
      }
      window.scrollTo(0, 0);
  }, [currentView]);

  const handleTourComplete = () => {
    localStorage.setItem('enterpriseArchitectTourCompleted', 'true');
    setShowTour(false);
  };

  const handleAnalysisRequest = useCallback(async (data: BusinessData) => {
    setCurrentView('loading');
    setError(null);
    setAnalysisResult(null);
    setCurrentBusinessData(data);
    setCurrentReportId(null);

    try {
      const result = await generateAnalysis(data, i18n.language);
      setAnalysisResult(result);
      
      if (currentUser) {
        const newReportData = {
          organizationName: data.organization_name,
          analysis: result,
          businessData: data,
        };

        const savedReport = await createReport(newReportData);
        setSavedReports(prevReports => [savedReport, ...prevReports]);
        setCurrentReportId(savedReport.id);
      }

      setCurrentView('analysis');
    } catch (err) {
      console.error("Analysis generation failed:", err);
      let errorMessage = t('app.errorModal.unknownError');
      if (err instanceof Error) errorMessage = t('app.errorModal.geminiError'); // Simplified error mapping for brevity
      setError(errorMessage);
      setCurrentView('error');
    }
  }, [i18n.language, t, currentUser]);

  const handleStartNew = () => {
    setAnalysisResult(null);
    setCurrentBusinessData(null);
    setCurrentReportId(null);
    setError(null);
    if (currentUser) {
        setCurrentView('form');
    } else {
        setPendingView('form');
        setIsAuthModalOpen(true);
    }
  };
  
  const handleLogout = async () => {
    await signOut();
    setCurrentView('landing');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'landing': return <LandingPage onStart={handleStartNew} />;
      case 'pricing': return <Pricing userProfile={userProfile} onLoginRequest={() => setIsAuthModalOpen(true)} onRefreshProfile={() => currentUser && fetchProfile(currentUser.id)} />;
      case 'about': return <About />;
      case 'blog': return <Blog />;
      case 'contact': return <Contact />;
      case 'faq': return <FAQ />;
      case 'privacy': return <Legal type="privacy" />;
      case 'terms': return <Legal type="terms" />;
      case 'admin': return <AdminDashboard onSettingsUpdate={setAppSettings} />;
      case 'loading': return <div className="max-w-4xl mx-auto p-6"><LoadingSpinner /></div>;
      case 'error': return (
          <div className="max-w-4xl mx-auto p-6 text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-500 mb-4">{t('app.errorModal.title')}</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
            <button onClick={() => setCurrentView('form')} className="px-6 py-2 bg-sky-600 text-white rounded-lg">{t('app.errorBoundary.reset')}</button>
          </div>
        );
      case 'analysis':
        if (analysisResult && currentBusinessData) {
          return <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><AnalysisDisplay analysis={analysisResult} businessData={currentBusinessData} reportId={currentReportId} onStartNew={handleStartNew} /></div>;
        }
        setCurrentView('form');
        return null;
      case 'history': return <div className="max-w-4xl mx-auto p-4 sm:p-6"><SavedReports reports={savedReports} isLoading={isReportsLoading} onViewReport={(report) => { setAnalysisResult(report.analysis); setCurrentBusinessData(report.businessData); setCurrentReportId(report.id); setCurrentView('analysis'); }} onDeleteReport={async (id) => { if(confirm("Delete?")) { await removeReport(id); setSavedReports(p => p.filter(r => r.id !== id)); } }} onGoToForm={() => setCurrentView('form')} /></div>;
      case 'form': default: return <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"><InputForm onAnalyze={handleAnalysisRequest} onViewHistory={() => setCurrentView('history')} hasHistory={!!currentUser && savedReports.length > 0} isAuthenticated={!!currentUser} /></div>;
    }
  };
  
  const isLanding = currentView === 'landing';
  const navLinkClass = (view: View) => `cursor-pointer hover:text-sky-500 transition-colors ${currentView === view ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`;

  // Helper to get social link or default
  const getSocialLink = (key: keyof AppSettings) => appSettings[key] || '#';

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
       {showTour && currentView === 'form' && <Tour onComplete={handleTourComplete} />}
       
       <header className={`w-full ${isLanding ? 'fixed top-0 left-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800' : 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm'} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 sm:h-20">
                <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => setCurrentView('landing')}>
                     <LogoIcon className="w-8 h-8 sm:w-10 sm:h-10 text-sky-600 dark:text-sky-500" />
                     <h1 className="ms-3 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white hidden sm:block tracking-tight">
                        {t('app.title')} <span className="text-sky-600 dark:text-sky-500">{t('app.gbt')}</span>
                    </h1>
                </div>
                
                <div className="flex items-center gap-3 sm:gap-6">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <button onClick={() => setCurrentView('pricing')} className={navLinkClass('pricing')}>{t('app.pricing')}</button>
                        <button onClick={() => setCurrentView('blog')} className={navLinkClass('blog')}>{t('app.blog')}</button>
                        <button onClick={() => setCurrentView('about')} className={navLinkClass('about')}>{t('app.about')}</button>
                        {userProfile?.is_admin && (
                             <button onClick={() => setCurrentView('admin')} className={`${navLinkClass('admin')} flex items-center gap-1 text-sky-600`}>
                                 <WrenchScrewdriverIcon className="w-4 h-4" /> {t('admin.menuLink')}
                             </button>
                        )}
                    </div>
                    
                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block"></div>
                    <LanguageSwitcher />
                    <Auth user={currentUser} onLogout={handleLogout} isOpen={isAuthModalOpen} onOpen={() => setIsAuthModalOpen(true)} onClose={() => setIsAuthModalOpen(false)} />
                </div>
            </div>
        </div>
      </header>
      
      <main className={`flex-grow ${isLanding || ['about', 'contact', 'faq', 'privacy', 'terms', 'blog', 'admin'].includes(currentView) ? '' : 'pt-4'}`}>
        <ErrorBoundary onReset={() => window.location.reload()} t={t}>
          {renderContent()}
        </ErrorBoundary>
      </main>
      
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 text-sm mt-auto">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div className="col-span-2 md:col-span-1">
                     <div className="flex items-center gap-2 mb-4">
                        <LogoIcon className="w-6 h-6 text-sky-600" />
                        <span className="font-bold text-slate-900 dark:text-white">{t('app.title')}</span>
                     </div>
                     <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{t('app.footerDesc')}</p>
                     
                     {/* Dynamic Social Media Icons */}
                     <div className="flex gap-4">
                        {appSettings.linkedin_url && <a href={appSettings.linkedin_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors"><LinkedInIcon className="w-5 h-5" /></a>}
                        {appSettings.twitter_url && <a href={appSettings.twitter_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-sky-500 transition-colors"><TwitterIcon className="w-5 h-5" /></a>}
                        {appSettings.instagram_url && <a href={appSettings.instagram_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors"><InstagramIcon className="w-5 h-5" /></a>}
                        {appSettings.youtube_url && <a href={appSettings.youtube_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-red-600 transition-colors"><YouTubeIcon className="w-5 h-5" /></a>}
                     </div>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">{t('footer.product')}</h3>
                    <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                        <li><button onClick={handleStartNew} className="hover:text-sky-500">{t('app.startNewAnalysis')}</button></li>
                        <li><button onClick={() => setCurrentView('pricing')} className="hover:text-sky-500">{t('app.pricing')}</button></li>
                        <li><button onClick={() => setCurrentView('blog')} className="hover:text-sky-500">{t('app.blog')}</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">{t('footer.company')}</h3>
                    <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                        <li><button onClick={() => setCurrentView('about')} className="hover:text-sky-500">{t('app.about')}</button></li>
                        <li><button onClick={() => setCurrentView('contact')} className="hover:text-sky-500">{t('app.contact')}</button></li>
                        <li><button onClick={() => setCurrentView('faq')} className="hover:text-sky-500">{t('app.faq')}</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">{t('footer.legal')}</h3>
                    <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                        <li><button onClick={() => setCurrentView('privacy')} className="hover:text-sky-500">{t('app.privacy')}</button></li>
                        <li><button onClick={() => setCurrentView('terms')} className="hover:text-sky-500">{t('app.terms')}</button></li>
                    </ul>
                </div>
            </div>
            
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-slate-400 dark:text-slate-500">
                <p>{t('app.footer')}</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
