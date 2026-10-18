// المسار: components/Settings/CourtsTab.js

window.CourtsTab = function({ firmId, showToast }) {
    const { useState, useEffect } = React;
    const storageKey = `MentraLocal_Courts_${firmId}`;

    // بيانات افتراضية أولية في حال كان السجل فارغاً
    const defaultCourts = [
        { id: 1, name: 'محكمة القاهرة الجديدة الابتدائية (التجمع الخامس)', date: 'تلقائي' },
        { id: 2, name: 'محكمة شمال القاهرة الابتدائية (مجمع العباسية)', date: 'تلقائي' },
        { id: 3, name: 'محكمة استئناف القاهرة (دار القضاء العالي)', date: 'تلقائي' },
        { id: 4, name: 'محكمة الأسرة (مجمع محاكم الزنانيري)', date: 'تلقائي' },
        { id: 5, name: 'مجلس الدولة (محكمة القضاء الإداري)', date: 'تلقائي' }
    ];

    const [courts, setCourts] = useState([]);
    const [newCourtName, setNewCourtName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // تحميل البيانات
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                setCourts(JSON.parse(saved));
            } else {
                setCourts(defaultCourts);
                localStorage.setItem(storageKey, JSON.stringify(defaultCourts));
            }
        } catch (e) {
            setCourts(defaultCourts);
        }
    }, [firmId]);

    // حفظ التغييرات في LocalStorage
    const saveToStorage = (updated) => {
        setCourts(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    };

    // إضافة محكمة جديدة
    const handleAddCourt = (e) => {
        e.preventDefault();
        const trimmed = newCourtName.trim();
        if (!trimmed) {
            showToast('يرجى كتابة اسم المحكمة أولاً', 'error');
            return;
        }

        const exists = courts.some(c => c.name.toLowerCase() === trimmed.toLowerCase());
        if (exists) {
            showToast('اسم هذه المحكمة مضاف بالفعل مسبقاً', 'error');
            return;
        }

        const newItem = {
            id: Date.now(),
            name: trimmed,
            date: new Date().toLocaleDateString('ar-EG')
        };

        const updated = [newItem, ...courts];
        saveToStorage(updated);
        setNewCourtName('');
        setCurrentPage(1);
        showToast('تمت إضافة المحكمة بنجاح', 'success');
    };

    // بدء التعديل
    const startEditing = (court) => {
        setEditingId(court.id);
        setEditValue(court.name);
    };

    // حفظ التعديل
    const handleSaveEdit = (id) => {
        const trimmed = editValue.trim();
        if (!trimmed) {
            showToast('لا يمكن ترك اسم المحكمة فارغاً', 'error');
            return;
        }

        const updated = courts.map(c => c.id === id ? { ...c, name: trimmed } : c);
        saveToStorage(updated);
        setEditingId(null);
        setEditValue('');
        showToast('تم تعديل بيانات المحكمة بنجاح', 'success');
    };

    // حذف محكمة
    const handleDeleteCourt = (id, name) => {
        if (confirm(`هل أنت متأكد من حذف "${name}" من قائمة المحاكم؟`)) {
            const updated = courts.filter(c => c.id !== id);
            saveToStorage(updated);

            // تعديل رقم الصفحة إذا أصبحت الصفحة فارغة
            const totalPages = Math.ceil(updated.length / itemsPerPage) || 1;
            if (currentPage > totalPages) setCurrentPage(totalPages);

            showToast('تم حذف المحكمة بنجاح', 'success');
        }
    };

    // حسابات الـ Pagination (3 عناصر بالصفحة)
    const totalPages = Math.ceil(courts.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = courts.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="p-4 md:p-8 animate-view space-y-6">
            {/* عنوان التاب */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                    <h4 className="font-black text-base md:text-lg text-[#1E3A8A] flex items-center gap-2">
                        <i className="fas fa-landmark text-[#D4AF37]"></i> إدارة المحاكم المختصة
                    </h4>
                    <p className="text-xs text-slate-400 font-bold mt-1">تحديد وتعديل أسماء المحاكم والدوائر التي يتعامل معها المكتب</p>
                </div>
                <span className="bg-blue-50 text-[#1E3A8A] text-xs font-black px-3 py-1.5 rounded-xl border border-blue-100">
                    إجمالي المحاكم: {courts.length}
                </span>
            </div>

            {/* نموذج إضافة محكمة جديدة */}
            <form onSubmit={handleAddCourt} className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 md:p-4 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <i className="fas fa-balance-scale absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input 
                        type="text" 
                        value={newCourtName} 
                        onChange={(e) => setNewCourtName(e.target.value)}
                        placeholder="اكتب اسم المحكمة أو الدائرة المختصة (مثال: محكمة استئناف القاهرة)"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-xs md:text-sm font-bold text-[#1E3A8A] outline-none focus:border-[#D4AF37] transition"
                    />
                </div>
                <button 
                    type="submit" 
                    className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-black px-5 py-2.5 rounded-xl text-xs md:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-blue-900/10 shrink-0"
                >
                    <i className="fas fa-plus"></i> إضافة محكمة
                </button>
            </form>

            {/* قائمة المحاكم المعروضة */}
            <div className="space-y-3">
                {currentItems.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                        <i className="fas fa-folder-open text-3xl mb-2"></i>
                        <p className="text-xs font-bold">لا توجد محاكم مسجلة حالياً، أضف محكمة للبدء</p>
                    </div>
                ) : (
                    currentItems.map((court, idx) => {
                        const globalIndex = startIndex + idx + 1;
                        const isEditing = editingId === court.id;

                        return (
                            <div 
                                key={court.id} 
                                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 md:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E3A8A] font-black text-xs flex items-center justify-center shrink-0 border border-blue-100">
                                        {globalIndex}
                                    </div>
                                    
                                    {isEditing ? (
                                        <div className="flex-1 max-w-lg">
                                            <input 
                                                type="text" 
                                                value={editValue} 
                                                onChange={(e) => setEditValue(e.target.value)}
                                                autoFocus
                                                className="w-full bg-slate-50 border-2 border-[#D4AF37] rounded-xl px-3 py-1.5 text-xs md:text-sm font-bold text-[#1E3A8A] outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex-1">
                                            <h5 className="font-bold text-xs md:text-sm text-slate-800 leading-snug">{court.name}</h5>
                                            <span className="text-[10px] text-slate-400 font-semibold">تاريخ التسجيل: {court.date}</span>
                                        </div>
                                    )}
                                </div>

                                {/* أزرار الإجراءات */}
                                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                    {isEditing ? (
                                        <>
                                            <button 
                                                type="button" 
                                                onClick={() => handleSaveEdit(court.id)} 
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 shadow-sm"
                                            >
                                                <i className="fas fa-check"></i> حفظ
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => { setEditingId(null); setEditValue(''); }} 
                                                className="bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1"
                                            >
                                                <i className="fas fa-times"></i> إلغاء
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                type="button" 
                                                onClick={() => startEditing(court)} 
                                                className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200/60 flex items-center justify-center text-xs transition"
                                                title="تعديل المحكمة"
                                            >
                                                <i className="fas fa-pen"></i>
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => handleDeleteCourt(court.id, court.name)} 
                                                className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 flex items-center justify-center text-xs transition"
                                                title="حذف المحكمة"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination شريط التنقل بين الصفحات (3 عناصر لكل صفحة) */}
            {courts.length > itemsPerPage && (
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-xs font-bold text-slate-400">
                        عرض <span className="text-[#1E3A8A] font-black">{startIndex + 1}</span> إلى <span className="text-[#1E3A8A] font-black">{Math.min(startIndex + itemsPerPage, courts.length)}</span> من أصل <span className="text-[#1E3A8A] font-black">{courts.length}</span> محكمة
                    </p>

                    <div className="flex items-center gap-1.5">
                        <button 
                            type="button" 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition"
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-xs font-black transition ${
                                    currentPage === page 
                                        ? 'bg-[#1E3A8A] text-white shadow-sm' 
                                        : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button 
                            type="button" 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};