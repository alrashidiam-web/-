import React, { useState, useEffect, useCallback } from 'react';
import type { BusinessData, SavedReport, BubbleUser } from './types';
import { generateAnalysis } from './services/geminiService';
import { getReports as fetchReports, createReport, deleteReport as removeReport } from './services/bubbleService';
import InputForm from './components/InputForm';
import AnalysisDisplay from './components/AnalysisDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Tour from './components/Tour';
import SavedReports from './components/SavedReports';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import { LogoIcon } from './components/icons';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';

type View = 'landing' | 'form' | 'loading' | 'analysis' | 'history' | 'error';

// Mock Bubble user for demonstration purposes if not running inside Bubble
// In a real Bubble environment, window.bubble_user would be populated
if (typeof (window as any).bubble_user === 'undefined') {
  (window as any).bubble_user = {
    is_logged_in: false,
    _id: '',
    email: '',
  };
}

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.props.onReset();
    this.setState({ hasError: false });
  };

  render() {
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
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  // Initial view is now 'landing' to act as a website homepage
  const [currentView, setCurrentView] = useState<View>('landing');
  const [error, setError] = useState<string | null>(null);
  const [showTour, setShowTour] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<BubbleUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReportsLoading, setIsReportsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);
    document.title = `${t('app.title')} ${t('app.gbt')}`;
  }, [i18n.language, i18n, t]);

  useEffect(() => {
    // Check for Bubble user session and fetch reports
    const bubbleUser = (window as any).bubble_user as BubbleUser;
    if (bubbleUser && bubbleUser.is_logged_in) {
      setIsAuthenticated(true);
      setCurrentUser(bubbleUser);
      setIsReportsLoading(true);
      fetchReports()
        .then(reports => {
          setSavedReports(reports);
        })
        .catch(err => {
          console.error("Failed to load saved reports from Bubble:", err);
          setError(t('app.errorModal.bubble.loadError'));
        })
        .finally(() => {
          setIsReportsLoading(false);
        });
    } else {
      setIsReportsLoading(false);
      setSavedReports([]);
    }

    // Check if the tour has been completed
    const tourCompleted = localStorage.getItem('enterpriseArchitectTourCompleted');
    if (!tourCompleted) {
       // Only show tour once the user enters the form view
       // Check inside the render logic or useEffect dependency on currentView
    }
  }, []); // Empty dependency array to run once

  // Trigger tour only when entering form view
  useEffect(() => {
      if (currentView === 'form') {
        const tourCompleted = localStorage.getItem('enterpriseArchitectTourCompleted');
        if (!tourCompleted) {
            setTimeout(() => setShowTour(true), 500);
        }
      }
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

    try {
      const result = await generateAnalysis(data, i18n.language);
      setAnalysisResult(result);
      
      if (isAuthenticated) {
        const newReportData = {
          organizationName: data.organization_name,
          analysis: result,
          businessData: data,
        };

        const savedReport = await createReport(newReportData);
        setSavedReports(prevReports => [savedReport, ...prevReports]);
      } else {
         console.warn("User not authenticated. Report not saved to Bubble.");
      }

      setCurrentView('analysis');
    } catch (err) {
      console.error("Analysis generation or saving failed:", err);
      let errorMessage = t('app.errorModal.unknownError');
      
      if (err instanceof Error) {
        if (err.message.includes('JSON')) {
          errorMessage = t('app.errorModal.jsonError');
        } else if (err.message.toLowerCase().includes('fetch') || err.message.toLowerCase().includes('network')) {
           errorMessage = t('app.errorModal.networkError');
        } else if (err.message.includes('Bubble')) {
            errorMessage = t('app.errorModal.bubble.saveError');
        } else {
            errorMessage = t('app.errorModal.geminiError');
        }
      }
      
      setError(errorMessage);
      setCurrentView('error');
    }
  }, [i18n.language, t, isAuthenticated]);

  const handleStartNew = () => {
    setAnalysisResult(null);
    setCurrentBusinessData(null);
    setError(null);
    setCurrentView('form');
  };
  
  const handleGoHome = () => {
      setCurrentView('landing');
  }
  
  const handleViewHistory = () => {
    setCurrentView('history');
  }

  const handleViewReport = (report: SavedReport) => {
    setAnalysisResult(report.analysis);
    setCurrentBusinessData(report.businessData);
    setCurrentView('analysis');
  }

  const handleDeleteReport = async (reportId: string) => {
    try {
      await removeReport(reportId);
      setSavedReports(prevReports => prevReports.filter(r => r.id !== reportId));
    } catch(err) {
       console.error("Failed to delete report from Bubble:", err);
       alert(t('app.errorModal.bubble.deleteError'));
    }
  }
  
  const handleLogin = () => {
    // In a real app, this would redirect to Bubble's login page
    alert(t('auth.loginRedirect'));
  };

  const handleLogout = () => {
    // In a real app, this would redirect to Bubble's logout flow
     alert(t('auth.logoutRedirect'));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onStart={handleStartNew} />;
      case 'loading':
        return (
            <div className="max-w-4xl mx-auto p-6">
                <LoadingSpinner />
            </div>
        );
      case 'error':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-500 mb-4">{t('app.errorModal.title')}</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
            <button
              onClick={handleStartNew}
              className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition-colors"
            >
              {t('app.errorBoundary.reset')}
            </button>
          </div>
        );
      case 'analysis':
        if (analysisResult && currentBusinessData) {
          return (
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <AnalysisDisplay analysis={analysisResult} businessData={currentBusinessData} onStartNew={handleStartNew} />
            </div>
          );
        }
        setCurrentView('form');
        return null;
      case 'history':
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <SavedReports reports={savedReports} isLoading={isReportsLoading} onViewReport={handleViewReport} onDeleteReport={handleDeleteReport} onGoToForm={handleStartNew} />
            </div>
        );
      case 'form':
      default:
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <InputForm onAnalyze={handleAnalysisRequest} onViewHistory={handleViewHistory} hasHistory={isAuthenticated && savedReports.length > 0} isAuthenticated={isAuthenticated} />
            </div>
        );
    }
  };
  
  const shouldShowTour = showTour && currentView === 'form';
  const isLanding = currentView === 'landing';

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 flex flex-col">
       {shouldShowTour && <Tour onComplete={handleTourComplete} />}
       
       <header className={`w-full ${isLanding ? 'fixed top-0 left-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800' : 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800'} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 sm:h-20">
                {/* Left: Logo */}
                <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={handleGoHome}>
                     <LogoIcon className="w-8 h-8 sm:w-10 sm:h-10 text-sky-500" />
                     <h1 className="ml-3 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white hidden sm:block">
                        {t('app.title')} <span className="text-sky-500">{t('app.gbt')}</span>
                    </h1>
                </div>
                
                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
                    <Auth user={currentUser} onLogin={handleLogin} onLogout={handleLogout} />
                </div>
            </div>
        </div>
      </header>
      
      <main className={`flex-grow ${isLanding ? '' : 'pt-8'}`}>
        <ErrorBoundary onReset={handleStartNew} t={t}>
          {renderContent()}
        </ErrorBoundary>
      </main>
      
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4">
            <p>{t('app.footer')}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;