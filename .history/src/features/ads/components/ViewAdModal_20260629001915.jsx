import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone } from 'lucide-react';

const ViewAdModal = ({ isOpen, onClose, selectedAd, handleApproveAd, handleRejectAd }) => {
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (selectedAd) {
      setActiveImage(selectedAd.image);
    }
  }, [selectedAd]);

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
           
            <button 
              onClick={onClose}
              className="absolute top-4 left-4 z-10 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

           
            <div className="h-48 sm:h-72 w-full relative bg-gray-100 overflow-hidden flex-shrink-0">
               <img 
                src={activeImage || selectedAd.image} 
                alt="Advertisement Banner" 
                className="w-full h-full object-cover transition-all duration-500"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex items-end p-6">
                <div className="flex items-center gap-3 text-white">
                  <img 
                    src={selectedAd.storeAvatar} 
                    alt={selectedAd.storeName} 
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white shadow-xl flex-shrink-0"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAd.storeName || 'Ad')}&background=367AFF&color=fff`;
                    }}
                  />
                  <div className="text-right">
                    <h3 className="text-base sm:text-xl font-black">{selectedAd.storeName}</h3>
                    {selectedAd.storePhone && (
                      <p className="text-xs text-gray-200 flex items-center gap-1 mt-0.5">
                        <Phone size={12} />
                        <span dir="ltr">{selectedAd.storePhone}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            
            <div className="p-5 sm:p-7 flex flex-col gap-5 text-right overflow-y-auto flex-grow custom-scrollbar">

              
              <div className="flex flex-col gap-2">
                <h2 className="text-lg sm:text-xl font-black text-gray-800">{selectedAd.title}</h2>
                {selectedAd.content && (
                  <p className="text-sm text-gray-500 leading-relaxed">{selectedAd.content}</p>
                )}
              </div>
              
             
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 font-bold">رقم الإعلان</span>
                  <span className="text-sm font-extrabold text-gray-700">#{selectedAd.id}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 font-bold">الجمهور المستهدف</span>
                  <span className="text-sm font-extrabold text-[#367AFF]">
                    {selectedAd.type === 'labs'
                      ? 'مخابر الأسنان فقط'
                      : selectedAd.type === 'both'
                      ? 'الأطباء والمخابر معاً'
                      : selectedAd.type === 'dentists'
                      ? 'أطباء الأسنان فقط'
                      : 'غير محدد'}
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
                  <span className="text-xs text-gray-400 font-bold">حالة المراجعة</span>
                  <div>
                    {selectedAd.approvalStatus === 'pending' && <span className="text-amber-500 font-bold text-sm">قيد المراجعة</span>}
                    {selectedAd.approvalStatus === 'approved' && <span className="text-blue-600 font-bold text-sm">مقبول وموافق عليه</span>}
                    {selectedAd.approvalStatus === 'rejected' && <span className="text-rose-500 font-bold text-sm">مرفوض</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 font-bold">سعر الحملة الإعلانية</span>
                  <span className="text-sm font-extrabold text-gray-800">
                    {selectedAd.price ? `${Number(selectedAd.price).toLocaleString()} ل.س` : 'غير محدد'}
                  </span>
                </div>
                {selectedAd.expiresAt && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400 font-bold">تاريخ الانتهاء</span>
                    <span className="text-sm font-extrabold text-gray-700">{selectedAd.expiresAt}</span>
                  </div>
                )}
                {selectedAd.raw?.createdAt && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400 font-bold">تاريخ الإنشاء</span>
                    <span className="text-sm font-extrabold text-gray-700">
                      {new Date(selectedAd.raw.createdAt).toLocaleDateString('ar-SY', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              
              {selectedAd.images && selectedAd.images.length > 1 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-gray-400 font-bold">صور الإعلان ({selectedAd.images.length})</span>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedAd.images.map((img, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`w-20 h-20 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 hover:scale-[1.05] shadow-sm ${
                          (activeImage === img || (!activeImage && idx === 0))
                            ? 'border-[#367AFF] scale-102 ring-2 ring-blue-500/10' 
                            : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`صورة ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            
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
