// المسار: components/Accounting/ExpenseModal.js

window.ExpenseModal = function({ mainBranch, showToast, modalMode, editData, onClose, onSuccess }) {
    const { useState, useEffect } = React;
    const getToday = () => new Date().toISOString().split('T')[0];

    const [isLoading, setIsLoading] = useState(false);
    const [expFormData, setExpFormData] = useState({ category: 'إيجار مقر', amount: '', expense_date: getToday(), notes: '' });

    useEffect(() => {
        if (modalMode === 'edit' && editData) {
            setExpFormData({
                category: editData.category || 'أخرى', amount: editData.amount, 
                expense_date: editData.expense_date, notes: editData.notes || ''
            });
        }
    }, [modalMode, editData]);

    const handleSaveExpense = async (e) => {
        e.preventDefault();
        if(!mainBranch) { showToast("خطأ: لم يتم العثور على فرع المكتب", "error"); return; }
        setIsLoading(true);
        try {
            const record = {
                branch_id: mainBranch.id,
                category: expFormData.category,
                amount: parseFloat(expFormData.amount || 0),
                expense_date: expFormData.expense_date,
                notes: expFormData.notes
            };
            if (modalMode === 'add') await window.db.firm_expenses.add(record);
            else await window.db.firm_expenses.update(editData.id, record);
            
            showToast("تم حفظ المصروف بنجاح", "success");
            onSuccess();
            onClose();
        } catch (error) { showToast("حدث خطأ", "error"); } 
        finally { setIsLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-3 sm:p-4 animate-view">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col max-h-[95vh] md:max-h-[90vh]">
                <div className="bg-gradient-to-r from-rose-600 to-red-800 p-4 md:p-6 flex justify-between items-center shrink-0">
                    <h3 className="text-base md:text-xl font-black text-white flex items-center gap-2">
                        <i className={`fas ${modalMode === 'add' ? 'fa-plus-circle' : 'fa-pen'}`}></i> 
                        {modalMode === 'add' ? 'تسجيل مصروف تشغيل' : 'تعديل المصروف'}
                    </h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition text-lg bg-white/5 w-8 h-8 rounded-full flex items-center justify-center"><i className="fas fa-times"></i></button>
                </div>
                <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form onSubmit={handleSaveExpense} className="space-y-4 md:space-y-5">
                        <div>
                            <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">بند المصروف <span className="text-rose-500">*</span></label>
                            <select name="category" value={expFormData.category} onChange={(e) => setExpFormData({...expFormData, category: e.target.value})} required className="w-full p-3 md:p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-rose-500 font-bold text-xs md:text-sm cursor-pointer">
                                <option value="إيجار مقر">إيجار مقر المكتب</option>
                                <option value="كهرباء وغاز ومياه">كهرباء وغاز ومرافق</option>
                                <option value="بوفيه وضيافة">بوفيه وضيافة</option>
                                <option value="انتقالات وسفر">انتقالات ومواصلات</option>
                                <option value="رسوم محاكم ودمغات">رسوم محاكم ودمغات</option>
                                <option value="أخرى">أخرى (يحدد في الملاحظات)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] md:text-xs font-bold text-rose-800 mb-1.5">المبلغ المدفوع (ج.م) <span className="text-rose-500">*</span></label>
                            <input type="number" name="amount" value={expFormData.amount} onChange={(e) => setExpFormData({...expFormData, amount: e.target.value})} required min="1" placeholder="0" className="w-full p-3 md:p-3.5 rounded-xl border border-rose-200 outline-none focus:border-rose-500 font-black text-lg md:text-xl text-rose-600 dir-ltr text-right" />
                        </div>
                        <div>
                            <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">تاريخ المصروف <span className="text-rose-500">*</span></label>
                            <input type="date" name="expense_date" value={expFormData.expense_date} onChange={(e) => setExpFormData({...expFormData, expense_date: e.target.value})} required className="w-full p-3 md:p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-rose-500 font-bold text-xs md:text-sm" />
                        </div>
                        <div>
                            <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">البيان والتفاصيل</label>
                            <input type="text" name="notes" value={expFormData.notes} onChange={(e) => setExpFormData({...expFormData, notes: e.target.value})} placeholder="تفاصيل المصروف للرجوع إليها..." className="w-full p-3 md:p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-rose-500 font-bold text-xs md:text-sm" />
                        </div>
                        <div className="pt-2">
                            <button type="submit" disabled={isLoading} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3.5 md:py-4 rounded-xl shadow-lg transition-colors disabled:opacity-50 text-sm md:text-base flex items-center justify-center gap-2">
                                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save"></i> {modalMode === 'add' ? 'حفظ المصروف' : 'تحديث المصروف'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};