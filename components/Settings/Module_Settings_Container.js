// المسار: components/Settings/Module_Settings_Container.js

window.Module_Settings_Container = function({ firmId, showToast }) {
    const { useState, useEffect } = React;
    
    const [activeTab, setActiveTab] = useState('profile'); 
    const [isLoading, setIsLoading] = useState(false);
    
    // بيانات المكتب والمدير
    const [formData, setFormData] = useState({
        firmName: '', ownerName: '', email: '', password: ''
    });

    // بيانات مساحة التخزين
    const [storageInfo, setStorageInfo] = useState({ used: '0.00', total: '0.00', percent: 0, isSupported: true });

    useEffect(() => {
        const loadSettingsData = async () => {
            try {
                const sessionStr = localStorage.getItem('MentraLocal_Session');
                if (!sessionStr) return;
                const session = JSON.parse(sessionStr);
                const firm = await window.db.law_firms.get(firmId);
                const user = await window.db.users.get(session.user_id);
                
                if (firm && user) {
                    setFormData({
                        firmName: firm.name,
                        ownerName: user.name,
                        email: user.email,
                        password: user.password
                    });
                }

                if (navigator.storage && navigator.storage.estimate) {
                    const estimate = await navigator.storage.estimate();
                    const usedMB = (estimate.usage / (1024 * 1024)).toFixed(2);
                    const totalMB = (estimate.quota / (1024 * 1024)).toFixed(2);
                    const percent = estimate.quota ? ((estimate.usage / estimate.quota) * 100).toFixed(4) : 0;
                    
                    setStorageInfo({ used: usedMB, total: totalMB, percent, isSupported: true });
                } else {
                    setStorageInfo(prev => ({ ...prev, isSupported: false }));
                }
            } catch (error) {
                console.error("خطأ في جلب الإعدادات", error);
            }
        };

        loadSettingsData();
    }, [firmId]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const session = JSON.parse(localStorage.getItem('MentraLocal_Session'));

            await window.db.law_firms.update(firmId, { name: formData.firmName });
            
            await window.db.users.update(session.user_id, {
                name: formData.ownerName,
                email: formData.email,
                password: formData.password
            });

            session.firm_name = formData.firmName;
            session.name = formData.ownerName;
            localStorage.setItem('MentraLocal_Session', JSON.stringify(session));

            showToast("تم تحديث بيانات المكتب بنجاح", "success");
            setTimeout(() => { window.location.reload(); }, 1200);
        } catch (error) {
            showToast("حدث خطأ أثناء التحديث", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackup = async () => {
        try {
            showToast("جاري تجميع البيانات وتجهيز الملف...", "success");
            
            const clients = await window.db.clients.where('firm_id').equals(firmId).toArray();
            const clientIds = clients.map(c => c.id);

            const cases = await window.db.cases.where('firm_id').equals(firmId).toArray();
            const caseIds = cases.map(c => c.id);

            const branches = await window.db.branches.where('firm_id').equals(firmId).toArray();
            const branchIds = branches.map(b => b.id);

            const allSessions = await window.db.agenda_sessions.toArray();
            const sessions = allSessions.filter(s => caseIds.includes(s.case_id));

            const allDocuments = await window.db.case_documents.toArray();
            const documents = allDocuments.filter(d => caseIds.includes(d.case_id));

            const allPayments = await window.db.client_payments.toArray();
            const payments = allPayments.filter(p => clientIds.includes(p.client_id));

            const allExpenses = await window.db.firm_expenses.toArray();
            const expenses = allExpenses.filter(e => branchIds.includes(e.branch_id));

            const courts = JSON.parse(localStorage.getItem(`MentraLocal_Courts_${firmId}`) || '[]');
            const caseTypes = JSON.parse(localStorage.getItem(`MentraLocal_CaseTypes_${firmId}`) || '[]');

            const exportData = {
                clients, cases, sessions, documents, payments, expenses, branches, courts, caseTypes
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MentraBackup_${(formData.firmName || 'Firm').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast("تم تحميل النسخة الاحتياطية بأمان", "success");
        } catch (error) {
            console.error(error);
            showToast("خطأ أثناء استخراج البيانات", "error");
        }
    };

    const handleFactoryReset = async () => {
        const confirm1 = confirm("⚠️ تحذير خطير: هل أنت متأكد من مسح جميع بيانات المكتب، القضايا، الموكلين، والماليات؟");
        if (confirm1) {
            const confirm2 = confirm("هذا الإجراء لا يمكن التراجع عنه أبداً (إلا إذا كان لديك ملف نسخ احتياطي). هل تريد المتابعة؟");
            if (confirm2) {
                await window.db.delete();
                localStorage.removeItem('MentraLocal_Session');
                localStorage.removeItem(`MentraLocal_Courts_${firmId}`);
                localStorage.removeItem(`MentraLocal_CaseTypes_${firmId}`);
                alert("تم تدمير البيانات بنجاح. سيتم توجيهك لشاشة الدخول.");
                window.location.replace('subscriptions.html');
            }
        }
    };

    return (
        <div className="space-y-6 animate-view max-w-5xl mx-auto pb-8">
            {window.SettingsHeader ? <window.SettingsHeader /> : null}

            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {window.SettingsTabs ? <window.SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} /> : null}

                <div className="flex-1 bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[420px]">
                    {activeTab === 'profile' && (
                        window.ProfileTab ? (
                            <window.ProfileTab 
                                formData={formData} 
                                handleInputChange={handleInputChange} 
                                handleSaveChanges={handleSaveChanges} 
                                isLoading={isLoading} 
                            />
                        ) : <div className="p-8 text-center text-slate-400">جاري تحميل الملف الشخصي...</div>
                    )}

                    {activeTab === 'courts' && (
                        window.CourtsTab ? (
                            <window.CourtsTab 
                                firmId={firmId} 
                                showToast={showToast} 
                            />
                        ) : <div className="p-8 text-center text-slate-400">جاري تحميل المحاكم...</div>
                    )}

                    {activeTab === 'case_types' && (
                        window.CaseTypesTab ? (
                            <window.CaseTypesTab 
                                firmId={firmId} 
                                showToast={showToast} 
                            />
                        ) : <div className="p-8 text-center text-slate-400">جاري تحميل أنواع القضايا...</div>
                    )}

                    {activeTab === 'storage' && (
                        window.StorageTab ? (
                            <window.StorageTab 
                                storageInfo={storageInfo} 
                                handleBackup={handleBackup} 
                            />
                        ) : <div className="p-8 text-center text-slate-400">جاري تحميل التخزين...</div>
                    )}

                    {activeTab === 'danger' && (
                        window.DangerTab ? (
                            <window.DangerTab 
                                handleFactoryReset={handleFactoryReset} 
                            />
                        ) : <div className="p-8 text-center text-slate-400">جاري تحميل الإعدادات...</div>
                    )}
					{activeTab === 'security' && <window.SecurityTab showToast={showToast} />}
                </div>
            </div>

            {window.SettingsPromo ? <window.SettingsPromo /> : null}
        </div>
    );
};