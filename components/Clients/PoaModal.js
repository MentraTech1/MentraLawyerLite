// المسار: components/Clients/PoaModal.js

window.PoaModal = function({ client, showToast, onClose, onSuccess }) {
    const { useState, useEffect } = React;
    
    const [clientPoasList, setClientPoasList] = useState([]);
    const [isPoaEditing, setIsPoaEditing] = useState(false);
    const [poaEditId, setPoaEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // البحث والترقيم (ليمت 3 توكيلات بالصفحة)
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const [poaFormData, setPoaFormData] = useState({
        poa_number: '', poa_type: 'عام قضايا', documentation_office: '', poa_date: '', expiry_date: '', notes: ''
    });

    const loadClientPoas = async () => {
        if (!client || !client.id || !window.db) return;
        const poas = await window.db.power_of_attorneys.filter(p => String(p.client_id) === String(client.id)).reverse().toArray();
        setClientPoasList(poas);
    };

    useEffect(() => {
        loadClientPoas();
    }, [client]);

    const handlePoaFormChange = (e) => setPoaFormData({ ...poaFormData, [e.target.name]: e.target.value });

    const handleEditPoa = (poa) => {
        setIsPoaEditing(true); 
        setPoaEditId(poa.id);
        setPoaFormData({
            poa_number: poa.poa_number || '', 
            poa_type: poa.poa_type || 'عام قضايا',
            documentation_office: poa.documentation_office || '', 
            poa_date: poa.poa_date || '', 
            expiry_date: poa.expiry_date || '', 
            notes: poa.notes || ''
        });
    };

    const handleCancelEdit = () => {
        setIsPoaEditing(false);
        setPoaEditId(null);
        setPoaFormData({ poa_number: '', poa_type: 'عام قضايا', documentation_office: '', poa_date: '', expiry_date: '', notes: '' });
    };

    const handleSavePoa = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = {
                client_id: client.id, 
                poa_number: poaFormData.poa_number.trim(), 
                poa_type: poaFormData.poa_type,
                documentation_office: poaFormData.documentation_office.trim(), 
                poa_date: poaFormData.poa_date, 
                expiry_date: poaFormData.expiry_date, 
                notes: poaFormData.notes
            };
            
            if (isPoaEditing) {
                await window.db.power_of_attorneys.update(poaEditId, data);
                showToast("تم تحديث بيانات التوكيل بنجاح", "success");
            } else {
                await window.db.power_of_attorneys.add(data);
                showToast("تم تسجيل التوكيل بنجاح", "success");
            }
            
            handleCancelEdit();
            await loadClientPoas();
            if (onSuccess) onSuccess();
        } catch (error) { 
            showToast("حدث خطأ أثناء حفظ التوكيل", "error"); 
        } finally { 
            setIsLoading(false); 
        }
    };

    const handleDeletePoa = async (id, number) => {
        if (confirm(`هل أنت متأكد من حذف التوكيل رقم "${number}"؟`)) {
            await window.db.power_of_attorneys.delete(id);
            await loadClientPoas();

            // فحص وتعديل رقم الصفحة في حال حُذف آخر عنصر بالصفحة
            const remainingCount = clientPoasList.length - 1;
            const newTotalPages = Math.ceil(remainingCount / itemsPerPage) || 1;
            if (currentPage > newTotalPages) setCurrentPage(newTotalPages);

            if (onSuccess) onSuccess();
            showToast("تم حذف التوكيل بنجاح", "success");
        }
    };

    // معالجة البحث وفلترة البيانات
    const filteredPoas = clientPoasList.filter(poa => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
            (poa.poa_number && poa.poa_number.toLowerCase().includes(q)) ||
            (poa.poa_type && poa.poa_type.toLowerCase().includes(q)) ||
            (poa.documentation_office && poa.documentation_office.toLowerCase().includes(q)) ||
            (poa.notes && poa.notes.toLowerCase().includes(q))
        );
    });

    // حسابات الـ Pagination (3 عناصر بالصفحة)
    const totalPages = Math.ceil(filteredPoas.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPoas = filteredPoas.slice(startIndex, startIndex + itemsPerPage);
    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-3 sm:p-4 animate-view">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-100 flex flex-col max-h-[95vh] md:max-h-[90vh]">
                
                {/* رأس النافذة */}
                <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 p-4 md:p-5 flex justify-between items-center shrink-0 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl backdrop-blur-md shadow-inner">
                            <i className="fas fa-file-signature"></i>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base md:text-lg font-black tracking-wide">إدارة سجل التوكيلات</h3>
                                <span className="bg-black/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {clientPoasList.length} توكيل مسجل
                                </span>
                            </div>
                            <p className="text-xs font-bold text-amber-100 mt-0.5 truncate max-w-[220px] sm:max-w-md">
                                <i className="fas fa-user ml-1 text-white/80"></i> الموكل: {client.name}
                            </p>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition"
                    >
                        <i className="fas fa-times text-sm"></i>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">
                    
                    {/* فورم الإضافة والتعديل (الجانب الأيمن) */}
                    <div className="w-full md:w-5/12 bg-slate-50 md:border-l border-b md:border-b-0 border-slate-200 p-4 md:p-6 shrink-0 md:overflow-y-auto">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                            <h4 className="font-black text-[#1E3A8A] text-xs md:text-sm flex items-center gap-1.5">
                                <i className={`fas ${isPoaEditing ? 'fa-pen text-amber-600' : 'fa-plus text-emerald-600'}`}></i> 
                                {isPoaEditing ? 'تعديل بيانات التوكيل' : 'إضافة توكيل جديد'}
                            </h4>
                            {isPoaEditing && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                    وضع التعديل
                                </span>
                            )}
                        </div>

                        <form onSubmit={handleSavePoa} className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">رقم التوكيل حرفي ورقمي <span className="text-rose-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="poa_number" 
                                    value={poaFormData.poa_number} 
                                    onChange={handlePoaFormChange} 
                                    required 
                                    placeholder="مثال: 1254 لسنة 2024 ب"
                                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-amber-500 font-bold text-xs text-[#1E3A8A] bg-white transition" 
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">نوع التوكيل <span className="text-rose-500">*</span></label>
                                <select 
                                    name="poa_type" 
                                    value={poaFormData.poa_type} 
                                    onChange={handlePoaFormChange} 
                                    required 
                                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-amber-500 font-bold text-xs text-[#1E3A8A] bg-white transition"
                                >
                                    <option value="عام قضايا">عام قضايا</option>
                                    <option value="خاص">خاص</option>
                                    <option value="عام رسمي">عام رسمي</option>
                                    <option value="تأسيس شركات">تأسيس شركات</option>
                                    <option value="بنوك وصرف">بنوك وصرف</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">مكتب التوثيق (الشهر العقاري) <span className="text-rose-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="documentation_office" 
                                    value={poaFormData.documentation_office} 
                                    onChange={handlePoaFormChange} 
                                    required 
                                    placeholder="مثال: توثيق الأهرام النموذجي"
                                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-amber-500 font-bold text-xs text-[#1E3A8A] bg-white transition" 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">تاريخ الإصدار</label>
                                    <input 
                                        type="date" 
                                        name="poa_date" 
                                        value={poaFormData.poa_date} 
                                        onChange={handlePoaFormChange} 
                                        className="w-full p-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 font-bold text-[11px] text-[#1E3A8A] bg-white" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">تاريخ الانتهاء</label>
                                    <input 
                                        type="date" 
                                        name="expiry_date" 
                                        value={poaFormData.expiry_date} 
                                        onChange={handlePoaFormChange} 
                                        className="w-full p-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 font-bold text-[11px] text-rose-600 bg-white" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-1">ملاحظات أو قيود التوكيل</label>
                                <textarea 
                                    name="notes" 
                                    value={poaFormData.notes} 
                                    onChange={handlePoaFormChange} 
                                    rows="2" 
                                    placeholder="مثال: لا يبيح الإقرار بالصلح أو القبض..."
                                    className="w-full p-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 font-bold text-xs text-[#1E3A8A] bg-white resize-none"
                                ></textarea>
                            </div>

                            <div className="pt-2 flex gap-2">
                                <button 
                                    type="submit" 
                                    disabled={isLoading} 
                                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-black py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                                >
                                    {isLoading ? (
                                        <i className="fas fa-spinner fa-spin"></i>
                                    ) : (
                                        <>
                                            <i className={`fas ${isPoaEditing ? 'fa-save' : 'fa-plus'}`}></i>
                                            <span>{isPoaEditing ? 'حفظ التعديل' : 'تسجيل التوكيل'}</span>
                                        </>
                                    )}
                                </button>

                                {isPoaEditing && (
                                    <button 
                                        type="button" 
                                        onClick={handleCancelEdit} 
                                        className="px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition"
                                    >
                                        إلغاء
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* قائمة التوكيلات مع البحث والترقيم ليمت 3 (الجانب الأيسر) */}
                    <div className="w-full md:w-7/12 p-4 md:p-6 bg-white flex flex-col justify-between overflow-y-auto">
                        <div>
                            {/* شريط البحث المباشر */}
                            <div className="relative mb-3">
                                <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1); // العودة للصفحة الأولى عند البحث
                                    }}
                                    placeholder="بحث برقم التوكيل، النوع، أو مكتب التوثيق..." 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pr-9 pl-8 text-xs font-bold text-[#1E3A8A] outline-none focus:border-amber-500 focus:bg-white transition"
                                />
                                {searchQuery && (
                                    <button 
                                        type="button" 
                                        onClick={() => setSearchQuery('')}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                                    >
                                        <i className="fas fa-times-circle"></i>
                                    </button>
                                )}
                            </div>

                            {/* قائمة الكروت */}
                            {currentPoas.length === 0 ? (
                                <div className="py-12 text-center flex flex-col items-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <i className="fas fa-folder-open text-3xl text-slate-300 mb-2"></i>
                                    <p className="text-slate-500 font-bold text-xs">
                                        {searchQuery ? 'لا توجد نتائج مطابقة لبحثك' : 'لا توجد توكيلات مسجلة لهذا الموكل حالياً'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {currentPoas.map((poa, idx) => {
                                        const globalIndex = startIndex + idx + 1;
                                        const isExpired = poa.expiry_date && poa.expiry_date < todayStr;

                                        return (
                                            <div 
                                                key={poa.id} 
                                                className={`border rounded-xl p-3 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
                                                    poaEditId === poa.id 
                                                        ? 'border-amber-400 bg-amber-50/50 shadow-sm' 
                                                        : 'border-slate-100 hover:border-amber-200 hover:bg-slate-50/70'
                                                }`}
                                            >
                                                <div className="flex-1 w-full sm:w-auto">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black flex items-center justify-center shrink-0">
                                                            {globalIndex}
                                                        </span>
                                                        <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md">
                                                            {poa.poa_type || 'توكيل'}
                                                        </span>
                                                        <h5 className="font-black text-[#1E3A8A] text-xs md:text-sm">
                                                            {poa.poa_number}
                                                        </h5>
                                                        
                                                        {poa.expiry_date && (
                                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                                                isExpired ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                                                            }`}>
                                                                {isExpired ? 'منتهي' : 'ساري'}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="text-[10px] font-bold text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 pr-7">
                                                        <span><i className="fas fa-building text-slate-400 ml-1"></i> {poa.documentation_office || 'مكتب غير مدون'}</span>
                                                        {poa.poa_date && <span><i className="fas fa-calendar-plus text-emerald-500 ml-1"></i> إصدار: {poa.poa_date}</span>}
                                                        {poa.expiry_date && <span><i className="fas fa-calendar-times text-rose-500 ml-1"></i> انتهاء: {poa.expiry_date}</span>}
                                                    </div>

                                                    {poa.notes && (
                                                        <p className="text-[10px] text-slate-400 font-semibold pr-7 mt-1 truncate max-w-sm">
                                                            <i className="fas fa-info-circle ml-1"></i> {poa.notes}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 border-t sm:border-0 border-slate-100 pt-1.5 sm:pt-0 w-full sm:w-auto justify-end">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleEditPoa(poa)} 
                                                        className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white flex items-center justify-center text-xs transition"
                                                        title="تعديل التوكيل"
                                                    >
                                                        <i className="fas fa-pen"></i>
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleDeletePoa(poa.id, poa.poa_number)} 
                                                        className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white flex items-center justify-center text-xs transition"
                                                        title="حذف التوكيل"
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Pagination شريط الترقيم ليمت 3 */}
                        {filteredPoas.length > itemsPerPage && (
                            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-[11px] font-bold text-slate-400">
                                    عرض {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPoas.length)} من {filteredPoas.length}
                                </span>

                                <div className="flex items-center gap-1">
                                    <button 
                                        type="button"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                        className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center text-[10px] hover:bg-slate-100 disabled:opacity-40 transition"
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-7 h-7 rounded-lg text-xs font-black transition ${
                                                currentPage === page 
                                                    ? 'bg-amber-500 text-white shadow-sm' 
                                                    : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button 
                                        type="button"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                        className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center text-[10px] hover:bg-slate-100 disabled:opacity-40 transition"
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};