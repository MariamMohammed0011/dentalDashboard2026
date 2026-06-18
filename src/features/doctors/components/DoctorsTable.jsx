import React from 'react';
import { MapPin, Phone, Mail, Calendar, Building2, Users, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';

// 💡 أضفنا البروب onToggleStatus والدالة الاختيارية isUpdatingStatus للـ Loading
const DoctorsTable = ({ doctors, isLoading, onToggleStatus, updatingDoctorId }) => {
  
  // دالة موحدة لإنشاء شارة الحالة بناءً على القيم القادمة من الـ API
  const renderStatusBadge = (status) => {
    const currentStatus = status?.toLowerCase();

    if (currentStatus === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black border bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          نشط
        </span>
      );
    }

    if (currentStatus === 'suspended') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black border bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          معلق
        </span>
      );
    }

    if (currentStatus === 'pendingadminapproval') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black border bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          قيد المراجعة
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black border bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
        {status || 'غير محدد'}
      </span>
    );
  };

  // 💡 دالة معالجة ضغط زر الـ Toggle (تبديل الحالة بين Active و Suspended)
  const handleToggleClick = (docId, currentStatus) => {
    if (!onToggleStatus) return;
    
    const normalizedStatus = currentStatus?.toLowerCase();
    if (normalizedStatus === 'active') {
      onToggleStatus(docId, 'Suspended');
    } else if (normalizedStatus === 'suspended') {
      onToggleStatus(docId, 'Active');
    }
  };

  return (
    <div className="w-full" dir="rtl">
      
      {/* ── Desktop View (Table Layout) ── */}
      <div className="hidden md:block overflow-x-auto no-scrollbar">
        <table className="w-full text-right border-collapse min-w-[700px] lg:min-w-0">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800/80 text-text-muted dark:text-slate-400 font-black text-xs uppercase bg-slate-50/50 dark:bg-slate-800/20">
              <th className="py-3 px-3 text-right">الطبيب</th>
              <th className="py-3 px-3 text-right">العيادة / العنوان</th>
              <th className="py-3 px-3 text-right">التواصل</th>
              <th className="py-3 px-3 text-right">تاريخ الانضمام</th>
              <th className="py-3 px-3 text-center">الحالة</th>
              {/* 💡 إضافة هيدر لعمود الإجراءات */}
              <th className="py-3 px-3 text-center">تغيير الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="6" className="py-4 px-3">
                    <div className="h-9 bg-bg-main/30 dark:bg-slate-800/30 rounded-xl w-full"></div>
                  </td>
                </tr>
              ))
            ) : doctors.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-text-muted dark:text-slate-500 font-bold">
                  <Users size={36} className="mx-auto mb-2 text-text-muted/40 dark:text-slate-600" />
                  لا يوجد أطباء مسجلون حالياً
                </td>
              </tr>
            ) : (
              doctors.map((doc) => {
                const formattedDate = doc.createdAt 
                  ? new Date(doc.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'numeric', day: 'numeric' }) 
                  : 'غير محدد';
                
                const isPending = doc.status?.toLowerCase() === 'pendingadminapproval';
                const isActive = doc.status?.toLowerCase() === 'active';
                const isCurrentlyUpdating = updatingDoctorId === doc.id;

                return (
                  <tr key={doc.id} className="hover:bg-white/40 dark:hover:bg-slate-800/20 transition-all duration-200">
                    
                    {/* Doctor Info */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full border border-primary/20 shrink-0 overflow-hidden shadow-sm">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name || 'طبيب')}&background=e0f2fe&color=367AFF&bold=true&size=64`} 
                            alt={doc.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-text-main dark:text-gray-100 text-[13px] truncate leading-normal">{doc.name}</span>
                          <span className="text-[10px] text-text-muted dark:text-slate-400 font-medium">ID: #{doc.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Clinic Name & Location */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-text-main dark:text-gray-200 text-[13px] truncate flex items-center gap-1">
                          <Building2 size={12} className="text-sky-500 dark:text-sky-400 shrink-0" />
                          {doc.clinicName || "غير محدد"}
                        </span>
                        {(doc.city || doc.country || doc.clinicAddress) && (
                          <div className="flex items-center gap-0.5 text-text-muted dark:text-slate-400 font-medium text-[11px] truncate mt-0.5">
                            <MapPin size={11} className="text-rose-500 dark:text-rose-400 shrink-0" />
                            <span className="truncate">
                              {[doc.clinicAddress, doc.city, doc.country].filter(Boolean).join('، ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Contact details */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col gap-1 text-[11px] text-text-main dark:text-gray-300 font-medium">
                        {doc.phone && (
                          <span className="flex items-center gap-1.5 justify-start">
                            <Phone size={11} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                            <span dir="ltr">{doc.phone}</span>
                          </span>
                        )}
                        {doc.email && (
                          <span className="flex items-center gap-1.5 justify-start">
                            <Mail size={11} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
                            <span dir="ltr" className="text-text-muted dark:text-slate-400 truncate max-w-[150px]">{doc.email}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="py-3.5 px-3 text-[12px] text-text-muted dark:text-slate-400 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-violet-500 dark:text-violet-400 shrink-0" />
                        {formattedDate}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3 text-center">
                      {renderStatusBadge(doc.status)}
                    </td>

                    {/* 💡 عمود الـ Toggle المضاف للديسكتوب */}
                    <td className="py-3.5 px-3 text-center">
                      {isCurrentlyUpdating ? (
                        <Loader2 size={18} className="animate-spin mx-auto text-primary" />
                      ) : isPending ? (
                        <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium select-none">—</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleClick(doc.id, doc.status)}
                          className="focus:outline-none transition-transform active:scale-95 duration-150 inline-block align-middle"
                          title={isActive ? "تعليق الحساب" : "تنشيط الحساب"}
                        >
                          {isActive ? (
                            <ToggleRight size={28} className="text-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer" />
                          ) : (
                            <ToggleLeft size={28} className="text-slate-300 dark:text-slate-600 hover:text-rose-400 transition-colors cursor-pointer" />
                          )}
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile View (Responsive Layout) ── */}
      <div className="block md:hidden">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white/50 dark:bg-slate-800/30 p-5 rounded-2xl animate-pulse h-[140px]" />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="py-12 text-center text-text-muted dark:text-slate-500 font-bold">
            <Users size={36} className="mx-auto mb-2 text-text-muted/40 dark:text-slate-600" />
            لا يوجد أطباء مسجلون حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {doctors.map((doc) => {
              const formattedDate = doc.createdAt 
                ? new Date(doc.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'numeric', day: 'numeric' }) 
                : 'غير محدد';

              const isPending = doc.status?.toLowerCase() === 'pendingadminapproval';
              const isActive = doc.status?.toLowerCase() === 'active';
              const isCurrentlyUpdating = updatingDoctorId === doc.id;

              return (
                <div 
                  key={doc.id} 
                  className="bg-white/70 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm relative overflow-hidden flex flex-col gap-3.5 hover:shadow-md hover:border-primary/25 transition-all duration-300"
                >
                  {/* Top Header: ID & Status */}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/50">
                    <span className="text-xs font-bold text-text-muted dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-3 py-1 rounded-xl">ID: #{doc.id}</span>
                    {renderStatusBadge(doc.status)}
                  </div>

                  {/* Doctor Info */}
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full border border-primary/25 text-primary flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name || 'طبيب')}&background=e0f2fe&color=367AFF&bold=true&size=64`} 
                        alt={doc.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="text-right flex flex-col min-w-0">
                      <span className="font-extrabold text-text-main dark:text-gray-100 text-sm leading-tight truncate">{doc.name}</span>
                      <span className="text-xs text-sky-500 dark:text-sky-400 font-bold mt-1 flex items-center gap-1">
                        <Building2 size={11} className="text-sky-500 dark:text-sky-400" />
                        {doc.clinicName || "عيادة غير محددة"}
                      </span>
                    </div>
                  </div>

                  {/* Locations & Contacts */}
                  <div className="flex flex-col gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800/50 text-[11px] text-right">
                    
                    {(doc.city || doc.country || doc.clinicAddress) && (
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-rose-500 dark:text-rose-400 shrink-0" />
                        <span className="font-medium text-text-main dark:text-gray-300 truncate">
                          {[doc.clinicAddress, doc.city, doc.country].filter(Boolean).join('، ')}
                        </span>
                      </div>
                    )}
                    
                    {doc.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                        <span className="font-medium font-sans text-text-main dark:text-gray-300" dir="ltr">{doc.phone}</span>
                      </div>
                    )}

                    {doc.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
                        <span className="font-medium font-sans text-text-muted dark:text-slate-400 truncate max-w-[190px]" dir="ltr">{doc.email}</span>
                      </div>
                    )}

                    {/* 💡 قسم التبديل المضاف أسفل كارد الجوال */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/30">
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-slate-500">
                        <Calendar size={12} className="text-violet-500 dark:text-violet-400 shrink-0" />
                        <span>انضم في: {formattedDate}</span>
                      </div>

                      {!isPending && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black text-text-muted dark:text-slate-400">تغيير الحالة:</span>
                          {isCurrentlyUpdating ? (
                            <Loader2 size={14} className="animate-spin text-primary" />
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleClick(doc.id, doc.status)}
                              className="focus:outline-none"
                            >
                              {isActive ? (
                                <ToggleRight size={24} className="text-emerald-500" />
                              ) : (
                                <ToggleLeft size={24} className="text-slate-300 dark:text-slate-600" />
                              )}
                            </button>
                          )}
                        </div>
                      )}
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

export default DoctorsTable;