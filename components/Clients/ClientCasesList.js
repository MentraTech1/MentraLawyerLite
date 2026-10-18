// المسار: components/Clients/ClientCasesList.js

window.ClientCasesList = function({ cases }) {
    const { useState } = React;
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // ليمت 3 قضايا بالصفحة

    const totalPages = Math.ceil(cases.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCases = cases.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                    <h4 className="font-black text-sm md:text-base text-[#1E3A8A] flex items-center gap-2">
                        <i className="fas fa-gavel text-blue-600"></i> قضايا الموكل ({cases.length})
                    </h4>
                    <span className="bg-blue-50 text-blue-700 text-xs font-black px-2.5 py-1 rounded-lg border border-blue-100">
                        {cases.length} قضايا مسجلة
                    </span>
                </div>

                {cases.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <i className="fas fa-folder-open text-3xl mb-2 opacity-40"></i>
                        <p className="text-xs font-bold">لا توجد قضايا مقيدة باسم هذا الموكل حالياً</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {currentCases.map((c, idx) => (
                            <div key={c.id || idx} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:border-blue-200 hover:bg-blue-50/20 transition">
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h5 className="font-black text-[#1E3A8A] text-sm md:text-base">
                                                دعوى رقم: {c.case_number || 'بدون رقم'} {c.case_year || c.year ? `لسنة ${c.case_year || c.year}` : ''}
                                            </h5>
                                            <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
                                                {c.status || 'متداولة'}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-slate-500 font-bold block mt-1">
                                            <i className="fas fa-landmark text-[#D4AF37] ml-1"></i> {c.court_name || c.court || 'المحكمة المختصة'} 
                                            {c.circle || c.court_circle ? ` • الدائرة: ${c.circle || c.court_circle}` : ''}
                                        </span>
                                    </div>
                                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                                        الأتعاب: {parseFloat(c.agreed_fees || c.fees || 0).toLocaleString()} ج.م
                                    </span>
                                </div>

                                {/* كافة البيانات الإضافية للقضية */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-bold text-slate-600 pt-2 border-t border-slate-200/60">
                                    <div>
                                        <span className="text-slate-400">الخصم: </span>
                                        <span className="text-slate-800">{c.opponent_name || c.opponent || 'غير مدون'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">نوع القضية: </span>
                                        <span className="text-slate-800">{c.case_type || c.type || 'مدني'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination القضايا */}
            {cases.length > itemsPerPage && (
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-slate-400">
                        عرض {startIndex + 1} - {Math.min(startIndex + itemsPerPage, cases.length)} من {cases.length}
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
                                    currentPage === page ? 'bg-[#1E3A8A] text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
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