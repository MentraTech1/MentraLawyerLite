// المسار: components/Agenda/AgendaCalendar.js

window.AgendaCalendar = function({ allSessions, onDayClick }) {
    const { useState, useMemo } = React;
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const daysOfWeek = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

    // حساب الجلسات وتجميعها حسب التاريخ
    const sessionsByDate = useMemo(() => {
        const map = {};
        allSessions.forEach(session => {
            if (!map[session.session_date]) {
                map[session.session_date] = [];
            }
            map[session.session_date].push(session);
        });
        return map;
    }, [allSessions]);

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
        setCurrentDate(new Date(newDate));
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const todayStr = new Date().toISOString().split('T')[0];

    // بناء مصفوفة الأيام
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const totalSlots = [...blanks, ...days];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-view mb-6">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
                <button onClick={() => changeMonth(-1)} className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-[#1E3A8A] hover:text-white transition-colors flex items-center justify-center">
                    <i className="fas fa-chevron-right text-sm"></i>
                </button>
                <div className="flex items-center gap-2">
                    <i className="fas fa-calendar-alt text-[#D4AF37] text-xl"></i>
                    <h3 className="text-lg md:text-xl font-black text-[#1E3A8A]">{monthNames[month]} {year}</h3>
                </div>
                <button onClick={() => changeMonth(1)} className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-[#1E3A8A] hover:text-white transition-colors flex items-center justify-center">
                    <i className="fas fa-chevron-left text-sm"></i>
                </button>
            </div>

            {/* Grid */}
            <div className="p-3 md:p-5">
                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                    {daysOfWeek.map(day => (
                        <div key={day} className="text-center text-[10px] md:text-xs font-black text-slate-400 p-1 md:p-2">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {totalSlots.map((day, index) => {
                        if (!day) return <div key={index} className="p-2"></div>;

                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isToday = dateStr === todayStr;
                        const daySessions = sessionsByDate[dateStr] || [];
                        const sessionCount = daySessions.length;
                        const hasPending = daySessions.some(s => s.status !== 'completed');

                        return (
                            <div 
                                key={index} 
                                onClick={() => sessionCount > 0 && onDayClick(dateStr, daySessions)}
                                className={`relative p-2 md:p-4 rounded-xl border flex flex-col items-center justify-center min-h-[50px] md:min-h-[70px] transition-all
                                    ${sessionCount > 0 ? 'cursor-pointer hover:border-[#D4AF37] hover:shadow-md' : 'border-transparent bg-transparent'}
                                    ${isToday ? 'border-[#1E3A8A] bg-blue-50/30' : 'border-slate-100 bg-slate-50/50'}
                                `}
                            >
                                <span className={`text-xs md:text-sm font-bold ${isToday ? 'text-[#1E3A8A]' : 'text-slate-600'}`}>{day}</span>
                                
                                {sessionCount > 0 && (
                                    <div className="absolute bottom-1 md:bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1">
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-black flex items-center gap-1 ${hasPending ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            {sessionCount} <i className="fas fa-gavel text-[8px]"></i>
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};