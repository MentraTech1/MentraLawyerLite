// المسار: components/Documents/DocumentAddModal.js

window.DocumentAddModal = function({ firmId, showToast, modalMode, editData, onClose, onSuccess }) {
    const { useState, useEffect } = React;
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        case_id: '', title: '', content: '', created_at: new Date().toISOString().split('T')[0]
    });
    const [caseSearch, setCaseSearch] = useState({ term: '', results: [], isSearching: false, display: null });

    // تعبئة البيانات في حالة التعديل
    useEffect(() => {
        if (modalMode === 'edit' && editData) {
            setFormData({
                case_id: editData.case_id, 
                title: editData.title, 
                content: editData.content, 
                created_at: editData.safe_date
            });
            setCaseSearch({ term: '', results: [], isSearching: false, display: `رقم القضية: ${editData.case_number}` });
        }
    }, [modalMode, editData]);

    const handleSearchCase = async (e) => {
        const term = e.target.value;
        setCaseSearch(prev => ({ ...prev, term }));
        if (!term.trim()) return setCaseSearch(prev => ({ ...prev, results: [] }));
        
        setCaseSearch(prev => ({ ...prev, isSearching: true }));
        const results = await window.db.cases.where('firm_id').equals(firmId).filter(c => c.case_number.includes(term)).limit(10).toArray();
        setCaseSearch(prev => ({ ...prev, results, isSearching: false }));
    };

    const selectCase = (caseItem) => {
        setFormData({ ...formData, case_id: caseItem.id });
        setCaseSearch({ term: '', results: [], isSearching: false, display: `رقم القضية: ${caseItem.case_number}` });
    };

    const clearSelectedCase = () => {
        setFormData({ ...formData, case_id: '' });
        setCaseSearch(prev => ({ ...prev, display: null }));
    };

    const handleSaveDoc = async (e) => {
        e.preventDefault();
        if (!formData.case_id) {
            showToast("الرجاء اختيار القضية", "error"); return;
        }

        setIsLoading(true);
        try {
            const docData = {
                case_id: parseInt(formData.case_id),
                title: formData.title,
                doc_type: 'memo',
                content: formData.content,
                created_at: new Date(formData.created_at).toISOString()
            };

            if (modalMode === 'edit') {
                await window.db.case_documents.update(editData.id, docData);
                showToast("تم تحديث المذكرة بنجاح", "success");
            } else {
                await window.db.case_documents.add(docData);
                showToast("تم حفظ المذكرة بنجاح", "success");
            }
            
            onSuccess();
            onClose();
        } catch (error) {
            showToast("حدث خطأ أثناء الحفظ", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-3 sm:p-4 animate-view">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 flex flex-col max-h-[95vh] md:max-h-[90vh]">
                
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 md:p-6 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-xl flex items-center justify-center text-base md:text-xl backdrop-blur-md">
                            <i className={`fas ${modalMode === 'edit' ? 'fa-pen' : 'fa-pen-nib'}`}></i>
                        </div>
                        <h3 className="text-base md:text-xl font-black tracking-wide">{modalMode === 'edit' ? 'تعديل المذكرة' : 'كتابة مذكرة أو مرافعة'}</h3>
                    </div>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition text-lg bg-white/5 w-8 h-8 rounded-full flex items-center justify-center"><i className="fas fa-times"></i></button>
                </div>

                <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form onSubmit={handleSaveDoc} className="space-y-4 md:space-y-5">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            <div className="relative">
                                <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">القضية المرتبطة <span className="text-rose-500">*</span></label>
                                {caseSearch.display ? (
                                    <div className="bg-emerald-50 border-2 border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                                        <span className="text-xs md:text-sm font-bold text-emerald-800 flex items-center gap-1.5"><i className="fas fa-check-circle text-emerald-500"></i><span className="truncate">{caseSearch.display}</span></span>
                                        <button type="button" onClick={clearSelectedCase} className="text-rose-500 hover:bg-rose-100 w-7 h-7 rounded-lg transition-colors flex shrink-0 items-center justify-center"><i className="fas fa-times text-sm"></i></button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input type="text" value={caseSearch.term} onChange={handleSearchCase} placeholder="ابحث برقم القضية..." className="w-full p-3 md:p-3.5 pl-10 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-indigo-500 font-bold text-xs md:text-sm text-[#1E3A8A]" />
                                        <i className={`fas ${caseSearch.isSearching ? 'fa-spinner fa-spin' : 'fa-search'} absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm`}></i>
                                        {caseSearch.results.length > 0 && (
                                            <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                                {caseSearch.results.map(c => (
                                                    <li key={c.id} onClick={() => selectCase(c)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 font-bold text-[#1E3A8A] text-xs md:text-sm">رقم: {c.case_number}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">عنوان المذكرة <span className="text-rose-500">*</span></label>
                                <input type="text" name="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required placeholder="مثال: مذكرة دفاع في جنحة..." className="w-full p-3 md:p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-indigo-500 focus:bg-white font-bold text-xs md:text-sm text-[#1E3A8A] transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">نص المذكرة / المرافعة <span className="text-rose-500">*</span></label>
                            <textarea name="content" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} required rows="8" placeholder="اكتب مذكرتك هنا بحرية..." className="w-full p-3 md:p-4 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-indigo-500 focus:bg-white font-bold text-xs md:text-sm text-slate-800 transition-all resize-none leading-loose"></textarea>
                        </div>

                        <div className="pt-2">
                            <button type="submit" disabled={isLoading || !formData.case_id} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 md:py-4 rounded-xl shadow-lg transition-all text-sm md:text-base flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save"></i> {modalMode === 'edit' ? 'حفظ التعديلات' : 'حفظ المذكرة'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};