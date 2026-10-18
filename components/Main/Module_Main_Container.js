// المسار: components/Main/Module_Main_Container.js

window.Module_Main_Container = function({ firmId }) {
    const { useState, useEffect } = React;

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
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                if(!window.db) return;

                // جلب الداتا الأساسية
                const allCases = await window.db.cases.where('firm_id').equals(firmId).reverse().toArray();
                const allClients = await window.db.clients.where('firm_id').equals(firmId).reverse().toArray();
                const clientIds = allClients.map(c => c.id);
                const caseIds = allCases.map(c => c.id);

                // الفلترة بالتاريخ
                const filteredCases = allCases.filter(c => c.created_at && c.created_at.substring(0, 10) >= startDate && c.created_at.substring(0, 10) <= endDate);
                const filteredClients = allClients.filter(c => c.created_at && c.created_at.substring(0, 10) >= startDate && c.created_at.substring(0, 10) <= endDate);

                // الجلسات
                let allSessions = caseIds.length > 0 ? await window.db.agenda_sessions.where('case_id').anyOf(caseIds).toArray() : [];
                const filteredSessions = allSessions.filter(s => s.session_date >= startDate && s.session_date <= endDate);
                
                const today = getToday();
                const upcoming = allSessions.filter(s => s.session_date >= today && s.status !== 'completed').sort((a, b) => a.session_date.localeCompare(b.session_date));
                const upcomingWithDetails = upcoming.map(session => {
                    const caseObj = allCases.find(c => c.id === session.case_id);
                    return { ...session, case_number: caseObj ? caseObj.case_number : 'غير محدد' };
                });

                // التوكيلات التي أوشكت على الانتهاء (أقل من 30 يوم أو انتهت)
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                const limitDate = thirtyDaysFromNow.toISOString().split('T')[0];

                let allPOAs = clientIds.length > 0 ? await window.db.power_of_attorneys.where('client_id').anyOf(clientIds).toArray() : [];
                const expiring = allPOAs.filter(p => p.expiry_date <= limitDate).map(poa => {
                    const clientObj = allClients.find(c => c.id === poa.client_id);
                    return { ...poa, client_name: clientObj ? clientObj.name : 'غير معروف' };
                }).sort((a, b) => a.expiry_date.localeCompare(b.expiry_date));

                // البيانات المالية (في النطاق الزمني)
                let payments = clientIds.length > 0 ? await window.db.client_payments.where('client_id').anyOf(clientIds).toArray() : [];
                let expenses = await window.db.firm_expenses.toArray(); // سنفلترها للمكتب لاحقاً بالفرع
                
                // افتراض وجود حقل payment_date أو created_at
                let revenue = payments.filter(p => p.payment_date >= startDate && p.payment_date <= endDate)
                                      .reduce((sum, p) => sum + parseFloat(p.paid_amount || 0), 0);
                
                let totalExp = expenses.filter(e => e.expense_date >= startDate && e.expense_date <= endDate)
                                       .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

                // تحديث الـ States
                setStats({ cases: filteredCases.length, clients: filteredClients.length, sessions: filteredSessions.length, totalCases: allCases.length });
                setUpcomingSessions(upcomingWithDetails);
                setFinancialData({ revenue: revenue, expenses: totalExp, profit: revenue - totalExp });
                setExpiringPOAs(expiring);
                setLatestCases(allCases); // بدون فلتر لتعرض دائما الأحدث
                setLatestClients(allClients);

            } catch (error) {
                console.error("خطأ في جلب البيانات:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [firmId, startDate, endDate]);

    return (
        <div className="space-y-6 animate-view pb-6">
            <window.DashboardFilters startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} activeFilterBtn={activeFilterBtn} setActiveFilterBtn={setActiveFilterBtn} applyQuickFilter={applyQuickFilter} />
            
            <window.DashboardStats stats={stats} isLoading={isLoading} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <window.FinancialChart data={financialData} isLoading={isLoading} />
                    <window.LatestRecords cases={latestCases} clients={latestClients} isLoading={isLoading} />
                </div>
                <div className="space-y-6">
                    <window.UpcomingSessions upcomingSessions={upcomingSessions} isLoading={isLoading} />
                    <window.ExpiringPOAs poas={expiringPOAs} isLoading={isLoading} />
                </div>
            </div>
            
            <window.PromoBanner />
        </div>
    );
};