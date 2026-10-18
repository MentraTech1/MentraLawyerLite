// المسار: components/Cases/CasesHeader.js

window.CasesHeader = function({ filters, handleFilterChange, openAddModal, totalFilteredItems }) {
    return (
        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm p-4 md:p-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-6">
                <h3 className="font-black text-lg md:text-xl text-[#1E3A8A] flex items-center gap-2 w-full md:w-auto">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><i className="fas fa-gavel"></i></div>
                    سجل القضايا
                    <span className="text-[10px] md:text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg mr-auto md:ml-2 md:mr-0 border border-slate-200">{totalFilteredItems} قضية</span>
                </h3>
                <button onClick={openAddModal} className="w-full md:w-auto bg-gradient-to-l from-[#1E3A8A] to-blue-800 hover:to-blue-900 text-white px-5 py-3 md:px-6 rounded-xl md:rounded-2xl text-sm font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                    <i className="fas fa-plus"></i> تسجيل قضية جديدة
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100">
                <div className="relative">
                    <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="بحث برقم القضية..." className="w-full bg-white border border-slate-200 rounded-xl py-2.5 md:py-3 pr-10 pl-4 text-xs md:text-sm font-bold text-[#1E3A8A] outline-none focus:border-[#D4AF37] transition" />
                </div>
                <div>
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full bg-white border border-slate-200 rounded-xl py-2.5 md:py-3 px-4 text-xs md:text-sm font-bold text-[#1E3A8A] outline-none focus:border-[#D4AF37] transition cursor-pointer">
                        <option value="all">جميع الحالات</option>
                        <option value="متداولة">متداولة</option>
                        <option value="محجوزة للحكم">محجوزة للحكم</option>
                        <option value="منتهية">منتهية</option>
                    </select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 whitespace-nowrap">من:</span>
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="bg-transparent text-xs md:text-sm font-bold text-[#1E3A8A] outline-none w-full" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 whitespace-nowrap">إلى:</span>
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="bg-transparent text-xs md:text-sm font-bold text-[#1E3A8A] outline-none w-full" />
                </div>
            </div>
        </div>
    );
};