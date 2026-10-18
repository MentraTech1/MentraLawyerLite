// المسار: components/Clients/ClientsPromo.js

window.ClientsPromo = function() {
    return (
        <div className="relative mt-8 bg-gradient-to-l from-emerald-900 to-[#0F172A] rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-xl overflow-hidden border border-emerald-800/50">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#25D366] rounded-full blur-[70px] opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-right">
                <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 w-full">
                    <div className="w-14 h-14 shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl border border-white/20 text-[#25D366]">
                        <i className="fab fa-whatsapp"></i>
                    </div>
                    <div>
                        <h4 className="font-black text-lg md:text-xl mb-1 text-white">تواصل مع موكليك بضغطة زر!</h4>
                        <p className="text-slate-300 text-xs md:text-sm font-semibold max-w-lg leading-relaxed">
                            هل ترغب في إبلاغ موكليك بمواعيد الجلسات أو القرارات فوراً؟ <br/> <strong className="text-emerald-400">النسخة السحابية</strong> تتيح لك إرسال رسائل واتساب تلقائية ومنسقة لكل موكل.
                        </p>
                    </div>
                </div>
                
                <div className="w-full md:w-auto shrink-0">
                    <a href="https://wa.me/201211934816" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5b] text-white px-6 py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-green-900/30">
                        <i className="fas fa-rocket text-lg"></i>
                        ترقية للنسخة السحابية
                    </a>
                </div>
            </div>
        </div>
    );
};