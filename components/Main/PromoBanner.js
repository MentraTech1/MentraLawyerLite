// المسار: components/Main/PromoBanner.js

window.PromoBanner = function() {
    return (
        <div className="relative mt-8 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#1e40af] rounded-3xl p-6 md:p-8 text-white shadow-2xl overflow-hidden border border-blue-800/50">
            {/* تأثيرات خلفية متحركة/مضيئة */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D4AF37] rounded-full blur-[60px] opacity-20 -ml-10 -mb-10 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 text-center lg:text-right">
                
                {/* النصوص والأيقونة */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4 sm:gap-5 w-full">
                    <div className="w-16 h-16 shrink-0 bg-gradient-to-br from-[#D4AF37] to-yellow-600 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(212,175,55,0.4)] border border-yellow-400/30">
                        <i className="fas fa-crown text-white"></i>
                    </div>
                    <div>
                        <h4 className="font-black text-xl md:text-2xl mb-1 tracking-tight">نظام متكامل ينتظر مكتبك!</h4>
                        <p className="text-blue-200 text-xs md:text-sm font-semibold leading-relaxed max-w-xl">
                            أنت تستخدم النسخة المصغرة (Lite). قم بالترقية للنسخة الاحترافية (Cloud) للاستمتاع بالمزامنة بين أجهزتك، إضافة سكرتارية، وأرشفة ملفات الـ PDF والصور سحابياً.
                        </p>
                    </div>
                </div>
                
                {/* الأزرار (تأخذ عرض كامل على الموبايل) */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                    <a href="https://wa.me/201211934816" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebd5b] text-white px-6 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/30 active:scale-95">
                        <i className="fab fa-whatsapp text-xl"></i>
                        تواصل واتساب
                    </a>
                    <a href="tel:01211934816" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 dir-ltr">
                        <i className="fas fa-phone-alt text-[#D4AF37]"></i>
                        01211934816
                    </a>
                </div>
                
            </div>
        </div>
    );
};