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

    const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

    const chunkArray = (array, size) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    };

    // 🛡️ فئة ذكية لمواءمة الـ IDs تعالج تعارض الأرقام والنصوص بدقة (String vs Number)
    class SafeIdMap {
        constructor() {
            this.map = new Map();
        }
        set(oldId, newId) {
            if (oldId !== undefined && oldId !== null) {
                this.map.set(String(oldId), newId);
                this.map.set(Number(oldId), newId);
            }
        }
        get(oldId) {
            if (oldId === undefined || oldId === null) return undefined;
            return this.map.get(String(oldId)) ?? this.map.get(Number(oldId));
        }
        has(oldId) {
            if (oldId === undefined || oldId === null) return false;
            return this.map.has(String(oldId)) || this.map.has(Number(oldId));
        }
    }

    // المعرفات المعتمدة للمكتب
    const targetIdNum = Number(firmId);
    const targetIdStr = String(firmId);
    const validFirmIds = isNaN(targetIdNum) ? [targetIdStr] : [targetIdNum, targetIdStr];

    // ==========================================
    // 1. نظام التصدير الكامل (Export)
    // ==========================================
    const handleExport = async () => {
        setIsProcessing(true);
        setProgress(0);
        setLogs([]);
        addLog("بدء استخراج وتجهيز بيانات المكتب الحالي...", "info");
        
        try {
            const exportData = {
                metadata: {
                    version: 3,
                    timestamp: new Date().toISOString(),
                    firmId: firmId,
                    app: "MentraLawyer Offline"
                },
                data: {}
            };

            // 1. الفروع والموكلين
            addLog("جاري استخراج الفروع والموكلين...", "info");
            const branches = await window.db.branches.where('firm_id').anyOf(validFirmIds).toArray();
            const branchIds = branches.map(b => b.id);

            const clients = await window.db.clients.where('firm_id').anyOf(validFirmIds).toArray();
            const clientIds = clients.map(c => c.id);
            setProgress(20);
            await yieldToMain();

            // 2. القضايا
            addLog("جاري استخراج ملفات القضايا...", "info");
            const cases = await window.db.cases.where('firm_id').anyOf(validFirmIds).toArray();
            const caseIds = cases.map(c => c.id);
            setProgress(40);
            await yieldToMain();

            // 3. الجلسات، المستندات، والتوكيلات
            addLog("جاري استخراج الجلسات، المستندات، وسجل التوكيلات...", "info");
            const sessions = caseIds.length > 0 
                ? await window.db.agenda_sessions.where('case_id').anyOf(caseIds).toArray() 
                : [];
            
            const documents = caseIds.length > 0 
                ? await window.db.case_documents.where('case_id').anyOf(caseIds).toArray() 
                : [];

            let poas = [];
            if (window.db.power_of_attorneys && clientIds.length > 0) {
                poas = await window.db.power_of_attorneys.where('client_id').anyOf(clientIds).toArray();
            }

            setProgress(65);
            await yieldToMain();

            // 4. الحسابات والماليات
            addLog("جاري استخراج الحركات المالية (الإيرادات والمصروفات)...", "info");
            let payments = [];
            if (clientIds.length > 0) {
                payments = await window.db.client_payments.where('client_id').anyOf(clientIds).toArray();
            }

            const allExpenses = await window.db.firm_expenses.toArray();
            const expenses = allExpenses.filter(e => {
                return (e.branch_id && branchIds.includes(e.branch_id)) || (e.firm_id && validFirmIds.includes(e.firm_id));
            });

            setProgress(85);
            await yieldToMain();

            // حزم البيانات
            exportData.data = {
                branches,
                clients,
                cases,
                agenda_sessions: sessions,
                case_documents: documents,
                power_of_attorneys: poas,
                client_payments: payments,
                firm_expenses: expenses
            };

            addLog("جاري بناء ملف التصدير النهائي...", "info");
            await yieldToMain();

            const jsonString = JSON.stringify(exportData);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const firm = await window.db.law_firms.get(targetIdNum) || await window.db.law_firms.get(targetIdStr);
            const safeName = firm ? firm.name.replace(/[\\/:*?"<>| ]/g, '_') : 'MyFirm';
            const fileName = `MentraBackup_${safeName}_${new Date().toISOString().split('T')[0]}.json`;

            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setProgress(100);
            addLog("🎉 اكتمل تصدير النسخة الاحتياطية بنجاح!", "success");
            showToast("تم تحميل ملف النسخة الاحتياطية بنجاح", "success");

        } catch (error) {
            console.error("Export Error:", error);
            addLog(`خطأ فادح أثناء التصدير: ${error.message}`, "error");
            showToast("فشل تصدير البيانات", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    // ==========================================
    // 2. نظام الاستيراد المتقن والمحمي (Import & Restore)
    // ==========================================
    const handleImportClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const processImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const confirmMsg = "⚠️ تحذير مهم جداً:\nسيتم تنظيف بيانات هذا المكتب الحالية واستبدالها بالبيانات الموجودة في الملف.\nلن تتأثر المكاتب الأخرى.\nهل أنت متأكد من المتابعة؟";
        if (!confirm(confirmMsg)) {
            e.target.value = null; 
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        setLogs([]);
        addLog(`جاري قراءة ملف النسخة: ${file.name}...`, "info");

        try {
            const fileContent = await file.text();
            addLog("تمت قراءة الملف بنجاح. جاري الفحص الهيكلي...", "info");
            await yieldToMain();

            const imported = JSON.parse(fileContent);

            if (!imported.metadata || imported.metadata.app !== "MentraLawyer Offline" || !imported.data) {
                throw new Error("ملف غير صالح أو تالف! يرجى اختيار ملف نسخة احتياطية سليم تم تصديره من MentraLawyer.");
            }

            const data = imported.data;
            addLog("الملف سليم 100%. جاري بدء العملية في بيئة محمية...", "info");
            setProgress(15);
            await yieldToMain();

            // الجداول المشتركة في المعاملة
            const tablesToLock = [
                window.db.branches,
                window.db.clients,
                window.db.cases,
                window.db.agenda_sessions,
                window.db.case_documents,
                window.db.client_payments,
                window.db.firm_expenses
            ];
            if (window.db.power_of_attorneys) {
                tablesToLock.push(window.db.power_of_attorneys);
            }

            const branchMap = new SafeIdMap();
            const clientMap = new SafeIdMap();
            const caseMap = new SafeIdMap();

            // تنفيذ العملية الذرية (Atomic Transaction)
            await window.db.transaction('rw', tablesToLock, async () => {

                // -------------------------------------------------------------
                // 1. تنظيف شامل ودقيق لبيانات المكتب الحالي فقط
                // -------------------------------------------------------------
                addLog("المرحلة 1: تفريغ السجلات السابقة لهذا المكتب بالكامل...", "warning");

                const currentBranches = await window.db.branches.where('firm_id').anyOf(validFirmIds).toArray();
                const curBranchIds = currentBranches.map(b => b.id);

                const currentClients = await window.db.clients.where('firm_id').anyOf(validFirmIds).toArray();
                const curClientIds = currentClients.map(c => c.id);

                const currentCases = await window.db.cases.where('firm_id').anyOf(validFirmIds).toArray();
                const curCaseIds = currentCases.map(c => c.id);

                // حذف التوابع أولاً
                if (curCaseIds.length > 0) {
                    await window.db.agenda_sessions.where('case_id').anyOf(curCaseIds).delete();
                    await window.db.case_documents.where('case_id').anyOf(curCaseIds).delete();
                }
                if (curClientIds.length > 0) {
                    await window.db.client_payments.where('client_id').anyOf(curClientIds).delete();
                    if (window.db.power_of_attorneys) {
                        await window.db.power_of_attorneys.where('client_id').anyOf(curClientIds).delete();
                    }
                }
                if (curBranchIds.length > 0) {
                    await window.db.firm_expenses.where('branch_id').anyOf(curBranchIds).delete();
                }
                // مسح أي مصروفات أخرى مسجلة مباشرة بـ firm_id
                await window.db.firm_expenses.filter(e => validFirmIds.includes(e.firm_id)).delete();

                // مسح الكيانات الأساسية
                await window.db.cases.where('firm_id').anyOf(validFirmIds).delete();
                await window.db.clients.where('firm_id').anyOf(validFirmIds).delete();
                await window.db.branches.where('firm_id').anyOf(validFirmIds).delete();

                // -------------------------------------------------------------
                // 2. استيراد الفروع ومواءمة المعرفات
                // -------------------------------------------------------------
                addLog("المرحلة 2: استيراد الفروع وتوليد المعرفات الجديدة...", "info");
                for (const b of (data.branches || [])) {
                    const oldId = b.id;
                    const copy = { ...b, firm_id: firmId };
                    delete copy.id;
                    const newId = await window.db.branches.add(copy);
                    branchMap.set(oldId, newId);
                }

                // -------------------------------------------------------------
                // 3. استيراد الموكلين ومواءمة المعرفات
                // -------------------------------------------------------------
                addLog("المرحلة 3: استيراد الموكلين بدقة...", "info");
                for (const c of (data.clients || [])) {
                    const oldId = c.id;
                    const copy = { ...c, firm_id: firmId };
                    delete copy.id;
                    const newId = await window.db.clients.add(copy);
                    clientMap.set(oldId, newId);
                }

                // -------------------------------------------------------------
                // 4. استيراد القضايا مع إعادة ربطها بالموكلين والفروع
                // -------------------------------------------------------------
                addLog("المرحلة 4: استيراد القضايا وربطها بالموكلين الجدد...", "info");
                for (const cs of (data.cases || [])) {
                    const oldId = cs.id;
                    const copy = { ...cs, firm_id: firmId };
                    delete copy.id;

                    // ربط الموكل الصحيح
                    if (cs.client_id && clientMap.has(cs.client_id)) {
                        copy.client_id = clientMap.get(cs.client_id);
                    }
                    // ربط الفرع الصحيح
                    if (cs.branch_id && branchMap.has(cs.branch_id)) {
                        copy.branch_id = branchMap.get(cs.branch_id);
                    }

                    const newId = await window.db.cases.add(copy);
                    caseMap.set(oldId, newId);
                }

                // -------------------------------------------------------------
                // 5. استيراد الجلسات والمستندات والتوكيلات والماليات
                // -------------------------------------------------------------
                addLog("المرحلة 5: استعادة الجلسات والمستندات والتوكيلات...", "info");

                // الجلسات
                const validSessions = (data.agenda_sessions || [])
                    .filter(s => caseMap.has(s.case_id))
                    .map(s => {
                        const copy = { ...s, case_id: caseMap.get(s.case_id) };
                        delete copy.id;
                        return copy;
                    });
                for (const chunk of chunkArray(validSessions, 500)) {
                    await window.db.agenda_sessions.bulkAdd(chunk);
                }

                // المستندات
                const validDocs = (data.case_documents || [])
                    .filter(d => caseMap.has(d.case_id))
                    .map(d => {
                        const copy = { ...d, case_id: caseMap.get(d.case_id) };
                        delete copy.id;
                        return copy;
                    });
                for (const chunk of chunkArray(validDocs, 500)) {
                    await window.db.case_documents.bulkAdd(chunk);
                }

                // التوكيلات
                if (window.db.power_of_attorneys && data.power_of_attorneys) {
                    const validPOAs = data.power_of_attorneys
                        .filter(p => clientMap.has(p.client_id))
                        .map(p => {
                            const copy = { ...p, client_id: clientMap.get(p.client_id) };
                            delete copy.id;
                            return copy;
                        });
                    for (const chunk of chunkArray(validPOAs, 500)) {
                        await window.db.power_of_attorneys.bulkAdd(chunk);
                    }
                }

                addLog("المرحلة 6: استعادة الحركات المالية ومطابقة الأرصدة...", "info");

                // المدفوعات
                const validPayments = (data.client_payments || [])
                    .filter(p => clientMap.has(p.client_id))
                    .map(p => {
                        const copy = { ...p, client_id: clientMap.get(p.client_id), firm_id: firmId };
                        if (p.case_id && caseMap.has(p.case_id)) {
                            copy.case_id = caseMap.get(p.case_id);
                        }
                        delete copy.id;
                        return copy;
                    });
                for (const chunk of chunkArray(validPayments, 500)) {
                    await window.db.client_payments.bulkAdd(chunk);
                }

                // المصروفات
                const validExpenses = (data.firm_expenses || []).map(e => {
                    const copy = { ...e, firm_id: firmId };
                    if (e.branch_id && branchMap.has(e.branch_id)) {
                        copy.branch_id = branchMap.get(e.branch_id);
                    }
                    delete copy.id;
                    return copy;
                });
                for (const chunk of chunkArray(validExpenses, 500)) {
                    await window.db.firm_expenses.bulkAdd(chunk);
                }
            });

            setProgress(100);
            addLog("🎉 تمت استعادة ومطابقة كافة البيانات والعلاقات بنجاح 100%!", "success");
            showToast("تمت الاستعادة بنجاح. جاري التحديث...", "success");

            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error("Restore Failure:", error);
            addLog(`⚠️ فشلت عملية الاستعادة وتم التراجع عن كافة التغييرات: ${error.message}`, "error");
            showToast("فشلت الاستعادة. بياناتك السابقة محمية دون تغيير.", "error");
        } finally {
            setIsProcessing(false);
            if (e.target) e.target.value = null;
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