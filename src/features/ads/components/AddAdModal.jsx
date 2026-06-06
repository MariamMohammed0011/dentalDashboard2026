import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, 
  X, 
  CheckCircle, 
  Image as ImageIcon 
} from 'lucide-react';
import { toast } from 'sonner';

const PRESET_IMAGES = [
  { name: 'عيادة حديثة', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80' },
  { name: 'كرسي أسنان متطور', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80' },
  { name: 'أدوات ومعدات طبية', url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80' },
  { name: 'مخبر تعويضات سنية', url: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=800&q=80' },
  { name: 'عناية بالأسنان', url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80' }
];

const AddAdModal = ({ isOpen, onClose, onCreateAd }) => {
  // Form state for adding new Ad
  const [newAdForm, setNewAdForm] = useState({
    storeName: '',
    storePhone: '',
    type: 'dentists',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAdForm.storeName || !newAdForm.storePhone) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    onCreateAd(newAdForm);
    toast.success('تمت إضافة الإعلان الجديد بنجاح');
    onClose();
    // Reset form
    setNewAdForm({
      storeName: '',
      storePhone: '',
      type: 'dentists',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      status: 'active'
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
                <Megaphone size={22} strokeWidth={2.5} />
                <h3 className="text-lg font-black">إضافة إعلان جديد</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/50 rounded-xl text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
              
              {/* Scrollable form body */}
              <div className="p-5 sm:p-7 flex flex-col gap-4 text-right overflow-y-auto flex-grow custom-scrollbar">
                
                {/* Store Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">اسم المتجر / الدكتور</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: عيادة د. أحمد"
                    value={newAdForm.storeName}
                    onChange={(e) => setNewAdForm({ ...newAdForm, storeName: e.target.value })}
                    className="bg-gray-50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">رقم الهاتف</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: +963 981 053 230"
                    value={newAdForm.storePhone}
                    onChange={(e) => setNewAdForm({ ...newAdForm, storePhone: e.target.value })}
                    className="bg-gray-50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full text-right"
                    dir="ltr"
                  />
                </div>

                {/* Type & Active Status side-by-side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">الجمهور المستهدف</label>
                    <select
                      value={newAdForm.type}
                      onChange={(e) => setNewAdForm({ ...newAdForm, type: e.target.value })}
                      className="bg-gray-50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer"
                    >
                      <option value="dentists">أطباء الأسنان</option>
                      <option value="labs">المختبرات</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">الحالة البدئية</label>
                    <select
                      value={newAdForm.status}
                      onChange={(e) => setNewAdForm({ ...newAdForm, status: e.target.value })}
                      className="bg-gray-50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer"
                    >
                      <option value="active">نشط ومفعل</option>
                      <option value="inactive">غير نشط</option>
                    </select>
                  </div>
                </div>

                {/* Image Selection presets */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">اختر صورة توضيحية للإعلان</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {PRESET_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNewAdForm({ ...newAdForm, image: img.url })}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          newAdForm.image === img.url 
                            ? 'border-[#367AFF] scale-95 shadow-md shadow-blue-500/10' 
                            : 'border-transparent hover:scale-105'
                        }`}
                        title={img.name}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        {newAdForm.image === img.url && (
                          <div className="absolute inset-0 bg-[#367AFF]/20 flex items-center justify-center text-white">
                            <CheckCircle size={16} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Image URL input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">أو الصق رابط صورة مخصص</label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://example.com/ad-image.jpg"
                      value={newAdForm.image}
                      onChange={(e) => setNewAdForm({ ...newAdForm, image: e.target.value })}
                      className="bg-gray-50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full pl-10"
                      dir="ltr"
                    />
                    <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

              </div>

              {/* Submit Actions Footer (Fixed at bottom) */}
              <div className="flex gap-3 justify-end items-center p-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-[#DBEAFE] bg-white text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#367AFF] text-white hover:bg-[#2563EB] font-bold rounded-2xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
                >
                  إضافة الإعلان
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

export default AddAdModal;
