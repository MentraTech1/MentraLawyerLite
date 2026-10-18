// المسار: components/Backup/BackupActions.js

window.BackupActions = function({ activeTab, isProcessing, handleExport, handleImportClick, processImport, fileInputRef }) {
    return (
        <div className="p-5 md:p-8 border-b border-slate-100">
            {activeTab === 'export' ? (
                <div className="text-center max-w-lg mx-auto">
                    <i className="fas fa-file-export text-5xl md:text-6xl text-slate-300 mb-3 md:mb-4"></i>
                    <h4 className="font-black text-lg md:text-xl text-[#1E3A8A] mb-2">إنشاء نسخة احتياطية محلية</h4>
                    <p className="text-xs md:text-sm font-bold text-slate-500 mb-5 md:mb-6 leading-relaxed">
                        هذه العملية ستقوم بتجميع كافة بيانات مكتبك وضغطها في ملف واحد (JSON). يرجى الاحتفاظ به في مكان آمن للرجوع إليه. <br/>
                        <span className="text-emerald-600 font-black text-[10px] md:text-xs">ملاحظة: الملف لا يحتوي على كلمات المرور لحمايتك.</span>
                    </p>
                    <button 
                        onClick={handleExport} 
                        disabled={isProcessing} 
                        className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white font-black py-3.5 md:py-4 rounded-xl shadow-xl shadow-blue-900/20 transition-all text-sm md:text-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        {isProcessing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-download"></i>}
                        {isProcessing ? 'جاري تصدير البيانات...' : 'بدء التصدير الآن'}
                    </button>
                </div>
            ) : (
                <div className="text-center max-w-lg mx-auto">
                    <i className="fas fa-file-import text-5xl md:text-6xl text-slate-300 mb-3 md:mb-4"></i>
                    <h4 className="font-black text-lg md:text-xl text-[#1E3A8A] mb-2">استعادة بيانات المكتب</h4>
                    <div className="bg-amber-50 border border-amber-200 p-3 md:p-4 rounded-xl mb-5 md:mb-6 text-right">
                        <p className="text-[10px] md:text-[11px] font-bold text-amber-700 leading-relaxed flex items-start gap-2">
                            <i className="fas fa-exclamation-triangle mt-0.5"></i>
                            بمجرد رفع ملف النسخة الاحتياطية، سيتم مسح القضايا الحالية واستبدالها ببيانات الملف. لن يتأثر اسم المكتب أو كلمة المرور الحالية.
                        </p>
                    </div>
                    
                    <input type="file" accept=".json" ref={fileInputRef} onChange={processImport} className="hidden" />
                    
                    <button 
                        onClick={handleImportClick} 
                        disabled={isProcessing} 
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3.5 md:py-4 rounded-xl shadow-xl shadow-amber-500/20 transition-all text-sm md:text-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        {isProcessing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-upload"></i>}
                        {isProcessing ? 'جاري حقن البيانات...' : 'اختيار ملف ورفع البيانات'}
                    </button>
                </div>
            )}
        </div>
    );
};