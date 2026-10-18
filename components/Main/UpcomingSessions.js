// المسار: components/Main/UpcomingSessions.js

window.UpcomingSessions = function({ upcomingSessions, isLoading }) {
    const { useState, useMemo } = React;
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const limit = 2;

    // فلترة الجلسات بحسب نص البحث (برقم القضية، التاريخ، أو الملاحظات)
    const filteredSessions = useMemo(() => {
        if (!searchTerm.trim()) return upcomingSessions || [];
        const term = searchTerm.toLowerCase().trim();
        return (upcomingSessions || []).filter(session => {
            const caseNumber = String(session.case_number || '').toLowerCase();
            const sessionDate = String(session.session_date || '').toLowerCase();
            const notes = String(session.notes || '').toLowerCase();
            return caseNumber.includes(term) || sessionDate.includes(term) || notes.includes(term);
        });
    }, [upcomingSessions, searchTerm]);

    // احتساب إجمالي الصفحات وتقسيم البيانات (الحد: 3 عناصر)
    const totalPages = Math.ceil(filteredSessions.length / limit) || 1;
    const currentSessions = filteredSessions.slice((page - 1) * limit, page * limit);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // العودة للصفحة الأولى دائماً عند البحث
    };

    return (
        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
            {/* Header مع شريط البحث */}
            <div className="p-4 md:p-5 border-b border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner shrink-0">
                        <i className="fas fa-clock text-sm"></i>
                    </div>
                    <div>
                        <h3 className="font-bold text-[#1E3A8A] text-sm md:text-base leading-tight">أقرب جلسات المحاكم القادمة</h3>
                        <span className="text-[10px] font-bold text-slate-400">الإجمالي: {filteredSessions.length} جلسة</span>
                    </div>
                </div>

                {/* حقل البحث السريع */}
                <div className="relative w-full sm:w-48">
                    <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="بحث برقم القضية أو القرار..."
                        className="w-full bg-white pr-8 pl-8 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 placeholder-slate-400 outline-none focus:border-[#1E3A8A] transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => { setSearchTerm(''); setPage(1); }}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                            title="مسح البحث"
                        >
                            <i className="fas fa-times-circle"></i>
                        </button>
                    )}
                </div>
            </div>
            
            {/* المحتوى */}
            <div className="p-0 md:p-2 min-h-[220px]">
                {isLoading ? (
                    <div className="py-14 text-center">
                        <i className="fas fa-circle-notch fa-spin text-2xl text-[#D4AF37]"></i>
                        <p className="text-slate-400 font-bold text-xs mt-2">جاري تحميل الجلسات...</p>
                    </div>
                ) : filteredSessions.length === 0 ? (
                    <div className="py-12 text-center flex flex-col items-center">
                        <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                            <i className={searchTerm ? "fas fa-search text-xl text-slate-300" : "fas fa-mug-hot text-xl text-slate-300"}></i>
                        </div>
                        <p className="text-slate-400 font-bold text-xs md:text-sm">
                            {searchTerm ? 'لا توجد نتائج مطابقة لبحثك' : 'لا توجد جلسات مجدولة قريباً، استمتع بقهوتك!'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* عرض الموبايل (بطاقات) */}
                        <div className="block md:hidden divide-y divide-slate-100">
                            {currentSessions.map((session, idx) => (
                                <div key={session.id || idx} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                            <span className="font-black text-[#1E3A8A] text-sm dir-ltr">{session.session_date}</span>
                                        </div>
                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold">
                                            قضية: {session.case_number}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-xs font-semibold leading-relaxed mt-1">
                                        <i className="fas fa-info-circle text-slate-300 ml-1"></i>
                                        {session.notes || 'لا توجد ملاحظات أو قرارات سابقة مسجلة.'}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* عرض الديسكتوب (جدول) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-right text-sm">
                                <thead>
                                    <tr className="text-slate-400 text-[11px] uppercase tracking-wider bg-slate-50/50">
                                        <th className="px-4 py-3 font-bold rounded-r-lg">تاريخ الجلسة</th>
                                        <th className="px-4 py-3 font-bold">رقم القضية</th>
                                        <th className="px-4 py-3 font-bold rounded-l-lg">القرار السابق / الملاحظات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {currentSessions.map((session, idx) => (
                                        <tr key={session.id || idx} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-amber-500 group-hover:animate-ping"></span>
                                                    <span className="font-bold text-[#1E3A8A] dir-ltr">{session.session_date}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-black text-slate-700">{session.case_number}</td>
                                            <td className="px-4 py-3 text-slate-500 text-xs font-semibold">
                                                {session.notes || 'لا توجد ملاحظات'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center px-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-1"
                    >
                        <i className="fas fa-chevron-right text-[10px]"></i>
                        <span>السابق</span>
                    </button>

                    <div className="text-xs font-bold text-[#1E3A8A] bg-blue-50/80 border border-blue-100 px-3 py-1 rounded-md">
                        صفحة {page} من {totalPages}
                    </div>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-1"
                    >
                        <span>التالي</span>
                        <i className="fas fa-chevron-left text-[10px]"></i>
                    </button>
                </div>
            )}
        </div>
    );
};