// المسار: components/Cases/CaseSessionsView.js

window.CaseSessionsView = function({ selectedCase, onBack, showToast }) {
    const { useState, useEffect } = React;
    
    const [isAddEditOpen, setIsAddEditOpen] = useState(false);
    const [sessionModalMode, setSessionModalMode] = useState('add');
    const [editSessionData, setEditSessionData] = useState(null);

    const [filters, setFilters] = useState({ status: 'all', startDate: '', endDate: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; 
    
    const [filteredSessions, setFilteredSessions] = useState([]);

    const rawSessions = window.useLiveQuery(
        () => window.db.agenda_sessions.where('case_id').equals(selectedCase.id).toArray(),
        [selectedCase.id]
    ) || [];

    // دالة مساعدة لمعرفة هل الجلسة مكتملة أياً كانت لغة الكلمة المخزنة
    const checkIsCompleted = (status) => status === 'completed' || status === 'تمت';

    // تطبيق الفلترة مع دعم اللغتين (عربي وإنجليزي)
    useEffect(() => {
        let result = [...rawSessions];

        if (filters.status !== 'all') {
            if (filters.status === 'completed') {
                result = result.filter(s => checkIsCompleted(s.status));
            } else if (filters.status === 'upcoming') {
                result = result.filter(s => !checkIsCompleted(s.status) && s.status !== 'مؤجلة');
            } else {
                result = result.filter(s => s.status === filters.status);
            }
        }
        if (filters.startDate) {
            result = result.filter(s => s.session_date >= filters.startDate);
        }
        if (filters.endDate) {
            result = result.filter(s => s.session_date <= filters.endDate);
        }

        result.sort((a, b) => new Date(b.session_date) - new Date(a.session_date));
        setFilteredSessions(result);
    }, [rawSessions, filters]);

    const totalPages = Math.ceil(filteredSessions.length / itemsPerPage) || 1;
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSessions = filteredSessions.slice(startIndex, startIndex + itemsPerPage);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setCurrentPage(1);
    };

    const openAddSession = () => {
        setSessionModalMode('add');
        setEditSessionData(null);
        setIsAddEditOpen(true);
    };

    const openEditSession = (session) => {
        setSessionModalMode('edit');
        setEditSessionData(session);
        setIsAddEditOpen(true);
    };

    const handleDeleteSession = async (id) => {
        if (confirm("هل أنت متأكد من حذف هذه الجلسة؟")) {
            try {
                await window.db.agenda_sessions.delete(id);
                showToast("تم حذف الجلسة بنجاح", "success");
            } catch (err) {
                showToast("حدث خطأ أثناء الحذف", "error");
            }
        }
    };

    // 🌟 التحديث بالقيمة القياسية 'completed' و 'upcoming' لضمان التزامن الفوري مع الأجندة
    const handleUpdateStatus = async (sessionId, newStatus) => {
        try {
            await window.db.agenda_sessions.update(sessionId, { status: newStatus });
            showToast(
                newStatus === 'completed' ? "تم إغلاق الجلسة بنجاح" : "تم استرجاع الجلسة للرول", 
                "success"
            );
        } catch (error) {
            showToast("حدث خطأ في التحديث", "error");
        }
    };

    const getStatusIcon = (status) => {
        if (checkIsCompleted(status)) {
            return (
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0" title="تمت">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm">
                        <i className="fas fa-check text-[10px] md:text-xs"></i>
                    </div>
                </div>
            );
        }
        if (status === 'upcoming' || status === 'قادمة') {
            return (
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0" title="قادمة">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-sm">
                        <i className="fas fa-gavel text-[10px] md:text-xs"></i>
                    </div>
                </div>
            );
        }
        return (
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0" title="مؤجلة">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-slate-400 rounded-full flex items-center justify-center text-white shadow-sm">
                    <i className="fas fa-clock text-[10px] md:text-xs"></i>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-view pb-8">
            <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm p-4 md:p-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-6">
                    <div className="flex flex-col">
                        <button onClick={onBack} className="text-slate-400 hover:text-[#1E3A8A] font-bold text-xs flex items-center gap-1 mb-2 transition-colors w-fit">
                            <i className="fas fa-arrow-right"></i> العودة لسجل القضايا
                        </button>
                        <h3 className="font-black text-lg md:text-xl text-[#1E3A8A] flex items-center gap-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><i className="fas fa-calendar-check"></i></div>
                            جلسات القضية رقم: {selectedCase.case_number}
                            <span className="text-[10px] md:text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg mr-2 border border-slate-200">{filteredSessions.length} جلسة</span>
                        </h3>
                    </div>
                    <button onClick={openAddSession} className="w-full md:w-auto bg-gradient-to-l from-[#1E3A8A] to-blue-800 hover:to-blue-900 text-white px-5 py-3 md:px-6 rounded-xl md:rounded-2xl text-sm font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                        <i className="fas fa-plus"></i> إضافة جلسة جديدة
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100">
                    <div>
                        <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full bg-white border border-slate-200 rounded-xl py-2.5 md:py-3 px-4 text-xs md:text-sm font-bold text-[#1E3A8A] outline-none focus:border-[#D4AF37] transition cursor-pointer">
                            <option value="all">جميع الحالات</option>
                            <option value="upcoming">الجلسات القادمة</option>
                            <option value="completed">الجلسات المنتهية (تمت)</option>
                            <option value="مؤجلة">مؤجلة</option>
                        </select>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
                        <span className="text-[10px] md:text-xs font-bold text-slate-400 whitespace-nowrap">من:</span>
                        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="bg-transparent text-xs md:text-sm font-bold text-[#1E3A8A] outline-none w-full" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
                        <span className="text-[10px] md:text-xs font-bold text-slate-400 whitespace-nowrap">إلى:</span>
                        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="bg-transparent text-xs md:text-sm font-bold text-[#1E3A8A] outline-none w-full" />
                    </div>
                </div>
            </div>

            {currentSessions.length === 0 ? (
                <div className="py-16 md:py-20 text-center flex flex-col items-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-3 md:mb-4 text-3xl md:text-4xl text-slate-300"><i className="fas fa-calendar-times"></i></div>
                    <h3 className="font-black text-lg md:text-xl text-[#1E3A8A] mb-1">لا توجد جلسات</h3>
                    <p className="text-slate-400 font-bold text-xs md:text-sm">لم يتم العثور على جلسات تطابق خيارات البحث.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {currentSessions.map(session => {
                        const isDone = checkIsCompleted(session.status);
                        return (
                            <div key={session.id} className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden relative transition-all hover:border-[#D4AF37] hover:shadow-md flex flex-col">
                                
                                <div className="flex justify-between items-center p-5 border-b border-slate-50">
                                    <div>
                                        <span className="block text-[10px] md:text-[11px] font-bold text-slate-400 mb-1">تاريخ الجلسة</span>
                                        <span className="font-black text-[#1E3A8A] text-lg md:text-xl tracking-wide" dir="ltr">{session.session_date}</span>
                                    </div>
                                    {getStatusIcon(session.status)}
                                </div>
                                
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="bg-slate-50/80 rounded-2xl p-4 md:p-5 border border-slate-100 flex-1">
                                        <span className="block text-[10px] md:text-[11px] font-bold text-slate-400 mb-2">القرار / المطلوب</span>
                                        <p className="text-sm font-bold text-[#1E3A8A] leading-relaxed whitespace-pre-wrap">
                                            {session.decision || session.notes || "لم يتم تدوين ملاحظات."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center px-5 pb-5 mt-auto">
                                    <button onClick={() => openEditSession(session)} className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-[#1E3A8A] px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors active:scale-95 shadow-sm">
                                        <i className="fas fa-pen text-[#1E3A8A]"></i> تحديث القرار
                                    </button>
                                    
                                    <div className="flex gap-2">
                                        <button onClick={() => handleDeleteSession(session.id)} className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors active:scale-95 shadow-sm" title="حذف الجلسة">
                                            <i className="fas fa-trash text-sm"></i>
                                        </button>

                                        {/* التبديل الفوري بالقيم المتطابقة تماماً مع الأجندة */}
                                        {!isDone ? (
                                            <button 
                                                onClick={() => handleUpdateStatus(session.id, 'completed')} 
                                                className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors active:scale-95 shadow-sm" 
                                                title="إنهاء الجلسة"
                                            >
                                                <i className="fas fa-check text-sm"></i>
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleUpdateStatus(session.id, 'upcoming')} 
                                                className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors active:scale-95 shadow-sm" 
                                                title="استرجاع الجلسة للرول"
                                            >
                                                <i className="fas fa-undo text-sm"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}

            {filteredSessions.length > itemsPerPage && (
                <div className="p-3 md:p-4 bg-white md:bg-slate-50 border border-slate-200 md:border-t md:border-x-0 md:border-b-0 flex items-center justify-between rounded-2xl md:rounded-none shadow-sm md:shadow-none mt-4 md:mt-0">
                    <p className="text-[11px] md:text-xs font-bold text-slate-500">
                        صفحة {currentPage} من {totalPages}
                    </p>
                    <div className="flex gap-1">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                            disabled={currentPage === 1} 
                            className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1E3A8A] hover:text-white transition-colors disabled:opacity-50"
                        >
                            <i className="fas fa-chevron-right text-[10px] md:text-xs"></i>
                        </button>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                            disabled={currentPage === totalPages} 
                            className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1E3A8A] hover:text-white transition-colors disabled:opacity-50"
                        >
                            <i className="fas fa-chevron-left text-[10px] md:text-xs"></i>
                        </button>
                    </div>
                </div>
            )}

            {isAddEditOpen && (
                <window.CaseSessionAddEditModal 
                    caseId={selectedCase.id} 
                    showToast={showToast} 
                    modalMode={sessionModalMode} 
                    editData={editSessionData} 
                    onClose={() => setIsAddEditOpen(false)} 
                />
            )}
        </div>
    );
};