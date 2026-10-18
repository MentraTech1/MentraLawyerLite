// المسار: components/Clients/ClientsHeader.js

window.ClientsHeader = function({ activeTab, switchTab, filters, handleFilterChange, openAddClientModal }) {
    return (
        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm p-4 md:p-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 md:mb-6">
                
                {/* التبويبات */}
                <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                    <button onClick={() => switchTab('clients')} className={`flex-1 md:w-32 py-2.5 md:py-2 text-xs md:text-sm font-black rounded-lg transition-all ${activeTab === 'clients' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>الموكلين</button>
                    <button onClick={() => switchTab('poas')} className={`flex-1 md:w-32 py-2.5 md:py-2 text-xs md:text-sm font-black rounded-lg transition-all ${activeTab === 'poas' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>سجل التوكيلات</button>
                </div>

                {/* زر الإضافة */}
                {activeTab === 'clients' && (
                    <button onClick={openAddClientModal} className="w-full md:w-auto bg-gradient-to-l from-emerald-600 to-emerald-700 hover:to-emerald-800 text-white px-5 py-3 md:px-6 md:py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                        <i className="fas fa-user-plus"></i> تسجيل موكل
                    </button>
                )}
            </div>

            {/* شبكة الفلاتر */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100">
                <div className="relative">
                    <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder={activeTab === 'clients' ? "بحث بالاسم، الهاتف..." : "بحث بالموكل، التوكيل..."} className="w-full bg-white border border-slate-200 rounded-xl py-2.5 md:py-3 pr-10 pl-4 text-xs md:text-sm font-bold text-[#1E3A8A] outline-none focus:border-emerald-500 transition" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 whitespace-nowrap">من تاريخ:</span>
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="bg-transparent text-xs md:text-sm font-bold text-[#1E3A8A] outline-none w-full" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 whitespace-nowrap">إلى تاريخ:</span>
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="bg-transparent text-xs md:text-sm font-bold text-[#1E3A8A] outline-none w-full" />
                </div>
            </div>
        </div>
    );
};