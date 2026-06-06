import React from 'react';
import { 
  Megaphone, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Check, 
  Trash2, 
  Eye, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';

const AdsList = ({ 
  ads, 
  isLoading, 
  pagination, 
  setCurrentPage, 
  handleApproveAd, 
  handleToggleStatus, 
  handleDeleteClick, 
  handleViewClick 
}) => {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex-grow flex flex-col">
      
      {/* Large/Medium Screen Table */}
      <div className="hidden lg:block overflow-x-auto custom-scrollbar">
        <table className="w-full border-separate border-spacing-y-0 text-center">
          <thead>
            <tr className="bg-[#E8F1FF] text-[#1E40AF] font-black text-[14px]">
              <th className="py-4.5 px-6 rounded-r-3xl">ID</th>
              <th className="py-4.5 px-4">الجمهور المستهدف</th>
              <th className="py-4.5 px-6 text-right">المتجر</th>
              <th className="py-4.5 px-4">حالة التأكيد</th>
              <th className="py-4.5 px-4">الحالة</th>
              <th className="py-4.5 px-6 rounded-l-3xl">العمليات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="6" className="py-5 px-6 border-b border-gray-50">
                    <div className="h-10 bg-gray-50 rounded-2xl w-full"></div>
                  </td>
                </tr>
              ))
            ) : ads.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-16 text-center text-gray-400 font-bold">
                  <Megaphone size={48} className="mx-auto mb-3 text-gray-300 opacity-80" />
                  لا توجد إعلانات مطابقة لخيارات البحث الحالية
                </td>
              </tr>
            ) : (
              ads.map((ad) => (
                <tr key={ad.id} className="bg-white hover:bg-blue-50/5 transition-colors group">
                  
                  {/* ID */}
                  <td className="py-5 px-6 border-b border-gray-50 text-gray-700 font-extrabold text-[15px]">
                    #{ad.id}
                  </td>
                  
                  {/* الجمهور المستهدف */}
                  <td className="py-5 px-4 border-b border-gray-50">
                    {ad.type === 'labs' || ad.type === 'lab' ? (
                      <div className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 border border-amber-100/50 px-3.5 py-1 rounded-full text-xs font-bold">
                        <Building2 size={14} className="text-amber-500" />
                        <span>المختبرات</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-sky-600 bg-sky-50 border border-sky-100/50 px-3.5 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 size={14} className="text-sky-500" />
                        <span>أطباء الأسنان</span>
                      </div>
                    )}
                  </td>

                  {/* المتجر */}
                  <td className="py-5 px-6 border-b border-gray-50 text-right">
                    <div className="flex items-center gap-3 justify-start">
                      <img 
                        src={ad.storeAvatar} 
                        alt={ad.storeName} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
                        }}
                      />
                      <div className="text-right flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">{ad.storeName}</span>
                        <span className="text-xs text-gray-400 font-mono mt-0.5" dir="ltr">{ad.storePhone}</span>
                      </div>
                    </div>
                  </td>

                  {/* حالة التأكيد */}
                  <td className="py-5 px-4 border-b border-gray-50">
                    {ad.approvalStatus === 'pending' && (
                      <div className="inline-flex items-center gap-1.5 text-amber-500 bg-[#FFFDF5] border border-amber-200/50 px-3.5 py-1.5 rounded-full text-xs font-bold">
                        <Clock size={13} className="text-amber-500 animate-pulse" />
                        <span>قيد الانتظار</span>
                      </div>
                    )}
                    {ad.approvalStatus === 'approved' && (
                      <div className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full text-xs font-bold">
                        <CheckCircle2 size={13} className="text-blue-500" />
                        <span>تمت الموافقة</span>
                      </div>
                    )}
                    {ad.approvalStatus === 'rejected' && (
                      <div className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 border border-rose-100/50 px-3.5 py-1.5 rounded-full text-xs font-bold">
                        <AlertCircle size={13} className="text-rose-500" />
                        <span>مرفوض</span>
                      </div>
                    )}
                  </td>

                  {/* الحالة */}
                  <td className="py-5 px-4 border-b border-gray-50">
                    {ad.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50/50 border border-blue-100/30 px-3 py-1 rounded-full text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                        نشط
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-500 bg-rose-50/50 border border-rose-100/30 px-3 py-1 rounded-full text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        غير نشط
                      </span>
                    )}
                  </td>

                  {/* العمليات */}
                  <td className="py-5 px-6 border-b border-gray-50">
                    <div className="flex items-center justify-center gap-2">
                      
                      {/* Approval button (Check) */}
                      <button
                        onClick={() => handleApproveAd(ad)}
                        disabled={ad.approvalStatus === 'approved'}
                        className={`p-2 rounded-xl border transition-all active:scale-95 ${
                          ad.approvalStatus === 'approved'
                            ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                            : 'bg-blue-50 border-blue-100 text-[#367AFF] hover:bg-[#367AFF] hover:text-white hover:shadow-md hover:shadow-blue-500/10'
                        }`}
                        title="الموافقة على الإعلان"
                      >
                        <Check size={16} strokeWidth={2.5} />
                      </button>

                      {/* Status Toggle Switch */}
                      <div className="flex items-center h-full px-1">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={ad.status === 'active'} 
                            onChange={() => handleToggleStatus(ad)} 
                            className="sr-only peer" 
                          />
                          <div className="w-10 h-5.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#367AFF]"></div>
                        </label>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteClick(ad.id)}
                        className="p-2 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-[#E11D48] hover:text-white hover:shadow-md hover:shadow-rose-500/10 transition-all active:scale-95"
                        title="حذف الإعلان"
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* View Button */}
                      <button
                        onClick={() => handleViewClick(ad)}
                        className="p-2 rounded-xl border border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-600 hover:text-white hover:shadow-md transition-all active:scale-95"
                        title="عرض تفاصيل الإعلان"
                      >
                        <Eye size={16} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Small Screen Layout (Modern Cards Grid) */}
      <div className="block lg:hidden p-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-50 p-5 rounded-3xl animate-pulse h-[160px]" />
            ))}
          </div>
        ) : ads.length === 0 ? (
          <div className="py-16 text-center text-gray-400 font-bold">
            <Megaphone size={48} className="mx-auto mb-3 text-gray-300 opacity-80" />
            لا توجد إعلانات مطابقة لخيارات البحث
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ads.map((ad) => (
              <div 
                key={ad.id} 
                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col gap-4 hover:shadow-md transition-shadow"
              >
                {/* Top Bar: ID and Action Buttons */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <span className="text-sm font-extrabold text-gray-700 bg-gray-100 px-3 py-1 rounded-xl">#{ad.id}</span>
                  
                  <div className="flex items-center gap-1.5">
                    {/* View */}
                    <button 
                      onClick={() => handleViewClick(ad)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 border border-gray-100"
                      title="عرض"
                    >
                      <Eye size={14} />
                    </button>

                    {/* Approve */}
                    <button 
                      onClick={() => handleApproveAd(ad)}
                      disabled={ad.approvalStatus === 'approved'}
                      className={`w-8 h-8 flex items-center justify-center rounded-xl border ${
                        ad.approvalStatus === 'approved'
                          ? 'bg-gray-50 text-gray-300 border-gray-100'
                          : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}
                      title="موافقة"
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </button>

                    {/* Delete */}
                    <button 
                      onClick={() => handleDeleteClick(ad.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100"
                      title="حذف"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="flex gap-3 justify-start items-center">
                  <img 
                    src={ad.storeAvatar} 
                    alt={ad.storeName} 
                    className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm"
                  />
                  <div className="text-right flex flex-col flex-grow">
                    <span className="font-extrabold text-gray-800 text-sm">{ad.storeName}</span>
                    <span className="text-xs text-gray-400 font-mono mt-0.5" dir="ltr">{ad.storePhone}</span>
                  </div>
                  <div>
                    {ad.type === 'labs' || ad.type === 'lab' ? (
                      <div className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 border border-amber-100/50 px-3 py-1 rounded-full text-xs font-bold">
                        <Building2 size={12} />
                        <span>مختبرات</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 text-sky-600 bg-sky-50 border border-sky-100/50 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 size={12} />
                        <span>أطباء أسنان</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Status Indicators */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-50 mt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-bold">تفعيل الحساب</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={ad.status === 'active'} 
                        onChange={() => handleToggleStatus(ad)} 
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:start-[2.5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#367AFF]"></div>
                    </label>
                  </div>

                  <div>
                    {ad.approvalStatus === 'pending' && (
                      <span className="inline-flex items-center gap-1 text-amber-500 bg-[#FFFDF5] border border-amber-100/30 px-3 py-1 rounded-full text-xs font-bold">
                        <Clock size={11} className="animate-pulse" />
                        قيد الانتظار
                      </span>
                    )}
                    {ad.approvalStatus === 'approved' && (
                      <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 border border-blue-100/30 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 size={11} />
                        الموافقة
                      </span>
                    )}
                    {ad.approvalStatus === 'rejected' && (
                      <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 border border-rose-100/30 px-3 py-1 rounded-full text-xs font-bold">
                        <AlertCircle size={11} />
                        مرفوض
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Table Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center p-5 border-t border-gray-100 bg-gray-50/50 mt-auto">
          <div className="text-xs sm:text-sm text-gray-500 font-bold">
            صفحة {pagination.page} من {pagination.totalPages} (الإجمالي {pagination.total} إعلان)
          </div>
          <div className="flex gap-2">
            <button 
              disabled={pagination.page === 1}
              onClick={() => setCurrentPage(pagination.page - 1)}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="الصفحة السابقة"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
            <button 
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setCurrentPage(pagination.page + 1)}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="الصفحة التالية"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdsList;
