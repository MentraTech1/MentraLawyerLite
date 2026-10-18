// المسار: components/Agenda/AgendaPagination.js

window.AgendaPagination = function({ totalFiltered, ITEMS_PER_PAGE, currentPage, setCurrentPage, totalPages }) {
    if (totalFiltered <= ITEMS_PER_PAGE) return null;

    return (
        <div className="flex items-center justify-between bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm mt-4 md:mt-6">
            <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg text-xs md:text-sm font-bold bg-slate-100 text-slate-600 hover:bg-[#1E3A8A] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
                <i className="fas fa-chevron-right text-[10px]"></i> <span className="hidden sm:inline">السابق</span>
            </button>
            
            <span className="text-xs md:text-sm font-black text-[#1E3A8A]">
                صفحة {currentPage} من {totalPages}
            </span>

            <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg text-xs md:text-sm font-bold bg-slate-100 text-slate-600 hover:bg-[#1E3A8A] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
                <span className="hidden sm:inline">التالي</span> <i className="fas fa-chevron-left text-[10px]"></i>
            </button>
        </div>
    );
};