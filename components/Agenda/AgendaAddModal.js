// المسار: components/Agenda/AgendaAddModal.js

window.AgendaAddModal = function({ firmId, showToast, setIsAddModalOpen }) {
    const { useState } = React;

    const [formData, setFormData] = useState({
        case_id: '',
        session_date: new Date().toISOString().split('T')[0],
        notes: '',
        status: 'upcoming'
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedCaseDisplay, setSelectedCaseDisplay] = useState(null);

    const handleSearchCase = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        
        if (!term.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const results = await window.db.cases
                .where('firm_id').equals(firmId)
                .filter(c => c.case_number.includes(term))
                .limit(10)
                .toArray();

            const clientIds = [...new Set(results.map(c => c.client_id))];
            const matchingClients = await window.db.clients.where('id').anyOf(clientIds).toArray();

            const enrichedResults = results.map(c => {
                const client = matchingClients.find(cl => cl.id === c.client_id);
                return { ...c, client_name: client ? client.name : 'بدون موكل' };
            });

            setSearchResults(enrichedResults);
        } catch (error) {
            console.error("Search Error:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const selectCase = (caseItem) => {
        setFormData({ ...formData, case_id: caseItem.id });
        setSelectedCaseDisplay(`قضية رقم: ${caseItem.case_number} - (${caseItem.client_name})`);
        setSearchTerm('');
        setSearchResults([]);
    };

    const clearSelectedCase = () => {
        setFormData({ ...formData, case_id: '' });
        setSelectedCaseDisplay(null);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSession = async (e) => {
        e.preventDefault();
        if (!formData.case_id || !formData.session_date) {
            showToast("الرجاء اختيار القضية وتاريخ الجلسة", "error");
            return;
        }

        try {
            await window.db.agenda_sessions.add({
                case_id: parseInt(formData.case_id),
                session_date: formData.session_date,
                notes: formData.notes,
                status: 'upcoming'
            });
            showToast("تمت إضافة الجلسة بنجاح", "success");
            setIsAddModalOpen(false);
        } catch (error) {
            showToast("حدث خطأ أثناء إضافة الجلسة", "error");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-view">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 relative max-h-[90vh] flex flex-col">
                <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-900 p-5 md:p-6 text-center relative shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center text-white text-lg md:text-xl mx-auto mb-2 backdrop-blur-md">
                        <i className="fas fa-calendar-plus"></i>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-white tracking-wide">إدراج جلسة جديدة</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="absolute left-4 top-4 text-white/50 hover:text-white transition text-lg bg-white/5 w-8 h-8 rounded-full flex items-center justify-center">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <div className="p-5 md:p-6 overflow-y-auto hide-scrollbar flex-1">
                    <form onSubmit={handleAddSession} className="space-y-4 md:space-y-5">
                        
                        <div className="relative">
                            <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">القضية المرتبطة <span className="text-rose-500">*</span></label>
                            
                            {selectedCaseDisplay ? (
                                <div className="bg-emerald-50 border-2 border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                                    <span className="text-xs md:text-sm font-bold text-emerald-800 flex items-center gap-2">
                                        <i className="fas fa-check-circle text-emerald-500"></i> {selectedCaseDisplay}
                                    </span>
                                    <button type="button" onClick={clearSelectedCase} className="text-rose-500 hover:bg-rose-100 w-7 h-7 rounded-lg flex items-center justify-center transition-colors">
                                        <i className="fas fa-times text-sm"></i>
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={searchTerm}
                                        onChange={handleSearchCase}
                                        placeholder="اكتب رقم القضية للبحث..." 
                                        className="w-full p-3 pl-10 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-[#D4AF37] focus:bg-white font-bold text-xs md:text-sm text-[#1E3A8A] transition-all"
                                    />
                                    <i className={`fas ${isSearching ? 'fa-spinner fa-spin' : 'fa-search'} absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm`}></i>
                                    
                                    {searchResults.length > 0 && (
                                        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                            {searchResults.map(c => (
                                                <li 
                                                    key={c.id} 
                                                    onClick={() => selectCase(c)}
                                                    className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex flex-col transition-colors"
                                                >
                                                    <span className="font-bold text-[#1E3A8A] text-xs md:text-sm">رقم: {c.case_number}</span>
                                                    <span className="text-[10px] md:text-xs text-slate-500 font-semibold">{c.client_name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">تاريخ الجلسة <span className="text-rose-500">*</span></label>
                            <input 
                                type="date" 
                                name="session_date" 
                                value={formData.session_date} 
                                onChange={handleInputChange} 
                                required 
                                className="w-full p-3 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-[#D4AF37] focus:bg-white font-bold text-xs md:text-sm text-[#1E3A8A] transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">الطلبات / الملاحظات للتذكير</label>
                            <textarea 
                                name="notes" 
                                value={formData.notes} 
                                onChange={handleInputChange} 
                                rows="3" 
                                placeholder="مثال: تقديم مستندات..." 
                                className="w-full p-3 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-[#D4AF37] focus:bg-white font-bold text-xs md:text-sm text-slate-700 resize-none transition-all"
                            ></textarea>
                        </div>

                        <div className="pt-2">
                            <button type="submit" disabled={!formData.case_id} className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white font-black py-3.5 md:py-4 rounded-xl shadow-lg transition-all text-sm md:text-base flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                <i className="fas fa-save"></i> حفظ في الرول
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};