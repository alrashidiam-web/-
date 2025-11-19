import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { simpleTextToHtml } from './AnalysisDisplay';
import { XMarkIcon, DocumentDuplicateIcon, CheckIcon } from './icons';

interface ManualDisplayModalProps {
  show: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

const ManualDisplayModal: React.FC<ManualDisplayModalProps> = ({ show, title, content, onClose }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!show) {
    return null;
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formattedContent = simpleTextToHtml(content);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-xl shadow-2xl flex flex-col mx-4 animate-fade-in-up">
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 rounded-t-xl z-10">
          <h2 id="modal-title" className="text-xl font-bold text-slate-800 dark:text-white">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <button
                onClick={handleCopyToClipboard}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg shadow-sm hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                >
                {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <DocumentDuplicateIcon className="w-5 h-5" />}
                <span>{copied ? t('analysisDisplay.copyButton.copied') : t('analysisDisplay.copyButton.copy')}</span>
            </button>
            <button
                onClick={onClose}
                aria-label={t('manualDisplayModal.close')}
                className="p-2 text-slate-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200"
                >
                <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="p-6 overflow-y-auto">
          <div
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        </main>
      </div>
    </div>
  );
};

export default ManualDisplayModal;
