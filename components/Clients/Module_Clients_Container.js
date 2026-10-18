// المسار: components/Clients/Module_Clients_Container.js

window.Module_Clients_Container = function({ firmId, showToast }) {
    const { useState, useEffect } = React;

    const [currentView, setCurrentView] = useState('list'); // 'list' or 'details'
    const [selectedClientForDetails, setSelectedClientForDetails] = useState(null);

    const [activeTab, setActiveTab] = useState('clients');
    const [refreshTrigger, setRefreshTrigger] = useState(0); 

    // الترقيم والفلاتر
    const [filters, setFilters] = useState({ search: '', startDate: '', endDate: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // حالة البيانات
    const [tableData, setTableData] = useState([]);
    const [totalFilteredItems, setTotalFilteredItems] = useState(0);
    const [stats, setStats] = useState({ clientsCount: 0, poasCount: 0, activePoas: 0 });

    // النوافذ المنبثقة
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [clientModalMode, setClientModalMode] = useState('add');
    const [editClientData, setEditClientData] = useState(null);

    const [isPoaModalOpen, setIsPoaModalOpen] = useState(false);
    const [selectedClientForPoa, setSelectedClientForPoa] = useState(null);

    const dbTriggerClients = window.useLiveQuery(() => window.db ? window.db.clients.where('firm_id').equals(firmId).count() : 0, [firmId]);
    const dbTriggerPoas = window.useLiveQuery(() => window.db ? window.db.power_of_attorneys.count() : 0, []);

    useEffect(() => {
        const fetchAndProcessData = async () => {
            if (!window.db) return;

            let rawClients = await window.db.clients.where('firm_id').equals(firmId).reverse().toArray();
            const clientIds = rawClients.map(c => c.id);
            const clientsMap = new Map(rawClients.map(c => [c.id, c.name]));

            let rawPoas = await window.db.power_of_attorneys.filter(p => clientIds.includes(p.client_id)).reverse().toArray();

            const today = new Date().toISOString().split('T')[0];
            const activePoasCount = rawPoas.filter(p => !p.expiry_date || p.expiry_date >= today).length;
            setStats({ clientsCount: rawClients.length, poasCount: rawPoas.length, activePoas: activePoasCount });

            let filteredData = [];
            
            if (activeTab === 'clients') {
                filteredData = rawClients;
                if (filters.search) {
                    const q = filters.search.toLowerCase();
                    filteredData = filteredData.filter(c => c.name.toLowerCase().includes(q) || (c.phone && c.phone.includes(q)) || (c.id_number && c.id_number.includes(q)));
                }
                if (filters.startDate) filteredData = filteredData.filter(c => (c.created_at || '2000-01-01').substring(0, 10) >= filters.startDate);
                if (filters.endDate) filteredData = filteredData.filter(c => (c.created_at || '2000-01-01').substring(0, 10) <= filters.endDate);
            } 
            else if (activeTab === 'poas') {
                filteredData = rawPoas.map(p => ({ ...p, client_name: clientsMap.get(p.client_id) || 'موكل محذوف' }));
                if (filters.search) {
                    const q = filters.search.toLowerCase();
                    filteredData = filteredData.filter(p => p.poa_number.includes(q) || p.client_name.toLowerCase().includes(q) || (p.poa_type && p.poa_type.includes(q)));
                }
                if (filters.startDate) filteredData = filteredData.filter(p => (p.poa_date || '2000-01-01') >= filters.startDate);
                if (filters.endDate) filteredData = filteredData.filter(p => (p.poa_date || '2000-01-01') <= filters.endDate);
            }

            setTotalFilteredItems(filteredData.length);

            const startIndex = (currentPage - 1) * itemsPerPage;
            const pagedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

            if (activeTab === 'clients') {
                const enriched = await Promise.all(pagedData.map(async (client) => {
                    const caseCount = await window.db.cases.filter(c => String(c.client_id) === String(client.id)).count();
                    const poaCount = await window.db.power_of_attorneys.filter(p => String(p.client_id) === String(client.id)).count();
                    return { ...client, cases_count: caseCount, poas_count: poaCount, safe_date: client.created_at ? client.created_at.substring(0, 10) : '' };
                }));
                setTableData(enriched);
            } else {
                setTableData(pagedData);
            }
        };

        fetchAndProcessData();
    }, [dbTriggerClients, dbTriggerPoas, refreshTrigger, filters, currentPage, activeTab, firmId]);

    const totalPages = Math.ceil(totalFilteredItems / itemsPerPage) || 1;
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);

    const switchTab = (tab) => {
        if (activeTab === tab) return;
        setTableData([]);
        setCurrentPage(1);
        setFilters({ search: '', startDate: '', endDate: '' });
        setActiveTab(tab);
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setCurrentPage(1);
    };

    const openAddClientModal = () => {
        setClientModalMode('add');
        setEditClientData(null);
        setIsClientModalOpen(true);
    };

    const openEditClientModal = (client) => {
        setClientModalMode('edit');
        setEditClientData(client);
        setIsClientModalOpen(true);
    };

    const handleDeleteClient = async (client) => {
        const checkCaseCount = await window.db.cases.filter(c => String(c.client_id) === String(client.id)).count();
        if (checkCaseCount > 0) return alert(`⚠️ لا يمكن حذف هذا الموكل لأن لديه (${checkCaseCount}) قضايا.`);
        if (confirm(`هل أنت متأكد من حذف الموكل "${client.name}" نهائياً؟ (سيتم حذف توكيلاته أيضاً)`)) {
            const poas = await window.db.power_of_attorneys.filter(p => String(p.client_id) === String(client.id)).toArray();
            for(let p of poas) await window.db.power_of_attorneys.delete(p.id);
            await window.db.clients.delete(client.id);
            
            if (currentView === 'details' && selectedClientForDetails?.id === client.id) {
                setCurrentView('list');
                setSelectedClientForDetails(null);
            }

            if (tableData.length === 1 && currentPage > 1) setCurrentPage(p => p - 1);
            setRefreshTrigger(p => p + 1);
            showToast("تم الحذف بنجاح", "success");
        }
    };

    const openPoaModal = async (record) => {
        let targetClient = record;
        if (!targetClient.name) {
            targetClient = await window.db.clients.get(record.client_id);
        }
        setSelectedClientForPoa(targetClient);
        setIsPoaModalOpen(true);
    };

    const handleOpenClientDetails = (client) => {
        setSelectedClientForDetails(client);
        setCurrentView('details');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="pb-8">
            {currentView === 'details' && selectedClientForDetails && window.ClientDetailsSubPage ? (
                <window.ClientDetailsSubPage 
                    client={selectedClientForDetails}
                    firmId={firmId}
                    showToast={showToast}
                    onBack={() => { setCurrentView('list'); setSelectedClientForDetails(null); }}
                    onEditClient={(c) => openEditClientModal(c)}
                    onOpenPoas={(c) => openPoaModal(c)}
                    onDeleteClient={(c) => handleDeleteClient(c)}
                />
            ) : (
                <div className="space-y-6 animate-view">
                    {window.ClientsStats && <window.ClientsStats stats={stats} />}

                    {window.ClientsHeader && (
                        <window.ClientsHeader 
                            activeTab={activeTab} 
                            switchTab={switchTab} 
                            filters={filters} 
                            handleFilterChange={handleFilterChange} 
                            openAddClientModal={openAddClientModal} 
                        />
                    )}

                    {window.ClientsList && (
                        <window.ClientsList 
                            activeTab={activeTab} 
                            tableData={tableData} 
                            openEditClientModal={openEditClientModal} 
                            handleDeleteClient={handleDeleteClient} 
                            openPoaModal={openPoaModal}
                            onOpenClientDetails={handleOpenClientDetails} 
                        />
                    )}

                    {window.ClientsPagination && (
                        <window.ClientsPagination 
                            totalFilteredItems={totalFilteredItems} 
                            itemsPerPage={itemsPerPage} 
                            currentPage={currentPage} 
                            setCurrentPage={setCurrentPage} 
                            totalPages={totalPages} 
                        />
                    )}

                    {window.ClientsPromo && <window.ClientsPromo />}
                </div>
            )}

            {isClientModalOpen && window.ClientModal && (
                <window.ClientModal 
                    firmId={firmId} 
                    showToast={showToast} 
                    modalMode={clientModalMode} 
                    editData={editClientData} 
                    onClose={() => setIsClientModalOpen(false)} 
                    onSuccess={async () => {
                        setRefreshTrigger(p => p + 1);
                        if (editClientData && selectedClientForDetails?.id === editClientData.id) {
                            const updated = await window.db.clients.get(editClientData.id);
                            if (updated) setSelectedClientForDetails(updated);
                        }
                    }} 
                />
            )}

            {isPoaModalOpen && selectedClientForPoa && window.PoaModal && (
                <window.PoaModal 
                    client={selectedClientForPoa} 
                    showToast={showToast} 
                    onClose={() => setIsPoaModalOpen(false)} 
                    onSuccess={() => setRefreshTrigger(p => p + 1)} 
                />
            )}
        </div>
    );
};