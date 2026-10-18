// المسار: components/Clients/ClientsStats.js

window.ClientsStats = function({ stats }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-white p-3 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-center md:text-right">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg md:text-xl shrink-0"><i className="fas fa-users"></i></div>
                <div><p className="text-[10px] md:text-xs font-bold text-slate-500">إجمالي الموكلين</p><h4 className="text-xl md:text-2xl font-black text-[#1E3A8A]">{stats.clientsCount}</h4></div>
            </div>
            <div className="bg-white p-3 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-center md:text-right">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg md:text-xl shrink-0"><i className="fas fa-file-signature"></i></div>
                <div><p className="text-[10px] md:text-xs font-bold text-slate-500">إجمالي التوكيلات</p><h4 className="text-xl md:text-2xl font-black text-[#1E3A8A]">{stats.poasCount}</h4></div>
            </div>
            <div className="col-span-2 md:col-span-1 bg-white p-3 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-center md:text-right">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg md:text-xl shrink-0"><i className="fas fa-check-circle"></i></div>
                <div><p className="text-[10px] md:text-xs font-bold text-slate-500">توكيلات سارية (فعالة)</p><h4 className="text-xl md:text-2xl font-black text-[#1E3A8A]">{stats.activePoas}</h4></div>
            </div>
        </div>
    );
};