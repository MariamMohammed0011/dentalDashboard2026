import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, 
  X, 
  CheckCircle, 
  Image as ImageIcon,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

const PRESET_IMAGES = [
  { name: 'عيادة حديثة', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80' },
  { name: 'كرسي أسنان متطور', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80' },
  { name: 'أدوات ومعدات طبية', url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80' },
  { name: 'مخبر تعويضات سنية', url: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=800&q=80' },
  { name: 'عناية بالأسنان', url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80' }
];

const AddAdForUserModal = ({ isOpen, onClose, onCreateAd, user, isSubmitting }) => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'dentists',
    expiresAt: '',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('يرجى كتابة عنوان الإعلان');
      return;
    }

    try {
      await onCreateAd(form);
      setForm({
        title: '',
        content: '',
        type: 'dentists',
        expiresAt: '',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'
      });
    } catch (err) {
      console.error(err);
    }
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
              <div className="flex flex-col gap-1 text-right">
                <div className="flex items-center gap-3 text-[#367AFF]">
                  <Megaphone size={22} strokeWidth={2.5} />
                  <h3 className="text-lg font-black">إضافة إعلان جديد</h3>
                </div>
                {user && (
                  <p className="text-xs text-[#367AFF]/80 mr-8 font-medium">
                    للعميل: <strong className="font-bold text-gray-800">{user.name}</strong> ({user.phone})
                  </p>
                )}
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
                
                {/* Ad Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">
                    عنوان الإعلان <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="مثال: خصم 50% على أجهزة التعقيم"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full"
                      disabled={isSubmitting}
                    />
                    <Megaphone className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                {/* Ad Content */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">محتوى / تفاصيل الإعلان</label>
                  <div className="relative">
                    <textarea
                      placeholder="اكتب تفاصيل الإعلان هنا..."
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className="bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full min-h-[80px] resize-none"
                      disabled={isSubmitting}
                    />
                    <FileText className="absolute right-3.5 top-5 text-gray-400" size={18} />
                  </div>
                </div>

                {/* Type & Expiry side-by-side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">الجمهور المستهدف</label>
                    <div className="relative">
                      <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-gray-700 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer appearance-none text-right"
                        disabled={isSubmitting}
                      >
                        <option value="dentists">أطباء الأسنان</option>
                        <option value="labs">المختبرات</option>
                      </select>
                      <Layers className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">تاريخ الانتهاء</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={form.expiresAt}
                        onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                        className="bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer"
                        disabled={isSubmitting}
                      />
                      <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>

                {/* Image Selection presets */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">اختر صورة توضيحية للإعلان</label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setForm({ ...form, image: img.url })}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          form.image === img.url 
                            ? 'border-[#367AFF] scale-95 shadow-md shadow-blue-500/10' 
                            : 'border-transparent hover:scale-105'
                        }`}
                        title={img.name}
                        disabled={isSubmitting}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        {form.image === img.url && (
                          <div className="absolute inset-0 bg-[#367AFF]/25 flex items-center justify-center text-white">
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
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className="bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full pl-10"
                      dir="ltr"
                      disabled={isSubmitting}
                    />
                    <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

              </div>

              {/* Submit Actions Footer */}
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
                  {isSubmitting ? 'جاري الإضافة...' : 'إضافة الإعلان'}
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

export default AddAdForUserModal;
