// المسار: components/Accounting/AccountingPromo.js

window.AccountingPromo = function() {
    return (
        <div className="relative mt-8 bg-gradient-to-l from-[#1E3A8A] to-[#0F172A] rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-xl overflow-hidden border border-blue-800/50">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#D4AF37] rounded-full blur-[70px] opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-right">
                <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 w-full">
                    <div className="w-14 h-14 shrink-0 bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl border border-white/10 text-[#D4AF37]">
                        <i className="fas fa-file-invoice"></i>
                    </div>
                    <div>
                        <h4 className="font-black text-lg md:text-xl mb-1 text-white">تحتاج إصدار إيصالات مطبوعة؟</h4>
                        <p className="text-slate-300 text-xs md:text-sm font-semibold max-w-lg leading-relaxed">
                            النسخة المجانية توفر تسجيلاً للحسابات محلياً. الترقية لـ <strong className="text-[#D4AF37]">النسخة السحابية</strong> تمنحك إمكانية إصدار إيصالات دفع للموكلين وطباعة تقارير مالية مفصلة.
                        </p>
                    </div>
                </div>
                
                <div className="w-full md:w-auto shrink-0">
                    <a href="https://wa.me/201211934816" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-yellow-500 text-[#1E3A8A] px-6 py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-yellow-900/30">
                        <i className="fas fa-rocket text-lg"></i>
                        ترقية للنسخة السحابية
                    </a>
                </div>
            </div>
        </div>
    );
};