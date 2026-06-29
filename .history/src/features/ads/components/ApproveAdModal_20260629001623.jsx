import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, Coins, Send, Info } from 'lucide-react';

const ApproveAdModal = ({ isOpen, onClose, ad, onConfirm }) => {
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (ad) {
      const initialPrice = ad.raw?.price || ad.price || '';
      setPrice(initialPrice);
    } else {
      setPrice('');
    }
  }, [ad, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      // In case we want a positive price, or allow 0
      onConfirm(parsedPrice || 0);
    } else {
      onConfirm(parsedPrice);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && ad && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full flex flex-col overflow-hidden border border-gray-100 relative"
          >
            
            {/* Header */}
            <div className="bg-[#E8F1FF] p-5 sm:p-6 text-right flex items-center justify-between border-b border-[#D2E4FF]/50 flex-shrink-0 animate-fade-in">
              <div className="flex items-center gap-3 text-[#367AFF]">
                <Megaphone size={22} strokeWidth={2.5} />
                <h3 className="text-lg font-black">الموافقة وتحديد سعر الحملة</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/50 rounded-xl text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col">
              
              <div className="p-5 sm:p-6 flex flex-col gap-4.5 text-right">
                
                {/* Ad Info card summary */}
                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-2xl flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs text-gray-400 font-bold">
                    <span>بيانات الإعلان المقبول</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded-lg border border-gray-200/50">#{ad.id}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm mt-1">{ad.title || "لا يوجد عنوان"}</h4>
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <span className="font-bold text-[#367AFF]">{ad.storeName}</span>
                    <span className="text-gray-300">|</span>
                    <span dir="ltr" className="font-mono text-[11px]">{ad.storePhone}</span>
                  </div>
                </div>

                {/* Info alert about notifications */}
                <div className="bg-blue-50/50 border border-blue-100/60 p-3.5 rounded-2xl flex items-start gap-2.5">
                  <Info size={16} className="text-[#367AFF] mt-0.5 flex-shrink-0" />
                  <p className="text-[11.5px] leading-relaxed text-blue-700/90 font-medium">
                    عند تأكيد هذا الإجراء، سيتم تحويل حالة الإعلان إلى <strong>مقبول مبدئياً</strong>، وسيصل <strong>إشعار دفع مباشر</strong> في حساب الطبيب بقيمة السعر المدخل للموافقة النهائية.
                  </p>
                </div>

                {/* Price Input Field */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1 flex items-center gap-1.5">
                    <Coins size={14} className="text-[#367AFF]" />
                    سعر الحملة الإعلانية المقترح (ل.س)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0"
                      step="any"
                      placeholder="أدخل السعر المقترح للحملة"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="bg-gray-50 border border-gray-200/80 rounded-2xl pl-16 pr-4 py-3 text-gray-700 font-extrabold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full text-left"
                      dir="ltr"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">
                      ل.س
                    </span>
                  </div>
                </div>

              </div>

              {/* Footer Actions */}
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
                  className="flex-1 py-3 bg-[#367AFF] text-white hover:bg-[#2563EB] font-bold rounded-2xl shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={15} />
                  قبول وإرسال الإشعار
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

export default ApproveAdModal;
