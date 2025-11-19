import React from 'react';
import type { SavedReport } from '../types';
import { HistoryIcon, TrashIcon, EyeIcon } from './icons';
import { useTranslation } from 'react-i18next';

interface SavedReportsProps {
  reports: SavedReport[];
  isLoading: boolean;
  onViewReport: (report: SavedReport) => void;
  onDeleteReport: (reportId: string) => void;
  onGoToForm: () => void;
}

const SavedReports: React.FC<SavedReportsProps> = ({ reports, isLoading, onViewReport, onDeleteReport, onGoToForm }) => {
  const { t, i18n } = useTranslation();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-500 dark:text-slate-400">{t('savedReports.loading')}</p>
        </div>
      );
    }

    if (reports.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400 text-lg">{t('savedReports.noReports')}</p>
          <p className="text-slate-400 dark:text-slate-500 mt-2">{t('savedReports.noReportsHint')}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
          >
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{report.organizationName}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {new Date(report.date).toLocaleString(i18n.language, { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onViewReport(report)}
                title={t('savedReports.viewTooltip')}
                className="p-2 text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
              >
                <EyeIcon className="w-6 h-6" />
              </button>
              <button
                onClick={() => onDeleteReport(report.id)}
                title={t('savedReports.deleteTooltip')}
                className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <HistoryIcon className="w-8 h-8 text-sky-500" />
          {t('savedReports.title')}
        </h2>
        <button
          onClick={onGoToForm}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg shadow-sm hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition-colors"
        >
          {t('app.startNewAnalysis')}
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default SavedReports;
