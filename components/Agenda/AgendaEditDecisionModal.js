// المسار: components/Agenda/AgendaEditDecisionModal.js

window.AgendaEditDecisionModal = function({ session, onClose, onSave }) {
    const { useState, useEffect, useRef } = React;
    const [notes, setNotes] = useState(session.notes || '');
    const textareaRef = useRef(null);

    // التركيز التلقائي على حقل النص عند فتح النافذة
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            // وضع المؤشر في نهاية النص
            textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(session.id, notes);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-view">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col">
                
                {/* هيدر النافذة */}
                <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-900 p-5 md:p-6 text-center relative shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center text-white text-lg md:text-xl mx-auto mb-2 backdrop-blur-md shadow-inner">
                        <i className="fas fa-pen-nib"></i>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-white tracking-wide">تحديث القرار أو الملاحظات</h3>
                    <button onClick={onClose} type="button" className="absolute left-4 top-4 text-white/50 hover:text-white transition text-lg bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                {/* محتوى النافذة */}
                <div className="p-5 md:p-6 flex-1 bg-slate-50/50">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-xs md:text-sm font-bold text-[#1E3A8A]">
                                    القرار / المطلوب لجلسة <span className="text-slate-500 dir-ltr inline-block ml-1">({session.session_date})</span>
                                </label>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">رقم: {session.case_number}</span>
                            </div>
                            
                            <textarea
                                ref={textareaRef}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows="6"
                                placeholder="اكتب منطوق القرار، الملاحظات، أو التأجيل هنا بشكل مفصل..."
                                className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-yellow-500/10 font-bold text-sm md:text-base text-slate-700 resize-none transition-all leading-relaxed shadow-inner"
                            ></textarea>
                        </div>
                        
                        <div className="flex gap-3 pt-4 border-t border-slate-100">
                            <button type="submit" className="flex-1 bg-[#1E3A8A] hover:bg-blue-900 text-white font-black py-3.5 md:py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all text-sm md:text-base flex items-center justify-center gap-2 active:scale-95">
                                <i className="fas fa-save"></i> حفظ التحديث
                            </button>
                            <button type="button" onClick={onClose} className="flex-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-black py-3.5 md:py-4 rounded-xl shadow-sm transition-all text-sm md:text-base flex items-center justify-center gap-2 active:scale-95">
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};