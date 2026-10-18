// المسار: components/Main/DashboardStats.js

window.DashboardStats = function({ stats, isLoading }) {
    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group flex flex-col justify-between h-full">
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 flex justify-between items-start mb-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-blue-600 text-white flex items-center justify-center text-lg md:text-xl shadow-lg shadow-blue-900/20"><i className="fas fa-gavel"></i></div>
                    <h3 className="text-2xl md:text-4xl font-black text-[#1E3A8A]">
                        {isLoading ? <i className="fas fa-spinner fa-spin text-lg text-slate-300"></i> : stats.cases}
                    </h3>
                </div>
                <div className="relative z-10">
                    <p className="text-[11px] md:text-xs font-bold text-slate-500">القضايا المضافة</p>
                    <p className="text-[9px] md:text-[10px] font-bold text-emerald-500 mt-1">في النطاق الزمني</p>
                </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group flex flex-col justify-between h-full">
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 flex justify-between items-start mb-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center text-lg md:text-xl shadow-lg shadow-emerald-500/20"><i className="fas fa-users"></i></div>
                    <h3 className="text-2xl md:text-4xl font-black text-[#1E3A8A]">
                        {isLoading ? <i className="fas fa-spinner fa-spin text-lg text-slate-300"></i> : stats.clients}
                    </h3>
                </div>
                <div className="relative z-10">
                    <p className="text-[11px] md:text-xs font-bold text-slate-500">الموكلين الجدد</p>
                    <p className="text-[9px] md:text-[10px] font-bold text-emerald-500 mt-1">في النطاق الزمني</p>
                </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group flex flex-col justify-between h-full">
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-amber-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 flex justify-between items-start mb-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#D4AF37] to-yellow-600 text-white flex items-center justify-center text-lg md:text-xl shadow-lg shadow-yellow-500/20"><i className="fas fa-calendar-alt"></i></div>
                    <h3 className="text-2xl md:text-4xl font-black text-[#1E3A8A]">
                        {isLoading ? <i className="fas fa-spinner fa-spin text-lg text-slate-300"></i> : stats.sessions}
                    </h3>
                </div>
                <div className="relative z-10">
                    <p className="text-[11px] md:text-xs font-bold text-slate-500">جلسات المحاكم</p>
                    <p className="text-[9px] md:text-[10px] font-bold text-amber-500 mt-1">في النطاق الزمني</p>
                </div>
            </div>

            <div className="bg-[#0B1120] p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group flex flex-col justify-between h-full">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50"></div>
                <div className="relative z-10 flex justify-between items-start mb-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 text-[#D4AF37] backdrop-blur-sm flex items-center justify-center text-lg md:text-xl border border-white/5"><i className="fas fa-archive"></i></div>
                    <h3 className="text-2xl md:text-4xl font-black text-white">
                        {isLoading ? <i className="fas fa-spinner fa-spin text-lg text-slate-500"></i> : stats.totalCases}
                    </h3>
                </div>
                <div className="relative z-10">
                    <p className="text-[11px] md:text-xs font-bold text-slate-400">إجمالي القضايا</p>
                    <p className="text-[9px] md:text-[10px] font-bold text-[#D4AF37] mt-1">تراكمي (كل الأوقات)</p>
                </div>
            </div>
        </div>
    );
};