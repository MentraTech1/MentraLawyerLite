// المسار: components/Clients/ClientFinancialStats.js

window.ClientFinancialStats = function({ stats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 animate-view">
            {/* 1. أداني كام */}
            <div className="bg-white p-5 rounded-2xl md:rounded-3xl border border-emerald-200 shadow-sm flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold text-slate-500 block mb-1">المدفوع للمكتب (أداني كام)</span>
                    <h4 className="text-2xl md:text-3xl font-black text-emerald-600">{stats.totalPaid.toLocaleString()} <span className="text-xs font-bold">ج.م</span></h4>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block"><i className="fas fa-check-circle ml-1"></i> إجمالي المقبوضات المسددة</span>
                </div>
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                    <i className="fas fa-hand-holding-dollar"></i>
                </div>
            </div>

            {/* 2. عليه كام */}
            <div className="bg-white p-5 rounded-2xl md:rounded-3xl border border-rose-200 shadow-sm flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold text-slate-500 block mb-1">المتبقي في ذمته (عليه كام)</span>
                    <h4 className="text-2xl md:text-3xl font-black text-rose-600">{stats.remaining.toLocaleString()} <span className="text-xs font-bold">ج.م</span></h4>
                    <span className={`text-[10px] font-bold mt-1 inline-block ${stats.remaining > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                        <i className="fas fa-receipt ml-1"></i> {stats.remaining > 0 ? 'مستحقات آجلة للمكتب' : 'الحساب خالص بالكامل'}
                    </span>
                </div>
                <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                    <i className="fas fa-file-invoice"></i>
                </div>
            </div>

            {/* 3. إجمالي الأتعاب */}
            <div className="bg-white p-5 rounded-2xl md:rounded-3xl border border-blue-200 shadow-sm flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي الأتعاب المقررة</span>
                    <h4 className="text-2xl md:text-3xl font-black text-[#1E3A8A]">{stats.totalFees.toLocaleString()} <span className="text-xs font-bold">ج.م</span></h4>
                    <span className="text-[10px] text-blue-500 font-bold mt-1 inline-block"><i className="fas fa-scale-balanced ml-1"></i> إجمالي قيمة التعاقدات</span>
                </div>
                <div className="w-14 h-14 bg-blue-50 text-[#1E3A8A] rounded-2xl flex items-center justify-center text-3xl shrink-0">
                    <i className="fas fa-coins"></i>
                </div>
            </div>
        </div>
    );
};