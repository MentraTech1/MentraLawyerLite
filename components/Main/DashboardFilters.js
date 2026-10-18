// المسار: components/Main/DashboardFilters.js

window.DashboardFilters = function({ startDate, setStartDate, endDate, setEndDate, activeFilterBtn, setActiveFilterBtn, applyQuickFilter }) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col xl:flex-row justify-between gap-4">
            
            {/* أزرار الفلترة السريعة (تمرير أفقي على الموبايل) */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 w-full xl:w-auto snap-x">
                <button onClick={() => applyQuickFilter('month')} className={`whitespace-nowrap snap-center px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeFilterBtn === 'month' ? 'bg-[#1E3A8A] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>هذا الشهر</button>
                <button onClick={() => applyQuickFilter('year')} className={`whitespace-nowrap snap-center px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeFilterBtn === 'year' ? 'bg-[#1E3A8A] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>هذا العام</button>
                <button onClick={() => applyQuickFilter('all')} className={`whitespace-nowrap snap-center px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeFilterBtn === 'all' ? 'bg-[#1E3A8A] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>كل الأوقات</button>
            </div>
            
            {/* حقول التاريخ (تأخذ عرض كامل على الموبايل) */}
            <div className="grid grid-cols-2 xl:flex items-center gap-3 w-full xl:w-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 w-full">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400">من</span>
                    <input type="date" value={startDate} onChange={(e) => {setStartDate(e.target.value); setActiveFilterBtn('custom');}} className="bg-transparent text-xs sm:text-sm font-bold text-[#1E3A8A] outline-none w-full" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 w-full">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400">إلى</span>
                    <input type="date" value={endDate} onChange={(e) => {setEndDate(e.target.value); setActiveFilterBtn('custom');}} className="bg-transparent text-xs sm:text-sm font-bold text-[#1E3A8A] outline-none w-full" />
                </div>
            </div>
        </div>
    );
};