import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = 'warning' }) => {
  if (typeof document === 'undefined') return null;

  const colors = {
    warning: 'from-orange-500 to-amber-500',
    danger: 'from-red-500 to-rose-500',
    success: 'from-green-500 to-emerald-500',
    info: 'from-blue-500 to-indigo-500',
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" dir="rtl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className={`h-24 bg-gradient-to-r ${colors[type]} flex items-center justify-center relative`}>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-xl">
                <AlertTriangle size={32} />
              </div>
              <button 
                onClick={onClose}
                className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 text-center">
              <h3 className="text-xl font-bold text-text-main mb-3">{title}</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">{message}</p>

              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
                >
                  {cancelText || 'إلغاء'}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 px-6 py-3.5 bg-gradient-to-r ${colors[type]} text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95`}
                >
                  {confirmText || 'تأكيد'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ConfirmationModal;
