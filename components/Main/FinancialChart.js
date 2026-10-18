// المسار: components/Main/FinancialChart.js

window.FinancialChart = function({ data, isLoading, firmId }) {
    const { useEffect, useRef } = React;
    const chartRef = useRef(null);

    const revenue = Number(data?.revenue) || 0;
    const expenses = Number(data?.expenses) || 0;
    const profit = Number(data?.profit) || 0;

    useEffect(() => {
        if (isLoading || !window.Chart || !chartRef.current) return;

        // 🛡️ الحل الحاسم: تدمير أي نسخة سابقة مسجلة في Chart.js لهذا الـ Canvas
        const existingChart = window.Chart.getChart(chartRef.current);
        if (existingChart) {
            existingChart.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        const newChart = new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['الإيرادات', 'المصروفات', 'صافي الربح'],
                datasets: [{
                    label: 'إحصائيات مالية (ج.م)',
                    data: [revenue, expenses, profit],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.85)',
                        'rgba(244, 63, 94, 0.85)',
                        profit >= 0 ? 'rgba(212, 175, 55, 0.85)' : 'rgba(239, 68, 68, 0.85)'
                    ],
                    borderColor: [
                        'rgb(16, 185, 129)',
                        'rgb(244, 63, 94)',
                        profit >= 0 ? 'rgb(212, 175, 55)' : 'rgb(239, 68, 68)'
                    ],
                    borderWidth: 1.5,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 400 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        rtl: true,
                        titleFont: { family: 'Cairo', weight: 'bold' },
                        bodyFont: { family: 'Cairo' },
                        callbacks: {
                            label: function(c) {
                                return ` ${c.parsed.y.toLocaleString('ar-EG')} ج.م`;
                            }
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { font: { family: 'Cairo' } } },
                    x: { ticks: { font: { family: 'Cairo', weight: 'bold' } } }
                }
            }
        });

        return () => {
            if (newChart) newChart.destroy();
        };
    }, [revenue, expenses, profit, isLoading, firmId]);

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <i className="fas fa-chart-line"></i>
                    </div>
                    <h3 className="font-bold text-[#1E3A8A]">الملخص المالي للمكتب</h3>
                </div>
                {!isLoading && (
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${profit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {profit >= 0 ? 'صافي إيجابي' : 'عجز مالي'}
                    </span>
                )}
            </div>

            {isLoading ? (
                <div className="h-[250px] flex items-center justify-center text-slate-400">
                    <i className="fas fa-circle-notch fa-spin text-2xl text-[#D4AF37]"></i>
                </div>
            ) : (
                <div className="relative h-[250px] w-full">
                    {/* key={`${firmId}`} يضمن إعادة إنشاء الـ Canvas نظيفاً 100% لكل مكتب */}
                    <canvas key={`chart-canvas-${firmId}`} ref={chartRef}></canvas>
                </div>
            )}
        </div>
    );
};