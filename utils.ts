
export const getEnv = (key: string): string => {
  // 1. Try Vite/Modern (import.meta.env)
  try {
    const meta = import.meta as any;
    if (meta && meta.env) {
      const val = meta.env[key] || meta.env[`VITE_${key}`];
      if (val) return val;
    }
  } catch (e) {
    // Ignore if import.meta is not supported
  }

  // 2. Direct checks for static replacements (Vite 'define')
  // CRITICAL FIX: We must check these specific keys OUTSIDE of any 'if (process)' check.
  // Vite replaces the string 'process.env.API_KEY' with the actual value at build time.
  // If we wrap this in 'if (typeof process !== undefined)', the browser skips it because 'process' is undefined.
  
  if (key === 'API_KEY') {
    try {
      // @ts-ignore
      if (typeof process.env.API_KEY !== 'undefined') {
          // @ts-ignore
          return process.env.API_KEY;
      }
    } catch (e) {}
  }
  
  if (key === 'VITE_SUPABASE_URL' || key === 'SUPABASE_URL') {
    try {
      // @ts-ignore
      if (typeof process.env.VITE_SUPABASE_URL !== 'undefined') return process.env.VITE_SUPABASE_URL;
    } catch (e) {}
  }

  if (key === 'VITE_SUPABASE_ANON_KEY' || key === 'SUPABASE_ANON_KEY') {
    try {
      // @ts-ignore
      if (typeof process.env.VITE_SUPABASE_ANON_KEY !== 'undefined') return process.env.VITE_SUPABASE_ANON_KEY;
    } catch (e) {}
  }

  // 3. Fallback to global process (e.g. if simple Node script)
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
        // @ts-ignore
        return process.env[key] || process.env[`VITE_${key}`];
    }
  } catch (e) {}

  // 4. Try Window Polyfill (window.process.env) - Last resort
  try {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.process && window.process.env) {
       // @ts-ignore
       return window.process.env[key] || window.process.env[`VITE_${key}`] || '';
    }
  } catch(e) {}

  return '';
};

export const simpleTextToHtml = (text: string): string => {
    if (!text) return '';

    let html = text;

    // Preserve newlines in code blocks or preformatted text
    html = html.replace(/```([\s\S]*?)```/g, (match, content) => {
        return `<pre class="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm my-4 font-mono shadow-inner border border-slate-700 dir-ltr text-left">${content.trim()}</pre>`;
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

        const cells = line.split(/\s{2,}|	|\|/).filter(cell => cell.trim() !== ''); // Improved split to handle pipes | often used in MD tables
        // Simple heuristic for table row: multiple cells, not a list item, not a header
        const isLikelyTableRow = cells.length > 1 && !line.startsWith('#') && !line.startsWith('- ') && !line.startsWith('* ') && line.trim() !== '' && !line.match(/^-+$/);
        
        if (isLikelyTableRow) {
            if (!inTable) {
                inTable = true;
                headers = cells;
                tableHtml = '<div class="overflow-x-auto my-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"><table class="w-full text-left rtl:text-right border-collapse bg-white dark:bg-slate-800 text-sm">';
                tableHtml += '<thead class="bg-slate-100 dark:bg-slate-900/50"><tr>';
                headers.forEach(cell => {
                    tableHtml += `<th class="px-6 py-3 font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">${cell.trim().replace(/^\||\|$/g, '')}</th>`;
                });
                tableHtml += '</tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">';
            } else {
                // Add striped background classes
                tableHtml += '<tr class="hover:bg-sky-50 dark:hover:bg-slate-700/50 transition-colors odd:bg-white even:bg-slate-50 dark:odd:bg-slate-800 dark:even:bg-slate-800/50">';
                cells.forEach((cell, index) => {
                    // Handle markdown table pipes if present
                    const cleanCell = cell.trim().replace(/^\||\|$/g, '');
                    if (index < headers.length || headers.length === 0) {
                       tableHtml += `<td class="px-6 py-4 text-slate-600 dark:text-slate-300 align-top">${cleanCell}</td>`;
                    }
                });
                // Fill missing cells if row is shorter than header
                if (headers.length > 0) {
                    for (let i = cells.length; i < headers.length; i++) {
                        tableHtml += `<td class="px-6 py-4 border-slate-200 dark:border-slate-700"></td>`;
                    }
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
            // Skip lines that are just separators like |---|---|
            if (!line.match(/^[|\s-:]+$/)) {
                processedLines.push(line);
            }
        }
    }
    if (inTable) {
        tableHtml += '</tbody></table></div>';
        processedLines.push(tableHtml);
    }

    html = processedLines.join('\n');
    
    html = html
      .replace(/<page-break>/g, '')
      .replace(/-------------------------------------/g, '<hr class="my-10 border-t-2 border-slate-100 dark:border-slate-700" />')
      // Improved Header Styling with Gradients/Colors
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 mb-6 mt-10 pb-4 border-b border-slate-200 dark:border-slate-700">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 mt-8 flex items-center gap-2"><span class="w-2 h-8 bg-sky-500 rounded-full inline-block"></span>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3 mt-6">$1</h3>')
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-600 dark:text-slate-400 italic">$1</em>')
      // Lists
      .replace(/^\s*[-*] (.*$)/gim, '<li class="flex items-start gap-2 mb-2 text-slate-700 dark:text-slate-300"><span class="mt-1.5 w-1.5 h-1.5 bg-sky-500 rounded-full flex-shrink-0"></span><span>$1</span></li>')
      .replace(/\n/g, '<br />');

    html = html.replace(/<br \/>(\s*<li)/g, '$1');
    html = html.replace(/(<\/li>)<br \/>/g, '$1');

    return html;
};
