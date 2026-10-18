// المسار: components/Accounting/AccountingChart.js

window.AccountingChart = function({ stats }) {
    const total = stats.totalCollected + stats.totalExpenses;
    
    // حساب النسب المئوية
    const revPercent = total === 0 ? 0 : Math.round((stats.totalCollected / total) * 100);
    const expPercent = total === 0 ? 0 : Math.round((stats.totalExpenses / total) * 100);

    // حسابات رسم الدائرة (SVG Circle Math)
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const revDasharray = `${(revPercent / 100) * circumference} ${circumference}`;
    const expDasharray = `${(expPercent / 100) * circumference} ${circumference}`;
    const expOffset = circumference - ((revPercent / 100) * circumference);

    // دالة ذكية لتنسيق الأرقام الكبيرة في منتصف الدائرة (K للمئات والآلاف، M للملايين)
    const formatCompactNumber = (number) => {
        if (number >= 1000000) return (number / 1000000).toFixed(2) + 'M';
        if (number >= 1000) return (number / 1000).toFixed(1) + 'k';
        return number.toString();
    };

    return (
        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm p-5 md:p-8 mb-6 relative overflow-hidden">
            {/* زخرفة خلفية بسيطة */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-slate-50 rounded-br-[100px] -z-0"></div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                
                {/* 1. قسم النصوص والمؤشر */}
                <div className="flex-1 text-center lg:text-right w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs mb-3 border border-blue-100">
                        <i className="fas fa-chart-pie"></i> التحليل المالي
                    </div>
                    <h3 className="font-black text-[#1E3A8A] text-xl md:text-2xl mb-3">مؤشر أداء الخزنة</h3>
                    <p className="text-slate-500 text-sm font-semibold leading-relaxed max-w-lg mx-auto lg:mx-0 mb-5">
                        يوضح هذا المؤشر التفاعلي توزيع السيولة النقدية في مكتبك، من خلال مقارنة حجم الإيرادات المُحصّلة مقابل المصروفات التشغيلية.
                    </p>

                    {/* شارة الحالة المالية */}
                    {total > 0 && (
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border shadow-sm transition-all ${
                            stats.netProfit > 0 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                            : stats.netProfit < 0 
                                ? 'bg-rose-50 border-rose-200 text-rose-700'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}>
                            {stats.netProfit > 0 ? (
                                <><i className="fas fa-arrow-trend-up text-emerald-500"></i> المؤشر إيجابي (فائض في الخزنة)</>
                            ) : stats.netProfit < 0 ? (
                                <><i className="fas fa-arrow-trend-down text-rose-500"></i> المؤشر سلبي (عجز في الخزنة)</>
                            ) : (
                                <><i className="fas fa-equals text-slate-500"></i> تعادل (لا يوجد ربح أو خسارة)</>
                            )}
                        </div>
                    )}
                </div>

                {/* 2. قسم الرسم البياني والتفاصيل */}
                <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 shrink-0 w-full lg:w-auto bg-slate-50/50 p-4 md:p-6 rounded-3xl border border-slate-100">
                    
                    {/* الرسم البياني (SVG Doughnut Chart) */}
                    <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center shrink-0 drop-shadow-md">
                        {total === 0 ? (
                            <div className="w-full h-full rounded-full border-[16px] border-slate-100 border-dashed flex items-center justify-center animate-[spin_20s_linear_infinite]">
                                <div className="animate-[spin_20s_linear_infinite_reverse] text-center">
                                    <i className="fas fa-box-open text-slate-300 text-xl mb-1 block"></i>
                                </div>
                            </div>
                        ) : (
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                                <defs>
                                    {/* تأثير الظل ليعطي بروز للرسم */}
                                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
                                    </filter>
                                </defs>
                                {/* دائرة الخلفية (تراك رمادي) */}
                                <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
                                
                                {/* دائرة الإيرادات */}
                                <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#10b981" strokeWidth="16" 
                                    strokeDasharray={revDasharray} strokeLinecap="round" className="transition-all duration-1000 ease-out" filter="url(#shadow)" />
                                    
                                {/* دائرة المصروفات */}
                                <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#f43f5e" strokeWidth="16" 
                                    strokeDasharray={expDasharray} strokeDashoffset={-expOffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" filter="url(#shadow)" />
                            </svg>
                        )}
                        
                        {/* النص في المنتصف */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">الحجم المالي</span>
                            <span className="font-black text-[#1E3A8A] text-lg md:text-xl dir-ltr tracking-tight">{formatCompactNumber(total)}</span>
                        </div>
                    </div>

                    {/* مفتاح الرسم البياني (البطاقات الجانبية) */}
                    <div className="flex flex-col gap-3 w-full sm:w-48">
                        {/* بطاقة الإيرادات */}
                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-colors">
                            <div className="flex items-center gap-2.5">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 leading-none mb-1">الإيرادات</p>
                                    <p className="text-xs font-black text-slate-700" dir="ltr">{stats.totalCollected.toLocaleString()}</p>
                                </div>
                            </div>
                            <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{revPercent}%</span>
                        </div>

                        {/* بطاقة المصروفات */}
                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-rose-200 transition-colors">
                            <div className="flex items-center gap-2.5">
                                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 leading-none mb-1">المصروفات</p>
                                    <p className="text-xs font-black text-slate-700" dir="ltr">{stats.totalExpenses.toLocaleString()}</p>
                                </div>
                            </div>
                            <span className="text-sm font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">{expPercent}%</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};