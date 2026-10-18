// المسار: components/Main/ExpiringPOAs.js

window.ExpiringPOAs = function({ poas, isLoading }) {
    const { useState, useMemo } = React;
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const limit = 3;

    // فلترة التوكيلات بحسب البحث (اسم الموكل، رقم التوكيل، أو تاريخ الانتهاء)
    const filteredPOAs = useMemo(() => {
        if (!searchTerm.trim()) return poas || [];
        const term = searchTerm.toLowerCase().trim();
        return (poas || []).filter(poa => {
            const clientName = String(poa.client_name || '').toLowerCase();
            const poaNumber = String(poa.poa_number || '').toLowerCase();
            const expiryDate = String(poa.expiry_date || '').toLowerCase();
            return clientName.includes(term) || poaNumber.includes(term) || expiryDate.includes(term);
        });
    }, [poas, searchTerm]);

    // احتساب إجمالي الصفحات وتقسيم البيانات (الحد: 3 عناصر)
    const totalPages = Math.ceil(filteredPOAs.length / limit) || 1;
    const currentData = filteredPOAs.slice((page - 1) * limit, page * limit);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // إعادة التوجيه للصفحة الأولى عند البحث
    };

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
            {/* Header مع شريط البحث */}
            <div className="p-4 md:p-5 border-b border-slate-50 bg-rose-50/30 flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner shrink-0">
                        <i className="fas fa-file-signature text-sm"></i>
                    </div>
                    <div>
                        <h3 className="font-bold text-[#1E3A8A] text-sm md:text-base leading-tight">توكيلات على وشك الانتهاء</h3>
                        <span className="text-[10px] font-bold text-slate-400">الإجمالي: {filteredPOAs.length} توكيل</span>
                    </div>
                </div>

                {/* حقل البحث السريع */}
                <div className="relative w-full sm:w-48">
                    <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="بحث بالموكل أو الرقم..."
                        className="w-full bg-white pr-8 pl-8 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 placeholder-slate-400 outline-none focus:border-rose-400 transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => { setSearchTerm(''); setPage(1); }}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                            title="مسح البحث"
                        >
                            <i className="fas fa-times-circle"></i>
                        </button>
                    )}
                </div>
            </div>

            {/* محتوى القائمة */}
            <div className="p-0 min-h-[200px]">
                {isLoading ? (
                    <div className="py-14 text-center">
                        <i className="fas fa-circle-notch fa-spin text-2xl text-rose-400"></i>
                        <p className="text-slate-400 font-bold text-xs mt-2">جاري فحص التوكيلات...</p>
                    </div>
                ) : filteredPOAs.length === 0 ? (
                    <div className="py-10 text-center flex flex-col items-center">
                        <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                            <i className={searchTerm ? "fas fa-search text-xl text-slate-300" : "fas fa-check-circle text-2xl text-emerald-400"}></i>
                        </div>
                        <p className="text-slate-400 font-bold text-xs md:text-sm">
                            {searchTerm ? 'لا توجد نتائج مطابقة لبحثك' : 'لا توجد توكيلات منتهية قريباً'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {currentData.map((poa, idx) => {
                            const isExpired = poa.expiry_date < todayStr;
                            return (
                                <div key={poa.id || idx} className="p-3.5 hover:bg-slate-50/80 transition-colors flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{poa.client_name}</p>
                                        <p className="text-[11px] font-bold text-slate-400 mt-1 flex gap-2">
                                            <span>رقم: {poa.poa_number || 'غير مسجل'}</span>
                                        </p>
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                                        isExpired 
                                            ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                                    }`}>
                                        <i className={`fas ${isExpired ? 'fa-exclamation-triangle' : 'fa-hourglass-half'} text-[9px]`}></i>
                                        <span>{isExpired ? 'منتهي' : poa.expiry_date}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center px-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-1"
                    >
                        <i className="fas fa-chevron-right text-[10px]"></i>
                        <span>السابق</span>
                    </button>

                    <div className="text-xs font-bold text-rose-800 bg-rose-50/80 border border-rose-100 px-3 py-1 rounded-md">
                        صفحة {page} من {totalPages}
                    </div>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-1"
                    >
                        <span>التالي</span>
                        <i className="fas fa-chevron-left text-[10px]"></i>
                    </button>
                </div>
            )}
        </div>
    );
};