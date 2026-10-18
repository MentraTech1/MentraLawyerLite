// المسار: components/Settings/StorageTab.js

window.StorageTab = function({ storageInfo, handleBackup }) {
    return (
        <div className="p-4 md:p-8 animate-view space-y-6 md:space-y-8">
            <h4 className="font-black text-base md:text-lg text-[#1E3A8A] mb-3 md:mb-4 border-b border-slate-100 pb-3 md:pb-4 flex items-center gap-2">
                <i className="fas fa-hdd text-[#D4AF37]"></i> مساحة التخزين المستخدمة (Offline)
            </h4>
            
            {storageInfo && storageInfo.isSupported ? (
                <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-100 relative overflow-hidden">
                    <i className="fas fa-database absolute -left-2 -bottom-2 md:-left-4 md:-bottom-4 text-6xl md:text-8xl text-slate-200 opacity-50"></i>
                    <div className="relative z-10">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <p className="text-[10px] md:text-xs font-bold text-slate-500 mb-0.5 md:mb-1">بيانات محفوظة محلياً</p>
                                <h3 className="text-2xl md:text-3xl font-black text-[#1E3A8A]">{storageInfo.used || '0.00'} <span className="text-xs md:text-sm">MB</span></h3>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] md:text-xs font-bold text-slate-400 mb-0.5 md:mb-1">مساحة جهازك المتاحة</p>
                                <h3 className="text-lg md:text-xl font-bold text-slate-600">{storageInfo.total || '0.00'} <span className="text-[10px] md:text-xs">MB</span></h3>
                            </div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 md:h-3 mb-2 overflow-hidden shadow-inner">
                            <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 md:h-3 rounded-full transition-all duration-1000" style={{ width: `${Math.max(storageInfo.percent || 1, 1)}%` }}></div>
                        </div>
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 flex items-start md:items-center gap-1">
                            <i className="fas fa-info-circle text-emerald-500 mt-0.5 md:mt-0"></i> البيانات النصية تستهلك مساحة صغيرة جداً. جهازك قادر على استيعاب آلاف القضايا!
                        </p>
                    </div>
                </div>
            ) : (
                <div className="bg-amber-50 p-3 md:p-4 rounded-xl border border-amber-200 text-amber-700 text-xs md:text-sm font-bold flex items-start md:items-center gap-2">
                    <i className="fas fa-exclamation-triangle mt-0.5 md:mt-0"></i> متصفحك لا يدعم قراءة مساحة التخزين، ولكن بياناتك محفوظة بأمان.
                </div>
            )}

            <div className="border-t border-slate-100 pt-6 md:pt-8">
                <h4 className="font-black text-base md:text-lg text-[#1E3A8A] mb-3 md:mb-4 flex items-center gap-2">
                    <i className="fas fa-cloud-download-alt text-[#D4AF37]"></i> استخراج نسخة احتياطية
                </h4>
                <div className="flex flex-col gap-4 bg-blue-50 p-4 md:p-6 rounded-2xl border border-blue-100 text-center md:text-right">
                    <div>
                        <h5 className="font-black text-blue-900 mb-1.5 md:mb-2 text-sm md:text-base">أمان بياناتك بيدك</h5>
                        <p className="text-[11px] md:text-xs font-bold text-blue-700 leading-relaxed mb-2">
                            لتجنب ضياع مجهودك عند عمل "فورمات" للجهاز أو المتصفح، قم بتحميل هذا الملف واحتفظ به في مكان آمن.
                        </p>
                        <p className="text-[9px] md:text-[10px] text-blue-500 font-bold">
                            <i className="fas fa-shield-alt"></i> ملاحظة: الملف المستخرج لا يحتوي على كلمات المرور لحمايتك.
                        </p>
                    </div>
                    <button 
                        type="button"
                        onClick={handleBackup} 
                        className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white px-5 md:px-6 py-3.5 md:py-4 rounded-xl text-sm font-black shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <i className="fas fa-download text-base md:text-lg"></i> تحميل قاعدة البيانات
                    </button>
                </div>
            </div>
        </div>
    );
};