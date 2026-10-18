// المسار: components/Documents/DocumentViewModal.js

window.DocumentViewModal = function({ viewMemo, onClose }) {
    const { useState } = React;
    const [isPrinting, setIsPrinting] = useState(false);

    // دالة الطباعة الاحترافية (تنسيق A4 مخفي)
    const handlePrint = () => {
        if (!viewMemo) return;
        setIsPrinting(true);

        const session = JSON.parse(localStorage.getItem('MentraLocal_Session') || '{}');
        const firmName = session.firm_name || 'مكتب المحاماة';

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const printDocument = iframe.contentWindow.document;

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>${viewMemo.title}</title>
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    @page { size: A4; margin: 20mm; }
                    body { 
                        font-family: 'Cairo', sans-serif; color: #000; background: #fff;
                        line-height: 2.2; font-size: 16pt; margin: 0; padding: 0; -webkit-print-color-adjust: exact;
                    }
                    .header { text-align: center; margin-bottom: 20px; border-bottom: 3px double #000; padding-bottom: 10px; }
                    .firm-name { font-size: 22pt; font-weight: 900; margin: 0; color: #000; }
                    .firm-desc { font-size: 14pt; font-weight: bold; color: #333; }
                    .meta-info { display: flex; justify-content: space-between; font-size: 14pt; font-weight: bold; margin-bottom: 30px; }
                    .memo-title { text-align: center; font-size: 20pt; font-weight: 900; text-decoration: underline; margin-bottom: 30px; }
                    .content { font-size: 16pt; font-weight: 600; white-space: pre-wrap; text-align: justify; text-justify: inter-word; }
                    .footer { margin-top: 50px; padding-top: 10px; border-top: 1px solid #ccc; text-align: center; font-size: 10pt; color: #555; }
                    h1, h2, h3, .memo-title { page-break-after: avoid; }
                    .content { page-break-inside: auto; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="firm-name">${firmName}</div>
                    <div class="firm-desc">للمحاماة والاستشارات القانونية</div>
                </div>
                <div class="meta-info">
                    <div><strong>القضية رقم:</strong> ${viewMemo.case_number}</div>
                    <div><strong>تاريخ التحرير:</strong> ${viewMemo.safe_date}</div>
                </div>
                <div class="memo-title">${viewMemo.title}</div>
                <div class="content">${viewMemo.content}</div>
                <div class="footer">تم استخراج هذه المذكرة عبر نظام MentraLawyer</div>
            </body>
            </html>
        `;

        printDocument.write(htmlContent);
        printDocument.close();

        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setIsPrinting(false);
            setTimeout(() => { document.body.removeChild(iframe); }, 1000);
        }, 800);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-3 sm:p-4 animate-view">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh] md:max-h-[90vh]">
                
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-start md:items-center bg-slate-50 shrink-0 flex-col md:flex-row gap-3">
                    <h3 className="font-black text-base md:text-lg text-[#1E3A8A] flex items-center gap-2 w-full md:w-auto pr-8 md:pr-0">
                        <i className="fas fa-book-open text-indigo-500 shrink-0"></i> 
                        <span className="truncate">{viewMemo.title}</span>
                    </h3>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <button onClick={handlePrint} disabled={isPrinting} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 disabled:opacity-50">
                            {isPrinting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-print"></i>}
                            {isPrinting ? 'جاري التجهيز...' : 'طباعة كـ PDF'}
                        </button>
                        <button onClick={onClose} className="absolute top-4 left-4 md:relative md:top-0 md:left-0 w-8 h-8 bg-slate-200 text-slate-500 rounded-full hover:bg-rose-500 hover:text-white transition flex items-center justify-center shrink-0">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                {/* Content */}
                <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar bg-[#F8FAFC] flex-1">
                    <div className="bg-white p-4 md:p-10 rounded-2xl shadow-sm border border-slate-100 min-h-[300px] md:min-h-[400px]">
                        <pre className="font-bold text-sm md:text-base text-slate-800 whitespace-pre-wrap break-words leading-loose text-justify" style={{fontFamily: "'Cairo', sans-serif"}}>{viewMemo.content}</pre>
                    </div>
                    <div className="mt-4 text-left">
                        <span className="text-[9px] md:text-[10px] text-slate-400 font-bold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">تاريخ التحرير: {viewMemo.safe_date}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};