import React, { useState, useEffect } from 'react';
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

  // تحديث البيانات داخل الفورم فور تمرير المستخدم المختار للتعديل
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* الخلفية المضببة الشفافة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* نافذة المودل الهيكلية */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-card border border-brand-secondary/20 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl z-10 text-right select-none"
            dir="rtl"
          >
            {/* الهيدر */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-secondary/10 bg-card/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/15">
                  <User size={16} />
                </div>
                <h3 className="font-extrabold text-text-main text-base">تعديل بيانات المستخدم</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* محتوى الفورم */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              
              {/* العميل (الاسم) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-muted">اسم العميل</label>
                <div className="relative flex items-center">
                  <User size={15} className="absolute right-3.5 text-text-muted/60" />
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    required
                    className="w-full text-sm font-semibold pr-10 pl-4 py-2.5 rounded-xl border border-brand-secondary/20 bg-bg-main/20 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="أدخل اسم العميل بالكامل"
                  />
                </div>
              </div>

              {/* رقم الهاتف */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-muted">بيانات التواصل (الهاتف)</label>
                <div className="relative flex items-center" dir="ltr">
                  <Phone size={15} className="absolute right-3.5 text-text-muted/60" />
                  <input
                    type="text"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                    required
                    className="w-full text-sm font-semibold pr-10 pl-4 py-2.5 rounded-xl border border-brand-secondary/20 bg-bg-main/20 text-text-main text-right focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="09xxxxxxxx"
                  />
                </div>
              </div>

              {/* اسم المنشأة */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-muted">المنشأة / العيادة</label>
                <div className="relative flex items-center">
                  <Building2 size={15} className="absolute right-3.5 text-text-muted/60" />
                  <input
                    type="text"
                    name="NamePlace"
                    value={formData.NamePlace}
                    onChange={handleChange}
                    className="w-full text-sm font-semibold pr-10 pl-4 py-2.5 rounded-xl border border-brand-secondary/20 bg-bg-main/20 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="اسم العيادة أو المختبر"
                  />
                </div>
              </div>

              {/* العنوان التفصيلي */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-muted">العنوان بالتفصيل</label>
                <div className="relative flex items-center">
                  <MapPin size={15} className="absolute right-3.5 text-text-muted/60" />
                  <input
                    type="text"
                    name="AddressPlace"
                    value={formData.AddressPlace}
                    onChange={handleChange}
                    className="w-full text-sm font-semibold pr-10 pl-4 py-2.5 rounded-xl border border-brand-secondary/20 bg-bg-main/20 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="الشارع، البناء، أو المعلم المميز"
                  />
                </div>
              </div>

              {/* المدينة والدولة بجانب بعضهما */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-muted">المدينة</label>
                  <div className="relative flex items-center">
                    <MapPin size={15} className="absolute right-3.5 text-text-muted/60" />
                    <input
                      type="text"
                      name="CityPlace"
                      value={formData.CityPlace}
                      onChange={handleChange}
                      className="w-full text-sm font-semibold pr-10 pl-4 py-2.5 rounded-xl border border-brand-secondary/20 bg-bg-main/20 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="دمشق، حلب..."
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-muted">الدولة</label>
                  <div className="relative flex items-center">
                    <Globe size={15} className="absolute right-3.5 text-text-muted/60" />
                    <input
                      type="text"
                      name="CountryPlace"
                      value={formData.CountryPlace}
                      onChange={handleChange}
                      className="w-full text-sm font-semibold pr-10 pl-4 py-2.5 rounded-xl border border-brand-secondary/20 bg-bg-main/20 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="سوريا..."
                    />
                  </div>
                </div>
              </div>

              {/* أزرار التحكم السفلية */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-brand-secondary/10 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-slate-800 text-text-muted hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}</span>
                </motion.button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditUserModal;