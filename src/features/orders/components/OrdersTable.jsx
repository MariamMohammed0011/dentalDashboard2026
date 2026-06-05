import React, { useState } from 'react';
import { Eye, Clock, User, Building2, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import framerImg from '../../../assets/framer.png';
import OrderDetailsModal from './OrderDetailsModal';

const OrdersTable = ({ orders, isLoading }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full" dir="rtl">
      {/* عرض الجدول للشاشات الكبيرة والمتوسطة مع سكرول أفقي */}
      <div className="hidden md:block overflow-hidden">
        <table className="w-full text-center border-collapse  table-auto">
          <thead>
            <tr className="bg-[#F0F0F0] border-b border-gray-300">
              <th className="px-4 py-5 font-bold text-gray-700 text-sm border-l border-gray-300 last:border-l-0">رقم الطلب</th>
              <th className="px-4 py-5 font-bold text-gray-700 text-sm border-l border-gray-300">الطبيب</th>
              <th className="px-4 py-5 font-bold text-gray-700 text-sm border-l border-gray-300">المخبر</th>
              <th className="px-4 py-5 font-bold text-gray-700 text-sm border-l border-gray-300">حالة الطلب</th>
              <th className="px-4 py-5 font-bold text-gray-700 text-sm border-l border-gray-300">تاريخ الإنشاء</th>
              <th className="px-4 py-5 font-bold text-gray-700 text-sm">عرض</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr
                key={order.id}
                className="bg-transparent hover:bg-gray-50/50 transition-colors border-b border-gray-200 last:border-b-0"
              >
                <td className="px-4 py-4 text-gray-600 text-sm border-l border-gray-200 last:border-l-0">{order.id}</td>
                <td className="px-4 py-4 text-gray-600 text-sm border-l border-gray-200 font-medium">{order.doctor}</td>
                <td className="px-4 py-4 text-gray-600 text-sm border-l border-gray-200 font-medium">{order.lab}</td>
                <td className="px-4 py-4 text-gray-600 text-sm border-l border-gray-200">
                  <span className="text-primary font-bold">{order.orderStatus}</span>
                </td>
                <td className="px-4 py-4 font-bold text-gray-400 text-sm border-l border-gray-200">{order.createdAt}</td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Eye size={22} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* عرض البطاقات للجوال بتصميم مودرن */}
      <div className="grid grid-cols-1 gap-5 md:hidden">
        {orders?.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-white p-5 rounded-[1.8rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all duration-300"
          >
            {/* الخلفية المزخرفة */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
              <img src={framerImg} alt="" className="w-full h-full object-cover" />
            </div>

            {/* الخط الجانبي الأيمن التفاعلي */}
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top z-20 rounded-l-full" />

            {/* المحتوى الرئيسي */}
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <span className="text-[10px] font-black">#{order.id}</span>
                  </div>
                  <span className="text-[12px] text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {order.createdAt}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsModalOpen(true);
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm cursor-pointer"
                >
                  <Eye size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-gray-50 text-gray-400">
                      <User size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-400">الطبيب</span>
                      <span className="text-[14px] font-bold text-gray-700">{order.doctor}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-gray-400">حالة الطلب</span>
                    <span className="text-[13px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-lg mt-1">{order.orderStatus}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-gray-300" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400">المخبر</span>
                      <span className="text-[12px] font-semibold text-gray-600 truncate">{order.lab}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* مودال تفاصيل الطلبية */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrdersTable;
