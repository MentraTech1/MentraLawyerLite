// المسار: components/Clients/ClientModal.js

window.ClientModal = function({ firmId, showToast, modalMode, editData, onClose, onSuccess }) {
    const { useState, useEffect } = React;
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '', phone: '', id_number: '', address: '', notes: '', created_at: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (modalMode === 'edit' && editData) {
            setFormData({
                name: editData.name, 
                phone: editData.phone || '', 
                id_number: editData.id_number || '', 
                address: editData.address || '', 
                notes: editData.notes || '', 
                created_at: editData.safe_date
            });
        }
    }, [modalMode, editData]);

    const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSaveClient = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const clientData = {
                firm_id: firmId, 
                name: formData.name, 
                phone: formData.phone, 
                id_number: formData.id_number,
                address: formData.address, 
                notes: formData.notes, 
                created_at: new Date(formData.created_at).toISOString()
            };

            if (modalMode === 'edit') {
                await window.db.clients.update(editData.id, clientData);
                showToast("تم تحديث البيانات", "success");
            } else {
                await window.db.clients.add(clientData);
                showToast("تم تسجيل الموكل", "success");
            }
            
            onSuccess();
            onClose();
        } catch (error) { 
            showToast("حدث خطأ", "error"); 
        } finally { 
            setIsLoading(false); 
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-3 sm:p-4 animate-view">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[95vh] md:max-h-[90vh]">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-4 md:p-6 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-xl flex items-center justify-center text-base md:text-xl backdrop-blur-md">
                            <i className={`fas ${modalMode === 'edit' ? 'fa-pen' : 'fa-user-plus'}`}></i>
                        </div>
                        <h3 className="text-base md:text-xl font-black tracking-wide">{modalMode === 'edit' ? 'تعديل بيانات الموكل' : 'تسجيل موكل جديد'}</h3>
                    </div>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition text-lg bg-white/5 w-8 h-8 rounded-full flex items-center justify-center"><i className="fas fa-times"></i></button>
                </div>
                <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form onSubmit={handleSaveClient} className="space-y-4 md:space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            <div>
                                <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">اسم الموكل رباعي <span className="text-rose-500">*</span></label>
                                <input type="text" name="name" value={formData.name} onChange={handleFormChange} required className="w-full p-3 md:p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-emerald-500 font-bold text-xs md:text-sm text-[#1E3A8A]" />
                            </div>
                            <div>
                                <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">تاريخ التسجيل <span className="text-rose-500">*</span></label>
                                <input type="date" name="created_at" value={formData.created_at} onChange={handleFormChange} required className="w-full p-3 md:p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-emerald-500 font-bold text-xs md:text-sm text-[#1E3A8A]" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            <div>
                                <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">رقم الهاتف</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} dir="ltr" className="w-full p-3 md:p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-emerald-500 font-bold text-xs md:text-sm text-[#1E3A8A] text-left" />
                            </div>
                            <div>
                                <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">الرقم القومي</label>
                                <input type="text" name="id_number" value={formData.id_number} onChange={handleFormChange} dir="ltr" className="w-full p-3 md:p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-emerald-500 font-bold text-xs md:text-sm text-[#1E3A8A] text-left" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">العنوان</label>
                            <input type="text" name="address" value={formData.address} onChange={handleFormChange} className="w-full p-3 md:p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-emerald-500 font-bold text-xs md:text-sm text-[#1E3A8A]" />
                        </div>
                        <div>
                            <label className="block text-[11px] md:text-xs font-bold text-slate-500 mb-1.5">ملاحظات</label>
                            <textarea name="notes" value={formData.notes} onChange={handleFormChange} rows="2" className="w-full p-3 md:p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-emerald-500 font-bold text-xs md:text-sm text-[#1E3A8A] resize-none"></textarea>
                        </div>
                        <div className="pt-2">
                            <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 md:py-4 rounded-xl shadow-lg transition-all text-sm md:text-base">{isLoading ? 'جاري الحفظ...' : 'حفظ البيانات'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};