// المسار: pages/main.js

window.Module_Main = function(props) {
    const { useState, useEffect } = React;
    const [componentsLoaded, setComponentsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadDependenciesAndComponents = async () => {
            try {
                // 1. التأكد من تحميل مكتبة Chart.js أولاً
                if (!window.Chart) {
                    await new Promise((resolve, reject) => {
                        const chartScript = document.createElement('script');
                        chartScript.src = 'assets/chart.js';
                        chartScript.onload = resolve;
                        chartScript.onerror = () => reject(new Error('فشل تحميل مكتبة الرسوم البيانية (chart.js)'));
                        document.head.appendChild(chartScript);
                    });
                }

                // 2. قائمة المكونات التابعة للشاشة الرئيسية
                const filesToLoad = [
                    'components/Main/DashboardFilters.js',
                    'components/Main/DashboardStats.js',
                    'components/Main/FinancialChart.js',
                    'components/Main/UpcomingSessions.js',
                    'components/Main/ExpiringPOAs.js',
                    'components/Main/LatestRecords.js',
                    'components/Main/PromoBanner.js',
                    'components/Main/Module_Main_Container.js'
                ];

                const isElectron = typeof window !== 'undefined' && typeof window.require !== 'undefined';

                // 3. تحميل المكونات ومعالجتها
                for (const file of filesToLoad) {
                    const compName = file.split('/').pop().split('.')[0];
                    
                    // إذا كان المكون محملاً بالفعل في الذاكرة نتخطاه
                    if (window[compName]) continue;
                    
                    let rawScript = "";

                    if (isElectron) {
                        const fs = window.require('fs');
                        const path = window.require('path');
                        let basePath = window.location.pathname;
                        if (process.platform === 'win32' && basePath.startsWith('/')) {
                            basePath = basePath.substring(1);
                        }
                        const dirPath = path.dirname(decodeURI(basePath));
                        const filePath = path.join(dirPath, file);

                        if (!fs.existsSync(filePath)) throw new Error(`الملف غير موجود محلياً: ${file}`);
                        rawScript = fs.readFileSync(filePath, 'utf-8');
                    } else {
                        // طلب الملف بمسار ثابت ليعمل مع الـ Cache أوفلاين بدون إنترنت
                        const res = await fetch(file);
                        if (!res.ok) throw new Error(`تعذر تحميل المكون: ${file}`);
                        rawScript = await res.text();
                    }

                    // تنظيف أي تعريفات مكررة لـ React hooks لمنع التعارض في النطاق العام
                    const sanitizedScript = rawScript.replace(/(?:const|let|var)\s*\{[^}]*\}\s*=\s*(?:React|Dexie)[^;\n]*;?/g, "");

                    // تحويل الكود من JSX إلى JS متوافق
                    const compiled = window.Babel.transform(sanitizedScript, { presets: ['react'] }).code;
                    
                    const scriptEl = document.createElement('script');
                    scriptEl.type = 'text/javascript';
                    scriptEl.text = compiled;
                    document.body.appendChild(scriptEl);
                }

                if (isMounted) {
                    setComponentsLoaded(true);
                }
            } catch (err) {
                console.error("Main Module Load Error:", err);
                if (isMounted) {
                    setError(err.message);
                }
            }
        };

        loadDependenciesAndComponents();

        return () => {
            isMounted = false;
        };
    }, []);

    // شاشة الخطأ في حالة تعذر تحميل الملفات
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-rose-50 rounded-3xl border border-rose-200 text-center max-w-xl mx-auto my-10 shadow-sm animate-view">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-inner">
                    <i className="fas fa-exclamation-triangle"></i>
                </div>
                <h3 className="text-rose-800 font-black text-lg mb-2">تعذر تجهيز لوحة التحكم</h3>
                <p className="text-rose-600 text-xs md:text-sm font-bold mb-4 leading-relaxed">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition shadow-md shadow-rose-600/20 active:scale-95"
                >
                    <i className="fas fa-rotate-right ml-1"></i> إعادة المحاولة
                </button>
            </div>
        );
    }

    // شاشة التحميل الأولية
    if (!componentsLoaded || !window.Module_Main_Container) {
        return (
            <div className="flex flex-col items-center justify-center h-[65vh] text-center">
                <div className="relative mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-900/20">
                        <i className="fas fa-chart-pie animate-pulse"></i>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#D4AF37] rounded-full border-2 border-white flex items-center justify-center text-[10px] text-slate-900">
                        <i className="fas fa-sync fa-spin"></i>
                    </div>
                </div>
                <h4 className="text-slate-800 font-black text-lg">جاري تجهيز لوحة القيادة</h4>
                <p className="text-slate-400 text-xs font-bold mt-1">تحديث الإحصائيات والأجندة والمؤشرات...</p>
            </div>
        );
    }

    // 🌟 المفتاح هنا: تمرير key={props.firmId} يضمن إعادة بناء الحاوية بالكامل عند تبديل المكتب 🌟
    return React.createElement(window.Module_Main_Container, {
        ...props,
        key: `firm-container-${props.firmId || 'default'}`
    });
};