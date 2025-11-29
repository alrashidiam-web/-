
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadIcon, DocumentDuplicateIcon, CheckIcon, BanknotesIcon, ClipboardDocumentListIcon, BriefcaseIcon, PdfIcon, WordIcon, StarIcon, ChartBarIcon } from './icons';
import type { BusinessData, ManualType, KPIBenchmark } from '../types';
import { generateManual, getKeyPerformanceIndicators } from '../services/geminiService';
import { submitFeedback } from '../services/supabaseService';
import ManualDisplayModal from './ManualDisplayModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { simpleTextToHtml } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalysisDisplayProps {
  analysis: string;
  businessData: BusinessData;
  reportId: string | null;
  onStartNew: () => void;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, businessData, reportId, onStartNew }) => {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualContent, setManualContent] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [loadingManual, setLoadingManual] = useState<ManualType | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const [benchmarkData, setBenchmarkData] = useState<KPIBenchmark[] | null>(null);
  const [isLoadingBenchmarks, setIsLoadingBenchmarks] = useState(false);
  
  const reportContentRef = useRef<HTMLDivElement>(null);

  // Helper to parse specific AI errors
  const getSpecificErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('429') || msg.includes('quota') || msg.includes('exhausted')) {
             return t('app.errorModal.quotaExceeded');
        } else if (msg.includes('401') || msg.includes('403') || msg.includes('key') || msg.includes('unauthorized')) {
             return t('app.errorModal.invalidKey');
        } else if (msg.includes('block') || msg.includes('safety') || msg.includes('policy')) {
             return t('app.errorModal.safetyBlock');
        } else if (msg.includes('503') || msg.includes('500') || msg.includes('overloaded')) {
            return t('app.errorModal.geminiError');
        } else if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed to fetch')) {
           return t('app.errorModal.networkError');
        } else if (msg.includes('json') || msg.includes('invalid_json_format')) {
           return t('app.errorModal.jsonError');
        } else if (msg.includes('empty_response')) {
           return t('app.errorModal.emptyResponse');
        }
    }
    return defaultMessage;
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(analysis).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadWord = () => {
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>
    `;
    
    // We remove the dark mode classes for the Word export to keep it clean
    const content = formattedAnalysis.replace(/class="[^"]*"/g, ''); 
    const footer = "</body></html>";
    const sourceHTML = header+content+footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${businessData.organization_name}_Analysis.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const handleDownloadPDF = async () => {
      if (!reportContentRef.current) return;
      setIsGeneratingPdf(true);

      try {
          const originalElement = reportContentRef.current;
          
          // Create a clone of the element to manipulate for PDF generation
          // We force a white background and text color to ensure readability regardless of theme
          const clone = originalElement.cloneNode(true) as HTMLElement;
          clone.style.width = '210mm'; // A4 width
          clone.style.padding = '20mm';
          clone.style.backgroundColor = 'white';
          clone.style.color = 'black';
          clone.classList.remove('dark'); 
          
          document.body.appendChild(clone);
          clone.style.position = 'absolute';
          clone.style.left = '-9999px';
          clone.style.top = '0';

          const canvas = await html2canvas(clone, {
              scale: 2, // Higher scale for better quality
              useCORS: true,
              logging: false,
          });

          document.body.removeChild(clone);

          const imgData = canvas.toDataURL('image/jpeg', 0.8);
          const pdf = new jsPDF('p', 'mm', 'a4', true);
          // Enable compression to reduce file size
          // @ts-ignore: jsPDF types might not include the compression flag in constructor depending on version, but passing true works
          
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = pdfWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
          heightLeft -= pdfHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;
          }

          pdf.save(`${businessData.organization_name}_Analysis.pdf`);
      } catch (error) {
          console.error("PDF Generation Error:", error);
          alert("Could not generate PDF. Please try again.");
      } finally {
          setIsGeneratingPdf(false);
      }
  };

  const handleGenerateManual = async (type: ManualType) => {
      setLoadingManual(type);
      try {
          const result = await generateManual(businessData, analysis, type, i18n.language);
          setManualTitle(t(`analysisDisplay.manuals.${type}.title`));
          setManualContent(result);
          setShowManualModal(true);
      } catch (error) {
          console.error("Manual Generation Error:", error);
          const specificError = getSpecificErrorMessage(error, t('analysisDisplay.manuals.error'));
          alert(specificError);
      } finally {
          setLoadingManual(null);
      }
  };
  
  const handleGenerateBenchmarks = async () => {
      setIsLoadingBenchmarks(true);
      try {
          const data = await getKeyPerformanceIndicators(businessData, i18n.language);
          setBenchmarkData(data);
      } catch (error) {
          console.error("Benchmark Error:", error);
          const specificError = getSpecificErrorMessage(error, t('analysisDisplay.benchmarks.error'));
          alert(specificError);
      } finally {
          setIsLoadingBenchmarks(false);
      }
  };
  
  const handleFeedbackSubmit = async () => {
      if (!reportId) return;
      setIsSubmittingFeedback(true);
      try {
          await submitFeedback(reportId, rating, comment);
          setIsFeedbackSubmitted(true);
      } catch (error) {
          console.error("Feedback Submit Error:", error);
          alert("Failed to submit feedback. Please check your connection.");
      } finally {
          setIsSubmittingFeedback(false);
      }
  };

  const formattedAnalysis = simpleTextToHtml(analysis);

  return (
    <div className="animate-fade-in space-y-8">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 no-print sticky top-20 z-10">
             <button onClick={onStartNew} className="w-full md:w-auto px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100">
                 &larr; {t('analysisDisplay.startNew')}
             </button>
             <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
                 <button onClick={handleCopyToClipboard} className="flex-1 md:flex-none justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white border border-slate-300 dark:bg-slate-700 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm">
                     {copied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <DocumentDuplicateIcon className="w-4 h-4" />}
                     <span>{copied ? t('analysisDisplay.copyButton.copied') : t('analysisDisplay.copyButton.copy')}</span>
                 </button>
                 <button onClick={handleDownloadWord} className="flex-1 md:flex-none justify-center items-center gap-2 px-4 py-2 text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 rounded-lg hover:bg-blue-100 transition-colors shadow-sm">
                     <WordIcon className="w-4 h-4" />
                     <span>Word</span>
                 </button>
                 <button onClick={handleDownloadPDF} disabled={isGeneratingPdf} className="flex-1 md:flex-none justify-center items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md disabled:opacity-70">
                     <PdfIcon className="w-4 h-4" />
                     {isGeneratingPdf ? t('analysisDisplay.pdfGenerating') : t('analysisDisplay.pdfButton')}
                 </button>
             </div>
        </div>

        {/* Report Content */}
        <div ref={reportContentRef} className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
             {/* Header for PDF/Print */}
             <div className="hidden print:block mb-10 border-b-2 border-slate-800 pb-6">
                 <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{businessData.organization_name}</h1>
                 <p className="text-slate-500 text-lg uppercase tracking-wide">Strategic Analysis Report • {new Date().toLocaleDateString()}</p>
             </div>
             
             <div className="prose prose-slate prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: formattedAnalysis }} />
             
             {/* Embedded Benchmarks (for PDF export) */}
             {benchmarkData && (
                 <div className="mt-12 pt-8 border-t-2 border-slate-200 dark:border-slate-700 break-inside-avoid">
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('analysisDisplay.benchmarks.title')}</h3>
                     <div className="grid grid-cols-1 gap-6">
                         {benchmarkData.map((item, index) => (
                             <div key={index} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                                 <div>
                                     <span className="block font-bold text-lg text-slate-800 dark:text-slate-200">{item.kpi}</span>
                                     <span className="text-sm text-slate-500">{item.explanation}</span>
                                 </div>
                                 <div className="text-right">
                                     <div className="text-lg font-bold text-sky-600">{item.companyValue} {item.unit}</div>
                                     <div className="text-sm text-slate-400">vs Industry: {item.industryAverage} {item.unit}</div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             )}
        </div>

        {/* Financial Benchmarks Section (Interactive) */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 no-print transition-all hover:shadow-2xl">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                 <div>
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                         <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <ChartBarIcon className="w-6 h-6" />
                         </div>
                         {t('analysisDisplay.benchmarks.title')}
                     </h3>
                     <p className="text-slate-500 dark:text-slate-400 mt-2 ml-11">{t('analysisDisplay.benchmarks.subtitle')}</p>
                 </div>
                 {!benchmarkData && (
                     <button 
                        onClick={handleGenerateBenchmarks}
                        disabled={isLoadingBenchmarks}
                        className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
                     >
                         {isLoadingBenchmarks && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                         {t('analysisDisplay.benchmarks.generateButton')}
                     </button>
                 )}
             </div>

             {benchmarkData && (
                 <div className="animate-fade-in">
                     <div className="h-[400px] w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart
                                 data={benchmarkData}
                                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                 barSize={40}
                             >
                                 <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                                 <XAxis dataKey="kpi" tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} interval={0} axisLine={false} tickLine={false} />
                                 <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                                 <Tooltip 
                                     cursor={{fill: 'transparent'}}
                                     contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc', padding: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                     itemStyle={{ color: '#f8fafc', paddingBottom: '4px' }}
                                 />
                                 <Legend wrapperStyle={{paddingTop: '20px'}} />
                                 <Bar dataKey="companyValue" name={t('analysisDisplay.benchmarks.companyLabel')} fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                                 <Bar dataKey="industryAverage" name={t('analysisDisplay.benchmarks.industryLabel')} fill="#94a3b8" radius={[6, 6, 0, 0]} />
                             </BarChart>
                         </ResponsiveContainer>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                         {benchmarkData.map((item, index) => (
                             <div key={index} className="p-5 bg-white dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-600 shadow-sm hover:border-sky-200 dark:hover:border-sky-800 transition-colors">
                                 <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 text-lg">{item.kpi}</h4>
                                 <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.explanation}</p>
                             </div>
                         ))}
                     </div>
                 </div>
             )}
        </div>

        {/* Manuals Generation Section */}
        <div className="bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-800 dark:to-slate-900 p-8 md:p-10 rounded-2xl border border-sky-100 dark:border-slate-700 no-print">
             <div className="text-center mb-10">
                 <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">{t('analysisDisplay.manuals.title')}</h3>
                 <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t('analysisDisplay.manuals.subtitle')}</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <button 
                    onClick={() => handleGenerateManual('financial_policies')}
                    disabled={!!loadingManual}
                    className="group flex flex-col items-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-1 transition-all disabled:opacity-70"
                 >
                     <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full mb-6 group-hover:scale-110 transition-transform">
                         {loadingManual === 'financial_policies' ? <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <BanknotesIcon className="w-8 h-8" />}
                     </div>
                     <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-3 text-center">{t('analysisDisplay.manuals.financial_policies.title')}</h4>
                     <p className="text-sm text-slate-500 dark:text-slate-400 text-center leading-relaxed">{t('analysisDisplay.manuals.financial_policies.description')}</p>
                 </button>

                 <button 
                    onClick={() => handleGenerateManual('financial_sops')}
                    disabled={!!loadingManual}
                    className="group flex flex-col items-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 hover:-translate-y-1 transition-all disabled:opacity-70"
                 >
                     <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full mb-6 group-hover:scale-110 transition-transform">
                         {loadingManual === 'financial_sops' ? <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <ClipboardDocumentListIcon className="w-8 h-8" />}
                     </div>
                     <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-3 text-center">{t('analysisDisplay.manuals.financial_sops.title')}</h4>
                     <p className="text-sm text-slate-500 dark:text-slate-400 text-center leading-relaxed">{t('analysisDisplay.manuals.financial_sops.description')}</p>
                 </button>

                 <button 
                    onClick={() => handleGenerateManual('admin_sops')}
                    disabled={!!loadingManual}
                    className="group flex flex-col items-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-green-300 dark:hover:border-green-700 hover:-translate-y-1 transition-all disabled:opacity-70"
                 >
                     <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full mb-6 group-hover:scale-110 transition-transform">
                         {loadingManual === 'admin_sops' ? <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <BriefcaseIcon className="w-8 h-8" />}
                     </div>
                     <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-3 text-center">{t('analysisDisplay.manuals.admin_sops.title')}</h4>
                     <p className="text-sm text-slate-500 dark:text-slate-400 text-center leading-relaxed">{t('analysisDisplay.manuals.admin_sops.description')}</p>
                 </button>
             </div>
        </div>
        
        {/* Feedback Section */}
        {reportId && (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 no-print">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 text-center">{t('analysisDisplay.feedback.title')}</h3>
                
                {isFeedbackSubmitted ? (
                    <div className="text-center py-8 animate-fade-in bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full mb-6">
                            <CheckIcon className="w-10 h-10" />
                        </div>
                        <p className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('analysisDisplay.feedback.success')}</p>
                        <p className="text-slate-500 dark:text-slate-400">Your insights help us improve.</p>
                    </div>
                ) : (
                    <div className="max-w-xl mx-auto space-y-8">
                        <div className="flex flex-col items-center gap-4">
                             <label className="text-base font-medium text-slate-700 dark:text-slate-300">{t('analysisDisplay.feedback.ratingLabel')}</label>
                             <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`focus:outline-none transition-all hover:scale-110 p-1 ${star <= rating ? 'text-yellow-400 drop-shadow-sm' : 'text-slate-200 dark:text-slate-600'}`}
                                    >
                                        <StarIcon className="w-10 h-10 fill-current" />
                                    </button>
                                ))}
                             </div>
                        </div>
                        
                        <div>
                             <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={t('analysisDisplay.feedback.placeholder')}
                                rows={4}
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all resize-none"
                             />
                        </div>
                        
                        <button
                            onClick={handleFeedbackSubmit}
                            disabled={rating === 0 || isSubmittingFeedback}
                            className="w-full py-4 bg-sky-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                        >
                            {isSubmittingFeedback ? 'Submitting...' : t('analysisDisplay.feedback.submit')}
                        </button>
                    </div>
                )}
            </div>
        )}

        <ManualDisplayModal 
            show={showManualModal}
            title={manualTitle}
            content={manualContent}
            onClose={() => setShowManualModal(false)}
        />
    </div>
  );
};

export default AnalysisDisplay;
