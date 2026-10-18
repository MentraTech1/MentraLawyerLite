// المسار: components/Clients/ClientPaymentsList.js

window.ClientPaymentsList = function({ payments, client, stats, onRefresh, showToast }) {
    const { useState, useEffect } = React;
    
    // --- حالة الترقيم (Pagination) ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; 

    // --- حالة النافذة المنبثقة (Modal) ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // قضايا الموكل
    const [clientCases, setClientCases] = useState([]);

    // --- حالات البحث الحي عن القضية (Live Search) ---
    const [caseSearchQuery, setCaseSearchQuery] = useState('');
    const [isCaseDropdownOpen, setIsCaseDropdownOpen] = useState(false);

    const [formData, setFormData] = useState({
        case_id: '',
        total_amount: '',
        paid_amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    // جلب قضايا الموكل
    useEffect(() => {
        if (client && client.id && window.db) {
            window.db.cases.filter(c => String(c.client_id) === String(client.id)).toArray()
            .then(cases => setClientCases(cases));
        }
    }, [client]);

    // --- حسابات الترقيم ---
    const totalPages = Math.ceil(payments.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPayments = payments.slice(startIndex, startIndex + itemsPerPage);

    // --- دوال التحكم في النافذة المنبثقة ---
    const handleOpenAdd = () => {
        setModalMode('add');
        setEditId(null);
        setCaseSearchQuery('');
        setIsCaseDropdownOpen(false);
        setFormData({
            case_id: '',
            total_amount: '',
            paid_amount: '',
            payment_date: new Date().toISOString().split('T')[0],
            notes: ''
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (payment) => {
        setModalMode('edit');
        setEditId(payment.id);
        
        // تعيين اسم القضية المختارة داخل حقل البحث الحي تلقائياً
        if (payment.case_id) {
            const currentCase = clientCases.find(c => c.id === payment.case_id);
            setCaseSearchQuery(currentCase ? `دعوى رقم ${currentCase.case_number || 'بدون'} - ${currentCase.case_type || 'مدني'}` : '');
        } else {
            setCaseSearchQuery('');
        }
        setIsCaseDropdownOpen(false);

        setFormData({
            case_id: payment.case_id || '',
            total_amount: payment.total_amount || payment.amount || '',
            paid_amount: payment.paid_amount || payment.amount || '',
            payment_date: payment.payment_date || payment.date || payment.created_at?.substring(0,10) || '',
            notes: payment.notes || ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsCaseDropdownOpen(false);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // فلترة القضايا للبحث الحي
    const filteredCases = clientCases.filter(c => {
        if (!caseSearchQuery.trim()) return true;
        const q = caseSearchQuery.toLowerCase().trim();
        const num = (c.case_number || '').toLowerCase();
        const type = (c.case_type || '').toLowerCase();
        const court = (c.court_name || c.court || '').toLowerCase();
        return num.includes(q) || type.includes(q) || court.includes(q);
    });

    // --- دوال الحفظ والحذف (Database) ---
    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const dataToSave = {
                client_id: client.id,
                case_id: formData.case_id ? parseInt(formData.case_id) : null,
                total_amount: parseFloat(formData.total_amount) || 0,
                paid_amount: parseFloat(formData.paid_amount) || 0,
                payment_date: formData.payment_date,
                notes: formData.notes,
                updated_at: new Date().toISOString()
            };

            if (modalMode === 'edit') {
                await window.db.client_payments.update(editId, dataToSave);
                showToast("تم تعديل الإيراد بنجاح", "success");
            } else {
                dataToSave.created_at = new Date().toISOString();
                await window.db.client_payments.add(dataToSave);
                showToast("تم تسجيل الإيراد بنجاح", "success");
            }
            
            handleCloseModal();
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error(error);
            showToast("حدث خطأ أثناء الحفظ", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("هل أنت متأكد من حذف هذه الدفعة المالية؟ لا يمكن التراجع عن هذا الإجراء وسيتم خصمها من الإيرادات.")) {
            try {
                await window.db.client_payments.delete(id);
                showToast("تم حذف الدفعة بنجاح", "success");
                if (onRefresh) onRefresh();
                
                if (currentPayments.length === 1 && currentPage > 1) setCurrentPage(p => p - 1);
            } catch (error) {
                showToast("حدث خطأ أثناء الحذف", "error");
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between animate-view min-h-[300px]">
            <div>
                {/* --- الهيدر وزر الإضافة --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                    <h4 className="font-black text-sm md:text-base text-[#1E3A8A] flex items-center gap-2">
                        <i className="fas fa-file-invoice-dollar text-emerald-500"></i> سجل الفواتير والمدفوعات ({payments.length})
                    </h4>
                    <button 
                        onClick={handleOpenAdd}
                        className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        <i className="fas fa-plus-circle"></i> تسجيل أتعاب / إيراد
                    </button>
                </div>

                {/* --- الشريط المالي المصغر --- */}
                {stats && (
                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-5">
                        <div className="flex-1 text-center border-l border-slate-200">
                            <span className="text-[10px] font-bold text-slate-500 block mb-1">إجمالي ما تم سداده</span>
                            <span className="text-base font-black text-emerald-600">{stats.totalPaid.toLocaleString()} ج.م</span>
                        </div>
                        <div className="flex-1 text-center border-l border-slate-200">
                            <span className="text-[10px] font-bold text-slate-500 block mb-1">المتبقي (عليه)</span>
                            <span className={`text-base font-black ${stats.remaining > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                                {stats.remaining.toLocaleString()} ج.م
                            </span>
                        </div>
                        <div className="flex-1 text-center">
                            <span className="text-[10px] font-bold text-slate-500 block mb-1">الإجمالي الكلي</span>
                            <span className="text-base font-black text-[#1E3A8A]">{stats.totalFees.toLocaleString()} ج.م</span>
                        </div>
                    </div>
                )}

                {/* --- قائمة الفواتير --- */}
                {payments.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fas fa-receipt text-2xl opacity-40"></i>
                        </div>
                        <p className="text-xs font-bold">لا توجد أي إيرادات أو أتعاب مسجلة لهذا الموكل حالياً</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {currentPayments.map((payment) => {
                            const paidAmount = parseFloat(payment.paid_amount || payment.amount || 0);
                            const totalAmount = parseFloat(payment.total_amount || 0);
                            const relatedCase = clientCases.find(c => c.id === payment.case_id);

                            return (
                                <div key={payment.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:border-emerald-200 transition flex flex-col sm:flex-row justify-between sm:items-center gap-4 group">
                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm shadow-inner">
                                                    <i className="fas fa-hand-holding-dollar"></i>
                                                </div>
                                                <div>
                                                    <h5 className="font-black text-[#1E3A8A] text-sm md:text-base">
                                                        سداد مبلغ: <span className="text-emerald-600">{paidAmount.toLocaleString()} ج.م</span>
                                                    </h5>
                                                    <span className="text-[10px] text-slate-400 font-bold">
                                                        <i className="fas fa-calendar-alt ml-1"></i> {payment.payment_date || payment.created_at?.substring(0,10)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* أزرار التعديل والحذف */}
                                            <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleOpenEdit(payment)} className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white flex items-center justify-center text-xs transition" title="تعديل">
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button onClick={() => handleDelete(payment.id)} className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white flex items-center justify-center text-xs transition" title="حذف">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-600 mt-2">
                                            {totalAmount > 0 && (
                                                <span className="bg-white border border-slate-200 px-2 py-1 rounded-md">
                                                    إجمالي المتفق عليه: {totalAmount.toLocaleString()} ج.م
                                                </span>
                                            )}
                                            {relatedCase ? (
                                                <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-md">
                                                    <i className="fas fa-gavel ml-1"></i> قضية رقم: {relatedCase.case_number || 'بدون رقم'}
                                                </span>
                                            ) : (
                                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                                    <i className="fas fa-user ml-1"></i> دفعة حساب عامة
                                                </span>
                                            )}
                                        </div>

                                        {payment.notes && (
                                            <p className="text-[10px] text-slate-500 font-bold mt-2 bg-white p-2 rounded-lg border border-slate-100">
                                                <i className="fas fa-sticky-note text-amber-400 ml-1"></i> {payment.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* --- Pagination --- */}
            {payments.length > itemsPerPage && (
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-slate-400">
                        عرض {startIndex + 1} - {Math.min(startIndex + itemsPerPage, payments.length)} من {payments.length}
                    </span>
                    <div className="flex items-center gap-1">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center text-[10px] hover:bg-slate-100 disabled:opacity-40 transition"><i className="fas fa-chevron-right"></i></button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button key={page} onClick={() => setCurrentPage(page)} className={`w-7 h-7 rounded-lg text-xs font-black transition ${currentPage === page ? 'bg-emerald-500 text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>{page}</button>
                        ))}
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center text-[10px] hover:bg-slate-100 disabled:opacity-40 transition"><i className="fas fa-chevron-left"></i></button>
                    </div>
                </div>
            )}

            {/* --- Modal (تسجيل أتعاب / إيراد) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-view">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-visible border border-emerald-100">
                        
                        {/* هيدر المودال الأخضر */}
                        <div className="bg-emerald-500 p-5 flex justify-between items-center text-white rounded-t-3xl">
                            <h3 className="font-black text-lg flex items-center gap-2">
                                <i className={`fas ${modalMode === 'add' ? 'fa-plus-circle' : 'fa-pen'}`}></i>
                                {modalMode === 'add' ? 'تسجيل أتعاب / إيراد' : 'تعديل أتعاب / إيراد'}
                            </h3>
                            <button onClick={handleCloseModal} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition text-sm">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
                            
                            {/* صف الموكل والقضية بالبحث الحي */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-600 mb-1.5">الموكل <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <i className="fas fa-user absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                        <input type="text" value={client.name} disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 pr-9 text-xs font-bold text-slate-500 cursor-not-allowed" />
                                    </div>
                                </div>

                                {/* حقل القضية (Live Search) */}
                                <div className="relative">
                                    <label className="block text-[11px] font-black text-slate-600 mb-1.5">القضية (اختياري - بحث حي)</label>
                                    <div className="relative">
                                        <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                                        <input 
                                            type="text"
                                            value={caseSearchQuery}
                                            onFocus={() => setIsCaseDropdownOpen(true)}
                                            onChange={(e) => {
                                                setCaseSearchQuery(e.target.value);
                                                setIsCaseDropdownOpen(true);
                                                if (!e.target.value.trim()) {
                                                    setFormData(prev => ({ ...prev, case_id: '' }));
                                                }
                                            }}
                                            placeholder="ابحث برقم القضية أو نوعها..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-9 pl-8 text-xs font-bold text-[#1E3A8A] outline-none focus:border-emerald-500 focus:bg-white transition"
                                        />
                                        
                                        {/* زر مسح الاختيار */}
                                        {formData.case_id && (
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, case_id: '' }));
                                                    setCaseSearchQuery('');
                                                }}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 text-xs transition"
                                                title="إلغاء ارتباط القضية (دفعة عامة)"
                                            >
                                                <i className="fas fa-times-circle"></i>
                                            </button>
                                        )}
                                    </div>

                                    {/* قائمة النتائج المنسدلة للبحث الحي */}
                                    {isCaseDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsCaseDropdownOpen(false)}></div>
                                            <div className="absolute z-50 top-full right-0 left-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto animate-view">
                                                {/* خيار دفعة عامة بدون قضية */}
                                                <div 
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, case_id: '' }));
                                                        setCaseSearchQuery('');
                                                        setIsCaseDropdownOpen(false);
                                                    }}
                                                    className={`p-2.5 text-xs font-bold border-b border-slate-100 cursor-pointer hover:bg-slate-50 flex items-center gap-2 ${!formData.case_id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'}`}
                                                >
                                                    <i className="fas fa-user-tag text-slate-400"></i>
                                                    <span>-- دفعة حساب عامة (بدون ربط بقضية) --</span>
                                                </div>

                                                {filteredCases.length === 0 ? (
                                                    <div className="p-3 text-center text-xs text-slate-400 font-bold">
                                                        لا توجد قضايا مطابقة لبحثك
                                                    </div>
                                                ) : (
                                                    filteredCases.map(c => (
                                                        <div 
                                                            key={c.id}
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, case_id: c.id }));
                                                                setCaseSearchQuery(`دعوى رقم ${c.case_number || 'بدون'} - ${c.case_type || 'مدني'}`);
                                                                setIsCaseDropdownOpen(false);
                                                            }}
                                                            className={`p-2.5 text-xs font-bold border-b border-slate-50 last:border-0 cursor-pointer hover:bg-emerald-50/50 flex items-center justify-between transition ${formData.case_id === c.id ? 'bg-emerald-50 text-emerald-700 font-black' : 'text-slate-700'}`}
                                                        >
                                                            <div className="flex items-center gap-2 truncate">
                                                                <i className="fas fa-gavel text-slate-400"></i>
                                                                <span className="truncate">دعوى: {c.case_number || 'بدون'} ({c.case_type || 'مدني'})</span>
                                                            </div>
                                                            {c.court_name && (
                                                                <span className="text-[10px] text-slate-400 shrink-0 font-normal mr-2">
                                                                    {c.court_name}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* صف المبالغ المادية */}
                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[11px] font-black text-emerald-700 mb-1.5">إجمالي الأتعاب المتفق عليها</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            name="total_amount" 
                                            value={formData.total_amount} 
                                            onChange={handleChange} 
                                            min="0"
                                            className="w-full bg-white border border-emerald-200 rounded-xl p-3 text-center text-sm font-black text-[#1E3A8A] outline-none focus:border-emerald-500" 
                                            placeholder="0"
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">ج.م</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-emerald-700 mb-1.5">المدفوع الفعلي (بالخزينة) <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            name="paid_amount" 
                                            value={formData.paid_amount} 
                                            onChange={handleChange} 
                                            required 
                                            min="0"
                                            className="w-full bg-white border border-emerald-400 shadow-[0_0_0_2px_rgba(16,185,129,0.1)] rounded-xl p-3 text-center text-sm font-black text-emerald-600 outline-none focus:border-emerald-600" 
                                            placeholder="0"
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600">ج.م</span>
                                    </div>
                                </div>
                            </div>

                            {/* صف التاريخ والملاحظات */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:order-2">
                                    <label className="block text-[11px] font-black text-slate-600 mb-1.5">تاريخ الدفع <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <i className="fas fa-calendar-alt absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                                        <input 
                                            type="date" 
                                            name="payment_date" 
                                            value={formData.payment_date} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-9 text-xs font-bold text-[#1E3A8A] outline-none focus:border-emerald-500" 
                                        />
                                    </div>
                                </div>
                                <div className="md:order-1">
                                    <label className="block text-[11px] font-black text-slate-600 mb-1.5">ملاحظات وطريقة الدفع</label>
                                    <input 
                                        type="text" 
                                        name="notes" 
                                        value={formData.notes} 
                                        onChange={handleChange} 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-[#1E3A8A] outline-none focus:border-emerald-500" 
                                        placeholder="كاش، شيك، فودافون كاش..."
                                    />
                                </div>
                            </div>
                            
                            {/* زر الحفظ */}
                            <div className="pt-4 border-t border-slate-100">
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                                >
                                    {isLoading ? <i className="fas fa-spinner fa-spin text-xl"></i> : <><i className="fas fa-save text-lg"></i> {modalMode === 'add' ? 'تسجيل الإيراد' : 'حفظ التعديلات'}</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};