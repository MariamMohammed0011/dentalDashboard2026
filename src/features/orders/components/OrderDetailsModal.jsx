import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  X, User, Phone, Mail, Calendar, Info,
  DollarSign, FileText, Activity, Layers,
  Compass, Hammer, Star, Sparkles, Paperclip,
  AlertCircle, FlaskConical, Clock, Tag, Box,
  Download, ExternalLink, FileCode, Loader2, CheckCircle2
} from 'lucide-react';
import { fetchOrderStlFiles } from '../services/ordersApi';
import { toast } from 'sonner';

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  const { t } = useTranslation();
  const [stlFiles, setStlFiles] = useState([]);
  const [isLoadingStl, setIsLoadingStl] = useState(false);

  useEffect(() => {
    if (isOpen && order?.id) {
      let isMounted = true;
      setIsLoadingStl(true);
      fetchOrderStlFiles(order.id)
        .then(res => {
          if (isMounted) {
            const list = Array.isArray(res?.data) ? res.data : [];
            setStlFiles(list);
          }
        })
        .catch(err => {
          console.error("Error fetching STL files:", err);
          if (isMounted) setStlFiles([]);
        })
        .finally(() => {
          if (isMounted) setIsLoadingStl(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [isOpen, order?.id]);

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
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getFullFileUrl = (file) => {
    if (!file) return '#';
    if (file.fullUrl) return file.fullUrl;
    if (file.path) {
      if (file.path.startsWith('http://') || file.path.startsWith('https://')) return file.path;
      return `https://localhost:44334/${file.path.replace(/^\//, '')}`;
    }
    return '#';
  };

  const isDigital = String(order.impressionType).toLowerCase() === 'digital' || String(order.impressionType) === 'رقمية' || stlFiles.length > 0;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 overflow-y-auto" dir="rtl">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white dark:bg-slate-950 w-full max-w-2xl rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden my-2 sm:my-6 border border-slate-100 dark:border-slate-850 flex flex-col text-right font-sans"
          >
            {/* Modal Header */}
            <div className={`p-4 sm:p-6 text-white relative flex items-center justify-between overflow-hidden ${
              order.isUrgent
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500'
            }`}>
              {/* Decorative Glow Circle */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2.5 sm:gap-3.5 relative z-10 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/30 shadow-md shrink-0">
                  <Star size={20} className={order.isUrgent ? 'animate-pulse text-amber-300 sm:w-6 sm:h-6' : 'text-white sm:w-6 sm:h-6'} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-black tracking-wide flex items-center gap-1.5 sm:gap-2 truncate">
                    {t('orders.detailsTitle')} #{order.id}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/85 font-medium mt-0.5 truncate">{order.title || t('orders.noTitle')}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 relative z-10 shrink-0">
                {order.isUrgent && (
                  <span className="bg-white/20 text-white text-[9px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full border border-white/30 animate-bounce shadow-sm whitespace-nowrap">
                    {t('orders.veryUrgent')}
                  </span>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/25 rounded-xl text-white transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="p-4 sm:p-6 md:p-8 max-h-[calc(85vh-80px)] overflow-y-auto custom-scrollbar space-y-4 sm:space-y-6">

              {/* 1. Basic Info Section */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30">
                    <Info size={15} />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-gray-200 uppercase tracking-wider">
                    {t('orders.basicInfo')}
                  </h4>
                </div>

                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 bg-slate-50/70 dark:bg-slate-900/50 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800/80">
                  {/* Order Status */}
                  <div className="p-3 bg-white dark:bg-slate-800/70 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-gray-400 dark:text-slate-400 flex items-center gap-1">
                      <Tag size={12} className="text-sky-500 shrink-0" />
                      {t('orders.orderStatus')}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-xl mt-2 w-max ${
                      order.status === 'Accepted'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Accepted' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Created At */}
                  <div className="p-3 bg-white dark:bg-slate-800/70 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-gray-400 dark:text-slate-400 flex items-center gap-1">
                      <Clock size={12} className="text-blue-500 shrink-0" />
                      {t('orders.createdAt')}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mt-2">
                      {formatDate(order.raw?.createdAt)}
                    </span>
                  </div>

                  {/* Shade Color */}
                  <div className="p-3 bg-white dark:bg-slate-800/70 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-gray-400 dark:text-slate-400 flex items-center gap-1">
                      <Sparkles size={12} className="text-amber-500 shrink-0" />
                      {t('orders.shadeColor')}
                    </span>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/30 px-2.5 py-0.5 rounded-lg w-max mt-2">
                      {order.shade || t('common.unknown')}
                    </span>
                  </div>

                  {/* Structure Type */}
                  <div className="p-3 bg-white dark:bg-slate-800/70 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-gray-400 dark:text-slate-400 flex items-center gap-1">
                      <Layers size={12} className="text-purple-500 shrink-0" />
                      {t('orders.structureType')}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mt-2">
                      {order.isTemporary ? t('orders.temporary') : t('orders.permanent')}
                    </span>
                  </div>

                  {/* Attachments */}
                  <div className="p-3 bg-white dark:bg-slate-800/70 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-gray-400 dark:text-slate-400 flex items-center gap-1">
                      <Paperclip size={12} className="text-emerald-500 shrink-0" />
                      {t('orders.attachments')}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mt-2">
                      {order.hasAccessories ? t('orders.hasAttachments') : t('orders.noAttachments')}
                    </span>
                  </div>

                  {/* Urgency Degree */}
                  <div className="p-3 bg-white dark:bg-slate-800/70 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-gray-400 dark:text-slate-400 flex items-center gap-1">
                      <AlertCircle size={12} className={order.isUrgent ? 'text-red-500 shrink-0' : 'text-slate-400 shrink-0'} />
                      {t('orders.urgencyDegree')}
                    </span>
                    <span className={`text-xs font-black block mt-2 ${order.isUrgent ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      {order.isUrgent ? t('orders.urgentDesc') : t('orders.normalDesc')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Impression Stage & Type */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                    <Compass size={15} />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-gray-200 uppercase tracking-wider">
                    {t('orders.impressionStageAndType')}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 bg-slate-50/70 dark:bg-slate-900/50 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800/80">
                  <div className="p-3.5 bg-white dark:bg-slate-800/70 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 shrink-0">
                      <Layers size={18} />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[11px] font-bold text-gray-400 dark:text-slate-400">{t('orders.impressionStage')}</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-gray-100 mt-0.5 block truncate">{translateStage(order.impressionStage)}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-slate-800/70 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-500 shrink-0">
                      <Activity size={18} />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[11px] font-bold text-gray-400 dark:text-slate-400">{t('orders.impressionType')}</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-gray-100 mt-0.5 block truncate">{translateType(order.impressionType)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Digital Scans & STL Files Section (يعرض عندما تكون الطبعة رقمية Digital أو عند وجود ملفات) */}
              {isDigital && (
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        <Box size={16} />
                      </div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-gray-200 uppercase tracking-wider">
                        {t('orders.digitalScansTitle')}
                      </h4>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {t('orders.stlFilesCount', { count: stlFiles.length })}
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50/50 via-slate-50 to-indigo-50/30 dark:from-blue-950/20 dark:via-slate-900/50 dark:to-indigo-950/20 p-4 rounded-2xl sm:rounded-3xl border border-blue-100 dark:border-blue-900/40 space-y-3">
                    {isLoadingStl ? (
                      <div className="flex items-center justify-center py-6 gap-2 text-xs font-bold text-blue-600">
                        <Loader2 size={18} className="animate-spin" />
                        <span>{t('orders.loadingStlFiles')}</span>
                      </div>
                    ) : stlFiles.length === 0 ? (
                      <div className="text-center py-6 text-xs text-text-muted font-medium">
                        <Box size={32} className="mx-auto mb-2 opacity-40 text-blue-500" />
                        <span>{t('orders.noStlFiles')}</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {stlFiles.map((file, idx) => {
                          const fileUrl = getFullFileUrl(file);
                          const fileName = file.path ? file.path.split('/').pop() : `STL_Scan_${file.id || idx + 1}.stl`;
                          return (
                            <div
                              key={file.id || idx}
                              className="bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm hover:shadow-md transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                                  <FileCode size={20} />
                                </div>
                                <div className="min-w-0">
                                  <span className="block text-xs font-black text-slate-800 dark:text-gray-100 truncate dir-ltr text-right" title={fileName}>
                                    {fileName}
                                  </span>
                                  <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
                                    <span className="font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">
                                      {file.type || t('orders.digitalScanType')}
                                    </span>
                                    {file.uploadedAt && (
                                      <span>• {formatDate(file.uploadedAt)}</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700">
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
                                >
                                  <Download size={14} />
                                  <span>{t('orders.downloadStl')}</span>
                                </a>

                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(fileUrl);
                                    toast.success('تم نسخ رابط ملف الـ STL إلى الحافظة');
                                  }}
                                  className="p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-xl transition-all"
                                  title="نسخ رابط الملف"
                                >
                                  <ExternalLink size={15} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. Contracted Parties (Dentist & Lab) */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                    <User size={15} />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-gray-200 uppercase tracking-wider">
                    {t('orders.contractedParties')}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Dentist Card */}
                  <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/20 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-blue-100/70 dark:border-blue-900/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-black border border-blue-500/20">
                        {t('orders.treatingDentist')}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                        <User size={16} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <span className="block text-sm font-black text-slate-800 dark:text-gray-100 truncate">{order.dentistName}</span>
                      <div className="text-[11px] text-gray-500 dark:text-slate-400 space-y-1.5 mt-2">
                        {order.dentistEmail && (
                          <span className="flex items-center gap-1.5 font-medium truncate"><Mail size={13} className="text-blue-500 shrink-0" /> {order.dentistEmail}</span>
                        )}
                        {order.dentistPhone && (
                          <span className="flex items-center gap-1.5 font-medium truncate"><Phone size={13} className="text-blue-500 shrink-0" /> {order.dentistPhone}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lab Card */}
                  <div className="bg-gradient-to-br from-emerald-50/60 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/20 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-emerald-100/70 dark:border-emerald-900/40 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-black border border-emerald-500/20">
                          {t('orders.compensationLab')}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                          <FlaskConical size={16} />
                        </div>
                      </div>
                      <div className="pt-2 min-w-0">
                        <span className="block text-sm font-black text-slate-800 dark:text-gray-100 truncate">{order.labName}</span>
                        <span className="text-[11px] text-gray-400 dark:text-slate-400 block mt-1.5 font-bold">{t('orders.expectedDeliveryDate')}</span>
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 px-2.5 py-1 rounded-xl w-max max-w-full truncate">
                          <Calendar size={13} className="shrink-0" /> {formatDate(order.raw?.deliveryDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Required Items */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                    <Hammer size={15} />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-gray-200 uppercase tracking-wider">
                    {t('orders.requiredItems')}
                  </h4>
                </div>

                <div className="bg-slate-50/70 dark:bg-slate-900/50 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800/80">
                  {order.items && order.items.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3 [&>div]:pt-3 first:pt-0">
                      {order.items.map((item, idx) => (
                        <div key={item.itemId || idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-2 sm:gap-0">
                          <div>
                            <span className="font-extrabold text-slate-800 dark:text-gray-200 text-sm">{translateCompensation(item.compensationType)}</span>
                            <span className="text-gray-400 dark:text-slate-500 block text-[10px] font-semibold mt-0.5">{t('orders.itemId')}: #{item.itemId}</span>
                          </div>
                          <div className="text-right sm:text-left w-full sm:w-auto">
                            <span className="text-[10px] text-gray-400 dark:text-slate-500 block font-bold">{t('orders.affectedTeeth')}</span>
                            <div className="flex flex-wrap gap-1.5 mt-1 justify-start sm:justify-end">
                              {item.toothNumbers && item.toothNumbers.map((num, i) => (
                                <span key={i} className="bg-primary/10 text-primary font-black px-2.5 py-0.5 rounded-lg text-[11px] border border-primary/20">
                                  {num}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs text-gray-400 dark:text-slate-500 font-bold">
                      {t('orders.noItemsDetails')}
                    </div>
                  )}
                </div>
              </div>

              {/* 6. Prices & Costs */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/30">
                    <DollarSign size={15} />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-gray-200 uppercase tracking-wider">
                    {t('orders.pricesAndCosts')}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-slate-50/70 dark:bg-slate-900/50 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800/80">
                  <div className="p-3 bg-white dark:bg-slate-800/70 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="block text-[11px] font-bold text-gray-400 dark:text-slate-400">{t('orders.estimatedPriceTitle')}</span>
                    <span className="text-sm font-black text-slate-800 dark:text-gray-200 mt-1 block">
                      {order.estimatedPrice ? `${order.estimatedPrice.toLocaleString()} ${t('orders.currency')}` : t('orders.freeOrUnknown')}
                    </span>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl border border-violet-500/20">
                    <span className="block text-[11px] font-bold text-violet-600 dark:text-violet-400">{t('orders.finalPriceTitle')}</span>
                    <span className="text-base font-black text-violet-600 dark:text-violet-400 mt-1 block">
                      {order.finalPrice ? `${order.finalPrice.toLocaleString()} ${t('orders.currency')}` : t('orders.notDeterminedYet')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 7. Doctor Notes */}
              {order.notes && (
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                      <FileText size={15} />
                    </div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-gray-200 uppercase tracking-wider">
                      {t('orders.doctorNotesTitle')}
                    </h4>
                  </div>
                  <div className="bg-amber-50/60 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-amber-200/60 dark:border-amber-900/40 text-xs leading-relaxed font-semibold">
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
