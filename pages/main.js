// المسار: pages/main.js

window.Module_Main = function(props) {
    const { useState, useEffect } = React;
    const [componentsLoaded, setComponentsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDependenciesAndComponents = async () => {
            try {
                // تحميل مكتبة Chart.js إذا لم تكن موجودة
                if (!window.Chart) {
                    await new Promise((resolve, reject) => {
                        const chartScript = document.createElement('script');
                        chartScript.src = 'assets/chart.js';
                        chartScript.onload = resolve;
                        chartScript.onerror = () => reject(new Error('فشل تحميل مكتبة الرسوم البيانية'));
                        document.head.appendChild(chartScript);
                    });
                }

                const filesToLoad = [
                    'components/Main/DashboardFilters.js',
                    'components/Main/DashboardStats.js',
                    'components/Main/FinancialChart.js',     // ملف جديد
                    'components/Main/UpcomingSessions.js',
                    'components/Main/ExpiringPOAs.js',       // ملف جديد
                    'components/Main/LatestRecords.js',      // ملف جديد
                    'components/Main/PromoBanner.js',
                    'components/Main/Module_Main_Container.js'
                ];

                for (const file of filesToLoad) {
                    const compName = file.split('/').pop().split('.')[0];
                    if (window[compName]) continue;
                    
                    const res = await fetch(`${file}?v=${Date.now()}`);
                    if (!res.ok) throw new Error(`تعذر تحميل: ${file}`);
                    
                    const rawScript = await res.text();
                    const compiled = window.Babel.transform(rawScript, { presets: ['react'] }).code;
                    
                    const scriptEl = document.createElement('script');
                    scriptEl.text = compiled;
                    document.body.appendChild(scriptEl);
                }
                setComponentsLoaded(true);
            } catch (err) {
                setError(err.message);
            }
        };

        loadDependenciesAndComponents();
    }, []);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-rose-50 rounded-3xl border border-rose-200">
                <i className="fas fa-exclamation-triangle text-4xl text-rose-500 mb-4"></i>
                <span className="text-rose-700 font-bold text-lg">خطأ في تحميل الشاشة الرئيسية:</span>
                <span className="text-rose-500 mt-2 text-sm">{error}</span>
            </div>
        );
    }

    if (!componentsLoaded || !window.Module_Main_Container) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <i className="fas fa-chart-pie fa-spin text-5xl text-[#1E3A8A] mb-4"></i>
                <span className="text-slate-500 font-bold text-lg">جاري تجهيز لوحة القيادة...</span>
            </div>
        );
    }

    return React.createElement(window.Module_Main_Container, props);
};