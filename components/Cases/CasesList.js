// المسار: components/Cases/CasesList.js

window.CasesList = function({ tableData, openEditModal, handleDelete }) {
    
    const getStatusBadge = (status) => {
        switch(status) {
            case 'متداولة': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'محجوزة للحكم': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'منتهية': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    if (tableData.length === 0) {
        return (
            <div className="py-16 md:py-20 text-center flex flex-col items-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-3 md:mb-4 text-3xl md:text-4xl text-slate-300"><i className="fas fa-folder-open"></i></div>
                <h3 className="font-black text-lg md:text-xl text-[#1E3A8A] mb-1">لا توجد قضايا</h3>
                <p className="text-slate-400 font-bold text-xs md:text-sm">لم يتم العثور على بيانات تطابق بحثك.</p>
            </div>
        );
    }

    return (
        <div className="bg-transparent md:bg-white rounded-none md:rounded-3xl border-none md:border md:border-slate-200 md:shadow-sm overflow-hidden">
            
            {/* عرض الموبايل (Cards) */}
            <div className="md:hidden flex flex-col gap-3">
                {tableData.map((c) => (
                    <div key={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-3 border-b border-slate-50 pb-3">
                            <div>
                                <div className="font-black text-[#1E3A8A] text-base">{c.case_number}</div>
                                <div className="text-[10px] text-slate-400 font-bold mt-0.5"><i className="fas fa-calendar-alt mr-1"></i> {c.safe_date}</div>
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-md border ${getStatusBadge(c.case_status)}`}>{c.case_status}</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-slate-50 text-slate-400 flex items-center justify-center text-[10px]"><i className="fas fa-user"></i></div>
                                <span className="font-bold text-slate-700 text-xs truncate flex-1">{c.client_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-slate-50 text-slate-400 flex items-center justify-center text-[10px]"><i className="fas fa-building"></i></div>
                                <div className="flex flex-col flex-1">
                                    <span className="font-bold text-slate-700 text-xs truncate">{c.court_name}</span>
                                    <span className="text-[9px] text-slate-500 font-bold">{c.type_name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-slate-50">
                            <button onClick={() => openEditModal(c)} className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-emerald-500 hover:text-white transition-colors">
                                <i className="fas fa-pen"></i> تعديل
                            </button>
                            <button onClick={() => handleDelete(c.id)} className="flex-1 bg-rose-50 text-rose-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-rose-500 hover:text-white transition-colors">
                                <i className="fas fa-trash"></i> حذف
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* عرض الديسكتوب (Table) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-right">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                            <th className="px-6 py-4 rounded-tr-3xl">رقم الدعوى</th>
                            <th className="px-6 py-4">الموكل</th>
                            <th className="px-6 py-4">المحكمة / النوع</th>
                            <th className="px-6 py-4 text-center">الحالة</th>
                            <th className="px-6 py-4 rounded-tl-3xl text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {tableData.map((c) => (
                            <tr key={c.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-black text-[#1E3A8A] text-lg">{c.case_number}</div>
                                    <div className="text-[10px] text-slate-400 font-bold mt-1"><i className="fas fa-calendar-alt mr-1"></i> {c.safe_date}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs"><i className="fas fa-user"></i></div>
                                        <span className="font-bold text-slate-700">{c.client_name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-700 text-sm mb-1">{c.court_name}</div>
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold border border-slate-200">{c.type_name}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-full border ${getStatusBadge(c.case_status)}`}>{c.case_status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => openEditModal(c)} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors" title="تعديل القضية"><i className="fas fa-pen"></i></button>
                                        <button onClick={() => handleDelete(c.id)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors" title="حذف القضية"><i className="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};