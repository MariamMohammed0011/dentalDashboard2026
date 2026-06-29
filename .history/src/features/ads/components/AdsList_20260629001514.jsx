import React from 'react';
import { 
  Megaphone, 
  Building2, 
  CheckCircle2, 
  Check, 
  Trash2, 
  Eye, 
  ChevronRight, 
  ChevronLeft,
  Users,
  Pencil
} from 'lucide-react';

const AdsList = ({ 
  ads, 
  isLoading, 
  pagination, 
  setCurrentPage, 
  handleApproveAd, 
  handleToggleStatus, 
  handleDeleteClick, 
  handleViewClick,
  handleEditClick
}) => {
  return (
    <div className="bg-transparent flex-grow flex flex-col">
      
      {/* Cards Grid Container */}
      <div className="py-4 sm:py-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-50 border border-gray-100 rounded-[2rem] aspect-[4/5] sm:min-h-[350px] flex flex-col overflow-hidden">
                <div className="bg-gray-200 h-48 w-full"></div>
                <div className="p-5 flex flex-col gap-4 flex-grow">
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
                  <div className="h-12 bg-gray-200 rounded-xl w-full mt-auto"></div>
                </div>
              </div>
            ))
          ) : ads.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-400 font-bold flex flex-col items-center justify-center bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
              <Megaphone size={48} className="text-gray-300 opacity-80 mb-3" />
              لا توجد إعلانات مطابقة لخيارات البحث الحالية
            </div>
          ) : (
            ads.map((ad) => {
              const isApproved = ad.approvalStatus === 'approved';
              return (
                <div 
                  key={ad.id} 
                  className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group text-right relative"
                >
                  {/* Image & Overlay Indicators */}
                  <div className="w-full aspect-video relative overflow-hidden bg-gray-50 border-b border-gray-50">
                    <img 
                      src={ad.image} 
                      alt={ad.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    
                    {/* Green Eye Circle Button at Top-Left */}
                    <button
                      onClick={() => handleViewClick(ad)}
                      className="absolute top-3.5 left-3.5 z-10 w-9 h-9 rounded-full bg-[#10B981] hover:bg-[#059669] text-white flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer"
                      title="عرض التفاصيل"
                    >
                      <Eye size={18} />
                    </button>

                    {/* Target Audience Badge overlay at Bottom-Left */}
                    <div className="absolute bottom-3.5 left-3.5 z-10">
                      {ad.type === 'labs' ? (
                        <div className="inline-flex items-center gap-1.5 text-white bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                          <Building2 size={13} className="text-amber-400" />
                          <span>مخابر فقط</span>
                        </div>
                      ) : ad.type === 'both' ? (
                        <div className="inline-flex items-center gap-1.5 text-white bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                          <Users size={13} className="text-indigo-400" />
                          <span>الجميع</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-white bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                          <CheckCircle2 size={13} className="text-sky-400" />
                          <span>أطباء فقط</span>
                        </div>
                      )}
                    </div>

                    {/* ID Overlay at Bottom-Right */}
                    <span className="absolute bottom-3.5 right-3.5 z-10 text-[11px] font-extrabold text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      #{ad.id}
                    </span>
                  </div>

                  {/* Content Body */}
                  <div className="p-5 flex flex-col gap-3.5 flex-grow">
                    
                    {/* Ad Title & Description */}
                    <div className="flex flex-col gap-1">
                      <h4 className="font-black text-gray-800 text-[15px] sm:text-base line-clamp-1">
                        {ad.title || "بدون عنوان"}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed min-h-[36px]">
                        {ad.content || "لا يوجد تفاصيل إضافية لهذا الإعلان."}
                      </p>
                    </div>

                    {/* Publisher / Store Info (Subtle) */}
                    <div className="flex items-center justify-between text-xs text-gray-500 font-bold mt-1.5">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={14} className="text-[#367AFF]" />
                        <span>{ad.storeName}</span>
                      </div>
                      
                      {/* Active Status indicator */}
                      <button
                        onClick={() => handleToggleStatus(ad)}
                        className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer text-left"
                        title="تغيير الحالة النشطة"
                      >
                        <span className={`w-2 h-2 rounded-full ${ad.status === 'active' ? 'bg-[#367AFF] animate-pulse' : 'bg-rose-500'}`} />
                        <span className="text-[10px] text-gray-400 font-bold">{ad.status === 'active' ? 'نشط' : 'غير نشط'}</span>
                      </button>
                    </div>

                    {/* Controls Footer */}
                    <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100/60">
                      
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditClick(ad)}
                        className="flex-grow bg-[#E8F1FF] text-[#367AFF] hover:bg-[#367AFF] hover:text-white rounded-2xl py-2.5 px-4 font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/5 cursor-pointer"
                        title="تعديل الإعلان"
                      >
                        <Pencil size={13} />
                        <span>تعديل</span>
                      </button>

                     
                      <button
                        onClick={() => handleApproveAd(ad)}
                        disabled={isApproved}
                        className={`p-2.5 rounded-2xl border transition-all duration-200 flex items-center justify-center ${
                          isApproved
                            ? 'bg-green-50 border-green-100 text-green-500 cursor-not-allowed'
                            : 'bg-blue-50 border-blue-100 text-[#367AFF] hover:bg-[#367AFF] hover:text-white hover:shadow-md hover:shadow-blue-500/10 cursor-pointer animate-pulse'
                        }`}
                        title={isApproved ? "تمت الموافقة" : "الموافقة على الإعلان"}
                      >
                        <Check size={14} strokeWidth={3} />
                      </button>

                     
                      <button
                        onClick={() => handleDeleteClick(ad.id)}
                        className="p-2.5 rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-[#E11D48] hover:text-white hover:shadow-md hover:shadow-rose-500/10 transition-all active:scale-95 cursor-pointer"
                        title="حذف الإعلان"
                      >
                        <Trash2 size={14} />
                      </button>

                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

     
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center p-5 border border-gray-100 rounded-[2rem] bg-white shadow-sm mt-auto">
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
