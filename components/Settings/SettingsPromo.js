// المسار: components/Settings/SettingsPromo.js

window.SettingsPromo = function() {
    return (
        <div className="relative mt-8 bg-gradient-to-l from-slate-900 via-[#0B1120] to-[#1E3A8A] rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-xl overflow-hidden border border-blue-900/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-right">
                <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 w-full">
                    <div className="w-14 h-14 shrink-0 bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl border border-white/10 text-[#D4AF37]">
                        <i className="fas fa-shield-alt"></i>
                    </div>
                    <div>
                        <h4 className="font-black text-lg md:text-xl mb-1 text-white">هل تنسى أخذ نسخة احتياطية؟</h4>
                        <p className="text-slate-400 text-xs md:text-sm font-semibold max-w-lg leading-relaxed">
                            في النسخة المجانية قد تفقد بياناتك إذا تم عمل "فورمات" لموبايلك. اشترك الآن في <strong className="text-white">النسخة السحابية (Cloud)</strong> واستمتع بنسخ احتياطي يومي تلقائي ومزامنة بين الموبايل والكمبيوتر بضمان 100%.
                        </p>
                    </div>
                </div>
                
                <div className="w-full md:w-auto shrink-0 flex flex-col gap-2">
                    <a href="https://wa.me/201211934816" target="_blank" rel="noopener noreferrer" className="w-full bg-[#D4AF37] hover:bg-yellow-500 text-[#1E3A8A] px-6 py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-yellow-900/20 flex items-center justify-center gap-2">
                        <i className="fab fa-whatsapp text-lg"></i>
                        تأمين مكتبي الآن
                    </a>
                </div>
            </div>
        </div>
    );
};