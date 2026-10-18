// المسار: components/Settings/ProfileTab.js

window.ProfileTab = function({ formData, handleInputChange, handleSaveChanges, isLoading }) {
    const { useState } = React;
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="p-4 md:p-8 animate-view">
            <h4 className="font-black text-base md:text-lg text-[#1E3A8A] mb-4 md:mb-6 border-b border-slate-100 pb-3 md:pb-4 flex items-center gap-2"><i className="fas fa-user-edit text-[#D4AF37]"></i> تحديث بيانات الملف الشخصي</h4>
            
            <form onSubmit={handleSaveChanges} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                        <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5 md:mb-2">اسم مكتب المحاماة <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <i className="fas fa-building absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                            <input type="text" name="firmName" value={formData.firmName} onChange={handleInputChange} required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 md:py-3 pr-9 md:pr-10 pl-4 text-xs md:text-sm font-bold text-[#1E3A8A] outline-none focus:border-[#D4AF37] focus:bg-white transition" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5 md:mb-2">اسم المدير (المحامي) <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <i className="fas fa-user-tie absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                            <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 md:py-3 pr-9 md:pr-10 pl-4 text-xs md:text-sm font-bold text-[#1E3A8A] outline-none focus:border-[#D4AF37] focus:bg-white transition" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                        <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5 md:mb-2">البريد الإلكتروني للولوج <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <i className="fas fa-envelope absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} dir="ltr" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 md:py-3 pr-9 md:pr-10 pl-4 text-xs md:text-sm font-bold text-[#1E3A8A] outline-none focus:border-[#D4AF37] focus:bg-white transition text-left" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5 md:mb-2">كلمة المرور الحالية/الجديدة <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <i className="fas fa-lock absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} dir="ltr" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 md:py-3 pr-9 md:pr-10 pl-10 md:pl-12 text-xs md:text-sm font-bold text-[#1E3A8A] outline-none focus:border-[#D4AF37] focus:bg-white transition text-left" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1E3A8A] text-sm">
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-2 md:pt-4 border-t border-slate-100 flex justify-end">
                    <button type="submit" disabled={isLoading} className="w-full md:w-auto bg-[#1E3A8A] hover:bg-blue-900 text-white font-black px-6 md:px-8 py-3.5 md:py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 text-sm md:text-base">
                        {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save"></i> حفظ التحديثات</>}
                    </button>
                </div>
            </form>
        </div>
    );
};