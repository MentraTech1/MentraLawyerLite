// المسار: components/Cases/Module_Cases_Container.js

window.Module_Cases_Container = function({ firmId, showToast }) {
    const { useState, useEffect } = React;
    
    const [viewMode, setViewMode] = useState('list');
    const [selectedCaseForSessions, setSelectedCaseForSessions] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editData, setEditData] = useState(null);
    
    // 🌟 إضافة clientId إلى الفلاتر
    const [filters, setFilters] = useState({ search: '', startDate: '', endDate: '', status: 'all', clientId: '' });
    
    // 🌟 حالة البحث المباشر عن العميل في الفلاتر
    const [clientFilterState, setClientFilterState] = useState({ term: '', results: [], isOpen: false, selectedName: '' });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [tableData, setTableData] = useState([]);
    const [totalFilteredItems, setTotalFilteredItems] = useState(0);

    const rawCases = window.useLiveQuery(() => window.db.cases.where('firm_id').equals(firmId).reverse().toArray(), [firmId]) || [];

    // 🌟 دالة البحث عن العملاء
    const handleClientFilterSearch = async (e) => {
        const term = e.target.value;
        setClientFilterState(prev => ({ ...prev, term, isOpen: true }));
        
        if (!term.trim()) {
            setClientFilterState(prev => ({ ...prev, results: [] }));
            return;
        }

        const results = await window.db.clients.where('firm_id').equals(firmId)
            .filter(c => c.name.includes(term))
            .limit(10).toArray();
            
        setClientFilterState(prev => ({ ...prev, results }));
    };

    // 🌟 دالة اختيار العميل للفلترة
    const selectClientForFilter = (client) => {
        setClientFilterState({ term: '', results: [], isOpen: false, selectedName: client.name });
        setFilters(prev => ({ ...prev, clientId: client.id }));
        setCurrentPage(1);
    };

    // 🌟 دالة إلغاء فلتر العميل
    const clearClientFilter = () => {
        setClientFilterState({ term: '', results: [], isOpen: false, selectedName: '' });
        setFilters(prev => ({ ...prev, clientId: '' }));
        setCurrentPage(1);
    };

    useEffect(() => {
        if (viewMode !== 'list') return;

        const processTableData = async () => {
            if (!rawCases.length) {
                setTableData([]);
                setTotalFilteredItems(0);
                return;
            }

            let filtered = rawCases;
            if (filters.search) {
                const q = filters.search.toLowerCase();
                filtered = filtered.filter(c => c.case_number.includes(q));
            }
            if (filters.startDate) {
                filtered = filtered.filter(c => c.created_at.substring(0, 10) >= filters.startDate);
            }
            if (filters.endDate) {
                filtered = filtered.filter(c => c.created_at.substring(0, 10) <= filters.endDate);
            }
            if (filters.status !== 'all') {
                filtered = filtered.filter(c => c.case_status === filters.status);
            }
            // 🌟 تطبيق فلتر العميل
            if (filters.clientId) {
                filtered = filtered.filter(c => c.client_id === filters.clientId);
            }

            setTotalFilteredItems(filtered.length);

            const startIndex = (currentPage - 1) * itemsPerPage;
            const pagedCases = filtered.slice(startIndex, startIndex + itemsPerPage);

            let savedCourts = [];
            let savedTypes = [];
            try {
                savedCourts = JSON.parse(localStorage.getItem(`MentraLocal_Courts_${firmId}`) || '[]');
                savedTypes = JSON.parse(localStorage.getItem(`MentraLocal_CaseTypes_${firmId}`) || '[]');

                if (savedCourts.length === 0) {
                    savedCourts = [
                        { id: 1, name: 'محكمة القاهرة الجديدة الابتدائية (التجمع الخامس)' },
                        { id: 2, name: 'محكمة شمال القاهرة الابتدائية (مجمع العباسية)' },
                        { id: 3, name: 'محكمة استئناف القاهرة (دار القضاء العالي)' },
                        { id: 4, name: 'محكمة الأسرة (مجمع محاكم الزنانيري)' },
                        { id: 5, name: 'مجلس الدولة (محكمة القضاء الإداري)' }
                    ];
                    localStorage.setItem(`MentraLocal_Courts_${firmId}`, JSON.stringify(savedCourts));
                }

                if (savedTypes.length === 0) {
                    savedTypes = [
                        { id: 1, name: 'مدني وتعويضات' },
                        { id: 2, name: 'جنح وجنايات' },
                        { id: 3, name: 'أسرة وأحوال شخصية' },
                        { id: 4, name: 'منازعات عمالية' },
                        { id: 5, name: 'قضاء إداري ومجلس دولة' }
                    ];
                    localStorage.setItem(`MentraLocal_CaseTypes_${firmId}`, JSON.stringify(savedTypes));
                }
            } catch(e) {}

            const enrichedCases = await Promise.all(pagedCases.map(async (c) => {
                const client = await window.db.clients.get(c.client_id);
                const court = c.court_id ? savedCourts.find(court => court.id === parseInt(c.court_id)) : null;
                const type = c.case_type_id ? savedTypes.find(type => type.id === parseInt(c.case_type_id)) : null;
                
                return {
                    ...c,
                    client_name: client ? client.name : 'محذوف / غير محدد',
                    court_name: court ? court.name : 'غير محدد',
                    type_name: type ? type.name : 'غير محدد',
                    safe_date: c.created_at ? c.created_at.substring(0, 10) : ''
                };
            }));

            setTableData(enrichedCases);
        };

        processTableData();
    }, [rawCases, filters, currentPage, viewMode]);

    const totalPages = Math.ceil(totalFilteredItems / itemsPerPage) || 1;
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setCurrentPage(1);
    };

    const openAddModal = () => {
        setModalMode('add');
        setEditData(null);
        setIsModalOpen(true);
    };

    const openEditModal = (caseItem) => {
        setModalMode('edit');
        setEditData(caseItem);
        setIsModalOpen(true);
    };

    const openSessionsView = (caseItem) => {
        setSelectedCaseForSessions(caseItem);
        setViewMode('sessions');
    };

    const handleDelete = async (id) => {
        if (confirm("هل أنت متأكد من حذف هذه القضية نهائياً؟ سيتم حذف جلساتها المرتبطة أيضاً.")) {
            try {
                await window.db.cases.delete(id);
                const sessions = await window.db.agenda_sessions.where('case_id').equals(id).toArray();
                const sessionIds = sessions.map(s => s.id);
                if(sessionIds.length > 0) await window.db.agenda_sessions.bulkDelete(sessionIds);
                
                if (tableData.length === 1 && currentPage > 1) setCurrentPage(prev => prev - 1);
                showToast("تم الحذف بنجاح", "success");
            } catch (error) { showToast("فشل الحذف", "error"); }
        }
    };

    if (viewMode === 'sessions' && selectedCaseForSessions) {
        return (
            <window.CaseSessionsView 
                selectedCase={selectedCaseForSessions} 
                onBack={() => setViewMode('list')} 
                showToast={showToast} 
            />
        );
    }

    return (
        <div className="space-y-6 animate-view pb-8">
            <window.CasesHeader 
                filters={filters} 
                handleFilterChange={handleFilterChange} 
                openAddModal={openAddModal} 
                totalFilteredItems={totalFilteredItems}
                clientFilterState={clientFilterState}           // 🌟 تمرير حالة العميل
                handleClientFilterSearch={handleClientFilterSearch} // 🌟 تمرير دالة البحث
                selectClientForFilter={selectClientForFilter}   // 🌟 تمرير دالة الاختيار
                clearClientFilter={clearClientFilter}           // 🌟 تمرير دالة الإلغاء
            />

            <window.CasesList 
                tableData={tableData} 
                openEditModal={openEditModal} 
                handleDelete={handleDelete} 
                openSessionsView={openSessionsView} 
            />

            <window.CasesPagination 
                totalFilteredItems={totalFilteredItems} 
                itemsPerPage={itemsPerPage} 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
                totalPages={totalPages} 
            />

            <window.CasesPromo />

            {isModalOpen && (
                <window.CaseAddModal 
                    firmId={firmId} 
                    showToast={showToast} 
                    modalMode={modalMode} 
                    editData={editData} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
};