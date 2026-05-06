import React from 'react';
import { Eye, Download } from 'lucide-react';

const ReportsTable = ({ reports, isLoading }) => {
  return (
    <div className="w-full bg-[#F2F4F7] rounded-[2.5rem] p-6 sm:p-10 border border-gray-200/50 shadow-inner" dir="rtl">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-separate border-spacing-y-0 text-center">
          <thead>
            <tr className="text-gray-600 font-bold text-[15px]">
              <th className="pb-6 px-4">رقم التقرير</th>
              <th className="pb-6 px-4">نوع التقرير</th>
              <th className="pb-6 px-4">المدة الزمنية</th>
              <th className="pb-6 px-4">حالة الطلب</th>
              <th className="pb-6 px-4">حالة التوصيل</th>
              <th className="pb-6 px-4">عرض التقرير</th>
              <th className="pb-6 px-4">تحميل التقرير</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="7" className="py-4"><div className="h-10 bg-white/50 rounded-xl w-full"></div></td>
                </tr>
              ))
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="bg-white group">
                  <td className="py-4 border-l border-gray-50 text-text-main font-medium">{report.id}</td>
                  <td className="py-4 border-l border-gray-50 text-gray-500 font-medium">{report.type}</td>
                  <td className="py-4 border-l border-gray-50 text-gray-500 font-medium">{report.duration}</td>
                  <td className="py-4 border-l border-gray-50 text-gray-500 font-medium">{report.orderStatus}</td>
                  <td className="py-4 border-l border-gray-50 text-gray-500 font-medium">{report.deliveryStatus}</td>
                  <td className="py-4 border-l border-gray-50">
                    <button className="text-primary hover:scale-110 transition-transform">
                      <Eye size={22} className="mx-auto" />
                    </button>
                  </td>
                  <td className="py-4">
                    <button className="text-primary hover:scale-110 transition-transform">
                      <Download size={22} className="mx-auto" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;
