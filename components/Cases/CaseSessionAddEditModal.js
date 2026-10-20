// المسار: components/Cases/CaseSessionAddEditModal.js

window.CaseSessionAddEditModal = function({ caseId, showToast, modalMode, editData, onClose }) {
    const { useState, useEffect, useRef } = React;
    const [isLoading, setIsLoading] = useState(false);
    
    // دالة مساعدة لتوحيد الحالة عند فتح نافذة التعديل
    const normalizeStatus = (status) => {
        if (status === 'تمت' || status === 'completed') return 'completed';
        if (status === 'قادمة' || status === 'upcoming') return 'upcoming';
        return status || 'upcoming';
    };

    const [formData, setFormData] = useState({
        session_date: '',
        status: 'upcoming', // القيمة القياسية
        decision: ''
    });

    const textareaRef = useRef(null);

    // تعبئة البيانات عند التعديل مع دعم التوافق التام
    useEffect(() => {
        if (modalMode === 'edit' && editData) {
            setFormData({
                session_date: editData.session_date || '',
                status: normalizeStatus(editData.status),
                decision: editData.decision || editData.notes || '' // قراءة القرار أو الملاحظات أيهما متوفر
            });
        }
    }, [modalMode, editData]);

    // التركيز التلقائي على حقل النص عند فتح النافذة
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
        }
    }, []);

    const handleSaveSession = async (e) => {
        e.preventDefault();
        if (!formData.session_date) return showToast("الرجاء تحديد تاريخ الجلسة", "error");

        setIsLoading(true);
        try {
            const textContent = formData.decision.trim();
            
            // تجهيز بيانات الجلسة مع حفظ القرار في الحقلين معاً للمزامنة الكاملة
            let sessionData = {
                case_id: caseId,
                session_date: formData.session_date,
                status: formData.status,
                decision: textContent,
                notes: textContent // 🌟 مزامنة notes مع decision لتقرأها الأجندة فوراً
            };

            if (modalMode === 'edit') {
                await window.db.agenda_sessions.update(editData.id, sessionData);
                showToast("تم تعديل الجلسة بنجاح", "success");
            } else {
                // عند إضافة جلسة جديدة: نجلب اسم الموكل ورقم القضية لضمان ظهورها بشكل مكتمل في الأجندة
                if (window.db.cases) {
                    try {
                        const currentCase = await window.db.cases.get(caseId);
                        if (currentCase) {
                            sessionData.case_number = currentCase.case_number || '';
                            sessionData.client_name = currentCase.client_name || '';
                        }
                    } catch (e) {
                        console.warn("Could not fetch case details", e);
                    }
                }

                await window.db.agenda_sessions.add(sessionData);
                showToast("تمت إضافة الجلسة بنجاح", "success");
            }
            onClose(); 
        } catch (error) {
            console.error(error);
            showToast("حدث خطأ أثناء حفظ الجلسة", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-view">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col">
                
                {/* هيدر النافذة */}
                <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-900 p-5 md:p-6 text-center relative shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center text-white text-lg md:text-xl mx-auto mb-2 backdrop-blur-md shadow-inner">
                        <i className={`fas ${modalMode === 'edit' ? 'fa-pen-nib' : 'fa-calendar-plus'}`}></i>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-white tracking-wide">
                        {modalMode === 'edit' ? 'تحديث بيانات الجلسة' : 'إضافة جلسة جديدة'}
                    </h3>
                    <button onClick={onClose} type="button" className="absolute left-4 top-4 text-white/50 hover:text-white transition text-lg bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* محتوى النافذة */}
                <div className="p-5 md:p-6 flex-1 bg-slate-50/50">
                    <form onSubmit={handleSaveSession} className="space-y-4 md:space-y-5">
                        
                        {/* صف التاريخ والحالة */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs md:text-sm font-bold text-[#1E3A8A] mb-2">تاريخ الجلسة <span className="text-rose-500">*</span></label>
                                <input 
                                    type="date" 
                                    value={formData.session_date} 
                                    onChange={e => setFormData({...formData, session_date: e.target.value})} 
                                    required 
                                    className="w-full p-3.5 rounded-xl border-2 border-slate-200 bg-white outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-yellow-500/10 font-bold text-sm text-[#1E3A8A] transition-all shadow-inner" 
                                />
                            </div>

                            <div>
                                <label className="block text-xs md:text-sm font-bold text-[#1E3A8A] mb-2">حالة الجلسة</label>
                                <select 
                                    value={formData.status} 
                                    onChange={e => setFormData({...formData, status: e.target.value})} 
                                    className="w-full p-3.5 rounded-xl border-2 border-slate-200 bg-white outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-yellow-500/10 font-bold text-sm text-[#1E3A8A] cursor-pointer transition-all shadow-inner"
                                >
                                    <option value="upcoming">قادمة</option>
                                    <option value="completed">تمت / منتهية</option>
                                    <option value="مؤجلة">مؤجلة</option>
                                </select>
                            </div>
                        </div>

                        {/* حقل القرار / الملاحظات */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-xs md:text-sm font-bold text-[#1E3A8A]">
                                    القرار / المطلوب
                                </label>
                            </div>
                            
                            <textarea
                                ref={textareaRef}
                                value={formData.decision}
                                onChange={e => setFormData({...formData, decision: e.target.value})}
                                rows="5"
                                placeholder="اكتب منطوق القرار، الملاحظات، أو سبب التأجيل هنا بشكل مفصل..."
                                className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-yellow-500/10 font-bold text-sm md:text-base text-slate-700 resize-none transition-all leading-relaxed shadow-inner"
                            ></textarea>
                        </div>

                        {/* الأزرار السفلية */}
                        <div className="flex gap-3 pt-4 border-t border-slate-100">
                            <button type="submit" disabled={isLoading} className="flex-1 bg-[#1E3A8A] hover:bg-blue-900 text-white font-black py-3.5 md:py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all text-sm md:text-base flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save"></i> حفظ الجلسة</>}
                            </button>
                            <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-black py-3.5 md:py-4 rounded-xl shadow-sm transition-all text-sm md:text-base flex items-center justify-center gap-2 active:scale-95">
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};