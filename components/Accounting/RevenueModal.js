// المسار: components/Accounting/RevenueModal.js

window.RevenueModal = function({ firmId, showToast, modalMode, editData, onClose, onSuccess }) {
    const { useState, useEffect } = React;
    const getToday = () => new Date().toISOString().split('T')[0];

    const [isLoading, setIsLoading] = useState(false);
    const [revFormData, setRevFormData] = useState({ client_id: '', case_id: '', total_amount: '', paid_amount: '', payment_date: getToday(), notes: '' });
    const [clientSearch, setClientSearch] = useState({ term: '', results: [], isSearching: false, display: null });
    const [caseSearch, setCaseSearch] = useState({ term: '', results: [], isSearching: false, display: null });

    useEffect(() => {
        if (modalMode === 'edit' && editData) {
            setRevFormData({
                client_id: editData.client_id, case_id: editData.case_id || '',
                total_amount: editData.total_amount, paid_amount: editData.paid_amount,
                payment_date: editData.payment_date, notes: editData.notes || ''
            });
            setClientSearch(prev => ({ ...prev, display: editData.client_name }));
            if (editData.case_id) setCaseSearch(prev => ({ ...prev, display: `رقم القضية: ${editData.case_number}` }));
        }
    }, [modalMode, editData]);

    const handleSearchClient = async (e) => {
        const term = e.target.value;
        setClientSearch(prev => ({ ...prev, term }));
        if (!term.trim()) return setClientSearch(prev => ({ ...prev, results: [] }));
        
        setClientSearch(prev => ({ ...prev, isSearching: true }));
        const results = await window.db.clients.where('firm_id').equals(firmId).filter(c => c.name.includes(term)).limit(10).toArray();
        setClientSearch(prev => ({ ...prev, results, isSearching: false }));
    };

    const handleSearchCase = async (e) => {
        const term = e.target.value;
        setCaseSearch(prev => ({ ...prev, term }));
        if (!term.trim()) return setCaseSearch(prev => ({ ...prev, results: [] }));
        
        setCaseSearch(prev => ({ ...prev, isSearching: true }));
        const results = await window.db.cases.where('firm_id').equals(firmId)
            .filter(c => c.client_id === parseInt(revFormData.client_id) && c.case_number.includes(term))
            .limit(10).toArray();
        setCaseSearch(prev => ({ ...prev, results, isSearching: false }));
    };

    const selectClient = (item) => {
        setRevFormData({ ...revFormData, client_id: item.id, case_id: '' });
        setClientSearch({ term: '', results: [], isSearching: false, display: item.name });
        setCaseSearch({ term: '', results: [], isSearching: false, display: null }); 
    };

    const selectCase = (item) => {
        setRevFormData({ ...revFormData, case_id: item.id });
        setCaseSearch({ term: '', results: [], isSearching: false, display: `رقم القضية: ${item.case_number}` });
    };

    const clearClient = () => {
        setRevFormData({ ...revFormData, client_id: '', case_id: '' });
        setClientSearch(prev => ({ ...prev, display: null }));
        setCaseSearch(prev => ({ ...prev, display: null }));
    };

    const clearCase = () => {
        setRevFormData({ ...revFormData, case_id: '' });
        setCaseSearch(prev => ({ ...prev, display: null }));
    };

    const handleSaveRevenue = async (e) => {
        e.preventDefault();
        if (!revFormData.client_id) { showToast("الرجاء اختيار الموكل", "error"); return; }
        setIsLoading(true);
        try {
            const record = {
                client_id: parseInt(revFormData.client_id),
                case_id: revFormData.case_id ? parseInt(revFormData.case_id) : null,
                total_amount: parseFloat(revFormData.total_amount || 0),
                paid_amount: parseFloat(revFormData.paid_amount || 0),
                payment_date: revFormData.payment_date,
                notes: revFormData.notes,
                status: (parseFloat(revFormData.total_amount || 0) - parseFloat(revFormData.paid_amount || 0)) <= 0 ? 'completed' : 'pending'
            };
            if (modalMode === 'add') await window.db.client_payments.add(record);
            else await window.db.client_payments.update(editData.id, record);
            
            showToast("تم حفظ السجل المالي بنجاح", "success");
            onSuccess();
            onClose();
        } catch (error) { showToast("حدث خطأ", "error"); } 
        finally { setIsLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-3 sm:p-4 animate-view">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[95vh] md:max-h-[90vh]">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-4 md:p-6 flex justify-between items-center shrink-0">
                    <h3 className="text-base md:text-xl font-black text-white flex items-center gap-2">
                        <i className={`fas ${modalMode === 'add' ? 'fa-plus-circle' : 'fa-pen'}`}></i> 
                        {modalMode === 'add' ? 'تسجيل أتعاب / إيراد' : 'تعديل السجل المالي'}
                    </h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition text-lg bg-white/5 w-8 h-8 rounded-full flex items-center justify-center"><i className="fas fa-times"></i></button>
                </div>
                <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form onSubmit={handleSaveRevenue} className="space-y-4 md:space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            <div className="relative">
                                <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">الموكل <span className="text-rose-500">*</span></label>
                                {clientSearch.display ? (
                                    <div className="bg-emerald-50 border-2 border-emerald-200 p-2.5 md:p-3 rounded-xl flex items-center justify-between">
                                        <span className="text-xs md:text-sm font-bold text-emerald-800 flex items-center gap-1.5"><i className="fas fa-check-circle text-emerald-500"></i><span className="truncate">{clientSearch.display}</span></span>
                                        <button type="button" onClick={clearClient} className="text-rose-500 hover:bg-rose-100 w-7 h-7 rounded-lg flex items-center justify-center shrink-0"><i className="fas fa-times"></i></button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input type="text" value={clientSearch.term} onChange={handleSearchClient} placeholder="ابحث باسم الموكل..." className="w-full p-2.5 md:p-3 pl-10 rounded-xl border-2 border-slate-100 outline-none focus:border-emerald-500 font-bold text-xs md:text-sm" />
                                        <i className={`fas ${clientSearch.isSearching ? 'fa-spinner fa-spin' : 'fa-search'} absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm`}></i>
                                        {clientSearch.results.length > 0 && (
                                            <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                                {clientSearch.results.map(item => (
                                                    <li key={item.id} onClick={() => selectClient(item)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 text-xs md:text-sm font-bold text-[#1E3A8A]">{item.name}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">القضية (اختياري)</label>
                                {caseSearch.display ? (
                                    <div className="bg-emerald-50 border-2 border-emerald-200 p-2.5 md:p-3 rounded-xl flex items-center justify-between">
                                        <span className="text-xs md:text-sm font-bold text-emerald-800 flex items-center gap-1.5"><i className="fas fa-check-circle text-emerald-500"></i><span className="truncate">{caseSearch.display}</span></span>
                                        <button type="button" onClick={clearCase} className="text-rose-500 hover:bg-rose-100 w-7 h-7 rounded-lg flex items-center justify-center shrink-0"><i className="fas fa-times"></i></button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input type="text" value={caseSearch.term} onChange={handleSearchCase} disabled={!revFormData.client_id} placeholder={revFormData.client_id ? "ابحث برقم القضية..." : "اختر الموكل أولاً"} className="w-full p-2.5 md:p-3 pl-10 rounded-xl border-2 border-slate-100 outline-none focus:border-emerald-500 font-bold text-xs md:text-sm disabled:opacity-50 disabled:bg-slate-100" />
                                        <i className={`fas ${caseSearch.isSearching ? 'fa-spinner fa-spin' : 'fa-search'} absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm`}></i>
                                        {caseSearch.results.length > 0 && (
                                            <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                                {caseSearch.results.map(c => (
                                                    <li key={c.id} onClick={() => selectCase(c)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 text-xs md:text-sm font-bold text-[#1E3A8A]">رقم: {c.case_number}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-4 bg-emerald-50/50 p-3 md:p-4 rounded-xl border border-emerald-100">
                            <div>
                                <label className="block text-[11px] md:text-xs font-bold text-emerald-800 mb-1.5">إجمالي الأتعاب المتفق عليها</label>
                                <input type="number" name="total_amount" value={revFormData.total_amount} onChange={(e) => setRevFormData({...revFormData, total_amount: e.target.value})} required min="0" placeholder="0" className="w-full p-2.5 md:p-3 rounded-xl border border-emerald-200 outline-none focus:border-emerald-500 font-black text-base md:text-lg dir-ltr text-right" />
                            </div>
                            <div>
                                <label className="block text-[11px] md:text-xs font-bold text-emerald-600 mb-1.5">المدفوع الفعلي (بالخزنة)</label>
                                <input type="number" name="paid_amount" value={revFormData.paid_amount} onChange={(e) => setRevFormData({...revFormData, paid_amount: e.target.value})} required min="0" placeholder="0" className="w-full p-2.5 md:p-3 rounded-xl border border-emerald-200 outline-none focus:border-emerald-500 font-black text-base md:text-lg text-emerald-600 dir-ltr text-right" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            <div>
                                <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">تاريخ الدفع</label>
                                <input type="date" name="payment_date" value={revFormData.payment_date} onChange={(e) => setRevFormData({...revFormData, payment_date: e.target.value})} required className="w-full p-2.5 md:p-3 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-emerald-500 font-bold text-xs md:text-sm" />
                            </div>
                            <div>
                                <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">ملاحظات وطريقة الدفع</label>
                                <input type="text" name="notes" value={revFormData.notes} onChange={(e) => setRevFormData({...revFormData, notes: e.target.value})} placeholder="كاش، شيك، فودافون كاش..." className="w-full p-2.5 md:p-3 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-emerald-500 font-bold text-xs md:text-sm" />
                            </div>
                        </div>
                        <div className="pt-2">
                            <button type="submit" disabled={isLoading || !revFormData.client_id} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 md:py-4 rounded-xl shadow-lg transition-colors disabled:opacity-50 text-sm md:text-base flex items-center justify-center gap-2">
                                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save"></i> {modalMode === 'add' ? 'تسجيل الإيراد' : 'تحديث السجل'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};