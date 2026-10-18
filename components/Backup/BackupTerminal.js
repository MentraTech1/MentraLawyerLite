// المسار: components/Backup/BackupTerminal.js

window.BackupTerminal = function({ isProcessing, progress, logs }) {
    const { useEffect, useRef } = React;
    const logsEndRef = useRef(null);

    // التمرير التلقائي لأسفل عند إضافة سجل جديد
    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    return (
        <div className="flex-1 bg-[#0F172A] p-4 md:p-6 relative overflow-hidden flex flex-col min-h-[200px] md:min-h-[300px]">
            <div className="flex justify-between items-center mb-3 md:mb-4 pb-2 border-b border-white/10">
                <span className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                    <i className="fas fa-terminal mr-2"></i> System Logs
                </span>
                <span className="text-[#D4AF37] text-[10px] md:text-xs font-black">{progress}%</span>
            </div>

            {/* شريط التقدم */}
            {isProcessing && (
                <div className="w-full bg-slate-800 rounded-full h-1 md:h-1.5 mb-3 md:mb-4 overflow-hidden">
                    <div className="bg-[#D4AF37] h-1 md:h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
            )}

            {/* شاشة السجلات (اللوجز) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[10px] md:text-xs space-y-2 dir-ltr text-left">
                {logs.length === 0 ? (
                    <p className="text-slate-600 italic">Waiting for operations...</p>
                ) : (
                    logs.map((log, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                            <span className="text-slate-500 shrink-0 whitespace-nowrap">[{log.time}]</span>
                            <span className={`break-words whitespace-pre-wrap
                                ${log.type === 'error' ? 'text-rose-400' : ''}
                                ${log.type === 'success' ? 'text-emerald-400' : ''}
                                ${log.type === 'warning' ? 'text-amber-400' : ''}
                                ${log.type === 'info' ? 'text-blue-300' : ''}
                            `}>
                                {log.msg}
                            </span>
                        </div>
                    ))
                )}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
};