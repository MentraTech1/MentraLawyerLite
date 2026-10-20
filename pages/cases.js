// المسار: pages/cases.js

window.Module_Cases = function(props) {
    const { useState, useEffect } = React;
    const [componentsLoaded, setComponentsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadComponents = async () => {
            const filesToLoad = [
                'components/Cases/CasesHeader.js',
                'components/Cases/CasesList.js',
                'components/Cases/CasesPagination.js',
                'components/Cases/CasesPromo.js',
                'components/Cases/CaseAddModal.js',
                'components/Cases/CaseSessionAddEditModal.js', // نافذة اضافة وتعديل الجلسة
                'components/Cases/CaseSessionsView.js',        // 🌟 الشاشة الكاملة الجديدة
                'components/Cases/Module_Cases_Container.js'
            ];

            try {
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

        loadComponents();
    }, []);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-rose-50 rounded-3xl border border-rose-200">
                <i className="fas fa-exclamation-triangle text-4xl text-rose-500 mb-4"></i>
                <span className="text-rose-700 font-bold text-lg">خطأ في تحميل القضايا:</span>
                <span className="text-rose-500 mt-2 text-sm">{error}</span>
            </div>
        );
    }

    if (!componentsLoaded || !window.Module_Cases_Container) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <i className="fas fa-gavel fa-bounce text-5xl text-[#1E3A8A] mb-4"></i>
                <span className="text-slate-500 font-bold text-lg">جاري تجهيز سجل القضايا...</span>
            </div>
        );
    }

    return React.createElement(window.Module_Cases_Container, props);
};