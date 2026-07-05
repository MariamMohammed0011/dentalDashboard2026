import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  X, User, Phone, Mail, Calendar, Info,
  DollarSign, FileText, Activity, Layers,
  Compass, Hammer, Star
} from 'lucide-react';

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  const { t } = useTranslation();

  if (typeof document === 'undefined') return null;
  if (!order) return null;


  const translateStage = (stage) => {
    switch (stage) {
      case 'PlasticImpression': return t('orders.stages.plasticImpression');
      case 'FinalImpression': return t('orders.stages.finalImpression');
      default: return stage || t('common.unknown');
    }
  };

  const translateType = (type) => {
    switch (type) {
      case 'Traditional': return t('orders.types.traditional');
      case 'Digital': return t('orders.types.digital');
      default: return type || t('common.unknown');
    }
  };

  const translateCompensation = (comp) => {
    switch (comp) {
      case 'Veneer': return t('orders.compensations.veneer');
      case 'Crown': return t('orders.compensations.crown');
      case 'Bridge': return t('orders.compensations.bridge');
      default: return comp || t('common.unknown');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('common.unknown');
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-y-auto" dir="rtl">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />


          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white dark:bg-gray-950 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden my-8 border border-gray-100 dark:border-gray-900"
          >

            <div className={`p-6 text-white relative flex items-center justify-between ${order.isUrgent
                ? 'bg-gradient-to-r from-red-600 to-rose-500 shadow-red-500/20'
                : 'bg-gradient-to-r from-primary to-blue-600'
              }`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                  <Star size={24} className={order.isUrgent ? 'animate-pulse text-amber-300' : 'text-white'} />
                </div>
                <div>
                  <h3 className="text-lg font-black">{t('orders.detailsTitle')} #{order.id}</h3>
                  <p className="text-xs text-white/80 font-medium mt-0.5">{order.title || t('orders.noTitle')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {order.isUrgent && (
                  <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-white/20 animate-bounce">
                    {t('orders.veryUrgent')}
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>


            <div className="p-6 md:p-8 max-h-[calc(80vh-80px)] overflow-y-auto custom-scrollbar space-y-6">


              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <Info size={14} /> {t('orders.basicInfo')}
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-3xl border border-gray-100 dark:border-gray-900">
                  <div>
                    <span className="block text-[11px] text-gray-400 dark:text-gray-500">{t('orders.orderStatus')}</span>
                    <span className={`inline-block text-xs font-black px-3 py-1 rounded-xl mt-1 ${order.status === 'Accepted'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20'
                      }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-gray-400 dark:text-gray-500">{t('orders.createdAt')}</span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mt-1">{formatDate(order.raw?.createdAt)}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-gray-400 dark:text-gray-500">{t('orders.shadeColor')}</span>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block mt-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 px-2 py-0.5 rounded-lg w-max">{order.shade || t('common.unknown')}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-gray-400 dark:text-gray-500">{t('orders.structureType')}</span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mt-1">
                      {order.isTemporary ? t('orders.temporary') : t('orders.permanent')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-gray-400 dark:text-gray-500">{t('orders.attachments')}</span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mt-1">
                      {order.hasAccessories ? t('orders.hasAttachments') : t('orders.noAttachments')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-gray-400 dark:text-gray-500">{t('orders.urgencyDegree')}</span>
                    <span className={`text-xs font-black block mt-1 ${order.isUrgent ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      {order.isUrgent ? t('orders.urgentDesc') : t('orders.normalDesc')}
                    </span>
                  </div>
                </div>
              </div>


              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <Compass size={14} /> {t('orders.impressionStageAndType')}
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-3xl border border-gray-100 dark:border-gray-900">
                  <div>
                    <span className="block text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1"><Layers size={11} /> {t('orders.impressionStage')}</span>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block mt-1">{translateStage(order.impressionStage)}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1"><Activity size={11} /> {t('orders.impressionType')}</span>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block mt-1">{translateType(order.impressionType)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <User size={14} /> {t('orders.contractedParties')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-3xl border border-gray-100 dark:border-gray-900 space-y-2">
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 px-2.5 py-0.5 rounded-full font-bold">{t('orders.treatingDentist')}</span>
                    <div className="pt-1">
                      <span className="block text-sm font-bold text-gray-800 dark:text-gray-100">{order.dentistName}</span>
                      <div className="text-[11px] text-gray-400 dark:text-gray-500 space-y-1 mt-1.5">
                        <span className="flex items-center gap-1"><Mail size={12} /> {order.dentistEmail}</span>
                        {order.dentistPhone && (
                          <span className="flex items-center gap-1"><Phone size={12} /> {order.dentistPhone}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-3xl border border-gray-100 dark:border-gray-900 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full font-bold">{t('orders.compensationLab')}</span>
                      <div className="pt-1.5">
                        <span className="block text-sm font-bold text-gray-800 dark:text-gray-100">{order.labName}</span>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 block mt-1">{t('orders.expectedDeliveryDate')}</span>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1 mt-1">
                          <Calendar size={12} /> {formatDate(order.raw?.deliveryDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <Hammer size={14} /> {t('orders.requiredItems')}
                </h4>
                <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-3xl border border-gray-100 dark:border-gray-900">
                  {order.items && order.items.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800 space-y-3 [&>div]:pt-3 first:pt-0">
                      {order.items.map((item, idx) => (
                        <div key={item.itemId || idx} className="flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-gray-800 dark:text-gray-200">{translateCompensation(item.compensationType)}</span>
                            <span className="text-gray-400 dark:text-gray-500 block text-[10px] mt-0.5">{t('orders.itemId')}: #{item.itemId}</span>
                          </div>
                          <div className="text-left">
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 block">{t('orders.affectedTeeth')}</span>
                            <div className="flex gap-1 mt-1 justify-end">
                              {item.toothNumbers && item.toothNumbers.map((num, i) => (
                                <span key={i} className="bg-primary/10 text-primary font-black px-2 py-0.5 rounded text-[11px]">
                                  {num}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs text-gray-400 dark:text-gray-500">
                      {t('orders.noItemsDetails')}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <DollarSign size={14} /> {t('orders.pricesAndCosts')}
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-3xl border border-gray-100 dark:border-gray-900">
                  <div>
                    <span className="block text-[11px] text-gray-400 dark:text-gray-500">{t('orders.estimatedPriceTitle')}</span>
                    <span className="text-sm font-black text-gray-800 dark:text-gray-200 mt-1 block">
                      {order.estimatedPrice ? `${order.estimatedPrice.toLocaleString()} ${t('orders.currency')}` : t('orders.freeOrUnknown')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-gray-400 dark:text-gray-500">{t('orders.finalPriceTitle')}</span>
                    <span className="text-sm font-black text-primary mt-1 block">
                      {order.finalPrice ? `${order.finalPrice.toLocaleString()} ${t('orders.currency')}` : t('orders.notDeterminedYet')}
                    </span>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
                    <FileText size={14} /> {t('orders.doctorNotesTitle')}
                  </h4>
                  <div className="bg-yellow-500/5 text-yellow-700 dark:text-yellow-400/80 p-4 rounded-3xl border border-yellow-500/10 text-xs leading-relaxed font-medium">
                    {order.notes}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default OrderDetailsModal;
