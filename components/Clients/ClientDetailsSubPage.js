// المسار: components/Clients/ClientDetailsSubPage.js

window.ClientDetailsSubPage = function({ client, firmId, showToast, onBack, onEditClient, onOpenPoas, onDeleteClient, refreshTrigger }) {
    const { useState, useEffect } = React;

    const [stats, setStats] = useState({ totalFees: 0, totalPaid: 0, remaining: 0, casesCount: 0, poasCount: 0 });
    const [clientCases, setClientCases] = useState([]);
    const [clientPoas, setClientPoas] = useState([]);
    const [clientPayments, setClientPayments] = useState([]); 

    // حالة التبويبات Tabs
    const [activeTab, setActiveTab] = useState('cases'); 

    const loadFullProfile = async () => {
        if (!client || !client.id || !window.db) return;
        try {
            const cases = await window.db.cases.filter(c => String(c.client_id) === String(client.id)).reverse().toArray();
            const poas = await window.db.power_of_attorneys.filter(p => String(p.client_id) === String(client.id)).reverse().toArray();
            
            let payments = [];
            if (window.db.client_payments) {
                payments = await window.db.client_payments.filter(p => String(p.client_id) === String(client.id)).reverse().toArray();
            }

            // 🚀 التعديل هنا: المنطق المالي الجديد والسليم للحساب الآجل
            let totalFees = 0;
            let totalPaid = 0;
            const caseFeesMap = {}; // خريطة لحفظ "أعلى إجمالي متفق عليه" لكل قضية

            payments.forEach(p => {
                // 1. حساب المدفوع الفعلي
                const paid = parseFloat(p.paid_amount || p.amount || 0);
                if (!isNaN(paid) && paid > 0) totalPaid += paid;

                // 2. حساب الأتعاب المتفق عليها
                const total = parseFloat(p.total_amount || 0);
                if (!isNaN(total) && total > 0) {
                    if (p.case_id) {
                        // إذا كانت الدفعة مرتبطة بقضية، نأخذ أكبر مبلغ متفق عليه تم تسجيله لهذه القضية (لمنع التكرار عند التقسيط)
                        if (!caseFeesMap[p.case_id] || total > caseFeesMap[p.case_id]) {
                            caseFeesMap[p.case_id] = total;
                        }
                    } else {
                        // إذا كانت دفعة عامة (غير مرتبطة بقضية)، تُضاف للإجمالي مباشرة
                        totalFees += total;
                    }
                }
            });

            // إضافة أتعاب القضايا للإجمالي
            Object.values(caseFeesMap).forEach(fee => {
                totalFees += fee;
            });

            // ربط الأتعاب بالقضايا لتظهر في قائمة القضايا بشكل صحيح
            const enrichedCases = cases.map(c => ({
                ...c,
                agreed_fees: caseFeesMap[c.id] || 0
            }));

            // احتياطي أمان: لا يمكن أن يكون الإجمالي أقل من المدفوع
            if (totalFees < totalPaid) totalFees = totalPaid;
            const remaining = Math.max(0, totalFees - totalPaid);

            setClientCases(enrichedCases);
            setClientPoas(poas);
            setClientPayments(payments);
            setStats({ totalFees, totalPaid, remaining, casesCount: cases.length, poasCount: poas.length });
        } catch (err) {
            console.error("خطأ جلب بيانات الموكل:", err);
        }
    };

    // 🚀 التعديل هنا: إضافة refreshTrigger لمصفوفة الاعتماديات لتحديث الصفحة تلقائياً
    useEffect(() => {
        loadFullProfile();
    }, [client, refreshTrigger]);

    // مكون التبويبات (Tabs UI)
    const renderTabs = () => (
        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl overflow-x-auto hide-scrollbar border border-slate-200/60 mb-6">
            <button 
                onClick={() => setActiveTab('cases')} 
                className={`flex-1 min-w-[100px] py-2.5 px-4 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'cases' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
                <i className="fas fa-gavel"></i> القضايا
                <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{clientCases.length}</span>
            </button>
            <button 
                onClick={() => setActiveTab('poas')} 
                className={`flex-1 min-w-[100px] py-2.5 px-4 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'poas' ? 'bg-white text-amber-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
                <i className="fas fa-file-signature"></i> التوكيلات
                <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{clientPoas.length}</span>
            </button>
            <button 
                onClick={() => setActiveTab('payments')} 
                className={`flex-1 min-w-[110px] py-2.5 px-4 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'payments' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
                <i className="fas fa-file-invoice-dollar"></i> الفواتير
                <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{clientPayments.length}</span>
            </button>
            <button 
                onClick={() => setActiveTab('info')} 
                className={`flex-1 min-w-[110px] py-2.5 px-4 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'info' ? 'bg-white text-purple-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
                <i className="fas fa-info-circle"></i> بيانات وملاحظات
            </button>
        </div>
    );

    return (
        <div className="space-y-6 animate-view pb-8">
            {/* بار التنقل العلوي وزر الرجوع */}
            <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button 
                        type="button" 
                        onClick={onBack}
                        className="bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95 shrink-0"
                        title="العودة لسجل الموكلين"
                    >
                        <i className="fas fa-arrow-right text-sm"></i>
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">سجل الموكلين</span>
                            <span className="text-slate-300">/</span>
                            <h3 className="text-base md:text-lg font-black text-[#1E3A8A] leading-none">{client.name}</h3>
                        </div>
                        <p className="text-[11px] text-slate-500 font-bold mt-1">الملف الشامل والحسابات المالية</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button 
                        type="button" 
                        onClick={() => onEditClient(client)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95"
                    >
                        <i className="fas fa-user-edit"></i>
                        <span>تعديل بيانات الموكل</span>
                    </button>
                    <button 
                        type="button" 
                        onClick={() => onDeleteClient(client)}
                        className="bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white px-3 py-2.5 rounded-xl text-xs font-bold border border-rose-200 transition active:scale-95"
                        title="حذف الموكل"
                    >
                        <i className="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>

            {/* بطاقة الترحيب والبيانات السريعة */}
            <div className="bg-gradient-to-r from-[#1E3A8A] via-blue-900 to-[#0B1120] rounded-2xl md:rounded-3xl p-5 md:p-7 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 text-[#D4AF37] border border-white/20 flex items-center justify-center text-2xl md:text-3xl font-black shadow-inner">
                            {client.name ? client.name.charAt(0) : <i className="fas fa-user"></i>}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl md:text-2xl font-black">{client.name}</h2>
                                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/30">موكل نشط</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-blue-200 font-bold">
                                <span><i className="fas fa-phone-alt text-[#D4AF37] ml-1"></i> {client.phone || 'بدون هاتف'}</span>
                                <span>•</span>
                                <span><i className="far fa-id-card text-blue-400 ml-1"></i> {client.id_number || 'غير مسجل'}</span>
                            </div>
                        </div>
                    </div>

                    {client.phone && (
                        <a 
                            href={`https://wa.me/20${client.phone.replace(/^0+/, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-[#25D366] hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-green-900/30 transition-all active:scale-95"
                        >
                            <i className="fab fa-whatsapp text-lg"></i>
                            <span>مراسلة واتساب فورية</span>
                        </a>
                    )}
                </div>
            </div>

            {/* المكون المالي المستقل */}
            {window.ClientFinancialStats && <window.ClientFinancialStats stats={stats} />}

            {/* شريط التبويبات Tabs */}
            {renderTabs()}

            {/* عرض المحتوى بناءً على التبويب النشط */}
            <div className="min-h-[300px]">
                {activeTab === 'cases' && window.ClientCasesList && (
                    <window.ClientCasesList cases={clientCases} />
                )}

                {activeTab === 'poas' && window.ClientPoasList && (
                    <window.ClientPoasList poas={clientPoas} onOpenPoas={() => onOpenPoas(client)} />
                )}

                {activeTab === 'payments' && window.ClientPaymentsList && (
                    <window.ClientPaymentsList 
                        payments={clientPayments} 
                        client={client} 
                        stats={stats} 
                        showToast={showToast} 
                        onRefresh={loadFullProfile} 
                    />
                )}

                {activeTab === 'info' && (
                    <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-5 shadow-sm animate-view">
                        <h4 className="font-black text-sm md:text-base text-[#1E3A8A] mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <i className="fas fa-info-circle text-purple-500"></i> البيانات الإضافية والعنوان
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-slate-400 block mb-2"><i className="fas fa-map-marker-alt text-rose-500 ml-1"></i> محل الإقامة / العنوان:</span>
                                <span className="text-slate-800 text-sm leading-relaxed block">{client.address || 'لا يوجد عنوان مدون'}</span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-slate-400 block mb-2"><i className="fas fa-calendar-alt text-emerald-500 ml-1"></i> تاريخ التسجيل بالنظام:</span>
                                <span className="text-slate-800 text-sm block">{client.safe_date || client.created_at?.substring(0,10) || 'غير محدد'}</span>
                            </div>
                            <div className="md:col-span-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                                <span className="text-amber-700 block mb-2"><i className="fas fa-sticky-note text-amber-500 ml-1"></i> ملاحظات المكتب الخاصة:</span>
                                <span className="text-slate-800 text-sm leading-relaxed block">{client.notes || 'لا توجد ملاحظات مدونة'}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};