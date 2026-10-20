// المسار: components/Cases/CasesHeader.js

window.CasesHeader = function({ 
    filters, handleFilterChange, openAddModal, totalFilteredItems,
    clientFilterState, handleClientFilterSearch, selectClientForFilter, clearClientFilter 
}) {
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

            {/* 🌟 تم تعديل الشبكة لتصبح 5 أعمدة في الشاشات الكبيرة */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100">
                
                {/* 1. فلتر رقم القضية */}
                <div className="relative">
                    <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="بحث برقم القضية..." className="w-full bg-white border border-slate-200 rounded-xl py-2.5 md:py-3 pr-10 pl-4 text-xs md:text-sm font-bold text-[#1E3A8A] outline-none focus:border-[#D4AF37] transition" />
                </div>

                {/* 🌟 2. فلتر البحث المباشر عن الموكل */}
                <div className="relative">
                    {clientFilterState.selectedName ? (
                        <div className="bg-emerald-50 border border-emerald-200 p-2.5 md:p-3 rounded-xl flex items-center justify-between h-full">
                            <span className="text-xs md:text-sm font-bold text-emerald-800 truncate flex items-center gap-1.5"><i className="fas fa-user-check text-emerald-500"></i> {clientFilterState.selectedName}</span>
                            <button onClick={clearClientFilter} className="text-rose-500 hover:bg-rose-100 w-6 h-6 rounded-md transition-colors flex shrink-0 items-center justify-center"><i className="fas fa-times text-xs"></i></button>
                        </div>
                    ) : (
                        <>
                            <input 
                                type="text" 
                                value={clientFilterState.term} 
                                onChange={handleClientFilterSearch} 
                                placeholder="اختر الموكل..." 
                                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 md:py-3 pr-10 pl-4 text-xs md:text-sm font-bold text-[#1E3A8A] outline-none focus:border-[#D4AF37] transition" 
                            />
                            <i className="fas fa-users absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                            
                            {clientFilterState.isOpen && clientFilterState.term && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => clearClientFilter()}></div>
                                    <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                        {clientFilterState.results.length > 0 ? (
                                            clientFilterState.results.map(client => (
                                                <li key={client.id} onClick={() => selectClientForFilter(client)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 font-bold text-[#1E3A8A] text-xs md:text-sm transition-colors">{client.name}</li>
                                            ))
                                        ) : (
                                            <li className="p-3 text-center text-slate-400 font-bold text-xs">لا يوجد موكل بهذا الاسم</li>
                                        )}
                                    </ul>
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* 3. فلتر الحالة */}
                <div>
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full bg-white border border-slate-200 rounded-xl py-2.5 md:py-3 px-4 text-xs md:text-sm font-bold text-[#1E3A8A] outline-none focus:border-[#D4AF37] transition cursor-pointer h-full">
                        <option value="all">جميع الحالات</option>
                        <option value="متداولة">متداولة</option>
                        <option value="محجوزة للحكم">محجوزة للحكم</option>
                        <option value="منتهية">منتهية</option>
                    </select>
                </div>

                {/* 4. فلتر التاريخ (من) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 h-full">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 whitespace-nowrap">من:</span>
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="bg-transparent text-xs md:text-sm font-bold text-[#1E3A8A] outline-none w-full" />
                </div>

                {/* 5. فلتر التاريخ (إلى) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 h-full">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 whitespace-nowrap">إلى:</span>
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="bg-transparent text-xs md:text-sm font-bold text-[#1E3A8A] outline-none w-full" />
                </div>
            </div>
        </div>
    );
};