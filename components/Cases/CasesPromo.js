// المسار: components/Cases/CasesPromo.js

window.CasesPromo = function() {
    return (
        <div className="relative mt-8 bg-gradient-to-l from-slate-900 to-[#0F172A] rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-xl overflow-hidden border border-slate-800">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500 rounded-full blur-[70px] opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-right">
                <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 w-full">
                    <div className="w-14 h-14 shrink-0 bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl border border-white/10 text-emerald-400">
                        <i className="fas fa-users-cog"></i>
                    </div>
                    <div>
                        <h4 className="font-black text-lg md:text-xl mb-1 text-white">هل لديك سكرتارية أو شركاء؟</h4>
                        <p className="text-slate-400 text-xs md:text-sm font-semibold max-w-lg leading-relaxed">
                            النسخة المجانية تعمل على جهاز واحد فقط. بادر بالترقية للنسخة السحابية لربط جميع أجهزة المكتب، تعيين صلاحيات لكل مستخدم، والعمل على نفس القضايا في وقت واحد!
                        </p>
                    </div>
                </div>
                
                <div className="w-full md:w-auto shrink-0">
                    <a href="https://wa.me/201211934816" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-emerald-900/30">
                        <i className="fab fa-whatsapp text-lg"></i>
                        تفعيل العمل الجماعي
                    </a>
                </div>
            </div>
        </div>
    );
};