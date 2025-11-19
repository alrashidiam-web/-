import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type TourStepContent = {
  title: string;
  content: string;
};

type TourStepConfig = {
  selector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
};

const tourStepConfigs: TourStepConfig[] = [
  { position: 'center' },
  { selector: '#organization_name', position: 'bottom' },
  { selector: '#sector', position: 'bottom' },
  { selector: '#operational_processes_overview', position: 'top' },
  { selector: '#generate-analysis-button', position: 'left' },
  { position: 'center' },
];

interface TourProps {
  onComplete: () => void;
}

const Tour: React.FC<TourProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const tourSteps = t('tour.steps', { returnObjects: true }) as TourStepContent[];
  const currentStepConfig = useMemo(() => tourStepConfigs[stepIndex], [stepIndex]);
  const currentStepContent = useMemo(() => tourSteps[stepIndex], [tourSteps, stepIndex]);

  useEffect(() => {
    if (currentStepConfig.selector) {
      const element = document.querySelector(currentStepConfig.selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setTargetRect(null); // For centered steps
    }
  }, [currentStepConfig]);

  const handleNext = () => {
    if (stepIndex < tourSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };
  
  const highlightStyle: React.CSSProperties = targetRect ? {
    position: 'fixed',
    top: `${targetRect.top - 5}px`,
    left: `${targetRect.left - 5}px`,
    width: `${targetRect.width + 10}px`,
    height: `${targetRect.height + 10}px`,
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
    borderRadius: '8px',
    zIndex: 9999,
    pointerEvents: 'none',
    transition: 'all 0.3s ease-in-out',
  } : {};

  const tooltipPositionStyle = (): React.CSSProperties => {
    if (!targetRect) { // Center position for steps without a selector
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
    
    switch (currentStepConfig.position) {
        case 'top': return { top: `${targetRect.top - 10}px`, left: `${targetRect.left + targetRect.width / 2}px`, transform: 'translate(-50%, -100%)' };
        case 'bottom': return { top: `${targetRect.bottom + 10}px`, left: `${targetRect.left + targetRect.width / 2}px`, transform: 'translate(-50%, 0)' };
        case 'left': return { top: `${targetRect.top + targetRect.height / 2}px`, left: `${targetRect.left - 10}px`, transform: 'translate(-100%, -50%)' };
        case 'right': return { top: `${targetRect.top + targetRect.height / 2}px`, left: `${targetRect.right + 10}px`, transform: 'translate(0, -50%)' };
        default: return { top: `${targetRect.bottom + 10}px`, left: `${targetRect.left + targetRect.width / 2}px`, transform: 'translate(-50%, 0)' };
    }
  };

  if (!currentStepContent) return null;

  return (
    <div className="fixed inset-0 z-[9998]">
      {targetRect && <div style={highlightStyle}></div>}
      {currentStepConfig.position === 'center' && <div className="fixed inset-0 bg-black/70"></div>}

      <div style={tooltipPositionStyle()} className="fixed z-[10000] bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-80 animate-fade-in">
        <h3 className="text-xl font-bold text-sky-500 mb-2">{currentStepContent.title}</h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">{currentStepContent.content}</p>
        <div className="flex justify-between items-center">
          <button onClick={onComplete} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">{t('tour.skip')}</button>
          <div className="flex gap-2">
            {stepIndex > 0 && (<button onClick={handlePrev} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">{t('tour.prev')}</button>)}
            <button onClick={handleNext} className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">
              {stepIndex === tourSteps.length - 1 ? t('tour.finish') : t('tour.next')}
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-4">
            {tourSteps.map((_, index) => (<div key={index} className={`w-2 h-2 rounded-full mx-1 ${index === stepIndex ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>))}
        </div>
      </div>
    </div>
  );
};

export default Tour;
