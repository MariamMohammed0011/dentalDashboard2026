import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone } from 'lucide-react';

const ViewAdModal = ({ isOpen, onClose, selectedAd, handleApproveAd, handleRejectAd }) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && selectedAd && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 relative"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 left-4 z-10 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Advertisement Image Header */}
            <div className="h-48 sm:h-72 w-full relative bg-gray-100 overflow-hidden flex-shrink-0">
              <img 
                src={selectedAd.image} 
                alt="Advertisement Banner" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex items-end p-6">
                <div className="flex items-center gap-3 text-white">
                  <img 
                    src={selectedAd.storeAvatar} 
                    alt={selectedAd.storeName} 
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white shadow-xl flex-shrink-0"
                  />
                  <div className="text-right">
                    <h3 className="text-base sm:text-xl font-black">{selectedAd.storeName}</h3>
                    <p className="text-xs text-gray-200 flex items-center gap-1 mt-0.5">
                      <Phone size={12} />
                      <span dir="ltr">{selectedAd.storePhone}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Body */}
            <div className="p-5 sm:p-7 flex flex-col gap-5 text-right overflow-y-auto flex-grow custom-scrollbar">
              
              {/* Meta details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 font-bold">رقم الإعلان المعرف</span>
                  <span className="text-sm font-extrabold text-gray-700">#{selectedAd.id}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 font-bold">الجمهور المستهدف</span>
                  <span className="text-sm font-extrabold text-[#367AFF]">
                    {selectedAd.type === 'labs' || selectedAd.type === 'lab' ? 'مختبرات الأسنان' : 'أطباء الأسنان'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 font-bold">حالة التفعيل</span>
                  <span className="text-sm font-extrabold">
                    {selectedAd.status === 'active' ? (
                      <span className="text-blue-600">نشط حالياً</span>
                    ) : (
                      <span className="text-rose-500">غير نشط</span>
                    )}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 font-bold">حالة المراجعة والتأكيد</span>
                  <div>
                    {selectedAd.approvalStatus === 'pending' && <span className="text-amber-500 font-bold text-sm">قيد المراجعة</span>}
                    {selectedAd.approvalStatus === 'approved' && <span className="text-blue-600 font-bold text-sm">مقبول وموافق عليه</span>}
                    {selectedAd.approvalStatus === 'rejected' && <span className="text-rose-500 font-bold text-sm">مرفوض</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer inside view modal */}
            <div className="flex gap-3 justify-end items-center p-4 sm:p-5 bg-gray-50/50 border-t border-gray-100 flex-shrink-0">
              <button 
                onClick={onClose}
                className="px-5 py-2.5 sm:px-6 sm:py-3 border border-gray-200 text-gray-500 font-bold text-sm sm:text-base rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                إغلاق المعاينة
              </button>
              
              {selectedAd.approvalStatus === 'pending' && (
                <>
                  <button 
                    onClick={() => {
                      handleRejectAd(selectedAd);
                      onClose();
                    }}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 bg-rose-50 text-rose-600 border border-rose-100 font-bold text-sm sm:text-base rounded-2xl hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                  >
                    رفض الإعلان
                  </button>
                  <button 
                    onClick={() => {
                      handleApproveAd(selectedAd);
                      onClose();
                    }}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#367AFF] text-white font-bold text-sm sm:text-base rounded-2xl hover:bg-[#2563EB] shadow-md shadow-blue-500/10 transition-all cursor-pointer"
                  >
                    قبول الإعلان
                  </button>
                </>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ViewAdModal;
