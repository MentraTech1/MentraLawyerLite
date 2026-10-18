// المسار: components/Main/Module_Main_Container.js

window.Module_Main_Container = function({ firmId }) {
    const { useState, useEffect } = React;

    // توحيد معرّف المكتب لدعم النوعين (Number & String) لمنع فشل الفهرسة
    const targetIdNum = Number(firmId);
    const targetIdStr = String(firmId);
    const validFirmIds = isNaN(targetIdNum) ? [targetIdStr] : [targetIdNum, targetIdStr];

    const getToday = () => new Date().toISOString().split('T')[0];
    const getFirstDayOfMonth = () => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
    };
    const getFirstDayOfYear = () => {
        const d = new Date();
        return new Date(d.getFullYear(), 0, 1).toISOString().split('T')[0];
    };

    const [startDate, setStartDate] = useState(getFirstDayOfMonth());
    const [endDate, setEndDate] = useState(getToday());
    const [activeFilterBtn, setActiveFilterBtn] = useState('month'); 
    
    const [stats, setStats] = useState({ cases: 0, clients: 0, sessions: 0, totalCases: 0 });
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [financialData, setFinancialData] = useState({ revenue: 0, expenses: 0, profit: 0 });
    const [expiringPOAs, setExpiringPOAs] = useState([]);
    const [latestCases, setLatestCases] = useState([]);
    const [latestClients, setLatestClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const applyQuickFilter = (type) => {
        setActiveFilterBtn(type);
        if (type === 'month') { setStartDate(getFirstDayOfMonth()); setEndDate(getToday()); } 
        else if (type === 'year') { setStartDate(getFirstDayOfYear()); setEndDate(getToday()); } 
        else if (type === 'all') { setStartDate('2000-01-01'); setEndDate('2099-12-31'); }
    };

    useEffect(() => {
        let isCurrent = true;

        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                if (!window.db || !firmId) return;

                // 1. جلب الكيانات الأساسية باستخدام (anyOf) لتفادي أخطاء النوع (String vs Number)
                const allCases = await window.db.cases.where('firm_id').anyOf(validFirmIds).reverse().toArray();
                const allClients = await window.db.clients.where('firm_id').anyOf(validFirmIds).reverse().toArray();
                const allBranches = await window.db.branches.where('firm_id').anyOf(validFirmIds).toArray();

                if (!isCurrent) return;

                const clientIds = allClients.map(c => c.id);
                const caseIds = allCases.map(c => c.id);
                const branchIds = allBranches.map(b => b.id);

                // 2. الفلترة الموثوقة بالتاريخ
                const filteredCases = allCases.filter(c => {
                    const d = (c.created_at || '').substring(0, 10);
                    return d >= startDate && d <= endDate;
                });

                const filteredClients = allClients.filter(c => {
                    const d = (c.created_at || '').substring(0, 10);
                    return d >= startDate && d <= endDate;
                });

                // 3. الجلسات
                let allSessions = caseIds.length > 0 
                    ? await window.db.agenda_sessions.where('case_id').anyOf(caseIds).toArray() 
                    : [];

                const filteredSessions = allSessions.filter(s => s.session_date >= startDate && s.session_date <= endDate);
                
                const today = getToday();
                const upcoming = allSessions
                    .filter(s => s.session_date >= today && s.status !== 'completed')
                    .sort((a, b) => (a.session_date || '').localeCompare(b.session_date || ''));

                const upcomingWithDetails = upcoming.map(session => {
                    const caseObj = allCases.find(c => c.id === session.case_id);
                    return { ...session, case_number: caseObj ? caseObj.case_number : 'غير محدد' };
                });

                // 4. التوكيلات
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                const limitDate = thirtyDaysFromNow.toISOString().split('T')[0];

                let allPOAs = clientIds.length > 0 
                    ? await window.db.power_of_attorneys.where('client_id').anyOf(clientIds).toArray() 
                    : [];

                const expiring = allPOAs
                    .filter(p => p.expiry_date && p.expiry_date <= limitDate)
                    .map(poa => {
                        const clientObj = allClients.find(c => c.id === poa.client_id);
                        return { ...poa, client_name: clientObj ? clientObj.name : 'غير معروف' };
                    })
                    .sort((a, b) => (a.expiry_date || '').localeCompare(b.expiry_date || ''));

                // 5. الماليات المعزولة كلياً
                let payments = clientIds.length > 0 
                    ? await window.db.client_payments.where('client_id').anyOf(clientIds).toArray() 
                    : [];

                let revenue = payments
                    .filter(p => {
                        const pDate = p.payment_date || (p.created_at ? p.created_at.substring(0, 10) : '');
                        return pDate >= startDate && pDate <= endDate;
                    })
                    .reduce((sum, p) => sum + parseFloat(p.paid_amount || p.amount || 0), 0);
                
                // جلب مصروفات هذا المكتب فقط (مع التحقق الصارم من وجود المعرفات)
                let rawExpenses = await window.db.firm_expenses.toArray();
                let expenses = rawExpenses.filter(e => {
                    const matchBranch = e.branch_id && branchIds.includes(e.branch_id);
                    const matchFirm = e.firm_id && validFirmIds.includes(e.firm_id);
                    return matchBranch || matchFirm;
                });

                let totalExp = expenses
                    .filter(e => {
                        const expDate = e.expense_date || (e.created_at ? e.created_at.substring(0, 10) : '');
                        return expDate >= startDate && expDate <= endDate;
                    })
                    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

                if (!isCurrent) return;

                // 6. تحديث كل الحالات
                setStats({ 
                    cases: filteredCases.length, 
                    clients: filteredClients.length, 
                    sessions: filteredSessions.length, 
                    totalCases: allCases.length 
                });
                
                setUpcomingSessions(upcomingWithDetails);
                setFinancialData({ 
                    revenue: revenue, 
                    expenses: totalExp, 
                    profit: revenue - totalExp 
                });
                setExpiringPOAs(expiring);
                setLatestCases(allCases);
                setLatestClients(allClients);

            } catch (error) {
                console.error("خطأ في جلب بيانات لوحة القيادة:", error);
            } finally {
                if (isCurrent) setIsLoading(false);
            }
        };

        fetchDashboardData();

        return () => {
            isCurrent = false;
        };
    }, [firmId, startDate, endDate]);

    return (
        <div className="space-y-6 animate-view pb-6" key={`firm-view-${firmId}`}>
            <window.DashboardFilters 
                startDate={startDate} 
                setStartDate={setStartDate} 
                endDate={endDate} 
                setEndDate={setEndDate} 
                activeFilterBtn={activeFilterBtn} 
                setActiveFilterBtn={setActiveFilterBtn} 
                applyQuickFilter={applyQuickFilter} 
            />
            
            <window.DashboardStats stats={stats} isLoading={isLoading} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <window.FinancialChart 
                        data={financialData} 
                        isLoading={isLoading} 
                        firmId={firmId} 
                    />
                    <window.LatestRecords 
                        cases={latestCases} 
                        clients={latestClients} 
                        isLoading={isLoading} 
                    />
                </div>
                <div className="space-y-6">
                    <window.UpcomingSessions 
                        upcomingSessions={upcomingSessions} 
                        isLoading={isLoading} 
                    />
                    <window.ExpiringPOAs 
                        poas={expiringPOAs} 
                        isLoading={isLoading} 
                    />
                </div>
            </div>
            
            <window.PromoBanner />
        </div>
    );
};