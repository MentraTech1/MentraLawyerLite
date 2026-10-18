// المسار: components/Settings/SettingsTabs.js

window.SettingsTabs = function({ activeTab, setActiveTab }) {
    const tabs = [
        { id: 'profile', title: 'بيانات المكتب', icon: 'fa-building', danger: false },
        { id: 'courts', title: 'المحكمة المختصة', icon: 'fa-landmark', danger: false },
        { id: 'case_types', title: 'نوع القضية', icon: 'fa-tags', danger: false },
        { id: 'security', title: 'مفتاح الأمان', icon: 'fa-shield-halved', danger: false }, // 👈 تمت الإضافة هنا
        { id: 'storage', title: 'التخزين والأمان', icon: 'fa-database', danger: false },
        { id: 'danger', title: 'منطقة الخطر', icon: 'fa-exclamation-triangle', danger: true },
    ];

    return (
        <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-1 md:pb-0 snap-x">
            {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                let activeClass = '';
                
                if (isActive) {
                    activeClass = tab.danger 
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' 
                        : 'bg-[#1E3A8A] text-white shadow-lg shadow-blue-900/20';
                } else {
                    activeClass = tab.danger 
                        ? 'bg-white text-rose-500 hover:bg-rose-50 border border-rose-200' 
                        : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200';
                }
				
                return (
                    <button 
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)} 
                        className={`snap-center flex-1 md:flex-none flex justify-center md:justify-start items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeClass}`}
                    >
                        <i className={`fas ${tab.icon} w-4 md:w-5 text-center`}></i> {tab.title}
                    </button>
                );
            })}
        </div>
    );
};