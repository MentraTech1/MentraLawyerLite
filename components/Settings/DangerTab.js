// المسار: components/Settings/DangerTab.js

window.DangerTab = function({ handleFactoryReset }) {
    return (
        <div className="p-4 md:p-8 animate-view">
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl md:rounded-3xl p-5 md:p-8 text-center relative overflow-hidden">
                <i className="fas fa-skull-crossbones absolute -right-6 -bottom-6 md:-right-10 md:-bottom-10 text-7xl md:text-9xl text-rose-100 opacity-50"></i>
                <div className="relative z-10">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white text-rose-600 rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-lg mx-auto mb-4 md:mb-6">
                        <i className="fas fa-radiation"></i>
                    </div>
                    <h3 className="font-black text-xl md:text-2xl text-rose-700 mb-2 md:mb-3">إعادة ضبط المصنع</h3>
                    <p className="text-xs md:text-sm font-bold text-rose-600 max-w-lg mx-auto leading-relaxed mb-6 md:mb-8">
                        هذا الزر سيقوم بمسح قاعدة البيانات من هذا المتصفح بشكل كامل ونهائي. سيتم مسح (المكتب، القضايا، الموكلين، والجلسات). لا تفعل ذلك إلا إذا أردت البدء من الصفر.
                    </p>
                    <button onClick={handleFactoryReset} className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-black px-6 md:px-8 py-3.5 md:py-4 rounded-xl shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2 mx-auto active:scale-95 text-xs md:text-sm">
                        <i className="fas fa-trash-alt"></i> مسح جميع بيانات مكتبي نهائياً
                    </button>
                </div>
            </div>
        </div>
    );
};