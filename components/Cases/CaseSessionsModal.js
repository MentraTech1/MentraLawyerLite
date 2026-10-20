// المسار: components/Cases/CaseSessionsModal.js

window.CaseSessionsModal = function({ selectedCase, showToast, onClose }) {
    const { useState } = React;
    
    // حالة التحكم بنافذة إضافة/تعديل الجلسة
    const [isAddEditOpen, setIsAddEditOpen] = useState(false);
    const [sessionModalMode, setSessionModalMode] = useState('add');
    const [editSessionData, setEditSessionData] = useState(null);

    // حالة الـ Pagination (الحد 3)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // جلب الجلسات الخاصة بهذه القضية فقط (تتحدث تلقائياً)
    const rawSessions = window.useLiveQuery(
        () => window.db.agenda_sessions.where('case_id').equals(selectedCase.id).toArray(),
        [selectedCase.id]
    ) || [];

    // ترتيب الجلسات من الأحدث للأقدم
    const sortedSessions = [...rawSessions].sort((a, b) => new Date(b.session_date) - new Date(a.session_date));

    // تقسيم البيانات (Pagination)
    const totalPages = Math.ceil(sortedSessions.length / itemsPerPage) || 1;
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSessions = sortedSessions.slice(startIndex, startIndex + itemsPerPage);

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

    const getStatusStyle = (status) => {
        if (status === 'قادمة') return 'bg-amber-100 text-amber-700 border-amber-200';
        if (status === 'تمت') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        return 'bg-slate-100 text-slate-700 border-slate-200';
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-3 sm:p-4 animate-view">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[95vh] md:max-h-[90vh]">
                
                {/* رأس النافذة */}
                <div className="bg-slate-50 p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 relative">
                    <button onClick={onClose} className="absolute top-4 left-4 md:top-6 md:left-6 text-slate-400 hover:text-rose-500 transition text-xl w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm"><i className="fas fa-times"></i></button>
                    <div>
                        <h3 className="text-lg md:text-xl font-black text-[#1E3A8A] flex items-center gap-2">
                            <i className="fas fa-calendar-check text-[#D4AF37]"></i>
                            جلسات القضية
                        </h3>
                        <p className="text-xs md:text-sm font-bold text-slate-500 mt-1">رقم الدعوى: {selectedCase.case_number}</p>
                    </div>
                    <button onClick={openAddSession} className="w-full md:w-auto bg-[#1E3A8A] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95">
                        <i className="fas fa-plus"></i> إضافة جلسة
                    </button>
                </div>

                {/* المحتوى */}
                <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
                    {currentSessions.length === 0 ? (
                        <div className="py-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3 text-3xl text-slate-300"><i className="fas fa-calendar-times"></i></div>
                            <h3 className="font-black text-lg text-[#1E3A8A] mb-1">لا توجد جلسات</h3>
                            <p className="text-slate-400 font-bold text-xs md:text-sm">لم يتم تسجيل أي جلسة لهذه القضية حتى الآن.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {currentSessions.map(session => (
                                <div key={session.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4 transition hover:border-[#D4AF37]">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-[#1E3A8A] text-sm md:text-base"><i className="fas fa-clock text-[#D4AF37] ml-1"></i> {session.session_date}</span>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${getStatusStyle(session.status)}`}>{session.status}</span>
                                        </div>
                                        <p className="text-xs md:text-sm font-bold text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                                            <span className="text-slate-400 text-[10px] block mb-1">القرار / الملاحظات:</span>
                                            {session.decision || "لا يوجد قرار مسجل"}
                                        </p>
                                    </div>
                                    <div className="flex md:flex-col gap-2 shrink-0 md:w-24">
                                        <button onClick={() => openEditSession(session)} className="flex-1 bg-white border border-slate-200 text-[#1E3A8A] py-2 md:py-1.5 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors">تعديل</button>
                                        <button onClick={() => handleDeleteSession(session.id)} className="flex-1 bg-white border border-slate-200 text-rose-500 py-2 md:py-1.5 rounded-xl text-xs font-bold hover:bg-rose-50 transition-colors">حذف</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination (يظهر فقط إذا كان هناك أكثر من 3 جلسات) */}
                {sortedSessions.length > itemsPerPage && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                        <p className="text-[11px] md:text-xs font-bold text-slate-500">
                            إجمالي {sortedSessions.length} جلسات
                        </p>
                        <div className="flex gap-1">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                disabled={currentPage === 1} 
                                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1E3A8A] hover:text-white transition-colors disabled:opacity-50"
                            >
                                <i className="fas fa-chevron-right text-[10px]"></i>
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#1E3A8A]">{currentPage}</span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                disabled={currentPage === totalPages} 
                                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1E3A8A] hover:text-white transition-colors disabled:opacity-50"
                            >
                                <i className="fas fa-chevron-left text-[10px]"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* نافذة الإضافة والتعديل الفرعية */}
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