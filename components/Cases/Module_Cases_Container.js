// المسار: components/Cases/Module_Cases_Container.js

window.Module_Cases_Container = function({ firmId, showToast }) {
    const { useState, useEffect } = React;
    
    // حالات النوافذ
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editData, setEditData] = useState(null);
    
    // حالات الفلترة والجدول
    const [filters, setFilters] = useState({ search: '', startDate: '', endDate: '', status: 'all' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [tableData, setTableData] = useState([]);
    const [totalFilteredItems, setTotalFilteredItems] = useState(0);

    // جلب القضايا الخام (تتحدث تلقائياً عند أي تغيير بفضل liveQuery)
    const rawCases = window.useLiveQuery(() => window.db.cases.where('firm_id').equals(firmId).reverse().toArray(), [firmId]) || [];

    useEffect(() => {
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

            setTotalFilteredItems(filtered.length);

            const startIndex = (currentPage - 1) * itemsPerPage;
            const pagedCases = filtered.slice(startIndex, startIndex + itemsPerPage);

            const enrichedCases = await Promise.all(pagedCases.map(async (c) => {
                const client = await window.db.clients.get(c.client_id);
                const court = c.court_id ? await window.db.global_courts.get(c.court_id) : null;
                const type = c.case_type_id ? await window.db.global_case_types.get(c.case_type_id) : null;
                
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
    }, [rawCases, filters, currentPage]);

    const totalPages = Math.ceil(totalFilteredItems / itemsPerPage) || 1;
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);

    // دوال التحكم
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

    const handleDelete = async (id) => {
        if (confirm("هل أنت متأكد من حذف هذه القضية نهائياً؟")) {
            try {
                await window.db.cases.delete(id);
                if (tableData.length === 1 && currentPage > 1) setCurrentPage(prev => prev - 1);
                showToast("تم الحذف بنجاح", "success");
            } catch (error) { showToast("فشل الحذف", "error"); }
        }
    };

    return (
        <div className="space-y-6 animate-view pb-8">
            <window.CasesHeader 
                filters={filters} 
                handleFilterChange={handleFilterChange} 
                openAddModal={openAddModal} 
                totalFilteredItems={totalFilteredItems} 
            />

            <window.CasesList 
                tableData={tableData} 
                openEditModal={openEditModal} 
                handleDelete={handleDelete} 
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