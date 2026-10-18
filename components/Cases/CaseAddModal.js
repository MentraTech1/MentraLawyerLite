// المسار: components/Cases/CaseAddModal.js

window.CaseAddModal = function({ firmId, showToast, modalMode, editData, onClose }) {
    const { useState, useEffect } = React;
    
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        case_number: '', client_id: '', case_type_id: '', court_id: '', case_status: 'متداولة', created_at: new Date().toISOString().split('T')[0]
    });

    const [clientSearch, setClientSearch] = useState({ term: '', results: [], isSearching: false, display: null });
    const [courtSearch, setCourtSearch] = useState({ term: '', results: [], isSearching: false, display: null });
    const [typeSearch, setTypeSearch] = useState({ term: '', results: [], isSearching: false, display: null });

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

    // دوال البحث التلقائي
    const handleSearchClient = async (e) => {
        const term = e.target.value;
        setClientSearch(prev => ({ ...prev, term }));
        if (!term.trim()) return setClientSearch(prev => ({ ...prev, results: [] }));
        
        setClientSearch(prev => ({ ...prev, isSearching: true }));
        const results = await window.db.clients.where('firm_id').equals(firmId).filter(c => c.name.includes(term)).limit(10).toArray();
        setClientSearch(prev => ({ ...prev, results, isSearching: false }));
    };

    const handleSearchCourt = async (e) => {
        const term = e.target.value;
        setCourtSearch(prev => ({ ...prev, term }));
        if (!term.trim()) return setCourtSearch(prev => ({ ...prev, results: [] }));
        
        setCourtSearch(prev => ({ ...prev, isSearching: true }));
        const results = await window.db.global_courts.filter(c => c.name.includes(term)).limit(10).toArray();
        setCourtSearch(prev => ({ ...prev, results, isSearching: false }));
    };

    const handleSearchType = async (e) => {
        const term = e.target.value;
        setTypeSearch(prev => ({ ...prev, term }));
        if (!term.trim()) return setTypeSearch(prev => ({ ...prev, results: [] }));
        
        setTypeSearch(prev => ({ ...prev, isSearching: true }));
        const results = await window.db.global_case_types.filter(c => c.name.includes(term)).limit(10).toArray();
        setTypeSearch(prev => ({ ...prev, results, isSearching: false }));
    };

    const selectItem = (type, item) => {
        if (type === 'client') {
            setFormData({ ...formData, client_id: item.id });
            setClientSearch({ term: '', results: [], isSearching: false, display: item.name });
        } else if (type === 'court') {
            setFormData({ ...formData, court_id: item.id });
            setCourtSearch({ term: '', results: [], isSearching: false, display: item.name });
        } else if (type === 'type') {
            setFormData({ ...formData, case_type_id: item.id });
            setTypeSearch({ term: '', results: [], isSearching: false, display: item.name });
        }
    };

    const clearSelection = (type) => {
        if (type === 'client') { setFormData({ ...formData, client_id: '' }); setClientSearch(prev => ({ ...prev, display: null })); }
        if (type === 'court') { setFormData({ ...formData, court_id: '' }); setCourtSearch(prev => ({ ...prev, display: null })); }
        if (type === 'type') { setFormData({ ...formData, case_type_id: '' }); setTypeSearch(prev => ({ ...prev, display: null })); }
    };

    const handleSaveCase = async (e) => {
        e.preventDefault();
        if (!formData.client_id || !formData.court_id || !formData.case_type_id) {
            showToast("الرجاء استكمال اختيار الموكل والمحكمة ونوع القضية", "error");
            return;
        }

        setIsLoading(true);
        try {
            const caseData = {
                firm_id: firmId,
                case_number: formData.case_number,
                client_id: parseInt(formData.client_id),
                case_type_id: parseInt(formData.case_type_id),
                court_id: parseInt(formData.court_id),
                case_status: formData.case_status,
                created_at: new Date(formData.created_at).toISOString()
            };

            if (modalMode === 'edit') {
                await window.db.cases.update(editData.id, caseData);
                showToast("تم تحديث بيانات القضية بنجاح", "success");
            } else {
                await window.db.cases.add(caseData);
                showToast("تم تسجيل القضية بنجاح", "success");
            }
            onClose();
        } catch (error) { showToast("حدث خطأ أثناء الحفظ", "error"); } 
        finally { setIsLoading(false); }
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
                                <input type="text" name="case_number" value={formData.case_number} onChange={(e) => setFormData({...formData, case_number: e.target.value})} required placeholder="مثال: 1234 لسنة 2024" className="w-full p-3 md:p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-[#D4AF37] focus:bg-white font-bold text-xs md:text-sm text-[#1E3A8A] transition-all" />
                            </div>
                            <div>
                                <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">تاريخ الإضافة <span className="text-rose-500">*</span></label>
                                <input type="date" name="created_at" value={formData.created_at} onChange={(e) => setFormData({...formData, created_at: e.target.value})} required className="w-full p-3 md:p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-[#D4AF37] focus:bg-white font-bold text-xs md:text-sm text-[#1E3A8A] transition-all" />
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
                                    <input type="text" value={clientSearch.term} onChange={handleSearchClient} placeholder="ابحث باسم الموكل..." className="w-full p-3 md:p-3.5 pl-10 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-[#D4AF37] font-bold text-xs md:text-sm text-[#1E3A8A]" />
                                    <i className={`fas ${clientSearch.isSearching ? 'fa-spinner fa-spin' : 'fa-search'} absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm`}></i>
                                    {clientSearch.results.length > 0 && (
                                        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                            {clientSearch.results.map(item => (
                                                <li key={item.id} onClick={() => selectItem('client', item)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 font-bold text-[#1E3A8A] text-xs md:text-sm">{item.name}</li>
                                            ))}
                                        </ul>
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
                                        <input type="text" value={courtSearch.term} onChange={handleSearchCourt} placeholder="اسم المحكمة..." className="w-full p-3 md:p-3.5 pl-10 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-[#D4AF37] font-bold text-xs md:text-sm text-[#1E3A8A]" />
                                        <i className={`fas ${courtSearch.isSearching ? 'fa-spinner fa-spin' : 'fa-search'} absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm`}></i>
                                        {courtSearch.results.length > 0 && (
                                            <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                                {courtSearch.results.map(item => (
                                                    <li key={item.id} onClick={() => selectItem('court', item)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 font-bold text-[#1E3A8A] text-xs md:text-sm">{item.name}</li>
                                                ))}
                                            </ul>
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
                                        <input type="text" value={typeSearch.term} onChange={handleSearchType} placeholder="نوع القضية..." className="w-full p-3 md:p-3.5 pl-10 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-[#D4AF37] font-bold text-xs md:text-sm text-[#1E3A8A]" />
                                        <i className={`fas ${typeSearch.isSearching ? 'fa-spinner fa-spin' : 'fa-search'} absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm`}></i>
                                        {typeSearch.results.length > 0 && (
                                            <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                                {typeSearch.results.map(item => (
                                                    <li key={item.id} onClick={() => selectItem('type', item)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 font-bold text-[#1E3A8A] text-xs md:text-sm">{item.name}</li>
                                                ))}
                                            </ul>
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
                                        <input type="radio" name="case_status" value={status} checked={formData.case_status === status} onChange={(e) => setFormData({...formData, case_status: e.target.value})} className="hidden" />
                                        {status}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2">
                            <button type="submit" disabled={isLoading || !formData.client_id || !formData.court_id || !formData.case_type_id} className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white font-black py-3.5 md:py-4 rounded-xl shadow-lg transition-all text-sm md:text-base flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save"></i> {modalMode === 'edit' ? 'حفظ التعديلات' : 'حفظ القضية في الأرشيف'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};