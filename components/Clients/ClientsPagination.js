// المسار: components/Clients/ClientsPagination.js

window.ClientsPagination = function({ totalFilteredItems, itemsPerPage, currentPage, setCurrentPage, totalPages }) {
    if (totalFilteredItems <= itemsPerPage) return null;

    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 animate-view">
            <p className="text-xs font-bold text-slate-500">
                عرض <span className="text-[#1E3A8A] font-black">{startIndex + 1}</span> إلى <span className="text-[#1E3A8A] font-black">{Math.min(startIndex + itemsPerPage, totalFilteredItems)}</span> من أصل <span className="text-[#1E3A8A] font-black">{totalFilteredItems}</span> عنصر
            </p>

            <div className="flex items-center gap-1.5">
                <button 
                    type="button" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                    className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1E3A8A] hover:text-white disabled:opacity-40 disabled:hover:bg-slate-50 disabled:hover:text-slate-600 transition"
                    title="الصفحة السابقة"
                >
                    <i className="fas fa-chevron-right text-xs"></i>
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
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                    className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1E3A8A] hover:text-white disabled:opacity-40 disabled:hover:bg-slate-50 disabled:hover:text-slate-600 transition"
                    title="الصفحة التالية"
                >
                    <i className="fas fa-chevron-left text-xs"></i>
                </button>
            </div>
        </div>
    );
};