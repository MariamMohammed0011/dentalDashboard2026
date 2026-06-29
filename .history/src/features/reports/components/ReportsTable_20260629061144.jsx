import React from 'react';
import { Eye, Download } from 'lucide-react';

const ReportsTable = ({ reports, isLoading }) => {
  return (
    <div className="w-full bg-[#F2F4F7] rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 lg:p-10 border border-gray-200/50 shadow-inner" dir="rtl">
      
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
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

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-[1.8rem] border border-gray-100 animate-pulse h-[140px]" />
          ))
        ) : (
          reports.map((report) => (
            <div 
              key={report.id}
              className="bg-white p-5 rounded-[1.8rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all duration-300"
            >
              {/* الخط الجانبي الأيمن التفاعلي */}
              <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top z-20 rounded-l-full" />
              
              <div className="relative z-10 flex flex-col gap-4">
                {/* الجزء العلوي: الرقم والأزرار */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <span className="text-sm font-black text-gray-700 bg-gray-50 px-3 py-1 rounded-xl"># {report.id}</span>
                  <div className="flex items-center gap-2">
                    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="عرض التقرير">
                      <Eye size={18} />
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="تحميل التقرير">
                      <Download size={18} />
                    </button>
                  </div>
                </div>

                {/* تفاصيل التقرير */}
                <div className="grid grid-cols-2 gap-3 text-right">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-400">نوع التقرير</span>
                    <span className="text-[13px] font-bold text-gray-700">{report.type}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-400">المدة الزمنية</span>
                    <span className="text-[13px] font-bold text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">{report.duration}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-400">حالة الطلب</span>
                    <span className="text-[13px] font-bold text-primary">{report.orderStatus}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-400">حالة التوصيل</span>
                    <span className="text-[13px] font-bold text-gray-600">{report.deliveryStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportsTable;
