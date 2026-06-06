import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  X, 
  User,
  Phone,
  Building2,
  MapPin,
  Map,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

const AddAdClientModal = ({ isOpen, onClose, onCreateClient, isSubmitting }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    namePlace: '',
    addressPlace: '',
    cityPlace: '',
    countryPlace: 'سوريا'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error('يرجى ملء الحقول الإجبارية (الاسم ورقم الهاتف)');
      return;
    }

    onCreateClient(form, {
      onSuccess: () => {
        toast.success('تم إنشاء حساب عميل الإعلانات بنجاح');
        setForm({
          name: '',
          phone: '',
          namePlace: '',
          addressPlace: '',
          cityPlace: '',
          countryPlace: 'سوريا'
        });
        onClose();
      },
      onError: (error) => {
        console.error("Failed to create client:", error);
        toast.error('حدث خطأ أثناء إنشاء حساب العميل');
      }
    });
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 relative"
          >
            
            {/* Header */}
            <div className="bg-[#E8F1FF] p-5 sm:p-6 text-right flex items-center justify-between border-b border-[#D2E4FF]/50 flex-shrink-0">
              <div className="flex items-center gap-3 text-[#367AFF]">
                <UserPlus size={22} strokeWidth={2.5} />
                <h3 className="text-lg font-black">إضافة مستخدم إعلانات جديد</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/50 rounded-xl text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                disabled={isSubmitting}
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
              
              {/* Scrollable form body */}
              <div className="p-5 sm:p-7 flex flex-col gap-4 text-right overflow-y-auto flex-grow custom-scrollbar">
                
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">
                    اسم العميل <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="مثال: أحمد المحمد"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full"
                    />
                    <User className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="مثال: 098765432"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full text-right"
                      dir="ltr"
                    />
                    <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                {/* Name Place */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">اسم المنشأة / العيادة</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="مثال: عيادة السن الجميل"
                      value={form.namePlace}
                      onChange={(e) => setForm({ ...form, namePlace: e.target.value })}
                      className="bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full"
                    />
                    <Building2 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                {/* Address Place */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">العنوان بالتفصيل</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="مثال: شارع بغداد، بجانب صيدلية الشفاء"
                      value={form.addressPlace}
                      onChange={(e) => setForm({ ...form, addressPlace: e.target.value })}
                      className="bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full"
                    />
                    <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                {/* City & Country side-by-side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">المدينة</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="مثال: دمشق"
                        value={form.cityPlace}
                        onChange={(e) => setForm({ ...form, cityPlace: e.target.value })}
                        className="bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full"
                      />
                      <Map className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">البلد</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="مثال: سوريا"
                        value={form.countryPlace}
                        onChange={(e) => setForm({ ...form, countryPlace: e.target.value })}
                        className="bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full"
                      />
                      <Globe className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit Actions Footer (Fixed at bottom) */}
              <div className="flex gap-3 justify-end items-center p-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border border-[#DBEAFE] bg-white text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#367AFF] text-white hover:bg-[#2563EB] font-bold rounded-2xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الإضافة...' : 'إضافة مستخدم'}
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

export default AddAdClientModal;
