// المسار: components/Accounting/Module_Accounting_Container.js

window.Module_Accounting_Container = function({ firmId, showToast }) {
    const { useState, useEffect } = React;
    
    const [activeTab, setActiveTab] = useState('revenues'); 
    const [firmName, setFirmName] = useState('مكتب المحاماة'); // لجلب اسم المكتب للفاتورة
    
    const [isRevModalOpen, setIsRevModalOpen] = useState(false);
    const [isExpModalOpen, setIsExpModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editData, setEditData] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0); 
    
    const getFirstDayOfMonth = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]; };
    const getToday = () => new Date().toISOString().split('T')[0];

    const [filters, setFilters] = useState({ search: '', status: 'all', startDate: getFirstDayOfMonth(), endDate: getToday() });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; 

    const [tableData, setTableData] = useState([]);
    const [totalFilteredItems, setTotalFilteredItems] = useState(0);
    const [stats, setStats] = useState({ totalCollected: 0, totalExpenses: 0, totalRemaining: 0, netProfit: 0 });

    const dbTrigger = window.useLiveQuery(() => window.db.client_payments.count(), []);
    const branches = window.useLiveQuery(() => window.db.branches.where('firm_id').equals(firmId).toArray(), [firmId]) || [];
    const mainBranch = branches.length > 0 ? branches[0] : null;

    useEffect(() => {
        setTableData([]);
        setStats({ totalCollected: 0, totalExpenses: 0, totalRemaining: 0, netProfit: 0 });
        setCurrentPage(1);
        
        // جلب اسم المكتب
        const getFirm = async () => {
            const firm = await window.db.law_firms.get(firmId);
            if(firm) setFirmName(firm.name);
        };
        getFirm();
    }, [firmId]);

    useEffect(() => {
        const processData = async () => {
            if (!window.db || !firmId) return;

            const firmClients = await window.db.clients.where('firm_id').equals(firmId).toArray();
            const firmClientIds = firmClients.map(c => c.id);

            let allRev = await window.db.client_payments.reverse().toArray();
            let rawRev = allRev.filter(r => firmClientIds.includes(r.client_id));

            let rawExp = [];
            if (mainBranch) {
                rawExp = await window.db.firm_expenses.where('branch_id').equals(mainBranch.id).reverse().toArray();
            }

            if (filters.startDate) {
                rawRev = rawRev.filter(r => (r.payment_date || '2000-01-01').substring(0, 10) >= filters.startDate);
                rawExp = rawExp.filter(e => (e.expense_date || '2000-01-01').substring(0, 10) >= filters.startDate);
            }
            if (filters.endDate) {
                rawRev = rawRev.filter(r => (r.payment_date || '2000-01-01').substring(0, 10) <= filters.endDate);
                rawExp = rawExp.filter(e => (e.expense_date || '2000-01-01').substring(0, 10) <= filters.endDate);
            }

            if (filters.status !== 'all') {
                rawRev = rawRev.filter(r => {
                    const remaining = (parseFloat(r.total_amount || 0) - parseFloat(r.paid_amount || 0));
                    return filters.status === 'خالص' ? remaining <= 0 : remaining > 0;
                });
            }

            if (filters.search) {
                const q = filters.search.toLowerCase();
                rawExp = rawExp.filter(e => (e.category || '').toLowerCase().includes(q) || ((e.notes || '').toLowerCase().includes(q)));
                
                const matchedClients = firmClients.filter(c => c.name.toLowerCase().includes(q));
                const clientIds = matchedClients.map(c => c.id);
                const matchedCases = await window.db.cases.where('firm_id').equals(firmId).filter(c => c.case_number.includes(q)).toArray();
                const caseIds = matchedCases.map(c => c.id);
                
                rawRev = rawRev.filter(r => clientIds.includes(r.client_id) || caseIds.includes(r.case_id));
            }

            const tCollected = rawRev.reduce((sum, r) => sum + (parseFloat(r.paid_amount) || 0), 0);
            const tRemaining = rawRev.reduce((sum, r) => sum + ((parseFloat(r.total_amount) || 0) - (parseFloat(r.paid_amount) || 0)), 0);
            const tExpenses = rawExp.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
            setStats({ totalCollected: tCollected, totalExpenses: tExpenses, totalRemaining: tRemaining, netProfit: tCollected - tExpenses });

            const activeDataRaw = activeTab === 'revenues' ? rawRev : rawExp;
            setTotalFilteredItems(activeDataRaw.length);

            const startIndex = (currentPage - 1) * itemsPerPage;
            const pagedRaw = activeDataRaw.slice(startIndex, startIndex + itemsPerPage);

            if (activeTab === 'revenues') {
                const enriched = await Promise.all(pagedRaw.map(async r => {
                    const client = firmClients.find(c => c.id === r.client_id); 
                    const caseObj = r.case_id ? await window.db.cases.get(r.case_id) : null;
                    return {
                        ...r,
                        client_name: client ? client.name : 'موكل محذوف',
                        case_number: caseObj ? caseObj.case_number : 'بدون قضية',
                        total: parseFloat(r.total_amount || 0),
                        paid: parseFloat(r.paid_amount || 0),
                        remaining: (parseFloat(r.total_amount || 0) - parseFloat(r.paid_amount || 0)),
                        safe_date: r.payment_date ? r.payment_date.substring(0, 10) : ''
                    };
                }));
                setTableData(enriched);
            } else {
                const enriched = pagedRaw.map(e => ({
                    ...e,
                    amount: parseFloat(e.amount || 0),
                    safe_date: e.expense_date ? e.expense_date.substring(0, 10) : ''
                }));
                setTableData(enriched);
            }
        };
        processData();
    }, [dbTrigger, refreshTrigger, activeTab, filters, currentPage, firmId, mainBranch]);

    const totalPages = Math.ceil(totalFilteredItems / itemsPerPage) || 1;
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);

    const switchTab = (tabName) => {
        if(activeTab === tabName) return;
        setTableData([]); setCurrentPage(1); setActiveTab(tabName);
    };

    const handleFilterChange = (e) => { setFilters({ ...filters, [e.target.name]: e.target.value }); setCurrentPage(1); };

    const openAddRevModal = () => { setModalMode('add'); setEditData(null); setIsRevModalOpen(true); };
    const openEditRevModal = (data) => { setModalMode('edit'); setEditData(data); setIsRevModalOpen(true); };
    const openAddExpModal = () => {
        if(!mainBranch) { showToast("خطأ: يجب إعداد الفرع الرئيسي للمكتب أولاً", "error"); return; }
        setModalMode('add'); setEditData(null); setIsExpModalOpen(true);
    };
    const openEditExpModal = (data) => { setModalMode('edit'); setEditData(data); setIsExpModalOpen(true); };

    const handleDeleteRev = async (id) => {
        if (confirm("هل أنت متأكد من حذف هذه الدفعة نهائياً؟")) {
            await window.db.client_payments.delete(id);
            if (tableData.length === 1 && currentPage > 1) setCurrentPage(p => p - 1);
            setRefreshTrigger(p => p + 1); showToast("تم الحذف بنجاح", "success");
        }
    };

    const handleDeleteExp = async (id) => {
        if (confirm("هل أنت متأكد من حذف هذا المصروف؟")) {
            await window.db.firm_expenses.delete(id);
            if (tableData.length === 1 && currentPage > 1) setCurrentPage(p => p - 1);
            setRefreshTrigger(p => p + 1); showToast("تم الحذف بنجاح", "success");
        }
    };

    // 🖨️ دالة طباعة الفاتورة (تعمل على الويب و Electron بشكل ممتاز 100% Offline)
    const handlePrintInvoice = (row) => {
        showToast("جاري تجهيز الفاتورة للطباعة...", "info");
        
        // إنشاء Iframe مخفي لعدم التأثير على تصميم الصفحة الأساسية
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '-9999px';
        iframe.style.bottom = '-9999px';
        document.body.appendChild(iframe);

        // تنسيق CSS نقي 100% داخل الـ Iframe ليعمل Offline دون الحاجة لـ Tailwind CDN
        const printHTML = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <title>إيصال استلام نقدية - ${row.client_name}</title>
                <style>
                    body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
                    .invoice-box { max-width: 800px; margin: auto; border: 2px solid #e2e8f0; padding: 40px; border-radius: 16px; background: #fff; }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px; }
                    .header h1 { margin: 0; color: #1e3a8a; font-size: 28px; font-weight: 900; }
                    .header p { margin: 5px 0 0; color: #64748b; font-size: 14px; font-weight: bold; }
                    .invoice-title { text-align: center; font-size: 22px; font-weight: 900; color: #d4af37; margin-bottom: 30px; background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px dashed #d4af37; }
                    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                    .detail-item { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
                    .detail-label { font-size: 12px; color: #64748b; font-weight: bold; margin-bottom: 5px; display: block; }
                    .detail-value { font-size: 16px; font-weight: 900; color: #0f172a; }
                    .financials { margin-top: 30px; }
                    .fin-row { display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #e2e8f0; font-size: 16px; font-weight: bold; }
                    .fin-row.total { background: #1e3a8a; color: white; border-radius: 8px 8px 0 0; }
                    .fin-row.paid { background: #ecfdf5; color: #059669; }
                    .fin-row.remaining { background: #fff1f2; color: #e11d48; border-bottom: none; border-radius: 0 0 8px 8px; }
                    .footer { margin-top: 50px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px; }
                    .signature { margin-top: 40px; display: flex; justify-content: space-between; }
                    .sig-box { text-align: center; width: 200px; }
                    .sig-line { border-top: 2px dashed #cbd5e1; margin-top: 40px; padding-top: 10px; font-weight: bold; }
                    @media print { body { padding: 0; } .invoice-box { border: none; } }
                </style>
            </head>
            <body>
                <div class="invoice-box">
                    <div class="header">
                        <div>
                            <h1>${firmName}</h1>
                            <p>إدارة الشؤون القانونية والمحاماة</p>
                        </div>
                        <div style="text-align: left;">
                            <p>التاريخ: <strong>${row.safe_date}</strong></p>
                            <p>رقم الإيصال: <strong>#${row.id.toString().padStart(5, '0')}</strong></p>
                        </div>
                    </div>
                    
                    <div class="invoice-title">إيصال استلام نقدية (أتعاب)</div>
                    
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="detail-label">استلمنا من السيد / السيدة:</span>
                            <span class="detail-value">${row.client_name}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">وذلك عن الدعوى / الإجراء رقم:</span>
                            <span class="detail-value" dir="ltr">${row.case_number !== 'بدون قضية' ? row.case_number : '---'}</span>
                        </div>
                    </div>
                    
                    ${row.notes ? `<div style="margin-bottom: 20px; font-weight: bold; color: #475569;">البيان: ${row.notes}</div>` : ''}

                    <div class="financials">
                        <div class="fin-row total">
                            <span>إجمالي الأتعاب المتفق عليها:</span>
                            <span dir="ltr">${(row.total || 0).toLocaleString()} ج.م</span>
                        </div>
                        <div class="fin-row paid">
                            <span>المدفوع بموجب هذا الإيصال:</span>
                            <span dir="ltr">${(row.paid || 0).toLocaleString()} ج.م</span>
                        </div>
                        <div class="fin-row remaining">
                            <span>الباقي من الأتعاب:</span>
                            <span dir="ltr">${(row.remaining || 0).toLocaleString()} ج.م</span>
                        </div>
                    </div>

                    <div class="signature">
                        <div class="sig-box">
                            <div class="sig-line">توقيع المستلم (المكتب)</div>
                        </div>
                        <div class="sig-box">
                            <div class="sig-line">توقيع الدافع (الموكل)</div>
                        </div>
                    </div>

                    <div class="footer">
                        هذا إيصال إلكتروني صادر من نظام MentraLawyer لإدارة مكاتب المحاماة.
                    </div>
                </div>
            </body>
            </html>
        `;

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(printHTML);
        doc.close();

        // ننتظر قليلاً ليتم بناء الصفحة في الخلفية ثم نأمر بالطباعة (متوافق مع Electron)
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            // إزالة الـ iframe بعد انتهاء الطباعة للحفاظ على الأداء
            setTimeout(() => { document.body.removeChild(iframe); }, 1000);
        }, 500);
    };

    return (
        <div className="space-y-6 animate-view pb-8">
            <window.AccountingHeader 
                filters={filters} 
                handleFilterChange={handleFilterChange} 
                openAddRevModal={openAddRevModal} 
                openAddExpModal={openAddExpModal} 
            />

            <window.AccountingStats stats={stats} />
            
            {/* 👈 الرسم البياني تمت إضافته هنا */}
            {window.AccountingChart && <window.AccountingChart stats={stats} />}

            <window.AccountingTable 
                activeTab={activeTab} 
                switchTab={switchTab} 
                tableData={tableData} 
                currentPage={currentPage} 
                totalPages={totalPages} 
                setCurrentPage={setCurrentPage} 
                totalFilteredItems={totalFilteredItems} 
                itemsPerPage={itemsPerPage} 
                openEditRevModal={openEditRevModal} 
                handleDeleteRev={handleDeleteRev} 
                openEditExpModal={openEditExpModal} 
                handleDeleteExp={handleDeleteExp} 
                handlePrintInvoice={handlePrintInvoice} /* 👈 تمرير الدالة */
            />

            <window.AccountingPromo />

            {isRevModalOpen && (
                <window.RevenueModal 
                    firmId={firmId} 
                    showToast={showToast} 
                    modalMode={modalMode} 
                    editData={editData} 
                    onClose={() => setIsRevModalOpen(false)} 
                    onSuccess={() => setRefreshTrigger(p => p + 1)} 
                />
            )}

            {isExpModalOpen && (
                <window.ExpenseModal 
                    mainBranch={mainBranch} 
                    showToast={showToast} 
                    modalMode={modalMode} 
                    editData={editData} 
                    onClose={() => setIsExpModalOpen(false)} 
                    onSuccess={() => setRefreshTrigger(p => p + 1)} 
                />
            )}
        </div>
    );
};