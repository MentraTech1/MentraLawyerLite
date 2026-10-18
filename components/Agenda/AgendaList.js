// المسار: components/Agenda/AgendaList.js

window.AgendaList = function({ paginatedSessions, handleUpdateStatus, handleEditDecision, handleDeleteSession }) {
    const todayStr = new Date().toISOString().split('T')[0];

    if (paginatedSessions.length === 0) {
        return (
            <div className="col-span-full py-16 md:py-24 text-center bg-white rounded-2xl md:rounded-3xl border border-dashed border-slate-300">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl md:text-5xl text-slate-300 shadow-inner">
                    <i className="fas fa-calendar-times"></i>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-[#1E3A8A] mb-2">الرول فارغ</h3>
                <p className="text-xs md:text-sm font-bold text-slate-400">لا توجد جلسات مسجلة في هذا القسم.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {paginatedSessions.map(session => (
                <div key={session.id} className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group">
                    
                    <div className="p-4 md:p-5 border-b border-slate-50 flex justify-between items-start bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-inner ${session.session_date === todayStr ? 'bg-rose-100 text-rose-600' : session.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                <i className={`fas ${session.status === 'completed' ? 'fa-check-circle' : 'fa-gavel'}`}></i>
                            </div>
                            <div>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mb-0.5 uppercase tracking-wider">تاريخ الجلسة</p>
                                <h4 className="font-black text-[#1E3A8A] text-base md:text-lg tracking-wide" dir="ltr">{session.session_date}</h4>
                            </div>
                        </div>
                        {session.status === 'upcoming' && session.session_date === todayStr && (
                            <span className="bg-rose-500 text-white text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded-full animate-pulse shadow-md">جلسة اليوم!</span>
                        )}
                    </div>
                    
                    <div className="p-4 md:p-5 flex-1 space-y-4">
                        <div>
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">بيانات الدعوى</p>
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-slate-100 flex items-center justify-center text-slate-400 text-[10px] md:text-xs"><i className="fas fa-hashtag"></i></div>
                                <span className="font-bold text-[#1E3A8A] text-xs md:text-sm">رقم: <span className="text-slate-600">{session.case_number}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-slate-100 flex items-center justify-center text-slate-400 text-[10px] md:text-xs"><i className="fas fa-user-tie"></i></div>
                                <span className="font-bold text-[#1E3A8A] text-xs md:text-sm line-clamp-1">الموكل: <span className="text-slate-600">{session.client_name}</span></span>
                            </div>
                        </div>

                        <div className="bg-[#F8FAFC] p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 relative group-hover:bg-white transition-colors">
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">القرار / المطلوب</p>
                            <p className="text-xs md:text-sm font-bold text-slate-700 leading-relaxed whitespace-pre-wrap">{session.notes || 'لم يتم تدوين ملاحظات.'}</p>
                        </div>
                    </div>
                    
                    <div className="p-3 md:p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex gap-2">
                            {session.status !== 'completed' ? (
                                <button onClick={() => handleUpdateStatus(session.id, 'completed')} className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors"><i className="fas fa-check text-xs md:text-sm"></i></button>
                            ) : (
                                <button onClick={() => handleUpdateStatus(session.id, 'upcoming')} className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors"><i className="fas fa-undo text-xs md:text-sm"></i></button>
                            )}
                            <button onClick={() => handleDeleteSession(session.id)} className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"><i className="fas fa-trash text-xs md:text-sm"></i></button>
                        </div>
                        <button onClick={() => handleEditDecision(session)} className="text-[10px] md:text-xs font-bold text-[#1E3A8A] hover:text-[#D4AF37] bg-white border border-slate-200 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl transition-colors flex items-center gap-1.5">
                            <i className="fas fa-pen"></i> تحديث القرار
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};