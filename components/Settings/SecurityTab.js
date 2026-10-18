// المسار: components/Settings/SecurityTab.js

window.SecurityTab = function({ showToast }) {
    const { useState, useEffect } = React;
    const [isLoading, setIsLoading] = useState(false);
    const [hasCode, setHasCode] = useState(false); 
    const [formData, setFormData] = useState({
        currentPassword: '',
        securityCode: '',
        confirmCode: ''
    });

    const session = JSON.parse(localStorage.getItem('MentraLocal_Session') || '{}');
    const userId = session.user_id;

    // جلب حالة مفتاح الأمان عند فتح الصفحة
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        // التحقق من أن الرمز 6 أرقام فقط
        const codeRegex = /^[0-9]{6}$/;
        if (!codeRegex.test(formData.securityCode)) {
            showToast("مفتاح الأمان يجب أن يتكون من 6 أرقام فقط", "error");
            return;
        }

        if (formData.securityCode !== formData.confirmCode) {
            showToast("مفتاح الأمان غير متطابق في الخانتين", "error");
            return;
        }

        setIsLoading(true);
        try {
            const user = await window.db.users.get(userId);
            
            if (user.password !== formData.currentPassword) {
                throw new Error("كلمة المرور الحالية غير صحيحة");
            }

            // حفظ المفتاح في قاعدة البيانات
            await window.db.users.update(userId, {
                recovery_code: formData.securityCode
            });

            setHasCode(true);
            showToast("تم حفظ مفتاح الأمان بنجاح", "success");
            setFormData({ currentPassword: '', securityCode: '', confirmCode: '' });

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
                    <h3 className="font-black text-xl text-[#1E3A8A]">مفتاح الأمان (استعادة الدخول)</h3>
                    <p className="text-slate-500 text-sm font-bold mt-1">
                        قم بتعيين رمز سري مكون من 6 أرقام لاستخدامه في حالة نسيان كلمة المرور للوصول لبياناتك.
                    </p>
                </div>
            </div>

            {hasCode && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl font-bold text-sm mb-6 flex items-start gap-3">
                    <i className="fas fa-check-circle text-lg mt-0.5"></i>
                    <div>
                        <p>مفتاح الأمان مُفعّل لحسابك وجاهز للاستخدام.</p>
                        <p className="text-xs font-semibold mt-1">إذا أردت تغييره، قم بإدخال البيانات أدناه وسيتم استبدال المفتاح القديم.</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSave} className="max-w-xl space-y-5">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                    <label className="block text-slate-700 text-sm font-black mb-2">كلمة المرور الحالية (لتأكيد هويتك)</label>
                    <input 
                        type="password" 
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        dir="ltr"
                        className="w-full p-3 rounded-lg border-2 border-slate-200 focus:border-[#D4AF37] outline-none text-left font-sans transition-colors"
                        placeholder="••••••••"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-slate-700 text-sm font-black mb-2">مفتاح الأمان الجديد (6 أرقام)</label>
                        <input 
                            type="password" 
                            name="securityCode"
                            value={formData.securityCode}
                            onChange={handleChange}
                            maxLength="6"
                            required
                            dir="ltr"
                            className="w-full p-3 rounded-lg border-2 border-slate-200 focus:border-[#D4AF37] outline-none text-center font-black tracking-[0.5em] transition-colors"
                            placeholder="000000"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-black mb-2">تأكيد مفتاح الأمان</label>
                        <input 
                            type="password" 
                            name="confirmCode"
                            value={formData.confirmCode}
                            onChange={handleChange}
                            maxLength="6"
                            required
                            dir="ltr"
                            className="w-full p-3 rounded-lg border-2 border-slate-200 focus:border-[#D4AF37] outline-none text-center font-black tracking-[0.5em] transition-colors"
                            placeholder="000000"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="mt-4 w-full md:w-auto bg-[#1E3A8A] hover:bg-blue-900 text-white font-black py-3 px-8 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                    حفظ مفتاح الأمان
                </button>
            </form>
        </div>
    );
};