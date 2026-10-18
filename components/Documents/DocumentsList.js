// المسار: components/Documents/DocumentsList.js

window.DocumentsList = function({ tableData, openEditModal, handleDelete, setViewMemo }) {
    if (tableData.length === 0) {
        return (
            <div className="py-16 md:py-20 text-center flex flex-col items-center bg-white rounded-2xl md:rounded-none border border-slate-200 md:border-none shadow-sm md:shadow-none">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-3 md:mb-4 text-3xl md:text-4xl text-slate-300"><i className="fas fa-file-signature"></i></div>
                <h3 className="font-black text-lg md:text-xl text-[#1E3A8A] mb-1">لا توجد مذكرات</h3>
                <p className="text-slate-400 font-bold text-xs md:text-sm">ابدأ بكتابة أول مرافعة أو مذكرة دفاع لك.</p>
            </div>
        );
    }

    return (
        <div className="bg-transparent md:bg-white rounded-none md:rounded-3xl border-none md:border md:border-slate-200 md:shadow-sm overflow-hidden">
            {/* 📱 عرض الموبايل (Cards) */}
            <div className="md:hidden flex flex-col gap-3">
                {tableData.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                        <div className="flex items-start gap-3 border-b border-slate-50 pb-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100 shrink-0">
                                <i className="fas fa-file-alt"></i>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="font-black text-slate-700 text-sm mb-1">{doc.title}</div>
                                <div className="font-bold text-[#1E3A8A] text-xs"><i className="fas fa-hashtag text-slate-300 mr-1"></i> {doc.case_number}</div>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-[10px] text-slate-500 font-bold leading-relaxed line-clamp-2">{doc.content}</p>
                            <div className="text-[9px] text-slate-400 font-bold mt-2"><i className="fas fa-calendar-alt mr-1"></i> التحرير: {doc.safe_date}</div>
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-slate-50">
                            <button onClick={() => setViewMemo(doc)} className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 hover:bg-indigo-500 hover:text-white transition-colors">
                                <i className="fas fa-book-open"></i> قراءة وطباعة
                            </button>
                            <button onClick={() => openEditModal(doc)} className="w-10 sm:w-auto sm:flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 hover:bg-emerald-500 hover:text-white transition-colors">
                                <i className="fas fa-pen"></i> <span className="hidden sm:inline">تعديل</span>
                            </button>
                            <button onClick={() => handleDelete(doc.id)} className="w-10 sm:w-auto sm:flex-1 bg-rose-50 text-rose-700 py-2 rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 hover:bg-rose-500 hover:text-white transition-colors">
                                <i className="fas fa-trash"></i> <span className="hidden sm:inline">حذف</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 💻 عرض الديسكتوب (Table) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-right">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                            <th className="px-6 py-4 rounded-tr-3xl">عنوان المذكرة / المرافعة</th>
                            <th className="px-6 py-4">القضية المرتبطة</th>
                            <th className="px-6 py-4">التاريخ</th>
                            <th className="px-6 py-4 rounded-tl-3xl text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {tableData.map((doc) => (
                            <tr key={doc.id} className="hover:bg-indigo-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100 shrink-0">
                                            <i className="fas fa-file-alt"></i>
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-700 text-sm mb-1">{doc.title}</div>
                                            <div className="text-[10px] text-slate-400 font-bold truncate max-w-[250px]">{doc.content}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-[#1E3A8A] text-sm"><i className="fas fa-hashtag text-slate-300 mr-1"></i> {doc.case_number}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">{doc.safe_date}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => setViewMemo(doc)} className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-colors" title="قراءة وطباعة"><i className="fas fa-print"></i></button>
                                        <button onClick={() => openEditModal(doc)} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors" title="تعديل المذكرة"><i className="fas fa-pen"></i></button>
                                        <button onClick={() => handleDelete(doc.id)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors" title="حذف المذكرة"><i className="fas fa-trash"></i></button>
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