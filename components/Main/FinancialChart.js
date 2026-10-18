// المسار: components/Main/FinancialChart.js

window.FinancialChart = function({ data, isLoading }) {
    const { useEffect, useRef } = React;
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (isLoading || !window.Chart || !chartRef.current) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['الإيرادات', 'المصروفات', 'صافي الربح'],
                datasets: [{
                    label: 'إحصائيات مالية (بالعملة المحلية)',
                    data: [data.revenue, data.expenses, data.profit],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)', // Emerald للإيرادات
                        'rgba(244, 63, 94, 0.8)',  // Rose للمصروفات
                        'rgba(212, 175, 55, 0.8)'  // Gold للربح
                    ],
                    borderColor: [
                        'rgb(16, 185, 129)',
                        'rgb(244, 63, 94)',
                        'rgb(212, 175, 55)'
                    ],
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        titleFont: { family: 'Cairo' },
                        bodyFont: { family: 'Cairo', size: 14 }
                    }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { font: { family: 'Cairo' } } },
                    x: { ticks: { font: { family: 'Cairo', weight: 'bold' } } }
                }
            }
        });

        return () => { if(chartInstance.current) chartInstance.current.destroy(); }
    }, [data, isLoading]);

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><i className="fas fa-chart-line"></i></div>
                <h3 className="font-bold text-[#1E3A8A]">الملخص المالي للمكتب</h3>
            </div>
            {isLoading ? (
                <div className="h-[250px] flex items-center justify-center"><i className="fas fa-circle-notch fa-spin text-2xl text-slate-300"></i></div>
            ) : (
                <div className="relative h-[250px] w-full">
                    <canvas ref={chartRef}></canvas>
                </div>
            )}
        </div>
    );
};