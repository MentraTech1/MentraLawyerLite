// المسار: components/Backup/BackupTabs.js

window.BackupTabs = function({ activeTab, setActiveTab, isProcessing }) {
    return (
        <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-1 md:pb-0 snap-x">
            <button 
                onClick={() => !isProcessing && setActiveTab('export')} 
                disabled={isProcessing} 
                className={`snap-center flex-1 md:flex-none flex justify-center md:justify-start items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'export' ? 'bg-[#1E3A8A] text-white shadow-lg shadow-blue-900/20' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
            >
                <i className="fas fa-cloud-download-alt w-4 md:w-5 text-center"></i> تصدير (Backup)
            </button>
            <button 
                onClick={() => !isProcessing && setActiveTab('import')} 
                disabled={isProcessing} 
                className={`snap-center flex-1 md:flex-none flex justify-center md:justify-start items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'import' ? 'bg-[#1E3A8A] text-white shadow-lg shadow-blue-900/20' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
            >
                <i className="fas fa-cloud-upload-alt w-4 md:w-5 text-center"></i> استعادة (Restore)
            </button>
        </div>
    );
};