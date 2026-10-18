// المسار: components/Agenda/Module_Agenda_Container.js

window.Module_Agenda_Container = function({ firmId, showToast }) {
    const { useState, useEffect } = React;
    
    const [activeTab, setActiveTab] = useState('today'); 
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null); // 👈 حالة جديدة للنافذة المنبثقة
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 3; 

    const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); 

    useEffect(() => {
        setCurrentPage(1);
        if (activeTab !== 'calendar') {
            setSelectedCalendarDate(null);
        }
    }, [activeTab, searchTerm]); 

    const allSessions = window.useLiveQuery(async () => {
        if (!window.db) return [];
        const firmCases = await window.db.cases.where('firm_id').equals(firmId).toArray();
        const caseIds = firmCases.map(c => c.id);
        if (caseIds.length === 0) return [];
        
        const clients = await window.db.clients.where('firm_id').equals(firmId).toArray();
        const sessions = await window.db.agenda_sessions.where('case_id').anyOf(caseIds).toArray();
        
        return sessions.map(session => {
            const caseObj = firmCases.find(c => c.id === session.case_id);
            const clientObj = caseObj ? clients.find(c => c.id === caseObj.client_id) : null;
            return {
                ...session,
                case_number: caseObj ? caseObj.case_number : 'غير محدد',
                client_name: clientObj ? clientObj.name : 'غير محدد'
            };
        });
    }, [firmId]) || [];

    const getToday = () => new Date().toISOString().split('T')[0];
    const todayStr = getToday();

    const filteredSessions = allSessions.filter(s => {
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            const caseNum = s.case_number ? s.case_number.toString().toLowerCase() : '';
            const client = s.client_name ? s.client_name.toLowerCase() : '';
            const notes = s.notes ? s.notes.toLowerCase() : '';
            return caseNum.includes(term) || client.includes(term) || notes.includes(term);
        }
        if (activeTab === 'today') return s.session_date === todayStr && s.status !== 'completed';
        if (activeTab === 'upcoming') return s.session_date > todayStr && s.status !== 'completed';
        if (activeTab === 'past') return s.session_date < todayStr || s.status === 'completed';
        if (activeTab === 'calendar' && selectedCalendarDate) return s.session_date === selectedCalendarDate;
        return false;
    }).sort((a, b) => {
        return (searchTerm.trim() !== '' || activeTab === 'past' || (activeTab === 'calendar' && selectedCalendarDate)) 
            ? b.session_date.localeCompare(a.session_date) 
            : a.session_date.localeCompare(b.session_date);
    });

    const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE) || 1;
    const paginatedSessions = filteredSessions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await window.db.agenda_sessions.update(id, { status: newStatus });
            showToast(newStatus === 'completed' ? "تم إغلاق الجلسة بنجاح" : "تم استرجاع الجلسة", "success");
        } catch (error) {
            showToast("حدث خطأ في التحديث", "error");
        }
    };

    // 👈 التعديل الأول: فتح النافذة بدلاً من الـ prompt
    const handleEditDecision = (session) => {
        setEditingSession(session);
    };

    // 👈 التعديل الثاني: حفظ البيانات القادمة من النافذة المنبثقة
    const handleSaveDecision = async (sessionId, newNotes) => {
        try {
            await window.db.agenda_sessions.update(sessionId, { notes: newNotes });
            showToast("تم تحديث القرار بنجاح", "success");
            setEditingSession(null); // إغلاق النافذة
        } catch (error) {
            showToast("حدث خطأ في التحديث", "error");
        }
    };

    const handleDeleteSession = async (id) => {
        if (confirm("هل أنت متأكد من حذف هذه الجلسة بشكل نهائي؟")) {
            try {
                await window.db.agenda_sessions.delete(id);
                if (paginatedSessions.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                }
                showToast("تم حذف الجلسة", "success");
            } catch (error) {
                showToast("حدث خطأ أثناء الحذف", "error");
            }
        }
    };

    const handleDayClick = (dateStr, daySessions) => {
        setSelectedCalendarDate(dateStr);
        setSearchTerm(''); 
        setCurrentPage(1); 
    };

    return (
        <div className="space-y-6 animate-view pb-8">
            
            {window.AgendaToolbar && (
                <window.AgendaToolbar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    allSessions={allSessions} 
                    setIsAddModalOpen={setIsAddModalOpen} 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
            )}

            {searchTerm.trim() !== '' && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-sm font-bold flex items-center justify-between">
                    <span><i className="fas fa-search mr-2"></i> يتم الآن البحث في جميع الجلسات المسجلة... ({filteredSessions.length} نتيجة)</span>
                </div>
            )}

            {activeTab === 'calendar' && !selectedCalendarDate && searchTerm.trim() === '' ? (
                window.AgendaCalendar ? (
                    <window.AgendaCalendar allSessions={allSessions} onDayClick={handleDayClick} />
                ) : (
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center text-slate-500 font-bold">
                        <i className="fas fa-spinner fa-spin text-[#D4AF37] text-2xl mb-2 block"></i> جاري تحميل التقويم الذكي...
                    </div>
                )
            ) : (
                <div className="space-y-6">
                    {activeTab === 'calendar' && selectedCalendarDate && searchTerm.trim() === '' && (
                        <div className="bg-blue-50 border-2 border-blue-100 p-4 rounded-2xl flex items-center justify-between shadow-sm animate-view">
                            <div>
                                <h3 className="font-black text-[#1E3A8A] text-lg">جلسات مرافعة يوم</h3>
                                <p className="text-slate-600 font-bold dir-ltr">{selectedCalendarDate}</p>
                            </div>
                            <button onClick={() => setSelectedCalendarDate(null)} className="bg-white text-[#1E3A8A] border border-blue-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-[#1E3A8A] hover:text-white transition-colors flex items-center gap-2">
                                <i className="fas fa-arrow-right"></i> العودة للتقويم
                            </button>
                        </div>
                    )}

                    {window.AgendaList && (
                        <window.AgendaList 
                            paginatedSessions={paginatedSessions} 
                            handleUpdateStatus={handleUpdateStatus} 
                            handleEditDecision={handleEditDecision} 
                            handleDeleteSession={handleDeleteSession} 
                        />
                    )}

                    {window.AgendaPagination && (
                        <window.AgendaPagination 
                            totalFiltered={filteredSessions.length} 
                            ITEMS_PER_PAGE={ITEMS_PER_PAGE} 
                            currentPage={currentPage} 
                            setCurrentPage={setCurrentPage} 
                            totalPages={totalPages} 
                        />
                    )}
                </div>
            )}

            {window.AgendaPromo && <window.AgendaPromo />}

            {/* نافذة الإضافة */}
            {isAddModalOpen && window.AgendaAddModal && (
                <window.AgendaAddModal firmId={firmId} showToast={showToast} setIsAddModalOpen={setIsAddModalOpen} />
            )}

            {/* 👈 التعديل الثالث: استدعاء نافذة تعديل القرار الجديدة */}
            {editingSession && window.AgendaEditDecisionModal && (
                <window.AgendaEditDecisionModal 
                    session={editingSession} 
                    onClose={() => setEditingSession(null)} 
                    onSave={handleSaveDecision} 
                />
            )}
        </div>
    );
};