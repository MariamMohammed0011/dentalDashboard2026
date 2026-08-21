import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  X, User, Phone, Mail, Calendar, Info,
  DollarSign, FileText, Activity, Layers,
  Compass, Hammer, Sparkles, Paperclip,
  AlertCircle, FlaskConical, Clock, Tag, Box,
  FileCode, Loader2, CheckCircle2, ShieldCheck, Eye
} from 'lucide-react';
import { fetchOrderStlFiles } from '../services/ordersApi';
import Stl3DViewer from './Stl3DViewer';

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  const { t } = useTranslation();
  const [stlFiles, setStlFiles] = useState([]);
  const [isLoadingStl, setIsLoadingStl] = useState(false);
  const [activeStlIndex, setActiveStlIndex] = useState(0);

  useEffect(() => {
    if (isOpen && order?.id) {
      let isMounted = true;
      setIsLoadingStl(true);
      setActiveStlIndex(0);

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
      case 'PlasticImpression': return t('orders.stages.plasticImpression') || 'طبعة بلاستيكية';
      case 'FinalImpression': return t('orders.stages.finalImpression') || 'طبعة نهائية';
      default: return stage || t('common.unknown') || 'غير محدد';
    }
  };

  const translateType = (type) => {
    switch (type) {
      case 'Traditional': return t('orders.types.traditional') || 'تقليدية';
      case 'Digital': return t('orders.types.digital') || 'رقمية';
      default: return type || t('common.unknown') || 'غير محدد';
    }
  };

  const translateCompensation = (comp) => {
    switch (comp) {
      case 'Veneer': return t('orders.compensations.veneer') || 'فينير (Veneer)';
      case 'Crown': return t('orders.compensations.crown') || 'تاج (Crown)';
      case 'Bridge': return t('orders.compensations.bridge') || 'جسر (Bridge)';
      default: return comp || t('common.unknown') || 'غير محدد';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('common.unknown') || 'غير محدد';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
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

  // const getFullFileUrl = (file) => {
  //   if (!file) return '#';
  //   if (file.fullUrl) return file.fullUrl;
  //   if (file.path) {
  //     if (file.path.startsWith('http://') || file.path.startsWith('https://')) return file.path;
  //     return `https://osnet.shop/dentconnect/${file.path.replace(/^\//, '')}`;
  //     // return `https://localhost:44334/${file.path.replace(/^\//, '')}`;
  //   }
  //   return '#';
  // };
const getFullFileUrl = (file) => {
  if (!file) return '#';
  if (file.fullUrl) return file.fullUrl;
  if (file.path) {
    if (file.path.startsWith('http://') || file.path.startsWith('https://')) return file.path;
    
    // جلب الرابط من .env.local وإزالة المائلة الزائدة
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
    const cleanPath = file.path.replace(/^\/+/, '');
    
    return `${baseUrl}/${cleanPath}`;
  }
  return '#';
};
  const isDigital = String(order.impressionType).toLowerCase() === 'digital' || String(order.impressionType) === 'رقمية' || stlFiles.length > 0;
  const currentStlFile = stlFiles[activeStlIndex] || stlFiles[0];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-zain" dir="rtl">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-xl shadow-xl overflow-hidden my-4 border border-slate-200 dark:border-slate-800 flex flex-col text-right font-zain"
          >
            {/* Header Toolbar */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  <Box size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {t('orders.detailsTitle') || 'تفاصيل الطلب'} <span className="font-mono text-sky-600 dark:text-sky-400">#{order.id}</span>
                    </h3>
                    {order.isUrgent && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40">
                        {t('orders.veryUrgent') || 'عاجل جداً'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {order.title || t('orders.noTitle') || 'بدون عنوان للطلب'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                aria-label="إغلاق"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[calc(85vh-75px)] overflow-y-auto custom-scrollbar space-y-6 divide-y divide-slate-100 dark:divide-slate-800/70 [&>div:not(:first-child)]:pt-6">

              {/* 1. Basic Info - Data Grid Layout */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Info size={16} className="text-sky-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {t('orders.basicInfo') || 'معلومات الحالة الأساسية'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden divide-x divide-y divide-slate-200/80 dark:divide-slate-800 rtl:divide-x-reverse bg-slate-50/40 dark:bg-slate-900/30">
                  
                  {/* Status */}
                  <div className="p-3">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                      <Tag size={13} className="text-sky-500" />
                      {t('orders.orderStatus') || 'حالة الطلب'}
                    </span>
                    <div className="mt-1.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded ${
                        order.status === 'Accepted' || order.orderStatus === 'مقبول'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          order.status === 'Accepted' || order.orderStatus === 'مقبول' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                        {order.orderStatus || order.status}
                      </span>
                    </div>
                  </div>

                  {/* Created At */}
                  <div className="p-3">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                      <Clock size={13} className="text-blue-500" />
                      {t('orders.createdAt') || 'تاريخ الإنشاء'}
                    </span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1.5 block">
                      {formatDate(order.raw?.createdAt)}
                    </span>
                  </div>

                  {/* Shade Color */}
                  <div className="p-3 ">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                      <Sparkles size={13} className="text-amber-500" />
                      {t('orders.shadeColor') }
                    </span>
                    <span className="text-xs   font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded w-max mt-1.5 block">
                      {order.shade || t('common.unknown') || 'غير محدد'}
                    </span>
                  </div>

                  {/* Structure Type */}
                  <div className="p-3">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                      <Layers size={13} className="text-purple-500" />
                      {t('orders.structureType') || 'نوع التركيبة'}
                    </span>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-1.5 block">
                      {order.isTemporary ? (t('orders.temporary') || 'مؤقتة') : (t('orders.permanent') || 'دائمة')}
                    </span>
                  </div>

                  {/* Attachments */}
                  <div className="p-3">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                      <Paperclip size={13} className="text-emerald-500" />
                      {t('orders.attachments') || 'المرفقات'}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1.5 block">
                      {order.hasAccessories ? (t('orders.hasAttachments') || 'يوجد مرفقات') : (t('orders.noAttachments') || 'لا يوجد')}
                    </span>
                  </div>

                  {/* Urgency Degree */}
                  <div className="p-3">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                      <AlertCircle size={13} className={order.isUrgent ? 'text-rose-500' : 'text-slate-400'} />
                      {t('orders.urgencyDegree') || 'الاستعجال'}
                    </span>
                    <span className={`text-xs font-bold mt-1.5 block ${order.isUrgent ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {order.isUrgent ? (t('orders.urgentDesc') || 'عاجل جداً') : (t('orders.normalDesc') || 'عادي')}
                    </span>
                  </div>

                </div>
              </div>

              {/* 2. Impression Info - Simple Clean Row */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Compass size={16} className="text-indigo-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {t('orders.impressionStageAndType') || 'مرحلة ونوع الطبعة'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {t('orders.impressionStage') || 'مرحلة الطبعة'}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {translateStage(order.impressionStage)}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {t('orders.impressionType') || 'نوع الطبعة'}
                    </span>
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                      {translateType(order.impressionType)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Interactive 3D STL Scans Section */}
              {isDigital && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <Eye size={16} className="text-sky-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {t('orders.digitalScansTitle') || 'المسحات الرقمية وتدقيق 3D'}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 border border-emerald-500/20">
                      <ShieldCheck size={12} className="text-emerald-500" />
                      معاينة آمنة
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-3">
                    {isLoadingStl ? (
                      <div className="flex items-center justify-center py-8 gap-2 text-xs font-medium text-sky-600 dark:text-sky-400">
                        <Loader2 size={16} className="animate-spin" />
                        <span>{t('orders.loadingStlFiles') || 'جاري فحص وجلب المسحات الرقمية...'}</span>
                      </div>
                    ) : stlFiles.length > 0 ? (
                      <>
                        {stlFiles.length > 1 && (
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
                            {stlFiles.map((file, idx) => {
                              const fName = file.path ? file.path.split('/').pop() : `Scan_${idx + 1}.stl`;
                              return (
                                <button
                                  key={file.id || idx}
                                  type="button"
                                  onClick={() => setActiveStlIndex(idx)}
                                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                                    activeStlIndex === idx
                                      ? 'bg-sky-500 text-white font-bold'
                                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                  }`}
                                >
                                  <FileCode size={13} />
                                  <span>{fName}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <Stl3DViewer
                          fileUrl={getFullFileUrl(currentStlFile)}
                          fileName={
                            currentStlFile?.path
                              ? currentStlFile.path.split('/').pop()
                              : order?.title
                              ? `Scan_${order.id}.stl`
                              : 'نموذج STL الثلاثي الأبعاد'
                          }
                        />
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
                        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
                          <FileCode size={26} />
                        </div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">
                          لم يتم إرفاق ملف طبعة رقمية (STL)
                        </h4>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-sm">
                          لم يتم العثور على مسح ثلاثي الأبعاد مرفوع لهذا الطلب في النظام حتى الآن.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. Parties - Two Column Clean View */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <User size={16} className="text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {t('orders.contractedParties') || 'الأطراف المتعاقدة'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Doctor Info */}
                  <div className="p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30">
                    <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wide block mb-1">
                      {t('orders.treatingDentist') || 'الطبيب المعالج'}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                      {order.dentistName}
                    </span>
                    <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                      {order.dentistEmail && (
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} className="text-sky-500" />
                          <span className="truncate">{order.dentistEmail}</span>
                        </div>
                      )}
                      {order.dentistPhone && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-sky-500" />
                          <span>{order.dentistPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lab Info */}
                  <div className="p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide block mb-1">
                        {t('orders.compensationLab') || 'مختبر التعويضات'}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                        {order.labName}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {t('orders.expectedDeliveryDate') || 'التسليم المتوقع:'}
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Calendar size={12} className="text-emerald-500" />
                        {formatDate(order.raw?.deliveryDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Required Items - Clean Table Style */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Hammer size={16} className="text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {t('orders.requiredItems') || 'المواد المطلوبة للتعويض السني'}
                  </span>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden">
                  {order.items && order.items.length > 0 ? (
                    <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
                      {order.items.map((item, idx) => (
                        <div key={item.itemId || idx} className="p-3 bg-white dark:bg-slate-900 flex items-center justify-between flex-wrap gap-2 text-xs">
                          <div>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                              {translateCompensation(item.compensationType)}
                            </span>
                            <span className="text-slate-400 text-[11px] font-mono mx-2">
                              #{item.itemId}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              {t('orders.affectedTeeth') || 'الأسنان'}:
                            </span>
                            <div className="flex items-center gap-1">
                              {item.toothNumbers && item.toothNumbers.map((num, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono text-[11px] font-bold border border-sky-500/20">
                                  #{num}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      {t('orders.noItemsDetails') || 'لا توجد تفاصيل مواد محددة لهذا الطلب.'}
                    </div>
                  )}
                </div>
              </div>

              {/* 6. Prices and Costs */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <DollarSign size={16} className="text-violet-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {t('orders.pricesAndCosts') || 'التكاليف والأسعار'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {t('orders.estimatedPriceTitle') || 'السعر التقديري'}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {order.estimatedPrice ? `${order.estimatedPrice.toLocaleString()} ${t('orders.currency') || '$'}` : (t('orders.freeOrUnknown') || 'غير محدد')}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-violet-200 dark:border-violet-900/50 bg-violet-50/30 dark:bg-violet-950/20 flex items-center justify-between">
                    <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
                      {t('orders.finalPriceTitle') || 'السعر النهائي'}
                    </span>
                    <span className="text-sm font-bold text-violet-700 dark:text-violet-300">
                      {order.finalPrice ? `${order.finalPrice.toLocaleString()} ${t('orders.currency') || '$'}` : (t('orders.notDeterminedYet') || 'قيد المراجعة')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 7. Doctor Notes */}
              {order.notes && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <FileText size={16} className="text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t('orders.doctorNotesTitle') || 'ملاحظات الطبيب والمعمل'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border-r-4 border-r-amber-500 border border-amber-500/20 bg-amber-500/10 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
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