// المسار: components/Main/LatestRecords.js

window.LatestRecords = function({ cases, clients, isLoading }) {
    const { useState } = React;
    const [activeTab, setActiveTab] = useState('cases');
    const [page, setPage] = useState(1);
    const limit = 5;

    const data = activeTab === 'cases' ? cases : clients;
    const totalPages = Math.ceil(data.length / limit);
    const currentData = data.slice((page - 1) * limit, page * limit);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50">
                <button onClick={() => handleTabChange('cases')} className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'cases' ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A] bg-white' : 'text-slate-400 hover:text-slate-600'}`}>
                    <i className="fas fa-gavel ml-2"></i>أحدث القضايا
                </button>
                <button onClick={() => handleTabChange('clients')} className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'clients' ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A] bg-white' : 'text-slate-400 hover:text-slate-600'}`}>
                    <i className="fas fa-users ml-2"></i>أحدث الموكلين
                </button>
            </div>

            <div className="p-0">
                {isLoading ? (
                    <div className="py-10 text-center"><i className="fas fa-spinner fa-spin text-xl text-slate-300"></i></div>
                ) : data.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 font-bold text-xs">لا توجد بيانات مسجلة بعد.</div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {currentData.map((item, idx) => (
                            <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                {activeTab === 'cases' ? (
                                    <>
                                        <div>
                                            <p className="font-bold text-sm text-[#1E3A8A]">قضية رقم: {item.case_number}</p>
                                            <p className="text-[11px] font-bold text-slate-500 mt-1 flex gap-3">
                                                <span><i className="fas fa-user text-slate-300 ml-1"></i> {item.client_name || 'غير محدد'}</span>
                                                <span><i className="fas fa-balance-scale text-slate-300 ml-1"></i> {item.type_name || ''}</span>
                                            </p>
                                        </div>
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">{item.case_status || 'متداولة'}</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold">{item.name.charAt(0)}</div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-800">{item.name}</p>
                                                <p className="text-[11px] font-bold text-slate-500 mt-0.5 dir-ltr text-right"><i className="fas fa-phone-alt ml-1"></i> {item.phone || 'لا يوجد'}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 disabled:opacity-50 hover:bg-slate-100 transition-colors"><i className="fas fa-chevron-right mr-1"></i> السابق</button>
                    <span className="text-xs font-bold text-[#1E3A8A] bg-blue-50 px-3 py-1 rounded-md">{page} / {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 disabled:opacity-50 hover:bg-slate-100 transition-colors">التالي <i className="fas fa-chevron-left ml-1"></i></button>
                </div>
            )}
        </div>
    );
};