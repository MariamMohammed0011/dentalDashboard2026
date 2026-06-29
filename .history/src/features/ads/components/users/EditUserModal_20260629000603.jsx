import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Building2, MapPin, Globe, Save } from 'lucide-react';

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Phone: '',
    NamePlace: '',
    AddressPlace: '',
    CityPlace: '',
    CountryPlace: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  useEffect(() => {
    if (user) {
      setFormData({
        Name: user.name || '',
        Phone: user.phone || '',
        NamePlace: user.namePlace || '',
        AddressPlace: user.addressPlace || '',
        CityPlace: user.cityPlace || '',
        CountryPlace: user.countryPlace || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(user.id, formData);
      onClose();
    } catch (error) {
      console.error("فشل في تحديث البيانات:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (typeof document === 'undefined' || !document.body) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl z-10 text-right select-none flex flex-col font-sans max-h-[90vh]"
            dir="rtl"
          >
            
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/15">
                  <User size={18} />
                </div>
                <div className="flex flex-col gap-0.5 text-right">
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-[15px]">تعديل بيانات العميل</h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">تحديث المعلومات الأساسية وعنوان المنشأة</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-350 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto custom-scrollbar flex-grow">
              
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 mr-1 select-none">اسم العميل</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    required
                    className="w-full text-xs sm:text-sm font-bold pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all shadow-sm"
                    placeholder="أدخل اسم العميل بالكامل"
                  />
                  <User size={15} className="absolute right-3.5 text-blue-500/70 dark:text-blue-400/70" />
                </div>
              </div>

              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 mr-1 select-none">بيانات التواصل (الهاتف)</label>
                <div className="relative flex items-center" dir="ltr">
                  <input
                    type="text"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                    required
                    className="w-full text-xs sm:text-sm font-bold pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 text-right focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all shadow-sm"
                    placeholder="09xxxxxxxx"
                  />
                  <Phone size={15} className="absolute right-3.5 text-emerald-500/70 dark:text-emerald-400/70" />
                </div>
              </div>

              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 mr-1 select-none">المنشأة / العيادة</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="NamePlace"
                    value={formData.NamePlace}
                    onChange={handleChange}
                    className="w-full text-xs sm:text-sm font-bold pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all shadow-sm"
                    placeholder="اسم العيادة أو المختبر"
                  />
                  <Building2 size={15} className="absolute right-3.5 text-purple-500/70 dark:text-purple-400/70" />
                </div>
              </div>

              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 mr-1 select-none">العنوان بالتفصيل</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="AddressPlace"
                    value={formData.AddressPlace}
                    onChange={handleChange}
                    className="w-full text-xs sm:text-sm font-bold pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all shadow-sm"
                    placeholder="الشارع، البناء، أو المعلم المميز"
                  />
                  <MapPin size={15} className="absolute right-3.5 text-rose-500/70 dark:text-rose-400/70" />
                </div>
              </div>

              {/* المدينة والدولة بجانب بعضهما */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 mr-1 select-none">المدينة</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      name="CityPlace"
                      value={formData.CityPlace}
                      onChange={handleChange}
                      className="w-full text-xs sm:text-sm font-bold pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all shadow-sm"
                      placeholder="دمشق، حلب..."
                    />
                    <MapPin size={15} className="absolute right-3.5 text-rose-500/70 dark:text-rose-400/70" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 mr-1 select-none">الدولة</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      name="CountryPlace"
                      value={formData.CountryPlace}
                      onChange={handleChange}
                      className="w-full text-xs sm:text-sm font-bold pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all shadow-sm"
                      placeholder="سوريا..."
                    />
                    <Globe size={15} className="absolute right-3.5 text-cyan-500/70 dark:text-cyan-400/70" />
                  </div>
                </div>
              </div>

              {/* أزرار التحكم السفلية */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-150 dark:border-slate-800/60 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-black border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-primary hover:bg-primary/95 shadow-md shadow-primary/20 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}</span>
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default EditUserModal;