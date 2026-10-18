// المسار: components/Cases/CaseAddModal.js

window.CaseAddModal = function({ firmId, showToast, modalMode, editData, onClose }) {
    const { useState, useEffect } = React;
    
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        case_number: '', client_id: '', case_type_id: '', court_id: '', case_status: 'متداولة', created_at: new Date().toISOString().split('T')[0]
    });

    const [clientSearch, setClientSearch] = useState({ term: '', results: [], isSearching: false, display: null, isOpen: false });
    const [courtSearch, setCourtSearch] = useState({ term: '', results: [], isSearching: false, display: null, isOpen: false });
    const [typeSearch, setTypeSearch] = useState({ term: '', results: [], isSearching: false, display: null, isOpen: false });

    // تعبئة البيانات في حالة التعديل
    useEffect(() => {
        if (modalMode === 'edit' && editData) {
            setFormData({
                case_number: editData.case_number, 
                client_id: editData.client_id, 
                case_type_id: editData.case_type_id || '', 
                court_id: editData.court_id || '', 
                case_status: editData.case_status, 
                created_at: editData.safe_date
            });
            setClientSearch(prev => ({ ...prev, display: editData.client_name }));
            setCourtSearch(prev => ({ ...prev, display: editData.court_name }));
            setTypeSearch(prev => ({ ...prev, display: editData.type_name }));
        }
    }, [modalMode, editData]);

    const getSavedCourts = () => {
        try {
            const saved = localStorage.getItem(`MentraLocal_Courts_${firmId}`);
            if (saved) return JSON.parse(saved);
        } catch(e) {}
        return [
            { id: 1, name: 'محكمة القاهرة الجديدة الابتدائية (التجمع الخامس)' },
            { id: 2, name: 'محكمة شمال القاهرة الابتدائية (مجمع العباسية)' },
            { id: 3, name: 'محكمة استئناف القاهرة (دار القضاء العالي)' },
            { id: 4, name: 'محكمة الأسرة (مجمع محاكم الزنانيري)' },
            { id: 5, name: 'مجلس الدولة (محكمة القضاء الإداري)' }
        ];
    };

    const getSavedTypes = () => {
        try {
            const saved = localStorage.getItem(`MentraLocal_CaseTypes_${firmId}`);
            if (saved) return JSON.parse(saved);
        } catch(e) {}
        return [
            { id: 1, name: 'مدني وتعويضات' },
            { id: 2, name: 'جنح وجنايات' },
            { id: 3, name: 'أسرة وأحوال شخصية' },
            { id: 4, name: 'منازعات عمالية' },
            { id: 5, name: 'قضاء إداري ومجلس دولة' }
        ];
    };

    const handleSearchClient = async (e) => {
        const term = e ? e.target.value : clientSearch.term;
        if (e) setClientSearch(prev => ({ ...prev, term }));
        
        setClientSearch(prev => ({ ...prev, isSearching: true, isOpen: true }));
        
        const results = await window.db.clients.where('firm_id').equals(firmId)
            .filter(c => c.name.includes(term))
            .limit(15).toArray();
            
        setClientSearch(prev => ({ ...prev, results, isSearching: false }));
    };

    const handleSearchCourt = (e) => {
        const term = e ? e.target.value : courtSearch.term;
        if (e) setCourtSearch(prev => ({ ...prev, term }));
        
        const savedCourts = getSavedCourts();
        const results = !term.trim() 
            ? savedCourts.slice(0, 15) 
            : savedCourts.filter(c => c.name.includes(term)).slice(0, 15);
            
        setCourtSearch(prev => ({ ...prev, results, isOpen: true }));
    };

    const handleSearchType = (e) => {
        const term = e ? e.target.value : typeSearch.term;
        if (e) setTypeSearch(prev => ({ ...prev, term }));
        
        const savedTypes = getSavedTypes();
        const results = !term.trim() 
            ? savedTypes.slice(0, 15) 
            : savedTypes.filter(t => t.name.includes(term)).slice(0, 15);
            
        setTypeSearch(prev => ({ ...prev, results, isOpen: true }));
    };

    // 🚀 التعديل هنا: استخدام (prev) لضمان عدم ضياع البيانات عند النقر السريع
    const selectItem = (type, item) => {
        if (type === 'client') {
            setFormData(prev => ({ ...prev, client_id: item.id }));
            setClientSearch(prev => ({ ...prev, term: '', isOpen: false, display: item.name }));
        } else if (type === 'court') {
            setFormData(prev => ({ ...prev, court_id: item.id }));
            setCourtSearch(prev => ({ ...prev, term: '', isOpen: false, display: item.name }));
        } else if (type === 'type') {
            setFormData(prev => ({ ...prev, case_type_id: item.id }));
            setTypeSearch(prev => ({ ...prev, term: '', isOpen: false, display: item.name }));
        }
    };

    const clearSelection = (type) => {
        if (type === 'client') { setFormData(prev => ({ ...prev, client_id: '' })); setClientSearch(prev => ({ ...prev, display: null })); }
        if (type === 'court') { setFormData(prev => ({ ...prev, court_id: '' })); setCourtSearch(prev => ({ ...prev, display: null })); }
        if (type === 'type') { setFormData(prev => ({ ...prev, case_type_id: '' })); setTypeSearch(prev => ({ ...prev, display: null })); }
    };

    // 🚀 التعديل هنا: رسائل خطأ دقيقة بدلاً من الصمت، وتحويل الـ ID لأرقام بشكل آمن
    const handleSaveCase = async (e) => {
        e.preventDefault();
        
        if (!formData.client_id) return showToast("الرجاء اختيار الموكل من القائمة المنسدلة", "error");
        if (!formData.court_id) return showToast("الرجاء اختيار المحكمة من القائمة المنسدلة", "error");
        if (!formData.case_type_id) return showToast("الرجاء اختيار نوع القضية من القائمة", "error");
        if (!formData.case_number.trim()) return showToast("الرجاء كتابة رقم القضية", "error");

        setIsLoading(true);
        try {
            const caseData = {
                firm_id: firmId,
                case_number: formData.case_number.trim(),
                client_id: Number(formData.client_id),
                case_type_id: Number(formData.case_type_id),
                court_id: Number(formData.court_id),
                case_status: formData.case_status,
                created_at: formData.created_at ? new Date(formData.created_at).toISOString() : new Date().toISOString()
            };

            if (modalMode === 'edit') {
                await window.db.cases.update(editData.id, caseData);
                showToast("تم تحديث بيانات القضية بنجاح", "success");
            } else {
                await window.db.cases.add(caseData);
                showToast("تم تسجيل القضية بنجاح", "success");
            }
            onClose();
        } catch (error) { 
            console.error("خطأ أثناء الحفظ:", error);
            showToast("حدث خطأ داخلي أثناء الحفظ", "error"); 
        } finally { 
            setIsLoading(false); 
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-3 sm:p-4 animate-view">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[95vh] md:max-h-[90vh]">
                
                <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-900 p-4 md:p-6 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-xl flex items-center justify-center text-base md:text-xl backdrop-blur-md">
                            <i className={`fas ${modalMode === 'edit' ? 'fa-pen' : 'fa-balance-scale'}`}></i>
                        </div>
                        <h3 className="text-base md:text-xl font-black tracking-wide">{modalMode === 'edit' ? 'تعديل بيانات القضية' : 'تسجيل قضية جديدة'}</h3>
                    </div>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition text-lg bg-white/5 w-8 h-8 rounded-full flex items-center justify-center"><i className="fas fa-times"></i></button>
                </div>

                <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form onSubmit={handleSaveCase} className="space-y-4 md:space-y-5">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            <div>
                                <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">رقم القضية وسنتها <span className="text-rose-500">*</span></label>
                                <input type="text" name="case_number" value={formData.case_number} onChange={(e) => setFormData(prev => ({...prev, case_number: e.target.value}))} required placeholder="مثال: 1234 لسنة 2024" className="w-full p-3 md:p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-[#D4AF37] focus:bg-white font-bold text-xs md:text-sm text-[#1E3A8A] transition-all" />
                            </div>
                            <div>
                                <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">تاريخ الإضافة <span className="text-rose-500">*</span></label>
                                <input type="date" name="created_at" value={formData.created_at} onChange={(e) => setFormData(prev => ({...prev, created_at: e.target.value}))} required className="w-full p-3 md:p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-[#D4AF37] focus:bg-white font-bold text-xs md:text-sm text-[#1E3A8A] transition-all" />
                            </div>
                        </div>

                        {/* بحث الموكل */}
                        <div className="relative">
                            <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">الموكل المرتبط <span className="text-rose-500">*</span></label>
                            {clientSearch.display ? (
                                <div className="bg-emerald-50 border-2 border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                                    <span className="text-xs md:text-sm font-bold text-emerald-800 flex items-center gap-1.5"><i className="fas fa-check-circle text-emerald-500"></i><span className="truncate">{clientSearch.display}</span></span>
                                    <button type="button" onClick={() => clearSelection('client')} className="text-rose-500 hover:bg-rose-100 w-7 h-7 rounded-lg transition-colors flex shrink-0 items-center justify-center"><i className="fas fa-times text-sm"></i></button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={clientSearch.term} 
                                        onChange={handleSearchClient} 
                                        onFocus={() => handleSearchClient(null)}
                                        placeholder="ابحث باسم الموكل..." 
                                        className="w-full p-3 md:p-3.5 pl-10 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-[#D4AF37] font-bold text-xs md:text-sm text-[#1E3A8A]" 
                                    />
                                    <i className={`fas ${clientSearch.isSearching ? 'fa-spinner fa-spin' : 'fa-search'} absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm`}></i>
                                    {clientSearch.isOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setClientSearch(prev => ({ ...prev, isOpen: false }))}></div>
                                            <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                                {clientSearch.results.length > 0 ? (
                                                    clientSearch.results.map(item => (
                                                        <li key={item.id} onClick={() => selectItem('client', item)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 font-bold text-[#1E3A8A] text-xs md:text-sm">{item.name}</li>
                                                    ))
                                                ) : (
                                                    <li className="p-3 text-center text-slate-400 font-bold text-xs">لا توجد نتائج (قم بإضافة موكلين أولاً)</li>
                                                )}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            {/* بحث المحكمة */}
                            <div className="relative">
                                <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">المحكمة المختصة <span className="text-rose-500">*</span></label>
                                {courtSearch.display ? (
                                    <div className="bg-emerald-50 border-2 border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                                        <span className="text-xs md:text-sm font-bold text-emerald-800 truncate flex items-center gap-1.5"><i className="fas fa-check-circle text-emerald-500"></i>{courtSearch.display}</span>
                                        <button type="button" onClick={() => clearSelection('court')} className="text-rose-500 hover:bg-rose-100 w-7 h-7 rounded-lg transition-colors flex shrink-0 items-center justify-center"><i className="fas fa-times text-sm"></i></button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={courtSearch.term} 
                                            onChange={handleSearchCourt} 
                                            onFocus={() => handleSearchCourt(null)}
                                            placeholder="اختر المحكمة..." 
                                            className="w-full p-3 md:p-3.5 pl-10 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-[#D4AF37] font-bold text-xs md:text-sm text-[#1E3A8A]" 
                                        />
                                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                                        {courtSearch.isOpen && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setCourtSearch(prev => ({ ...prev, isOpen: false }))}></div>
                                                <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                                    {courtSearch.results.length > 0 ? (
                                                        courtSearch.results.map(item => (
                                                            <li key={item.id} onClick={() => selectItem('court', item)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 font-bold text-[#1E3A8A] text-xs md:text-sm">{item.name}</li>
                                                        ))
                                                    ) : (
                                                        <li className="p-3 text-center text-slate-400 font-bold text-xs">لا توجد محاكم مطابقة</li>
                                                    )}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* بحث نوع القضية */}
                            <div className="relative">
                                <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">نوع القضية <span className="text-rose-500">*</span></label>
                                {typeSearch.display ? (
                                    <div className="bg-emerald-50 border-2 border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                                        <span className="text-xs md:text-sm font-bold text-emerald-800 truncate flex items-center gap-1.5"><i className="fas fa-check-circle text-emerald-500"></i>{typeSearch.display}</span>
                                        <button type="button" onClick={() => clearSelection('type')} className="text-rose-500 hover:bg-rose-100 w-7 h-7 rounded-lg transition-colors flex shrink-0 items-center justify-center"><i className="fas fa-times text-sm"></i></button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={typeSearch.term} 
                                            onChange={handleSearchType} 
                                            onFocus={() => handleSearchType(null)} 
                                            placeholder="اختر نوع القضية..." 
                                            className="w-full p-3 md:p-3.5 pl-10 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-[#D4AF37] font-bold text-xs md:text-sm text-[#1E3A8A]" 
                                        />
                                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                                        {typeSearch.isOpen && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setTypeSearch(prev => ({ ...prev, isOpen: false }))}></div>
                                                <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                                    {typeSearch.results.length > 0 ? (
                                                        typeSearch.results.map(item => (
                                                            <li key={item.id} onClick={() => selectItem('type', item)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 font-bold text-[#1E3A8A] text-xs md:text-sm">{item.name}</li>
                                                        ))
                                                    ) : (
                                                        <li className="p-3 text-center text-slate-400 font-bold text-xs">لا توجد تصنيفات مطابقة</li>
                                                    )}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">الحالة الحالية للقضية</label>
                            <div className="flex flex-wrap sm:flex-nowrap gap-2 md:gap-3 bg-slate-50 p-2 rounded-xl border-2 border-slate-100">
                                {['متداولة', 'محجوزة للحكم', 'منتهية'].map(status => (
                                    <label key={status} className={`flex-1 min-w-[30%] text-center py-2 md:py-2.5 rounded-lg cursor-pointer text-[10px] md:text-xs font-bold transition-all ${formData.case_status === status ? 'bg-white text-[#1E3A8A] shadow-sm border border-[#D4AF37]' : 'text-slate-500 hover:bg-slate-200'}`}>
                                        <input type="radio" name="case_status" value={status} checked={formData.case_status === status} onChange={(e) => setFormData(prev => ({...prev, case_status: e.target.value}))} className="hidden" />
                                        {status}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2">
                            {/* 🚀 التعديل هنا: تمت إزالة شرط التعطيل المعقد للسماح بالضغط وظهور التنبيه */}
                            <button type="submit" disabled={isLoading} className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white font-black py-3.5 md:py-4 rounded-xl shadow-lg transition-all text-sm md:text-base flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save"></i> {modalMode === 'edit' ? 'حفظ التعديلات' : 'حفظ القضية في الأرشيف'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};