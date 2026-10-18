// المسار: components/Backup/BackupHeader.js

window.BackupHeader = function() {
    return (
        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm p-4 md:p-6 flex flex-col md:flex-row gap-4 justify-between items-center relative overflow-hidden text-center md:text-right">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 relative z-10 w-full md:w-auto">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl md:text-2xl shadow-inner border border-indigo-100">
                    <i className="fas fa-server"></i>
                </div>
                <div>
                    <h3 className="font-black text-xl md:text-2xl text-[#1E3A8A]">إدارة قواعد البيانات</h3>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 mt-1">نسخ واستعادة البيانات بأمان وسرية تامة</p>
                </div>
            </div>
        </div>
    );
};