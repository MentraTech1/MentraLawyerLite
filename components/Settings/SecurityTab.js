// المسار: components/Settings/SecurityTab.js (النسخة المطورة بذكاء التوليد التلقائي)

window.SecurityTab = function({ showToast }) {
    const { useState, useEffect } = React;
    const [isLoading, setIsLoading] = useState(false);
    const [hasCode, setHasCode] = useState(false); 
    
    const [formData, setFormData] = useState({
        currentPassword: '',
        security_key: ''
    });

    const session = JSON.parse(localStorage.getItem('MentraLocal_Session') || '{}');
    const userId = session.user_id;

    // التحقق مما إذا كان لديه مفتاح بالفعل
    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return;
            const user = await window.db.users.get(userId);
            if (user && user.recovery_code) {
                setHasCode(true);
            }
        };
        fetchUserData();
    }, [userId]);

    // 🚀 دالة توليد المفتاح الذكي (كما في نظام العيادات)
    const generateRandomKey = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let key = '';
        for (let i = 0; i < 12; i++) {
            if (i > 0 && i % 4 === 0) key += '-';
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData({ ...formData, security_key: key });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!formData.security_key.trim()) {
            showToast("الرجاء توليد أو إدخال مفتاح أمان", "error");
            return;
        }

        setIsLoading(true);
        try {
            const user = await window.db.users.get(userId);
            
            // التأكد من هوية المحامي
            if (user.password !== formData.currentPassword) {
                throw new Error("كلمة المرور الحالية غير صحيحة");
            }

            // حفظ المفتاح الاحترافي
            await window.db.users.update(userId, {
                recovery_code: formData.security_key.trim()
            });

            setHasCode(true);
            showToast("تم اعتماد مفتاح الأمان بنجاح", "success");
            setFormData({ currentPassword: '', security_key: '' });

        } catch (error) {
            showToast(error.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 animate-view">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                    <i className="fas fa-shield-halved"></i>
                </div>
                <div>
                    <h3 className="font-black text-xl text-[#1E3A8A]">مفتاح الاستعادة والأمان</h3>
                    <p className="text-slate-500 text-sm font-bold mt-1">
                        يُستخدم لاستعادة الحساب للوصول لبياناتك في حال نسيان كلمة المرور.
                    </p>
                </div>
            </div>

            {hasCode && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl font-bold text-sm mb-6 flex items-start gap-3">
                    <i className="fas fa-check-circle text-lg mt-0.5"></i>
                    <div>
                        <p>مفتاح الأمان مُفعّل لحسابك وجاهز للاستخدام.</p>
                        <p className="text-xs font-semibold mt-1">لإنشاء مفتاح جديد، قم بتوليد رمز جديد وسيتم استبدال القديم.</p>
                    </div>
                </div>
            )}

            {/* 🚀 رسالة التوعية الذكية المأخوذة من نظام العيادات */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-5 flex items-start gap-3 mb-6">
                <i className="fas fa-info-circle text-amber-500 text-xl mt-1 shrink-0"></i>
                <p className="text-xs md:text-sm font-bold text-amber-700 leading-relaxed">
                    نظراً لأن النظام يعمل (Offline) بدون إنترنت، لا توجد إمكانية لاستعادة الباسورد عبر الإيميل أو الهاتف. 
                    لذلك، <strong className="text-amber-900">يجب عليك توليد مفتاح أمان والاحتفاظ به في مكان آمن (في ورقة خارجية)</strong>. في حال نسيان الباسورد، سيطلب منك النظام هذا المفتاح.
                </p>
            </div>

            <form onSubmit={handleSave} className="max-w-2xl space-y-6">
                
                {/* مفتاح الأمان مع زر التوليد */}
                <div>
                    <label className="block text-slate-700 text-sm font-black mb-2">مفتاح الأمان (Recovery Key) <span className="text-rose-500">*</span></label>
                    <div className="flex flex-col md:flex-row gap-3">
                        <input 
                            type="text" 
                            dir="ltr"
                            placeholder="مثال: A1B2-C3D4-E5F6"
                            value={formData.security_key} 
                            onChange={e => setFormData({...formData, security_key: e.target.value.toUpperCase()})} 
                            required
                            className="flex-1 p-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-black tracking-widest text-center text-[#1E3A8A] focus:border-[#D4AF37] outline-none uppercase placeholder:text-sm placeholder:tracking-normal transition" 
                        />
                        <button 
                            type="button" 
                            onClick={generateRandomKey}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-6 py-3.5 rounded-xl transition-colors shrink-0 text-sm flex items-center justify-center gap-2 active:scale-95 border border-slate-200"
                        >
                            <i className="fas fa-random text-[#D4AF37]"></i> توليد تلقائي
                        </button>
                    </div>
                </div>

                {/* تأكيد الهوية */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <label className="block text-slate-700 text-sm font-black mb-2">كلمة المرور الحالية (لتأكيد هويتك) <span className="text-rose-500">*</span></label>
                    <input 
                        type="password" 
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={e => setFormData({...formData, currentPassword: e.target.value})}
                        required
                        dir="ltr"
                        className="w-full p-3 rounded-lg border-2 border-slate-200 focus:border-[#D4AF37] outline-none text-left transition-colors"
                        placeholder="••••••••"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full md:w-auto bg-[#1E3A8A] hover:bg-blue-900 text-white font-black py-4 px-10 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-lock"></i>}
                    اعتماد وحفظ مفتاح الأمان
                </button>
            </form>
        </div>
    );
};