import React, { useState } from 'react';
import { MapPin, Phone, Mail, Calendar, Building2, Users, Loader2, ChevronDown } from 'lucide-react';
import UserStatusModal from '../../../components/shared/UserStatusModal';

// مكون شارة الحالة التفاعلية
const StatusBadge = ({ doc, updatingDoctorId, onOpenModal }) => {
  const isCurrentlyUpdating = updatingDoctorId === doc.id;
  const currentStatus = doc.status?.toLowerCase();

  if (isCurrentlyUpdating) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black border bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-850 animate-pulse select-none">
        <Loader2 size={11} className="animate-spin text-primary shrink-0" />
        <span>جاري...</span>
      </div>
    );
  }

  const getBadgeStyle = () => {
    if (currentStatus === 'active') {
      return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/50";
    }
    if (currentStatus === 'suspended') {
      return "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100/50 dark:border-rose-900/30 hover:bg-rose-100/50 dark:hover:bg-rose-950/50";
    }
    if (currentStatus === 'pendingadminapproval' || currentStatus === 'pending') {
      return "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/30 hover:bg-amber-100/50 dark:hover:bg-amber-950/50";
    }
    return "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-150 dark:border-slate-700 hover:bg-slate-100";
  };

  const getStatusLabel = () => {
    if (currentStatus === 'active') return "نشط";
    if (currentStatus === 'suspended') return "معلق";
    if (currentStatus === 'pendingadminapproval' || currentStatus === 'pending') return "قيد المراجعة";
    return doc.status || 'غير محدد';
  };

  const getDotColor = () => {
    if (currentStatus === 'active') return "bg-emerald-500 animate-pulse";
    if (currentStatus === 'suspended') return "bg-rose-500";
    if (currentStatus === 'pendingadminapproval' || currentStatus === 'pending') return "bg-amber-500 animate-pulse";
    return "bg-slate-500";
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpenModal(doc);
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black border transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${getBadgeStyle()}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDotColor()}`} />
      <span>{getStatusLabel()}</span>
      <ChevronDown size={11} className="opacity-70 shrink-0" />
    </button>
  );
};

const DoctorsTable = ({ doctors, isLoading, onToggleStatus, updatingDoctorId }) => {
  const [selectedDocForStatus, setSelectedDocForStatus] = useState(null);
  const [tempStatus, setTempStatus] = useState(null);

  // دالة تغيير الحالة النهائية
  const handleStatusChange = (docId, nextStatus) => {
    if (!onToggleStatus) return;
    onToggleStatus(docId, nextStatus);
  };

  // فتح المودال وتخزين الحالة المؤقتة
  const openStatusModal = (doc) => {
    setSelectedDocForStatus(doc);
    setTempStatus(doc.status);
  };

  // تأكيد التعديل وإغلاق المودال
  const handleConfirmStatusChange = () => {
    if (!selectedDocForStatus) return;
    handleStatusChange(selectedDocForStatus.id, tempStatus);
    setSelectedDocForStatus(null);
  };

  return (
    <div className="w-full flex flex-col gap-3" dir="rtl">
      
      {/* ── Table Headers (Desktop View - Minimalist Borderless Headers) ── */}
      <div className="hidden md:flex items-center w-full px-6 py-2 text-slate-400 dark:text-slate-500 font-extrabold text-[12px] uppercase select-none">
        <div className="w-[26%] text-right">الطبيب</div>
        <div className="w-[26%] text-right">العيادة / العنوان</div>
        <div className="w-[26%] text-right">التواصل</div>
        <div className="w-[11%] text-right">تاريخ الانضمام</div>
        <div className="w-[11%] text-center">الحالة</div>
      </div>

      {/* ── Desktop View Rows (Smart Separated Row Cards) ── */}
      <div className="hidden md:flex flex-col gap-3">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/60 dark:bg-slate-900/40 border border-slate-100/60 dark:border-slate-800/60 rounded-2xl h-[78px] w-full" />
          ))
        ) : doctors.length === 0 ? (
          <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-12 text-center text-text-muted dark:text-slate-500 font-bold w-full">
            <Users size={36} className="mx-auto mb-2 text-text-muted/40 dark:text-slate-600" />
            لا يوجد أطباء مسجلون حالياً
          </div>
        ) : (
          doctors.map((doc) => {
            const formattedDate = doc.createdAt 
              ? new Date(doc.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }) 
              : 'غير محدد';

            return (
              <div 
                key={doc.id} 
                className="flex items-center w-full bg-white dark:bg-slate-900 border border-slate-100/60 dark:border-slate-800/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-200 gap-2"
              >
                
                <div className="w-[26%] flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full border border-primary/20 shrink-0 overflow-hidden shadow-sm bg-sky-50 dark:bg-slate-850 flex items-center justify-center">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name || 'طبيب')}&background=e0f2fe&color=367AFF&bold=true&size=64`} 
                      alt={doc.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-text-main dark:text-gray-100 text-[13px] truncate leading-normal">{doc.name}</span>
                    <span className="text-[10px] text-text-muted dark:text-slate-400 font-medium">ID: #{doc.id}</span>
                  </div>
                </div>

                
                <div className="w-[26%] flex flex-col min-w-0">
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

                
                <div className="w-[26%] flex flex-col gap-1 text-[11px] text-text-main dark:text-gray-300 font-medium min-w-0">
                  {doc.phone && (
                    <span className="flex items-center gap-1.5 justify-start">
                      <Phone size={11} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                      <span dir="ltr">{doc.phone}</span>
                    </span>
                  )}
                  {doc.email && (
                    <span className="flex items-center gap-1.5 justify-start">
                      <Mail size={11} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
                      <span dir="ltr" className="text-text-muted dark:text-slate-400 truncate max-w-[170px]">{doc.email}</span>
                    </span>
                  )}
                </div>

                
                <div className="w-[11%] text-[12px] text-text-muted dark:text-slate-400 font-medium flex items-center gap-1 min-w-0">
                  <Calendar size={12} className="text-violet-500 dark:text-violet-400 shrink-0" />
                  <span className="truncate">{formattedDate}</span>
                </div>

                {/* Interactive Status Badge Dropdown */}
                <div className="w-[11%] flex justify-center shrink-0">
                  <StatusBadge doc={doc} updatingDoctorId={updatingDoctorId} onOpenModal={openStatusModal} />
                </div>
              </div>
            );
          })
        )}
      </div>

    
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

              return (
                <div 
                  key={doc.id} 
                  className="bg-white/70 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm relative overflow-hidden flex flex-col gap-3.5 hover:shadow-md hover:border-primary/25 transition-all duration-300"
                >
                  {/* Top Header: ID & Interactive Status Badge */}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/50 z-10">
                    <span className="text-xs font-bold text-text-muted dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-3 py-1 rounded-xl">ID: #{doc.id}</span>
                    <StatusBadge doc={doc} updatingDoctorId={updatingDoctorId} onOpenModal={openStatusModal} />
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

                    
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-slate-500 pt-2 border-t border-slate-50 dark:border-slate-800/30">
                      <Calendar size={12} className="text-violet-500 dark:text-violet-400 shrink-0" />
                      <span>انضم في: {formattedDate}</span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      
      <UserStatusModal
        isOpen={!!selectedDocForStatus}
        user={selectedDocForStatus}
        type="doctor"
        onClose={() => setSelectedDocForStatus(null)}
        tempStatus={tempStatus}
        setTempStatus={setTempStatus}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
};

export default DoctorsTable;