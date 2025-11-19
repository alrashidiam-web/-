
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadIcon, DocumentDuplicateIcon, CheckIcon, BanknotesIcon, ClipboardDocumentListIcon, BriefcaseIcon, PdfIcon } from './icons';
import type { BusinessData, ManualType } from '../types';
import { generateManual } from '../services/geminiService';
import ManualDisplayModal from './ManualDisplayModal';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalysisDisplayProps {
  analysis: string;
  businessData: BusinessData;
  onStartNew: () => void;
}

// Simple text to HTML converter to render the structured report
export const simpleTextToHtml = (text: string): string => {
    if (!text) return '';

    let html = text;

    // Preserve newlines in code blocks or preformatted text
    html = html.replace(/```([\s\S]*?)```/g, (match, content) => {
        return `<pre class="bg-slate-100 dark:bg-slate-900 p-4 rounded-md overflow-x-auto text-sm whitespace-pre-wrap">${content.trim()}</pre>`;
    });

    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = '';
    let processedLines: string[] = [];
    let headers: string[] = [];

    // Process tables line by line
    for (const line of lines) {
        if (line.includes('<pre>')) { // Skip table processing for preformatted text
            processedLines.push(line);
            continue;
        }

        const cells = line.split(/\s{2,}|	/);
        const isLikelyTableRow = cells.length > 1 && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*') && line.trim() !== '' && !line.includes('---');
        
        if (isLikelyTableRow) {
            if (!inTable) {
                inTable = true;
                headers = cells;
                tableHtml = '<div class="overflow-x-auto my-4"><table class="w-full text-left border-collapse border border-slate-300 dark:border-slate-600">';
                tableHtml += '<thead><tr class="bg-slate-100 dark:bg-slate-800">';
                headers.forEach(cell => {
                    tableHtml += `<th class="border border-slate-300 dark:border-slate-600 px-4 py-2 font-semibold">${cell.trim()}</th>`;
                });
                tableHtml += '</tr></thead><tbody>';
            } else {
                tableHtml += '<tr class="border-b border-slate-200 dark:border-slate-700">';
                cells.forEach((cell, index) => {
                    if (index < headers.length) {
                       tableHtml += `<td class="border border-slate-300 dark:border-slate-600 px-4 py-2">${cell.trim()}</td>`;
                    }
                });
                for (let i = cells.length; i < headers.length; i++) {
                    tableHtml += `<td class="border border-slate-300 dark:border-slate-600 px-4 py-2"></td>`;
                }
                tableHtml += '</tr>';
            }
        } else {
            if (inTable) {
                inTable = false;
                tableHtml += '</tbody></table></div>';
                processedLines.push(tableHtml);
                tableHtml = '';
            }
            processedLines.push(line);
        }
    }
    if (inTable) {
        tableHtml += '</tbody></table></div>';
        processedLines.push(tableHtml);
    }

    html = processedLines.join('\n');
    
    html = html
      .replace(/<page-break>/g, '')
      .replace(/-------------------------------------/g, '<hr class="my-8 border-slate-300 dark:border-slate-600" />')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-4 mt-8 pb-2 border-b-2 border-sky-500">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-4">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-800 dark:text-slate-100">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^\s*[-*] (.*$)/gim, '<li class="list-disc ml-6">$1</li>')
      .replace(/\n/g, '<br />');

    html = html.replace(/<br \/>(\s*<li)/g, '$1');
    html = html.replace(/(<\/li>)<br \/>/g, '$1');

    return html;
};


const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, businessData, onStartNew }) => {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualContent, setManualContent] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [loadingManual, setLoadingManual] = useState<ManualType | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const reportContentRef = React.useRef<HTMLDivElement>(null);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(analysis).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
      if (!reportContentRef.current) return;
      setIsGeneratingPdf(true);

      try {
          const originalElement = reportContentRef.current;
          
          // Create a clone of the element to manipulate for PDF generation
          // We wrap it in a container to enforce A4 width ratios
          const cloneContainer = document.createElement('div');
          cloneContainer.style.position = 'absolute';
          cloneContainer.style.top = '-9999px';
          cloneContainer.style.left = '0';
          cloneContainer.style.width = '794px'; // A4 width in pixels at 96 DPI
          cloneContainer.style.backgroundColor = '#ffffff'; // Force white background
          cloneContainer.className = 'bg-white text-slate-900 p-8'; // Force light mode styling
          
          // Clone the content
          const clone = originalElement.cloneNode(true) as HTMLElement;
          
          // Remove dark mode classes from the clone and its children to ensure a clean PDF
          // This is a simple heuristic: remove 'dark:' classes and force text color
          const removeDarkMode = (el: HTMLElement) => {
              if (el.classList) {
                 el.classList.remove('dark:bg-slate-800', 'dark:text-white', 'dark:text-slate-200', 'dark:text-slate-300', 'dark:text-slate-400', 'dark:border-slate-600', 'dark:border-slate-700');
                 // Add explicit print-friendly classes if needed, or rely on the parent's reset
              }
              Array.from(el.children).forEach(child => removeDarkMode(child as HTMLElement));
          };
          removeDarkMode(clone);
          
          // Remove the "Generate Manuals" section from the PDF
          const manualSection = clone.querySelector('.no-print');
          if (manualSection) {
              manualSection.remove();
          }

          cloneContainer.appendChild(clone);
          document.body.appendChild(cloneContainer);

          const canvas = await html2canvas(cloneContainer, {
              scale: 2, // Higher scale for better clarity
              useCORS: true,
              logging: false,
          });

          // Convert to JPEG with 0.8 quality to reduce file size significantly while maintaining good visual quality for text
          const imgData = canvas.toDataURL('image/jpeg', 0.8);
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 297; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;

          // Enable compression in jsPDF
          const doc = new jsPDF('p', 'mm', 'a4', true);
          let position = 0;

          doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
              position = heightLeft - imgHeight;
              doc.addPage();
              doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
          }

          doc.save(`${businessData.organization_name}_Strategic_Analysis.pdf`);
          
          // Cleanup
          document.body.removeChild(cloneContainer);

      } catch (error) {
          console.error("Error generating PDF:", error);
          alert(t('app.errorModal.unknownError'));
      } finally {
          setIsGeneratingPdf(false);
      }
  };

  const handleGenerateManual = async (manualType: ManualType) => {
    setLoadingManual(manualType);
    try {
        const manual = await generateManual(businessData, analysis, manualType, i18n.language);
        setManualContent(manual);
        setManualTitle(t(`analysisDisplay.manuals.${manualType}.title`));
        setShowManualModal(true);
    } catch(err) {
        console.error("Failed to generate manual:", err);
        alert(t('analysisDisplay.manuals.error'));
    } finally {
        setLoadingManual(null);
    }
  };

  const manualButtons = [
    { type: 'financial_policies' as ManualType, icon: BanknotesIcon },
    { type: 'financial_sops' as ManualType, icon: ClipboardDocumentListIcon },
    { type: 'admin_sops' as ManualType, icon: BriefcaseIcon },
  ];

  const reportHtml = simpleTextToHtml(analysis);

  return (
    <div className="animate-fade-in">
      <style>{`
        @media print {
          body, html { background-color: #fff; color: #000; }
          body * { visibility: hidden; }
          .printable-area, .printable-area * { visibility: visible; }
          .printable-area { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important; }
          .dark .printable-area { background-color: #fff !important; }
          .dark .report-content * { color: #000 !important; border-color: #ccc !important; }
          .dark .report-content tr { background-color: #f9fafb !important; }
          .no-print { display: none; }
          h1, h2, h3 { page-break-after: avoid; }
          table, hr { page-break-inside: avoid; }
        }
      `}</style>

      <ManualDisplayModal 
        show={showManualModal}
        title={manualTitle}
        content={manualContent}
        onClose={() => setShowManualModal(false)}
      />

      <div ref={reportContentRef} className="printable-area bg-white dark:bg-slate-800 p-6 sm:p-8 md:p-12 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="prose prose-slate dark:prose-invert max-w-none report-content" dangerouslySetInnerHTML={{ __html: reportHtml }} />
        
        <div className="mt-12 pt-8 border-t-2 border-dashed border-slate-300 dark:border-slate-600 no-print">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-2">{t('analysisDisplay.manuals.title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{t('analysisDisplay.manuals.subtitle')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {manualButtons.map(({ type, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => handleGenerateManual(type)}
                  disabled={!!loadingManual}
                  className="flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/40 transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-wait"
                >
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    {loadingManual === type ? (
                        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <Icon className="w-12 h-12 text-sky-500 dark:text-sky-400" />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 mt-4">{t(`analysisDisplay.manuals.${type}.title`)}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t(`analysisDisplay.manuals.${type}.description`)}</p>
                </button>
              ))}
            </div>
        </div>
      </div>

      <div className="no-print text-center mt-8 flex flex-wrap justify-center items-center gap-4">
        <button onClick={onStartNew} className="px-6 py-3 bg-slate-600 text-white font-bold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 transition-colors">
          {t('analysisDisplay.startNew')}
        </button>
        <button onClick={handleCopyToClipboard} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition-colors">
          {copied ? <CheckIcon className="w-5 h-5" /> : <DocumentDuplicateIcon className="w-5 h-5" />}
          <span>{copied ? t('analysisDisplay.copyButton.copied') : t('analysisDisplay.copyButton.copy')}</span>
        </button>
         <button 
            onClick={handleDownloadPDF} 
            disabled={isGeneratingPdf}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors disabled:opacity-70 disabled:cursor-wait"
        >
          {isGeneratingPdf ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
              <PdfIcon className="w-5 h-5" />
          )}
          <span>{isGeneratingPdf ? t('analysisDisplay.pdfGenerating') : t('analysisDisplay.pdfButton')}</span>
        </button>
        <button onClick={handlePrint} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white font-bold rounded-lg shadow-md hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-opacity-75 transition-colors">
          <DownloadIcon className="w-5 h-5" />
          <span>{t('analysisDisplay.printButton')}</span>
        </button>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
