// المسار: components/Clients/ClientsList.js

window.ClientsList = function({ activeTab, tableData, openEditClientModal, handleDeleteClient, openPoaModal, onOpenClientDetails }) {
    if (!tableData || tableData.length === 0) {
        return (
            <div className="py-16 md:py-20 text-center flex flex-col items-center bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm animate-view">
                <div className={`w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-3 md:mb-4 text-3xl md:text-4xl ${activeTab === 'clients' ? 'text-emerald-200' : 'text-amber-200'}`}>
                    <i className={`fas ${activeTab === 'clients' ? 'fa-user-slash' : 'fa-file-excel'}`}></i>
                </div>
                <h3 className="font-black text-lg md:text-xl text-[#1E3A8A] mb-1">لا توجد سجلات لعرضها</h3>
                <p className="text-slate-400 font-bold text-xs md:text-sm">لم يتم العثور على أي موكلين مسجلين وفقاً للفلاتر الحالية.</p>
            </div>
        );
    }

    return (
        <div className="animate-view">
            {/* عرض 3 كروت في كل صفحة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {tableData.map((row) => (
                    <div 
                        key={row.id} 
                        className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 hover:border-[#D4AF37] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                    >
                        {activeTab === 'clients' ? (
                            <>
                                {/* رأس الكارت قابل للنقر لفتح الملف */}
                                <div 
                                    onClick={() => onOpenClientDetails && onOpenClientDetails(row)}
                                    className="p-4 md:p-5 cursor-pointer bg-gradient-to-b from-slate-50/70 to-white border-b border-slate-100 transition-colors group-hover:from-amber-50/20"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-[#1E3A8A] text-white group-hover:bg-[#D4AF37] group-hover:text-slate-900 flex items-center justify-center font-black text-lg shadow-md transition-all duration-300">
                                                {row.name ? row.name.charAt(0) : <i className="fas fa-user"></i>}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-[#1E3A8A] group-hover:text-blue-900 text-sm md:text-base leading-tight transition-colors line-clamp-1">{row.name}</h4>
                                                <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block"><i className="fas fa-calendar-alt text-[#D4AF37] ml-1"></i> {row.safe_date || 'مسجل حديثاً'}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black bg-blue-50 text-[#1E3A8A] border border-blue-100 px-2 py-0.5 rounded-lg shrink-0">موكل</span>
                                    </div>

                                    <div className="space-y-1.5 text-xs font-bold text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 mb-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-slate-400 font-bold"><i className="fas fa-phone-alt ml-1 text-emerald-500"></i> الهاتف:</span>
                                            <span className="font-bold text-slate-800 text-[11px]" dir="ltr">{row.phone || 'بدون هاتف'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-slate-400 font-bold"><i className="far fa-id-card ml-1 text-blue-500"></i> القومي:</span>
                                            <span className="font-bold text-slate-800 text-[11px]" dir="ltr">{row.id_number || 'غير مسجل'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-slate-400 font-bold"><i className="fas fa-map-marker-alt ml-1 text-rose-500"></i> العنوان:</span>
                                            <span className="font-bold text-slate-700 text-[11px] truncate max-w-[140px]">{row.address || 'غير محدد'}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-center">
                                        <div className={`p-2 rounded-xl border ${row.cases_count > 0 ? 'bg-blue-50/80 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                            <span className="text-[10px] font-bold block mb-0.5">القضايا</span>
                                            <span className="font-black text-xs md:text-sm"><i className="fas fa-gavel text-[11px] ml-1"></i> {row.cases_count || 0}</span>
                                        </div>
                                        <div className={`p-2 rounded-xl border ${row.poas_count > 0 ? 'bg-amber-50/80 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                            <span className="text-[10px] font-bold block mb-0.5">التوكيلات</span>
                                            <span className="font-black text-xs md:text-sm"><i className="fas fa-file-signature text-[11px] ml-1"></i> {row.poas_count || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* أزرار الإجراءات في أسفل الكارت */}
                                <div className="p-3 bg-slate-50 flex items-center justify-between gap-1.5 border-t border-slate-100">
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onOpenClientDetails) onOpenClientDetails(row);
                                        }} 
                                        className="flex-1 bg-[#1E3A8A] hover:bg-blue-900 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                                        title="فتح ملف الموكل والحسابات"
                                    >
                                        <i className="fas fa-chart-pie text-[#D4AF37]"></i>
                                        <span>الملف والحسابات</span>
                                    </button>

                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); openPoaModal(row); }} 
                                        className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white border border-amber-200/60 flex items-center justify-center text-xs transition" 
                                        title="إدارة التوكيلات"
                                    >
                                        <i className="fas fa-file-signature"></i>
                                    </button>

                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); openEditClientModal(row); }} 
                                        className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200/60 flex items-center justify-center text-xs transition" 
                                        title="تعديل الموكل"
                                    >
                                        <i className="fas fa-pen"></i>
                                    </button>

                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteClient(row); }} 
                                        className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border border-rose-200/60 flex items-center justify-center text-xs transition" 
                                        title="حذف الموكل"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* سجل التوكيلات */
                            <div className="p-4 md:p-5 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex justify-between items-start border-b border-slate-100 pb-2.5 mb-3">
                                        <div>
                                            <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md inline-block mb-1">{row.poa_type || 'توكيل'}</span>
                                            <h4 className="font-black text-[#1E3A8A] text-sm md:text-base">{row.poa_number}</h4>
                                        </div>
                                        <i className="fas fa-file-contract text-2xl text-amber-300"></i>
                                    </div>

                                    <div className="space-y-2 text-xs font-bold text-slate-600 mb-4">
                                        <div className="flex items-center gap-1.5 text-slate-700">
                                            <i className="fas fa-user text-slate-400 w-4"></i>
                                            <span>الموكل: {row.client_name}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                                            <i className="fas fa-building text-slate-400 w-4"></i>
                                            <span>مكتب: {row.documentation_office || 'غير محدد'}</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex justify-between text-[11px] font-bold mb-4">
                                        <div><span className="text-slate-400 block text-[9px]">تاريخ الإصدار</span>{row.poa_date || '---'}</div>
                                        <div className="text-left text-rose-600"><span className="text-slate-400 block text-[9px]">تاريخ الانتهاء</span>{row.expiry_date || 'ساري'}</div>
                                    </div>
                                </div>

                                <button 
                                    type="button"
                                    onClick={() => openPoaModal(row)} 
                                    className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <i className="fas fa-cog text-[#D4AF37]"></i> إدارة التوكيل
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};