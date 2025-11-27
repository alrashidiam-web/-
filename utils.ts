
export const getEnv = (key: string): string => {
  // In Vite/Vercel, variables are exposed via import.meta.env
  // We check for the key directly or with VITE_ prefix
  const meta = import.meta as any;
  if (meta.env) {
    return meta.env[key] || meta.env[`VITE_${key}`] || '';
  }
  return '';
};

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
