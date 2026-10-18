// المسار: components/Documents/Module_Documents_Container.js

window.Module_Documents_Container = function({ firmId, showToast }) {
    const { useState, useEffect } = React;
    
    // حالات الفلترة والجدول
    const [filters, setFilters] = useState({ search: '', startDate: '', endDate: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; 
    const [tableData, setTableData] = useState([]);
    const [totalFilteredItems, setTotalFilteredItems] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0); 

    // حالات النوافذ المنبثقة
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editData, setEditData] = useState(null);
    const [viewMemo, setViewMemo] = useState(null); 

    const dbTrigger = window.useLiveQuery(() => window.db.case_documents.count(), []);

    // جلب ومعالجة البيانات
    useEffect(() => {
        const fetchAndProcessData = async () => {
            if (!window.db) return;

            let allDocs = await window.db.case_documents.reverse().toArray();
            let filtered = allDocs.filter(d => d.doc_type === 'memo');

            if (filters.search) {
                const q = filters.search.toLowerCase();
                filtered = filtered.filter(d => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q));
            }
            if (filters.startDate) {
                filtered = filtered.filter(d => d.created_at.substring(0, 10) >= filters.startDate);
            }
            if (filters.endDate) {
                filtered = filtered.filter(d => d.created_at.substring(0, 10) <= filters.endDate);
            }

            setTotalFilteredItems(filtered.length);

            const startIndex = (currentPage - 1) * itemsPerPage;
            const pagedDocs = filtered.slice(startIndex, startIndex + itemsPerPage);

            const enrichedDocs = await Promise.all(pagedDocs.map(async (doc) => {
                const caseObj = await window.db.cases.get(doc.case_id);
                if (caseObj && caseObj.firm_id === firmId) {
                    return { ...doc, case_number: caseObj.case_number, safe_date: doc.created_at.substring(0, 10) };
                }
                return null;
            }));

            setTableData(enrichedDocs.filter(d => d !== null));
        };

        fetchAndProcessData();
    }, [dbTrigger, filters, currentPage, firmId, refreshTrigger]); 

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
        setIsAddModalOpen(true);
    };

    const openEditModal = (doc) => {
        setModalMode('edit');
        setEditData(doc);
        setIsAddModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm("هل أنت متأكد من حذف هذه المذكرة نهائياً؟")) {
            try {
                await window.db.case_documents.delete(id);
                if (tableData.length === 1 && currentPage > 1) setCurrentPage(prev => prev - 1);
                setRefreshTrigger(prev => prev + 1); 
                showToast("تم الحذف بنجاح", "success");
            } catch (error) { showToast("فشل الحذف", "error"); }
        }
    };

    return (
        <div className="space-y-6 animate-view pb-8">
            <window.DocumentsHeader 
                filters={filters} 
                handleFilterChange={handleFilterChange} 
                openAddModal={openAddModal} 
                totalFilteredItems={totalFilteredItems} 
            />

            <window.DocumentsList 
                tableData={tableData} 
                openEditModal={openEditModal} 
                handleDelete={handleDelete} 
                setViewMemo={setViewMemo} 
            />

            <window.DocumentsPagination 
                totalFilteredItems={totalFilteredItems} 
                itemsPerPage={itemsPerPage} 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
                totalPages={totalPages} 
            />

            <window.DocumentsPromo />

            {isAddModalOpen && (
                <window.DocumentAddModal 
                    firmId={firmId} 
                    showToast={showToast} 
                    modalMode={modalMode} 
                    editData={editData} 
                    onClose={() => setIsAddModalOpen(false)} 
                    onSuccess={() => setRefreshTrigger(p => p + 1)} 
                />
            )}

            {viewMemo && (
                <window.DocumentViewModal 
                    viewMemo={viewMemo} 
                    onClose={() => setViewMemo(null)} 
                />
            )}
        </div>
    );
};