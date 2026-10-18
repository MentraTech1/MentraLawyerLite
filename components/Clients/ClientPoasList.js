// المسار: components/Clients/ClientPoasList.js

window.ClientPoasList = function({ poas, onOpenPoas }) {
    const { useState } = React;
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // ليمت 3 توكيلات بالصفحة
    const todayStr = new Date().toISOString().split('T')[0];

    const totalPages = Math.ceil(poas.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPoas = poas.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                    <h4 className="font-black text-sm md:text-base text-[#1E3A8A] flex items-center gap-2">
                        <i className="fas fa-file-signature text-amber-500"></i> توكيلات الموكل ({poas.length})
                    </h4>
                    <button 
                        type="button" 
                        onClick={onOpenPoas}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-black px-3 py-1.5 rounded-lg border border-amber-200 transition flex items-center gap-1 active:scale-95"
                    >
                        <i className="fas fa-plus"></i> إدارة / توكيل جديد
                    </button>
                </div>

                {poas.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <i className="fas fa-file-excel text-3xl mb-2 opacity-40"></i>
                        <p className="text-xs font-bold">لا توجد توكيلات مسجلة لهذا الموكل</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {currentPoas.map((p, idx) => {
                            const isExpired = p.expiry_date && p.expiry_date < todayStr;
                            return (
                                <div key={p.id || idx} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:border-amber-200 hover:bg-amber-50/20 transition">
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                                    {p.poa_type || 'توكيل'}
                                                </span>
                                                <h5 className="font-black text-[#1E3A8A] text-sm md:text-base">
                                                    {p.poa_number}
                                                </h5>
                                                {p.expiry_date && (
                                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                                        isExpired ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                                                    }`}>
                                                        {isExpired ? 'منتهي الصلاحية' : 'ساري'}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[11px] text-slate-500 font-bold block mt-1">
                                                <i className="fas fa-building text-slate-400 ml-1"></i> {p.documentation_office || 'مكتب الشهر العقاري غير محدد'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* كافة تواريخ التوكيل والقيود */}
                                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-200/60">
                                        <div>
                                            <span className="text-slate-400">تاريخ الإصدار: </span>
                                            <span className="text-slate-700">{p.poa_date || 'غير محدد'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">تاريخ الانتهاء: </span>
                                            <span className={isExpired ? "text-rose-600 font-black" : "text-slate-700"}>
                                                {p.expiry_date || 'مفتوح (بدون أجل)'}
                                            </span>
                                        </div>
                                    </div>

                                    {p.notes && (
                                        <div className="mt-2 text-[10px] text-slate-600 font-semibold bg-white p-2 rounded-lg border border-slate-100">
                                            <span className="font-bold text-amber-700"><i className="fas fa-info-circle ml-1"></i> القيود/الملاحظات: </span>
                                            {p.notes}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Pagination التوكيلات */}
            {poas.length > itemsPerPage && (
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-slate-400">
                        عرض {startIndex + 1} - {Math.min(startIndex + itemsPerPage, poas.length)} من أصل {poas.length} توكيلات
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
                                    currentPage === page ? 'bg-amber-500 text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
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
    );
};