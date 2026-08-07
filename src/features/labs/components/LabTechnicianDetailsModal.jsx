import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Mail, Phone, MapPin, Building2, 
  Calendar, CheckCircle, ShieldAlert, FileText 
} from 'lucide-react';

const LabTechnicianDetailsModal = ({ tech, isOpen, onClose }) => {
  if (typeof document === 'undefined') return null;

  // تنسيق تاريخ الإنشاء
  const formattedDate = tech?.createdAt 
    ? new Date(tech.createdAt).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'غير محدد';

  // تركيب العنوان والمدينة
  const addressParts = tech ? [tech.addressPlace, tech.cityPlace, tech.countryPlace].filter(Boolean) : [];
  const fullAddress = addressParts.length > 0 ? addressParts.join('، ') : 'غير متوفر';

  return createPortal(
    <AnimatePresence>
      {isOpen && tech && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden" dir="rtl">
          {/* الخلفية المظلمة */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* نافذة المودال */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden z-10 border border-slate-100 dark:border-slate-800"
          >
            {/* الهيدر العلوي */}
            <div className="relative h-40 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 p-8 flex items-end justify-between overflow-hidden">
              <div className="relative z-10 flex items-center gap-5">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shrink-0 overflow-hidden">
                  {tech.profilePictureUrl ? (
                    <img src={tech.profilePictureUrl} alt={tech.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={36} />
                  )}
                </div>
                <div className="text-white">
                  <span className="text-[11px] bg-white/20 text-white font-bold px-3 py-1 rounded-full inline-block mb-1">
                    فني مخبري #{tech.id}
                  </span>
                  {/* اسم المخبري الشخصي */}
                  <h2 className="text-2xl font-black truncate">{tech.name || 'بدون اسم'}</h2>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="absolute top-6 left-6 p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all backdrop-blur-md border border-white/10 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* محتوى التفاصيل */}
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* اسم المخبري والبريد */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <User size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold block">اسم المخبري</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{tech.name}</span>
                  </div>
                </div>

                {/* البريد الإلكتروني */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-gray-400 font-bold block">البريد الإلكتروني</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate block">{tech.email || 'غير متوفر'}</span>
                  </div>
                </div>

                {/* رقم الهاتف */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold block">رقم الهاتف</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200" dir="ltr">{tech.phone || 'غير متوفر'}</span>
                  </div>
                </div>

                {/* اسم مكان العمل */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold block">اسم المخبر / مكان العمل</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{tech.namePlace || 'غير محدد'}</span>
                  </div>
                </div>

                {/* العنوان والمدينة */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold block">العنوان والمدينة</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{fullAddress}</span>
                  </div>
                </div>

                {/* تاريخ التسجيل */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="p-3 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 rounded-xl">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold block">تاريخ انضمام الحساب</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{formattedDate}</span>
                  </div>
                </div>

              </div>

              {/* حالة الحساب والمستندات */}
              <div className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">حالة الحساب الحالية:</span>
                  <span className="px-3 py-1 text-xs font-black rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                    {tech.status}
                  </span>
                </div>

                {/* مستند التحقق / التوثيق */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-gray-400">ملف توثيق المهنة:</span>
                  {tech.verificationDocumentPath ? (
                    <a 
                      href={`https://localhost:44334/${tech.verificationDocumentPath}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
                    >
                      <FileText size={16} />
                      عرض المستند المرفق
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 font-bold">لا يوجد مستند مرفق</span>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LabTechnicianDetailsModal;