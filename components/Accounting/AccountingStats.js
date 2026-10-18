// المسار: components/Accounting/AccountingStats.js

window.AccountingStats = function({ stats }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-emerald-50 p-4 md:p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between text-center md:text-right">
                <p className="text-[9px] md:text-[11px] font-bold text-emerald-600 mb-1">الإيرادات (المُحصّل)</p>
                <h4 className="text-lg md:text-2xl font-black text-emerald-700 truncate" dir="ltr">{(stats.totalCollected).toLocaleString()} <span className="text-[10px] md:text-xs">ج.م</span></h4>
            </div>
            <div className="bg-rose-50 p-4 md:p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-between text-center md:text-right">
                <p className="text-[9px] md:text-[11px] font-bold text-rose-600 mb-1">المصروفات التشغيلية</p>
                <h4 className="text-lg md:text-2xl font-black text-rose-700 truncate" dir="ltr">{(stats.totalExpenses).toLocaleString()} <span className="text-[10px] md:text-xs">ج.م</span></h4>
            </div>
            <div className={`p-4 md:p-5 rounded-2xl border shadow-sm flex flex-col justify-between text-center md:text-right ${stats.netProfit >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
                <p className={`text-[9px] md:text-[11px] font-bold mb-1 ${stats.netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>صافي الخزنة</p>
                <h4 className={`text-lg md:text-2xl font-black truncate dir-ltr ${stats.netProfit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>{(stats.netProfit).toLocaleString()} <span className="text-[10px] md:text-xs">ج.م</span></h4>
            </div>
            <div className="bg-slate-800 p-4 md:p-5 rounded-2xl border border-slate-700 shadow-sm relative overflow-hidden flex flex-col justify-between text-center md:text-right">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-5 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
                <p className="text-[9px] md:text-[11px] font-bold text-slate-300 mb-1">مستحقات آجل (خارجية)</p>
                <h4 className="text-lg md:text-2xl font-black text-[#D4AF37] truncate" dir="ltr">{(stats.totalRemaining).toLocaleString()} <span className="text-[10px] md:text-xs">ج.م</span></h4>
            </div>
        </div>
    );
};