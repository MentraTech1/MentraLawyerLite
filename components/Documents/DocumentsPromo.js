// المسار: components/Documents/DocumentsPromo.js

window.DocumentsPromo = function() {
    return (
        <div className="relative mt-8 bg-gradient-to-r from-slate-900 to-[#1E3A8A] rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-xl overflow-hidden border border-blue-900/50">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 rounded-full blur-[70px] opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-right">
                <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 w-full">
                    <div className="w-14 h-14 shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl border border-white/20 text-indigo-300">
                        <i className="fas fa-file-pdf"></i>
                    </div>
                    <div>
                        <h4 className="font-black text-lg md:text-xl mb-1 text-white">تريد رفع صور التوكيلات ومحاضر الجلسات؟</h4>
                        <p className="text-blue-200 text-xs md:text-sm font-semibold max-w-lg leading-relaxed">
                            النسخة الحالية تدعم كتابة النصوص فقط لتوفير مساحة متصفحك. بادر بالترقية للنسخة السحابية للحصول على أرشيف رقمي كامل يسمح برفع (PDF, JPG, PNG) بلا حدود!
                        </p>
                    </div>
                </div>
                
                <div className="w-full md:w-auto shrink-0 flex flex-col gap-2">
                    <a href="https://wa.me/201211934816" target="_blank" rel="noopener noreferrer" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-900/30">
                        <i className="fas fa-cloud-upload-alt text-lg"></i>
                        تفعيل الأرشيف السحابي
                    </a>
                </div>
            </div>
        </div>
    );
};