// المسار: components/Clients/ClientDetailsModal.js

window.ClientDetailsModal = function({ client, firmId, showToast, onClose, onEditClient, onOpenPoas, onRefresh }) {
    const { useState, useEffect } = React;
    
    const [stats, setStats] = useState({
        totalFees: 0,
        totalPaid: 0,
        remaining: 0,
        casesCount: 0,
        poasCount: 0
    });
    
    const [clientCases, setClientCases] = useState([]);
    const [clientPoas, setClientPoas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClientFullProfile = async () => {
            if (!client || !client.id || !window.db) return;
            setLoading(true);
            try {
                // 1. جلب قضايا وتوكيلات الموكل
                const cases = await window.db.cases.where('client_id').equals(client.id).toArray();
                const poas = await window.db.power_of_attorneys.where('client_id').equals(client.id).toArray();
                
                // 🚀 التعديل هنا: تطبيق نفس المنطق المالي السليم
                let totalFees = 0;
                let totalPaid = 0;
                const caseFeesMap = {};

                if (window.db.client_payments) {
                    const payments = await window.db.client_payments.where('client_id').equals(client.id).toArray();
                    payments.forEach(p => {
                        const paid = parseFloat(p.paid_amount || p.amount || 0);
                        if (!isNaN(paid) && paid > 0) totalPaid += paid;

                        const total = parseFloat(p.total_amount || 0);
                        if (!isNaN(total) && total > 0) {
                            if (p.case_id) {
                                if (!caseFeesMap[p.case_id] || total > caseFeesMap[p.case_id]) {
                                    caseFeesMap[p.case_id] = total;
                                }
                            } else {
                                totalFees += total;
                            }
                        }
                    });
                }

                Object.values(caseFeesMap).forEach(fee => {
                    totalFees += fee;
                });

                if (totalFees < totalPaid) totalFees = totalPaid;
                const remaining = Math.max(0, totalFees - totalPaid);

                setClientCases(cases);
                setClientPoas(poas);
                setStats({
                    totalFees,
                    totalPaid,
                    remaining,
                    casesCount: cases.length,
                    poasCount: poas.length
                });

            } catch (err) {
                console.error("خطأ في جلب بيانات ملف الموكل:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchClientFullProfile();
    }, [client]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-3 sm:p-4 animate-view">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-100 flex flex-col max-h-[95vh] md:max-h-[90vh]">
                
                {/* الهيدر الرئيسي للملف */}
                <div className="bg-gradient-to-r from-[#1E3A8A] via-blue-900 to-[#0B1120] p-5 md:p-6 text-white flex justify-between items-center shrink-0 border-b border-white/10">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 text-[#D4AF37] border border-white/20 flex items-center justify-center text-xl md:text-2xl font-black shadow-inner">
                            {client.name ? client.name.charAt(0) : <i className="fas fa-user"></i>}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base md:text-xl font-black">{client.name}</h3>
                                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">موكل نشط</span>
                            </div>
                            <p className="text-blue-200 text-xs font-bold mt-1 flex items-center gap-3">
                                <span><i className="fas fa-calendar-alt text-[#D4AF37] ml-1"></i> مسجل منذ: {client.safe_date || (client.created_at ? client.created_at.substring(0, 10) : 'غير مسجل')}</span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            type="button"
                            onClick={() => { onClose(); onEditClient(client); }} 
                            className="bg-[#D4AF37] hover:bg-yellow-500 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-yellow-500/20"
                            title="تعديل بيانات الموكل"
                        >
                            <i className="fas fa-pen"></i> <span className="hidden sm:inline">تعديل البيانات</span>
                        </button>
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 w-9 h-9 rounded-full flex items-center justify-center transition"
                        >
                            <i className="fas fa-times text-base"></i>
                        </button>
                    </div>
                </div>

                {/* محتوى الشاشة */}
                <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
                    
                    {/* 💰 كروت الإحصائيات المالية (أداني كام / عليه كام) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                        
                        {/* 1. أداني كام */}
                        <div className="bg-white p-4 md:p-5 rounded-2xl border border-emerald-200 shadow-sm relative overflow-hidden flex items-center justify-between">
                            <div className="relative z-10">
                                <span className="text-[11px] font-bold text-slate-500 block mb-1">المدفوع للمكتب (أداني كام)</span>
                                <h4 className="text-xl md:text-2xl font-black text-emerald-600">{stats.totalPaid.toLocaleString()} <span className="text-xs font-bold">ج.م</span></h4>
                                <span className="text-[10px] text-emerald-500 font-bold mt-1 inline-block"><i className="fas fa-check-circle ml-1"></i> دفعات مسددة فعلياً</span>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                                <i className="fas fa-hand-holding-dollar"></i>
                            </div>
                        </div>

                        {/* 2. عليه كام (المتبقي والآجل) */}
                        <div className="bg-white p-4 md:p-5 rounded-2xl border border-rose-200 shadow-sm relative overflow-hidden flex items-center justify-between">
                            <div className="relative z-10">
                                <span className="text-[11px] font-bold text-slate-500 block mb-1">المتبقي في ذمته (عليه كام)</span>
                                <h4 className="text-xl md:text-2xl font-black text-rose-600">{stats.remaining.toLocaleString()} <span className="text-xs font-bold">ج.م</span></h4>
                                <span className={`text-[10px] font-bold mt-1 inline-block ${stats.remaining > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                                    <i className="fas fa-exclamation-circle ml-1"></i> {stats.remaining > 0 ? 'مستحقات آجلة للمكتب' : 'لا توجد مبالغ مستحقة'}
                                </span>
                            </div>
                            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                                <i className="fas fa-receipt"></i>
                            </div>
                        </div>

                        {/* 3. إجمالي الأتعاب المقررة */}
                        <div className="bg-white p-4 md:p-5 rounded-2xl border border-blue-200 shadow-sm relative overflow-hidden flex items-center justify-between">
                            <div className="relative z-10">
                                <span className="text-[11px] font-bold text-slate-500 block mb-1">إجمالي الأتعاب المقررة</span>
                                <h4 className="text-xl md:text-2xl font-black text-[#1E3A8A]">{stats.totalFees.toLocaleString()} <span className="text-xs font-bold">ج.م</span></h4>
                                <span className="text-[10px] text-blue-500 font-bold mt-1 inline-block"><i className="fas fa-file-invoice-dollar ml-1"></i> إجمالي قيمة التعاقدات</span>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 text-[#1E3A8A] rounded-2xl flex items-center justify-center text-2xl shrink-0">
                                <i className="fas fa-scale-balanced"></i>
                            </div>
                        </div>

                    </div>

                    {/* 📇 البطاقة التعريفية ومعلومات الاتصال */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
                        <h4 className="font-black text-sm text-[#1E3A8A] mb-3 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <i className="fas fa-id-card text-[#D4AF37]"></i> البيانات الشخصية ومعلومات الاتصال
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 text-xs">
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="text-slate-400 font-bold block mb-1">رقم الهاتف:</span>
                                {client.phone ? (
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-slate-800 text-sm" dir="ltr">{client.phone}</span>
                                        <a href={`https://wa.me/20${client.phone.replace(/^0+/, '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 font-bold text-xs flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                                            <i className="fab fa-whatsapp"></i> مراسلة
                                        </a>
                                    </div>
                                ) : (
                                    <span className="text-slate-400 font-bold">غير مدون</span>
                                )}
                            </div>

                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="text-slate-400 font-bold block mb-1">الرقم القومي:</span>
                                <span className="font-black text-slate-800 text-sm" dir="ltr">{client.id_number || 'غير مسجل'}</span>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 sm:col-span-2 md:col-span-1">
                                <span className="text-slate-400 font-bold block mb-1">العنوان:</span>
                                <span className="font-bold text-slate-700 truncate block">{client.address || 'بدون عنوان مسجل'}</span>
                            </div>
                        </div>

                        {client.notes && (
                            <div className="mt-3 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-xs">
                                <span className="text-amber-800 font-black block mb-0.5"><i className="fas fa-sticky-note ml-1"></i> ملاحظات المكتب:</span>
                                <p className="text-slate-700 font-bold leading-relaxed">{client.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* ⚖️ قضايا وتوكيلات الموكل */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* سجل قضايا الموكل */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm flex flex-col">
                            <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
                                <h4 className="font-black text-sm text-[#1E3A8A] flex items-center gap-2">
                                    <i className="fas fa-gavel text-blue-600"></i> قضايا الموكل ({clientCases.length})
                                </h4>
                            </div>

                            {clientCases.length === 0 ? (
                                <div className="text-center py-6 text-slate-400 my-auto">
                                    <i className="fas fa-folder-open text-2xl mb-1.5 opacity-40"></i>
                                    <p className="text-xs font-bold">لا توجد قضايا مقيدة باسم هذا الموكل حالياً</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                    {clientCases.map(c => (
                                        <div key={c.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex justify-between items-center">
                                            <div>
                                                <h5 className="font-black text-xs text-[#1E3A8A]">دعوى رقم: {c.case_number || 'غير مرقمة'}</h5>
                                                <span className="text-[10px] text-slate-500 font-bold">{c.court_name || c.court || 'المحكمة المختصة'} - {c.case_type || 'مدني'}</span>
                                            </div>
                                            <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
                                                {c.status || 'متداولة'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* سجل توكيلات الموكل */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm flex flex-col">
                            <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
                                <h4 className="font-black text-sm text-[#1E3A8A] flex items-center gap-2">
                                    <i className="fas fa-file-signature text-amber-500"></i> توكيلات الموكل ({clientPoas.length})
                                </h4>
                                <button 
                                    type="button"
                                    onClick={() => { onClose(); onOpenPoas(client); }} 
                                    className="text-[11px] font-black text-amber-600 hover:text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 transition"
                                >
                                    <i className="fas fa-plus ml-1"></i> إدارة وتوكيل جديد
                                </button>
                            </div>

                            {clientPoas.length === 0 ? (
                                <div className="text-center py-6 text-slate-400 my-auto">
                                    <i className="fas fa-file-excel text-2xl mb-1.5 opacity-40"></i>
                                    <p className="text-xs font-bold">لا توجد توكيلات رسمية مسجلة لهذا الموكل</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                    {clientPoas.map(p => (
                                        <div key={p.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex justify-between items-center">
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">{p.poa_type || 'توكيل'}</span>
                                                    <h5 className="font-black text-xs text-[#1E3A8A]">{p.poa_number}</h5>
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{p.documentation_office || 'مكتب توثيق غير مدون'}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {p.poa_date || 'تاريخ غير محدد'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                </div>

                {/* فوتر النافذة */}
                <div className="bg-slate-100 p-3 md:p-4 border-t border-slate-200 flex justify-between items-center shrink-0">
                    <button 
                        type="button" 
                        onClick={() => { onClose(); onEditClient(client); }} 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow"
                    >
                        <i className="fas fa-user-edit"></i> تعديل بيانات الموكل
                    </button>

                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="bg-white hover:bg-slate-200 text-slate-700 font-bold px-5 py-2 rounded-xl text-xs border border-slate-300 transition"
                    >
                        إغلاق الملف
                    </button>
                </div>

            </div>
        </div>
    );
};