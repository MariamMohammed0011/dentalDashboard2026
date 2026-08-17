import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Clock, User, Building2, Tag, Calendar, FileText, Inbox, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import OrderDetailsModal from './OrderDetailsModal';

const OrdersTable = ({ orders, isLoading }) => {
  const { t } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadgeStyle = (statusStr) => {
    const status = String(statusStr || '').toLowerCase().trim();
    if (status.includes('مقبول') || status.includes('accepted') || status.includes('مكتمل') || status.includes('completed')) {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/50',
        dot: 'bg-emerald-500 animate-pulse'
      };
    }
    if (status.includes('انتظار') || status.includes('pending') || status.includes('معلق')) {
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/50',
        dot: 'bg-amber-500 animate-pulse'
      };
    }
    if (status.includes('مرفوض') || status.includes('rejected') || status.includes('ملغى') || status.includes('cancelled')) {
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/50',
        dot: 'bg-rose-500'
      };
    }
    if (status.includes('جاهز') || status.includes('ready')) {
      return {
        bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/50',
        dot: 'bg-sky-500 animate-pulse'
      };
    }
    return {
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      dot: 'bg-slate-400'
    };
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 flex flex-col justify-center items-center gap-3 font-zain">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-sky-500 border-t-transparent"></div>
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">جاري تحميل طلبات الأطباء...</span>
      </div>
    );
  }

  return (
    <div className="w-full font-zain" dir="rtl">
      {/* Table Container - Desktop View */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <table className="w-full text-right border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-50/90 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-xs font-black text-slate-600 dark:text-slate-300">
              <th className="py-4 px-5 text-right w-[14%]">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <FileText size={14} className="text-sky-500" />
                  <span>{t('orders.orderNumber') || 'رقم الطلب'}</span>
                </div>
              </th>
              <th className="py-4 px-5 text-right w-[24%]">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <User size={14} className="text-sky-500" />
                  <span>{t('orders.doctor') || 'الطبيب'}</span>
                </div>
              </th>
              <th className="py-4 px-5 text-right w-[24%]">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Building2 size={14} className="text-emerald-500" />
                  <span>{t('orders.lab') || 'المخبر'}</span>
                </div>
              </th>
              <th className="py-4 px-5 text-center w-[16%]">
                <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Tag size={14} className="text-amber-500" />
                  <span>{t('orders.orderStatus') || 'حالة الطلب'}</span>
                </div>
              </th>
              <th className="py-4 px-5 text-center w-[14%]">
                <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Calendar size={14} className="text-blue-500" />
                  <span>{t('orders.createdAt') || 'تاريخ الإنشاء'}</span>
                </div>
              </th>
              <th className="py-4 px-5 text-center w-[8%]">
                <span className="text-slate-500 dark:text-slate-400">{t('orders.view') || 'عرض'}</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-bold text-slate-800 dark:text-slate-200">
            {orders && orders.length > 0 ? (
              orders.map((order) => {
                const statusStyle = getStatusBadgeStyle(order.orderStatus || order.status);
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors duration-150 group"
                  >
                    {/* Order ID */}
                    <td className="py-4 px-5 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-mono font-bold text-xs border border-sky-500/20">
                        #{order.id}
                      </span>
                    </td>

                    {/* Doctor Name */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-black shrink-0 border border-slate-200/60 dark:border-slate-700/60">
                          {order.doctor ? order.doctor.charAt(0) : 'D'}
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate" title={order.doctor}>
                          {order.doctor || t('orders.unknownDoctor') || 'طبيب غير محدد'}
                        </span>
                      </div>
                    </td>

                    {/* Lab Name */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                          <Building2 size={16} />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs truncate" title={order.lab}>
                          {order.lab || t('orders.unknownLab') || 'مخبر غير محدد'}
                        </span>
                      </div>
                    </td>

                    {/* Order Status */}
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusStyle.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        <span>{order.orderStatus || order.status}</span>
                      </span>
                    </td>

                    {/* Created At */}
                    <td className="py-4 px-5 text-center">
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold dir-ltr inline-block">
                        {order.createdAt}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-5 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
                        title={t('orders.view') || 'عرض التفاصيل'}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 font-bold text-sm">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox size={36} className="text-slate-300 dark:text-slate-700" />
                    <span>لا توجد طلبات أطباء مطابقة حالياً.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards View - Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {orders && orders.length > 0 ? (
          orders.map((order, index) => {
            const statusStyle = getStatusBadgeStyle(order.orderStatus || order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-bold text-xs border border-sky-500/20">
                      #{order.id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock size={12} />
                      {order.createdAt}
                    </span>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusStyle.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    <span>{order.orderStatus || order.status}</span>
                  </span>
                </div>

                {/* Details */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">{t('orders.doctor') || 'الطبيب'}:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{order.doctor}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">{t('orders.lab') || 'المخبر'}:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{order.lab}</span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 transition-all text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 border border-slate-200/60 dark:border-slate-700"
                >
                  <Eye size={15} />
                  <span>{t('orders.view') || 'عرض التفاصيل'}</span>
                </button>
              </motion.div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-400 font-bold text-xs border border-slate-200/80 dark:border-slate-800">
            لا توجد طلبات للعرض حالياً.
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrdersTable;
