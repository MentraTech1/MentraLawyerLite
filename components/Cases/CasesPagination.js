// المسار: components/Cases/CasesPagination.js

window.CasesPagination = function({ totalFilteredItems, itemsPerPage, currentPage, setCurrentPage, totalPages }) {
    if (totalFilteredItems <= itemsPerPage) return null;

    return (
        <div className="p-3 md:p-4 mt-3 md:mt-0 border border-slate-200 md:border-t md:border-x-0 md:border-b-0 bg-white md:bg-slate-50 flex items-center justify-between rounded-2xl md:rounded-none shadow-sm md:shadow-none">
            <p className="text-[11px] md:text-xs font-bold text-slate-500">
                صفحة {currentPage} من {totalPages}
            </p>
            <div className="flex gap-1">
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                    disabled={currentPage === 1} 
                    className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1E3A8A] hover:text-white transition-colors disabled:opacity-50"
                >
                    <i className="fas fa-chevron-right text-[10px] md:text-xs"></i>
                </button>
                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                    disabled={currentPage === totalPages} 
                    className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1E3A8A] hover:text-white transition-colors disabled:opacity-50"
                >
                    <i className="fas fa-chevron-left text-[10px] md:text-xs"></i>
                </button>
            </div>
        </div>
    );
};