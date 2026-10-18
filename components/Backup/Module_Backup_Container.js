// المسار: components/Backup/Module_Backup_Container.js

window.Module_Backup_Container = function({ firmId, showToast }) {
    const { useState, useRef } = React;

    const [activeTab, setActiveTab] = useState('export'); 
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState([]); 
    
    const fileInputRef = useRef(null);

    const addLog = (msg, type = 'info') => {
        setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
    };

    const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 10));

    // ==========================================
    // 1. نظام التصدير
    // ==========================================
    const handleExport = async () => {
        setIsProcessing(true);
        setProgress(0);
        setLogs([]);
        addLog("بدء عملية تجهيز بيانات المكتب الحالي فقط...", "info");
        
        try {
            const exportData = {
                metadata: {
                    version: 2,
                    timestamp: new Date().toISOString(),
                    firmId: firmId,
                    app: "MentraLawyer Offline"
                },
                data: {}
            };

            addLog("جاري استخراج بيانات الموكلين والفروع...", "info");
            const clients = await window.db.clients.where('firm_id').equals(firmId).toArray();
            const clientIds = clients.map(c => c.id);
            
            const cases = await window.db.cases.where('firm_id').equals(firmId).toArray();
            const caseIds = cases.map(c => c.id);
            
            const branches = await window.db.branches.where('firm_id').equals(firmId).toArray();
            const branchIds = branches.map(b => b.id);

            setProgress(20);
            await yieldToMain();

            addLog("جاري استخراج الجلسات والمستندات...", "info");
            const allSessions = await window.db.agenda_sessions.toArray();
            const sessions = allSessions.filter(s => caseIds.includes(s.case_id));

            const allDocs = await window.db.case_documents.toArray();
            const documents = allDocs.filter(d => caseIds.includes(d.case_id));

            setProgress(50);
            await yieldToMain();

            addLog("جاري استخراج الماليات...", "info");
            const allPayments = await window.db.client_payments.toArray();
            const payments = allPayments.filter(p => clientIds.includes(p.client_id));

            const allExpenses = await window.db.firm_expenses.toArray();
            const expenses = allExpenses.filter(e => branchIds.includes(e.branch_id));

            setProgress(80);
            await yieldToMain();

            exportData.data = {
                branches: branches,
                clients: clients,
                cases: cases,
                case_documents: documents,
                agenda_sessions: sessions,
                client_payments: payments,
                firm_expenses: expenses
            };

            addLog("جاري ضغط وبناء ملف النسخة الاحتياطية...", "info");
            await yieldToMain();

            const jsonString = JSON.stringify(exportData);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const firm = await window.db.law_firms.get(firmId);
            const firmNameSafe = firm ? firm.name.replace(/\s+/g, '_') : 'MyFirm';
            const fileName = `MentraBackup_${firmNameSafe}_${new Date().toISOString().split('T')[0]}.json`;

            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setProgress(100);
            addLog("🎉 تمت عملية التصدير بنجاح! احتفظ بالملف في مكان آمن.", "success");
            showToast("تم تحميل النسخة الاحتياطية", "success");

        } catch (error) {
            console.error(error);
            addLog(`خطأ فادح: ${error.message}`, "error");
            showToast("فشل التصدير", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    // ==========================================
    // 2. نظام الاستيراد
    // ==========================================
    const handleImportClick = () => {
        if(fileInputRef.current) fileInputRef.current.click();
    };

    const processImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const confirmMsg = "⚠️ تحذير: استعادة النسخة الاحتياطية سيقوم باستبدال قضايا وموكلين هذا المكتب فقط. (لن يتأثر اسم المكتب أو كلمة المرور). هل تريد المتابعة؟";
        if (!confirm(confirmMsg)) {
            e.target.value = null; 
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        setLogs([]);
        addLog(`جاري قراءة الملف: ${file.name}...`, "info");

        try {
            const text = await file.text();
            addLog("تمت القراءة. جاري تحليل البيانات...", "info");
            await yieldToMain();

            const importedData = JSON.parse(text);

            if (!importedData.metadata || importedData.metadata.app !== "MentraLawyer Offline") {
                throw new Error("ملف النسخة الاحتياطية غير صالح أو لا يتبع هذا النظام.");
            }

            addLog("تم التحقق من الملف. جاري تفريغ البيانات القديمة لهذا المكتب فقط...", "warning");
            await yieldToMain();

            const currentClients = await window.db.clients.where('firm_id').equals(firmId).toArray();
            const currentClientIds = currentClients.map(c => c.id);
            const currentCases = await window.db.cases.where('firm_id').equals(firmId).toArray();
            const currentCaseIds = currentCases.map(c => c.id);
            const currentBranches = await window.db.branches.where('firm_id').equals(firmId).toArray();
            const currentBranchIds = currentBranches.map(b => b.id);

            const sessionsToDelete = await window.db.agenda_sessions.filter(s => currentCaseIds.includes(s.case_id)).primaryKeys();
            await window.db.agenda_sessions.bulkDelete(sessionsToDelete);

            const docsToDelete = await window.db.case_documents.filter(d => currentCaseIds.includes(d.case_id)).primaryKeys();
            await window.db.case_documents.bulkDelete(docsToDelete);

            const paymentsToDelete = await window.db.client_payments.filter(p => currentClientIds.includes(p.client_id)).primaryKeys();
            await window.db.client_payments.bulkDelete(paymentsToDelete);

            const expensesToDelete = await window.db.firm_expenses.filter(e => currentBranchIds.includes(e.branch_id)).primaryKeys();
            await window.db.firm_expenses.bulkDelete(expensesToDelete);

            await window.db.cases.where('firm_id').equals(firmId).delete();
            await window.db.clients.where('firm_id').equals(firmId).delete();
            await window.db.branches.where('firm_id').equals(firmId).delete();

            setProgress(40);
            addLog("تم تفريغ البيانات القديمة بنجاح. جاري حقن النسخة الجديدة...", "info");
            await yieldToMain();

            const dataToRestore = importedData.data;
            const tablesToRestore = Object.keys(dataToRestore);
            let currentTableIndex = 0;

            for (const tableName of tablesToRestore) {
                if (!window.db[tableName]) continue;

                addLog(`حقن جدول: ${tableName}...`, "info");
                let records = dataToRestore[tableName];
                
                records = records.map(record => {
                    if (record.hasOwnProperty('firm_id')) {
                        record.firm_id = firmId;
                    }
                    return record;
                });

                const chunkSize = 5000;
                for (let offset = 0; offset < records.length; offset += chunkSize) {
                    const chunk = records.slice(offset, offset + chunkSize);
                    await window.db[tableName].bulkPut(chunk); 
                    await yieldToMain();
                }
                
                addLog(`تم استعادة ${records.length} سجل في ${tableName}.`, "success");
                
                currentTableIndex++;
                const overallProgress = 40 + ((currentTableIndex / tablesToRestore.length) * 60);
                setProgress(Math.round(overallProgress));
            }

            setProgress(100);
            addLog("🎉 تمت استعادة البيانات بالكامل بنجاح!", "success");
            showToast("تمت الاستعادة. سيتم تحديث الصفحة.", "success");
            
            setTimeout(() => { window.location.reload(); }, 2000);

        } catch (error) {
            console.error(error);
            addLog(`خطأ فادح: ${error.message}`, "error");
            showToast("فشل استيراد البيانات", "error");
        } finally {
            setIsProcessing(false);
            if(e.target) e.target.value = null;
        }
    };

    return (
        <div className="space-y-6 animate-view max-w-5xl mx-auto pb-8">
            <window.BackupHeader />

            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <window.BackupTabs 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    isProcessing={isProcessing} 
                />

                <div className="flex-1 bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <window.BackupActions 
                        activeTab={activeTab}
                        isProcessing={isProcessing}
                        handleExport={handleExport}
                        handleImportClick={handleImportClick}
                        processImport={processImport}
                        fileInputRef={fileInputRef}
                    />
                    
                    <window.BackupTerminal 
                        isProcessing={isProcessing}
                        progress={progress}
                        logs={logs}
                    />
                </div>
            </div>

            <window.BackupPromo />
        </div>
    );
};