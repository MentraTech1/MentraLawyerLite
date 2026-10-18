// المسار: components/Accounting/AccountingTable.js

window.AccountingTable = function({ activeTab, switchTab, tableData, currentPage, totalPages, setCurrentPage, totalFilteredItems, itemsPerPage, openEditRevModal, handleDeleteRev, openEditExpModal, handleDeleteExp, handlePrintInvoice }) {
    return (
        <div className="bg-transparent md:bg-white rounded-none md:rounded-3xl border-none md:border md:border-slate-200 md:shadow-sm overflow-hidden flex flex-col">
            
            {/* التبويبات */}
            <div className="flex border-b border-slate-100 bg-white md:bg-slate-50 p-2 gap-2 overflow-x-auto hide-scrollbar rounded-2xl md:rounded-none mb-3 md:mb-0 shadow-sm md:shadow-none">
                <button onClick={() => switchTab('revenues')} className={`flex-1 min-w-[140px] py-2.5 md:py-3 text-xs md:text-sm font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${activeTab === 'revenues' ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100' : 'text-slate-500 hover:text-slate-700 bg-slate-50'}`}>
                    <i className="fas fa-hand-holding-usd"></i> الإيرادات والأتعاب
                </button>
                <button onClick={() => switchTab('expenses')} className={`flex-1 min-w-[140px] py-2.5 md:py-3 text-xs md:text-sm font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${activeTab === 'expenses' ? 'bg-rose-50 text-rose-700 shadow-sm border border-rose-100' : 'text-slate-500 hover:text-slate-700 bg-slate-50'}`}>
                    <i className="fas fa-money-bill-wave"></i> مصروفات المكتب
                </button>
            </div>

            {tableData.length === 0 ? (
                <div className="py-16 md:py-20 text-center flex flex-col items-center bg-white rounded-2xl md:rounded-none border border-slate-200 md:border-none shadow-sm md:shadow-none">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-3 md:mb-4 text-3xl md:text-4xl text-slate-300"><i className="fas fa-receipt"></i></div>
                    <h3 className="font-black text-lg md:text-xl text-[#1E3A8A] mb-1">لا توجد سجلات</h3>
                    <p className="text-slate-400 font-bold text-xs md:text-sm">لم يتم العثور على حركات مالية في هذا النطاق.</p>
                </div>
            ) : (
                <>
                    {/* 📱 عرض الموبايل (Cards) */}
                    <div className="md:hidden flex flex-col gap-3">
                        {tableData.map((row) => (
                            <div key={row.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                                {activeTab === 'revenues' ? (
                                    <>
                                        <div className="flex justify-between items-start border-b border-slate-50 pb-3 mb-3">
                                            <div className="flex-1 overflow-hidden pr-2">
                                                <div className="font-black text-[#1E3A8A] text-sm truncate">{row.client_name}</div>
                                                <div className="text-[10px] text-slate-500 font-bold mt-1"><i className="fas fa-hashtag text-slate-400"></i> {row.case_number}</div>
                                            </div>
                                            <div className="text-left shrink-0">
                                                <span className="text-[9px] text-slate-400 font-bold block mb-0.5">{row.safe_date}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                            <div className="text-center">
                                                <p className="text-[9px] font-bold text-slate-500 mb-0.5">الإجمالي</p>
                                                <p className="text-xs font-black text-slate-700" dir="ltr">{(row.total || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="text-center border-x border-slate-200">
                                                <p className="text-[9px] font-bold text-emerald-600 mb-0.5">المدفوع</p>
                                                <p className="text-xs font-black text-emerald-600" dir="ltr">{(row.paid || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[9px] font-bold text-rose-600 mb-0.5">الآجل</p>
                                                <p className="text-xs font-black text-rose-600" dir="ltr">{(row.remaining || 0).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button onClick={() => openEditRevModal(row)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-blue-500 hover:text-white transition-colors">
                                                <i className="fas fa-pen"></i>
                                            </button>
                                            {/* زر الطباعة للموبايل */}
                                            <button onClick={() => handlePrintInvoice(row)} className="flex-1 bg-slate-50 text-slate-600 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-slate-700 hover:text-white transition-colors">
                                                <i className="fas fa-print"></i>
                                            </button>
                                            <button onClick={() => handleDeleteRev(row.id)} className="w-10 bg-rose-50 text-rose-600 py-2 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors">
                                                <i className="fas fa-trash text-xs"></i>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start border-b border-slate-50 pb-3 mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs shrink-0"><i className="fas fa-bolt"></i></span>
                                                <div>
                                                    <div className="font-black text-slate-700 text-sm">{row.category}</div>
                                                    <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{row.safe_date}</span>
                                                </div>
                                            </div>
                                            <div className="text-left shrink-0">
                                                <span className="text-sm font-black text-rose-600 block" dir="ltr">{(row.amount || 0).toLocaleString()} <span className="text-[9px]">ج.م</span></span>
                                            </div>
                                        </div>
                                        
                                        {row.notes && (
                                            <div className="mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs font-bold text-slate-600">
                                                <i className="fas fa-info-circle text-slate-400 ml-1"></i> {row.notes}
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <button onClick={() => openEditExpModal(row)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-blue-500 hover:text-white transition-colors">
                                                <i className="fas fa-pen"></i> تعديل
                                            </button>
                                            <button onClick={() => handleDeleteExp(row.id)} className="w-10 bg-rose-50 text-rose-600 py-2 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors">
                                                <i className="fas fa-trash text-xs"></i>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 💻 عرض الديسكتوب (Table) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-right">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                                    {activeTab === 'revenues' ? (
                                        <>
                                            <th className="px-6 py-4">الموكل والقضية</th>
                                            <th className="px-6 py-4 text-center">إجمالي الأتعاب</th>
                                            <th className="px-6 py-4 text-center">المدفوع</th>
                                            <th className="px-6 py-4 text-center">الآجل</th>
                                            <th className="px-6 py-4">التاريخ</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="px-6 py-4">بند المصروف</th>
                                            <th className="px-6 py-4 text-center">المبلغ</th>
                                            <th className="px-6 py-4">التاريخ</th>
                                            <th className="px-6 py-4">ملاحظات</th>
                                        </>
                                    )}
                                    <th className="px-6 py-4 text-center">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {tableData.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                        {activeTab === 'revenues' ? (
                                            <>
                                                <td className="px-6 py-4">
                                                    <div className="font-black text-[#1E3A8A] text-sm mb-1">{row.client_name}</div>
                                                    <div className="text-[10px] text-slate-500 font-bold"><i className="fas fa-hashtag"></i> {row.case_number}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-slate-700">{(row.total || 0).toLocaleString()}</td>
                                                <td className="px-6 py-4 text-center font-black text-emerald-600">{(row.paid || 0).toLocaleString()}</td>
                                                <td className="px-6 py-4 text-center font-black text-rose-500">{(row.remaining || 0).toLocaleString()}</td>
                                                <td className="px-6 py-4 text-xs font-bold text-slate-500">{row.safe_date}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        {/* زر الطباعة للديسكتوب */}
                                                        <button title="طباعة إيصال" onClick={() => handlePrintInvoice(row)} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors"><i className="fas fa-print text-xs"></i></button>
                                                        <button title="تعديل" onClick={() => openEditRevModal(row)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"><i className="fas fa-pen text-xs"></i></button>
                                                        <button title="حذف" onClick={() => handleDeleteRev(row.id)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"><i className="fas fa-trash text-xs"></i></button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs"><i className="fas fa-bolt"></i></span>
                                                        <span className="font-black text-slate-700">{row.category}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center font-black text-rose-600">{(row.amount || 0).toLocaleString()} ج.م</td>
                                                <td className="px-6 py-4 text-xs font-bold text-slate-500">{row.safe_date}</td>
                                                <td className="px-6 py-4 text-xs font-bold text-slate-600 max-w-[200px] truncate" title={row.notes}>{row.notes || '--'}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => openEditExpModal(row)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"><i className="fas fa-pen text-xs"></i></button>
                                                        <button onClick={() => handleDeleteExp(row.id)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"><i className="fas fa-trash text-xs"></i></button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            
            {/* Pagination */}
            {totalFilteredItems > itemsPerPage && (
                <div className="p-3 md:p-4 mt-3 md:mt-0 border border-slate-200 md:border-t md:border-x-0 md:border-b-0 bg-white md:bg-slate-50 flex items-center justify-between rounded-2xl md:rounded-none shadow-sm md:shadow-none">
                    <p className="text-[11px] md:text-xs font-bold text-slate-500">صفحة {currentPage} من {totalPages}</p>
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1E3A8A] hover:text-white disabled:opacity-50 transition-colors"><i className="fas fa-chevron-right text-[10px] md:text-xs"></i></button>
                        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1E3A8A] hover:text-white disabled:opacity-50 transition-colors"><i className="fas fa-chevron-left text-[10px] md:text-xs"></i></button>
                    </div>
                </div>
            )}
        </div>
    );
};