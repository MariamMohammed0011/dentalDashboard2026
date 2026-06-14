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

// Preset images removed to support device uploads

const AddAdModal = ({ isOpen, onClose, onCreateAd }) => {
  // Form state for adding new Ad
  const [newAdForm, setNewAdForm] = useState({
    storeName: '',
    storePhone: '',
    type: 'dentists',
    image: null,
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAdForm.storeName || !newAdForm.storePhone) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (!newAdForm.image) {
      toast.error('يرجى اختيار صورة الإعلان من الجهاز');
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
      image: null,
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
                      <option value="dentists">أطباء الأسنان فقط</option>
                      <option value="labs">مخابر الأسنان فقط</option>
                      <option value="both">الأطباء والمخابر معاً</option>
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

                {/* Image Selection - File Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">صورة الإعلان <span className="text-red-500">*</span></label>
                  <div className="flex flex-col items-center gap-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-5 hover:border-[#367AFF] transition-colors relative cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setNewAdForm({ ...newAdForm, image: file });
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {newAdForm.image ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-100">
                        <img 
                          src={URL.createObjectURL(newAdForm.image)} 
                          alt="Ad Preview" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-sm">
                          تغيير الصورة
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <ImageIcon size={36} className="text-gray-300 group-hover:text-[#367AFF] transition-colors" />
                        <span className="text-xs font-semibold group-hover:text-[#367AFF] transition-colors">اضغط هنا لاختيار صورة من جهازك</span>
                        <span className="text-[10px] text-gray-400">تدعم صيغ PNG, JPG, JPEG</span>
                      </div>
                    )}
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
