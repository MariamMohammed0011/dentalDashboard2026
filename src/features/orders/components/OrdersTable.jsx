import React from 'react';
import { Eye } from 'lucide-react';

const OrdersTable = ({ orders, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F0F0F0] rounded-[1.5rem] md:rounded-[2rem] p-3 sm:p-4 md:p-6 shadow-sm border border-border-main" dir="rtl">
      {/* عرض الجدول للشاشات الكبيرة */}
      <div className="hidden md:block overflow-hidden border border-gray-300 rounded-[1.5rem]">
        <table className="w-full text-center border-collapse bg-[#F0F0F0]">
          <thead>
            <tr className="bg-[#F0F0F0] border-b border-gray-300">
              <th className="px-4 py-4 font-bold text-text-main text-sm border-l border-gray-300 last:border-l-0">رقم الطلب</th>
              <th className="px-4 py-4 font-bold text-text-main text-sm border-l border-gray-300">الطبيب</th>
              <th className="px-4 py-4 font-bold text-text-main text-sm border-l border-gray-300">المخبر</th>
              <th className="px-4 py-4 font-bold text-text-main text-sm border-l border-gray-300">شركة التوصيل</th>
              <th className="px-4 py-4 font-bold text-text-main text-sm border-l border-gray-300">حالة الطلب</th>
              <th className="px-4 py-4 font-bold text-text-main text-sm border-l border-gray-300">حالة التوصيل</th>
              <th className="px-4 py-4 font-bold text-text-main text-sm border-l border-gray-300">تاريخ الإنشاء</th>
              <th className="px-4 py-4 font-bold text-text-main text-sm">عرض</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr 
                key={order.id} 
                className="bg-transparent hover:bg-white transition-colors border-b border-gray-200 last:border-b-0 group"
              >
                <td className="px-4 py-4 text-text-main text-sm border-l border-gray-200 last:border-l-0">{order.id}</td>
                <td className="px-4 py-4 text-text-main text-sm border-l border-gray-200">{order.doctor}</td>
                <td className="px-4 py-4 text-text-main text-sm border-l border-gray-200">{order.lab}</td>
                <td className="px-4 py-4 text-text-main text-sm border-l border-gray-200">{order.deliveryCompany}</td>
                <td className="px-4 py-4 text-text-main text-sm border-l border-gray-200">{order.orderStatus}</td>
                <td className="px-4 py-4 text-text-main text-sm border-l border-gray-200">{order.deliveryStatus}</td>
                <td className="px-4 py-4 text-text-main text-sm border-l border-gray-200">{order.createdAt}</td>
                <td className="px-4 py-4">
                  <button className="flex justify-center w-full text-blue-600 hover:scale-110 transition-transform">
                    <Eye size={22} />
                  </button>
                </td>
              </tr>
            ))}
            {/* أسطر فارغة لتكملة الشكل كما في الصورة */}
            {[1, 2, 3, 4].map((i) => (
              <tr key={`empty-${i}`} className="bg-transparent border-b border-gray-200 last:border-b-0 h-[53px]">
                <td className="border-l border-gray-200 last:border-l-0"></td>
                <td className="border-l border-gray-200"></td>
                <td className="border-l border-gray-200"></td>
                <td className="border-l border-gray-200"></td>
                <td className="border-l border-gray-200"></td>
                <td className="border-l border-gray-200"></td>
                <td className="border-l border-gray-200"></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* عرض البطاقات للجوال */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {orders?.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">#{order.id}</span>
              <button className="text-blue-600">
                <Eye size={20} />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">الطبيب:</span>
                <span className="font-bold text-text-main">{order.doctor}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">المخبر:</span>
                <span className="font-bold text-text-main">{order.lab}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">حالة الطلب:</span>
                <span className="font-bold text-primary">{order.orderStatus}</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-gray-100">
                <span className="text-text-muted">{order.createdAt}</span>
                <span className="text-text-muted">{order.deliveryCompany}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersTable;
