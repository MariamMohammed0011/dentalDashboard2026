import React from 'react';
import { 
  Users, 
  MapPin, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  Eye,
  Trash2,
  Pencil
} from 'lucide-react';

const UsersTable = ({ 
  users, 
  isLoading, 
  onAddAdClick,
  onViewClick,
  onEditClick,
  onDeleteClick
}) => {
  return (
    <div className="bg-transparent rounded-2xl overflow-hidden flex-grow flex flex-col">
      
      
      <div className="hidden lg:block overflow-x-auto custom-scrollbar">
        <table className="w-full text-center border-collapse table-fixed">
          <thead>
            <tr className="border-b border-border-main/30 text-text-muted font-bold text-xs sm:text-sm bg-gray-50/50 dark:bg-slate-800/30">
              <th className="py-4 px-4 text-right font-bold text-text-muted w-[23%]">العميل</th>
              <th className="py-4 px-4 text-right font-bold text-text-muted w-[20%]">المنشأة / العيادة</th>
              <th className="py-4 px-4 text-right font-bold text-text-muted w-[17%]">بيانات التواصل</th>
              <th className="py-4 px-4 text-center font-bold text-text-muted w-[13%]">الإعلانات النشطة</th>
              <th className="py-4 px-4 text-center font-bold text-text-muted w-[27%]">العمليات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="5" className="py-5 px-4 border-b border-border-main/20">
                    <div className="h-12 bg-bg-main/30 rounded-2xl w-full"></div>
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-16 text-center text-text-muted font-bold">
                  <Users size={48} className="mx-auto mb-3 text-text-muted/50 opacity-80" />
                  لا يوجد مستخدمو إعلانات مسجلون حالياً
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const hasAds = (user.advertisementsCount || 0) > 0;
                const isAdmin = Number(user.id) === 1;

                return (
                  <tr key={user.id} className="bg-transparent hover:bg-primary/5 transition-colors border-b border-border-main/10 group">
                    
                    
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center gap-2.5 justify-start min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shadow-sm flex-shrink-0">
                          {user.name ? user.name.charAt(0) : <Users size={14} />}
                        </div>
                        <div className="text-right flex flex-col min-w-0">
                          <span className="font-bold text-text-main text-xs sm:text-sm truncate">{user.name || "بدون اسم"}</span>
                          <span className="text-[10px] text-text-muted font-semibold mt-0.5">ID: #{user.id}</span>
                        </div>
                      </div>
                    </td>

                    
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex flex-col justify-start min-w-0">
                        <span className="font-bold text-text-main text-xs sm:text-sm truncate">{user.namePlace || "غير محدد"}</span>
                        <div className="flex items-center gap-1 text-text-muted font-medium text-[11px] mt-0.5">
                          <MapPin size={10} className="text-text-muted/60 flex-shrink-0" />
                          <span className="truncate">
                            {user.cityPlace || "دمشق"}
                            {user.countryPlace ? `، ${user.countryPlace}` : ""}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* بيانات التواصل (Contact Info) */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-text-main text-xs sm:text-sm font-mono truncate block" dir="ltr">
                        {user.phone || "-"}
                      </span>
                    </td>

                    {/* الإعلانات النشطة (Active Ads Status) */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 justify-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          hasAds 
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                            : "bg-primary/10 text-primary border border-primary/20"
                        }`}>
                          {hasAds ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                        </div>
                        <span className={`text-[12px] font-black whitespace-nowrap ${
                          hasAds ? "text-emerald-500" : "text-primary"
                        }`}>
                          {hasAds ? `${user.advertisementsCount}` : "0"} إعلان
                        </span>
                      </div>
                    </td>

                    {/* 🛠️ العمليات - تم دمج وتنظيف كافة الأزرار هنا لتكون متناسقة */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2 flex-nowrap">
                        {/* View Details Button */}
                        <button
                          onClick={() => onViewClick(user)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-primary/10 text-gray-500 hover:text-primary transition-all duration-200 cursor-pointer active:scale-95 flex-shrink-0"
                          title="عرض تفاصيل العميل"
                        >
                          <Eye size={14} />
                        </button>

                        {/* Edit User Button */}
                        <button
                          onClick={() => onEditClick(user)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-500/10 dark:bg-blue-950/20 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 cursor-pointer active:scale-95 flex-shrink-0"
                          title="تعديل بيانات المستخدم"
                        >
                          <Pencil size={13} />
                        </button>

                        {/* Delete User Button */}
                        <button
                          onClick={() => !isAdmin && onDeleteClick(user)}
                          disabled={isAdmin}
                          className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 flex-shrink-0 ${
                            isAdmin
                              ? "bg-gray-100 dark:bg-slate-800/50 text-gray-400 dark:text-slate-600 cursor-not-allowed opacity-50"
                              : "bg-red-500/10 dark:bg-red-950/20 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer active:scale-95"
                          }`}
                          title={isAdmin ? "لا يمكن حذف المسؤول الأساسي" : "حذف المستخدم"}
                        >
                          <Trash2 size={14} />
                        </button>

                        {/* Add Ad Button */}
                        <button
                          onClick={() => onAddAdClick(user)}
                          className="bg-primary text-white hover:bg-primary/95 px-2.5 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all duration-200 hover:scale-[1.02] active:scale-95 whitespace-nowrap justify-center cursor-pointer shadow-sm flex-shrink-0"
                        >
                          <Plus size={12} strokeWidth={2.5} />
                          <span>إضافة إعلان</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Small Screen Layout (Modern Cards Grid) */}
      <div className="block lg:hidden p-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-bg-main/30 p-5 rounded-2xl animate-pulse h-[140px]" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-text-muted font-bold">
            <Users size={48} className="mx-auto mb-3 text-text-muted/50 opacity-80" />
            لا يوجد مستخدمو إعلانات مسجلون حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {users.map((user) => {
              const hasAds = (user.advertisementsCount || 0) > 0;
              const isAdmin = Number(user.id) === 1;

              return (
                <div 
                  key={user.id} 
                  className="bg-bg-card p-5 rounded-2xl border border-border-main/40 shadow-sm relative overflow-hidden flex flex-col gap-4 hover:shadow-md transition-shadow"
                >
                  {/* Top Bar: ID and Action Buttons */}
                  <div className="flex justify-between items-center pb-3 border-b border-border-main/30">
                    <span className="text-xs font-bold text-text-muted bg-bg-main/50 px-3 py-1 rounded-xl">ID: #{user.id}</span>
                    
                    <div className="flex items-center gap-1.5">
                      {/* View Details Button */}
                      <button 
                        onClick={() => onViewClick(user)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-bg-main/40 border border-border-main/40 text-text-muted hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all cursor-pointer"
                        title="عرض"
                      >
                        <Eye size={14} />
                      </button>

                      {/* Edit Button */}
                      <button 
                        onClick={() => onEditClick(user)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-all cursor-pointer active:scale-95"
                        title="تعديل"
                      >
                        <Pencil size={13} />
                      </button>

                      {/* Delete User Button */}
                      <button 
                        onClick={() => !isAdmin && onDeleteClick(user)}
                        disabled={isAdmin}
                        className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                          isAdmin
                            ? "bg-gray-100 dark:bg-slate-800/50 text-gray-400 dark:text-slate-600 cursor-not-allowed opacity-50"
                            : "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer active:scale-95"
                        }`}
                        title={isAdmin ? "لا يمكن حذف المسؤول الأساسي" : "حذف"}
                      >
                        <Trash2 size={14} />
                      </button>

                      {/* Add Ad Button */}
                      <button 
                        onClick={() => onAddAdClick(user)}
                        className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white px-3 py-1.5 rounded-xl font-bold text-xs transition-all duration-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} strokeWidth={2.5} />
                        إضافة إعلان
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex gap-3 justify-start items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20 flex-shrink-0">
                      {user.name ? user.name.charAt(0) : <Users size={16} />}
                    </div>
                    <div className="text-right flex flex-col flex-grow">
                      <span className="font-extrabold text-text-main text-sm">{user.name || "بدون اسم"}</span>
                      <span className="text-xs text-text-muted font-mono mt-0.5" dir="ltr">{user.phone || "-"}</span>
                    </div>
                  </div>

                  {/* Info List */}
                  <div className="grid grid-cols-2 gap-2 text-right pt-3 border-t border-border-main/30 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-text-muted font-bold">المنشأة:</span>
                      <span className="text-text-main font-medium truncate">{user.namePlace || "غير محدد"}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-text-muted font-bold">الإعلانات:</span>
                      <span className={`font-black ${
                        hasAds ? "text-emerald-500" : "text-primary"
                      }`}>
                        {hasAds ? `+${user.advertisementsCount}` : "0"} إعلان
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default UsersTable;