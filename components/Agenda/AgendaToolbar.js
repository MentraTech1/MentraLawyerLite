// المسار: components/Agenda/AgendaToolbar.js

window.AgendaToolbar = function({ activeTab, setActiveTab, allSessions, setIsAddModalOpen, searchTerm, setSearchTerm }) {
    const todayStr = new Date().toISOString().split('T')[0];
    
    return (
        <div className="bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
            
            {/* الصف الأول: التبويبات وزر الإضافة */}
            <div className="flex flex-col xl:flex-row justify-between items-center gap-3 md:gap-4">
                <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full xl:w-auto snap-x pb-1">
                    <button 
                        onClick={() => setActiveTab('today')} 
                        className={`snap-center flex-shrink-0 px-4 md:px-5 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'today' ? 'bg-[#1E3A8A] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        جلسات اليوم 
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${activeTab === 'today' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'}`}>
                            {allSessions.filter(s => s.session_date === todayStr && s.status !== 'completed').length}
                        </span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('upcoming')} 
                        className={`snap-center flex-shrink-0 px-4 md:px-5 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'upcoming' ? 'bg-[#1E3A8A] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        القادمة
                    </button>
                    <button 
                        onClick={() => setActiveTab('past')} 
                        className={`snap-center flex-shrink-0 px-4 md:px-5 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'past' ? 'bg-[#1E3A8A] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        السجل والقرارات
                    </button>
                    <button 
                        onClick={() => setActiveTab('calendar')} 
                        className={`snap-center flex-shrink-0 px-4 md:px-5 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'calendar' ? 'bg-[#D4AF37] text-[#1E3A8A] shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        <i className="fas fa-calendar-alt"></i> التقويم
                    </button>
                </div>
                
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full xl:w-auto bg-gradient-to-l from-[#D4AF37] to-yellow-500 hover:to-yellow-600 text-white px-5 py-3 rounded-xl md:rounded-2xl text-sm font-black shadow-lg shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
                >
                    <i className="fas fa-plus"></i> إدراج جلسة
                </button>
            </div>

            {/* الصف الثاني: شريط البحث الشامل */}
            <div className="relative w-full">
                <input 
                    type="text" 
                    placeholder="بحث شامل عن جلسة (برقم القضية، اسم الموكل، أو القرار)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#D4AF37] focus:bg-white rounded-xl py-3 px-12 text-sm font-bold text-[#1E3A8A] outline-none transition-all"
                />
                <i className={`fas ${searchTerm ? 'fa-search-plus text-[#D4AF37]' : 'fa-search text-slate-400'} absolute right-4 top-1/2 -translate-y-1/2 text-lg transition-colors`}></i>
                
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm('')} 
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>

        </div>
    );
};