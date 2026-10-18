// المسار: components/Backup/BackupPromo.js

window.BackupPromo = function() {
    return (
        <div className="relative mt-8 bg-gradient-to-r from-blue-900 to-[#1E3A8A] rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-xl overflow-hidden border border-blue-800/50">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-[80px] opacity-10 -ml-10 -mt-10 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-right">
                <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 w-full">
                    <div className="w-14 h-14 shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl border border-white/20">
                        <i className="fas fa-cloud-upload-alt text-[#D4AF37]"></i>
                    </div>
                    <div>
                        <h4 className="font-black text-lg md:text-xl mb-1">خائف من ضياع بياناتك أو تلف جهازك؟</h4>
                        <p className="text-blue-200 text-xs md:text-sm font-semibold max-w-lg leading-relaxed">
                            في النسخة المجانية (الحالية) أنت المسؤول عن أخذ النسخ الاحتياطية يدوياً. قم بالترقية للنسخة السحابية للاستمتاع <strong>بنسخ احتياطي يومي تلقائي</strong> مع حماية كاملة ضد تلف المتصفح أو الأجهزة.
                        </p>
                    </div>
                </div>
                
                <div className="w-full md:w-auto shrink-0 flex flex-col gap-2">
                    <a href="https://wa.me/201211934816" target="_blank" rel="noopener noreferrer" className="w-full bg-[#D4AF37] hover:bg-yellow-500 text-[#1E3A8A] px-6 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-yellow-900/20">
                        <i className="fab fa-whatsapp text-lg"></i>
                        تأمين مكتبي الآن
                    </a>
                </div>
            </div>
        </div>
    );
};