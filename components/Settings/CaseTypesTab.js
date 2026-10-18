// المسار: components/Settings/CaseTypesTab.js

window.CaseTypesTab = function({ firmId, showToast }) {
    const { useState, useEffect } = React;
    const storageKey = `MentraLocal_CaseTypes_${firmId}`;

    // بيانات افتراضية أولية
    const defaultTypes = [
        { id: 1, name: 'مدني وتعويضات', desc: 'منازعات عقود، مطالبات مالية، وتعويضات مدنية' },
        { id: 2, name: 'جنح وجنايات', desc: 'قضايا الشيكات، النصب، والجرائم الجنائية' },
        { id: 3, name: 'أسرة وأحوال شخصية', desc: 'دعاوى النفقات، الطلاق، والوصاية' },
        { id: 4, name: 'منازعات عمالية', desc: 'فصل تعسفي ومستحقات العاملين' },
        { id: 5, name: 'قضاء إداري ومجلس دولة', desc: 'طعون القرارات الإدارية ومنازعات التراخيص' }
    ];

    const [types, setTypes] = useState([]);
    const [newTypeName, setNewTypeName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                setTypes(JSON.parse(saved));
            } else {
                setTypes(defaultTypes);
                localStorage.setItem(storageKey, JSON.stringify(defaultTypes));
            }
        } catch (e) {
            setTypes(defaultTypes);
        }
    }, [firmId]);

    const saveToStorage = (updated) => {
        setTypes(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    };

    // إضافة نوع قضية جديد
    const handleAddType = (e) => {
        e.preventDefault();
        const trimmed = newTypeName.trim();
        if (!trimmed) {
            showToast('يرجى إدخال اسم نوع القضية أولاً', 'error');
            return;
        }

        const exists = types.some(t => t.name.toLowerCase() === trimmed.toLowerCase());
        if (exists) {
            showToast('نوع القضية هذا مضاف مسبقاً', 'error');
            return;
        }

        const newItem = {
            id: Date.now(),
            name: trimmed,
            desc: 'تصنيف قضائي مخصص للمكتب'
        };

        const updated = [newItem, ...types];
        saveToStorage(updated);
        setNewTypeName('');
        setCurrentPage(1);
        showToast('تمت إضافة نوع القضية بنجاح', 'success');
    };

    // بدء التعديل
    const startEditing = (type) => {
        setEditingId(type.id);
        setEditValue(type.name);
    };

    // حفظ التعديل
    const handleSaveEdit = (id) => {
        const trimmed = editValue.trim();
        if (!trimmed) {
            showToast('لا يمكن ترك اسم نوع القضية فارغاً', 'error');
            return;
        }

        const updated = types.map(t => t.id === id ? { ...t, name: trimmed } : t);
        saveToStorage(updated);
        setEditingId(null);
        setEditValue('');
        showToast('تم تحديث نوع القضية بنجاح', 'success');
    };

    // حذف نوع قضية
    const handleDeleteType = (id, name) => {
        if (confirm(`هل أنت متأكد من حذف تصنيف "${name}"؟`)) {
            const updated = types.filter(t => t.id !== id);
            saveToStorage(updated);

            const totalPages = Math.ceil(updated.length / itemsPerPage) || 1;
            if (currentPage > totalPages) setCurrentPage(totalPages);

            showToast('تم حذف نوع القضية بنجاح', 'success');
        }
    };

    // حسابات الـ Pagination (3 عناصر بالصفحة)
    const totalPages = Math.ceil(types.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = types.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="p-4 md:p-8 animate-view space-y-6">
            {/* عنوان التاب */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                    <h4 className="font-black text-base md:text-lg text-[#1E3A8A] flex items-center gap-2">
                        <i className="fas fa-tags text-[#D4AF37]"></i> تصنيفات وأنواع القضايا
                    </h4>
                    <p className="text-xs text-slate-400 font-bold mt-1">إدارة أنواع القضايا لتصنيف ملفات الموكلين بدقة وسهولة</p>
                </div>
                <span className="bg-amber-50 text-amber-700 text-xs font-black px-3 py-1.5 rounded-xl border border-amber-200">
                    إجمالي الأنواع: {types.length}
                </span>
            </div>

            {/* نموذج إضافة نوع قضية */}
            <form onSubmit={handleAddType} className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 md:p-4 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <i className="fas fa-folder-plus absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input 
                        type="text" 
                        value={newTypeName} 
                        onChange={(e) => setNewTypeName(e.target.value)}
                        placeholder="اكتب تصنيف أو نوع القضية (مثال: قضايا عمالية، أحوال شخصية...)"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-xs md:text-sm font-bold text-[#1E3A8A] outline-none focus:border-[#D4AF37] transition"
                    />
                </div>
                <button 
                    type="submit" 
                    className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-black px-5 py-2.5 rounded-xl text-xs md:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-blue-900/10 shrink-0"
                >
                    <i className="fas fa-plus"></i> إضافة تصنيف
                </button>
            </form>

            {/* قائمة أنواع القضايا المعروضة */}
            <div className="space-y-3">
                {currentItems.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                        <i className="fas fa-tag text-3xl mb-2"></i>
                        <p className="text-xs font-bold">لا توجد تصنيفات مضافة حتى الآن</p>
                    </div>
                ) : (
                    currentItems.map((type, idx) => {
                        const globalIndex = startIndex + idx + 1;
                        const isEditing = editingId === type.id;

                        return (
                            <div 
                                key={type.id} 
                                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 md:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 font-black text-xs flex items-center justify-center shrink-0 border border-amber-200/60">
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
                                            <h5 className="font-bold text-xs md:text-sm text-slate-800 leading-snug">{type.name}</h5>
                                            <span className="text-[10px] text-slate-400 font-semibold">{type.desc}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                    {isEditing ? (
                                        <>
                                            <button 
                                                type="button" 
                                                onClick={() => handleSaveEdit(type.id)} 
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
                                                onClick={() => startEditing(type)} 
                                                className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200/60 flex items-center justify-center text-xs transition"
                                                title="تعديل نوع القضية"
                                            >
                                                <i className="fas fa-pen"></i>
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => handleDeleteType(type.id, type.name)} 
                                                className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 flex items-center justify-center text-xs transition"
                                                title="حذف نوع القضية"
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
            {types.length > itemsPerPage && (
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-xs font-bold text-slate-400">
                        عرض <span className="text-[#1E3A8A] font-black">{startIndex + 1}</span> إلى <span className="text-[#1E3A8A] font-black">{Math.min(startIndex + itemsPerPage, types.length)}</span> من أصل <span className="text-[#1E3A8A] font-black">{types.length}</span> نوع
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