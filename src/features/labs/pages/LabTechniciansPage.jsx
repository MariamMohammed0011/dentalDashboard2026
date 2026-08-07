import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  FlaskConical, 
  Eye, 
  User, 
  Building2, 
  MapPin, 
  ChevronDown, 
  Loader2 
} from 'lucide-react';

import LabTechnicianDetailsModal from '../components/LabTechnicianDetailsModal';
import UserStatusModal from '../../../components/shared/UserStatusModal';
import { useLabTechnicians } from '../hooks/useLabTechnicians';
import Search from '../../../components/shared/Search/Search';
import MembershipPagination from '../../membership/components/MembershipPagination';

// 🎨 مكون شارة الحالة
const StatusBadgeButton = ({ tech, updatingTechId, onOpenModal }) => {
  const { t } = useTranslation();
  const isCurrentlyUpdating = updatingTechId === tech.id;
  const currentStatus = String(tech.status ?? '').toLowerCase().trim();

  if (isCurrentlyUpdating) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-50 dark:bg-slate-800 text-slate-500 animate-pulse select-none border border-slate-100 dark:border-slate-800">
        <Loader2 size={11} className="animate-spin text-indigo-600 shrink-0" />
        <span>{t('common.processing') || 'جاري التحديث...'}</span>
      </div>
    );
  }

  const getBadgeStyle = () => {
    if (currentStatus === 'active' || currentStatus === '2') {
      return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-900/40 hover:bg-emerald-100/60";
    }
    if (currentStatus === 'suspended' || currentStatus === '4') {
      return "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-900/40 hover:bg-rose-100/60";
    }
    if (currentStatus === 'readonly' || currentStatus === '3') {
      return "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-900/40 hover:bg-indigo-100/60";
    }
    if (currentStatus === 'pendingadminapproval' || currentStatus === 'pending' || currentStatus === '1') {
      return "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-900/40 hover:bg-amber-100/60";
    }
    return "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100";
  };

  const getStatusLabel = () => {
    if (currentStatus === 'active' || currentStatus === '2') return 'نشط';
    if (currentStatus === 'suspended' || currentStatus === '4') return 'معلق';
    if (currentStatus === 'readonly' || currentStatus === '3') return 'قراءة فقط';
    if (currentStatus === 'pendingadminapproval' || currentStatus === 'pending' || currentStatus === '1') return 'قيد المراجعة';
    if (currentStatus === 'pendingverification' || currentStatus === '0') return 'قيد التثبت';
    return tech.status || 'غير محدد';
  };

  const getDotColor = () => {
    if (currentStatus === 'active' || currentStatus === '2') return "bg-emerald-500 animate-pulse";
    if (currentStatus === 'suspended' || currentStatus === '4') return "bg-rose-500";
    if (currentStatus === 'readonly' || currentStatus === '3') return "bg-indigo-500";
    if (currentStatus === 'pendingadminapproval' || currentStatus === 'pending' || currentStatus === '1') return "bg-amber-500 animate-pulse";
    return "bg-slate-500";
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpenModal(tech);
      }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black border transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-2xs ${getBadgeStyle()}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${getDotColor()}`} />
      <span>{getStatusLabel()}</span>
      <ChevronDown size={11} className="opacity-70 shrink-0" />
    </button>
  );
};

const LabTechniciansPage = () => {
  const { t } = useTranslation();
  const {
    technicians,
    pagination,
    isLoading,
    searchQuery,
    setSearchQuery,
    setCurrentPage,
    techDetails,
    handleShowDetails,
    handleCloseDetails,
    selectedTechForStatus,
    setSelectedTechForStatus,
    tempStatus,
    setTempStatus,
    openStatusModal,
    handleConfirmStatusChange,
    updatingTechId,
  } = useLabTechnicians();

  return (
    <div className="flex flex-col gap-6 px-2 sm:px-8 lg:px-2 pb-10 min-h-full" dir="rtl">
      
      {/* ── الهيدر العلوي ── */}
      <div className="flex flex-col sm:flex-row justify-between items-center py-2 px-0 gap-4 w-full">
        <h1 className="text-xl sm:text-3xl font-black text-slate-800 dark:text-gray-100 flex items-center gap-3 w-full sm:w-auto">
          <FlaskConical size={28} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
          {t('technicians.title') || 'قائمة المخبرين'}
        </h1>

        <Search
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('technicians.searchPlaceholder') || 'ابحث باسم المخبري، البريد أو المدينة...'}
          width="70%"
          className="w-full sm:w-[70%]"
          onClear={() => setSearchQuery('')}
        />
      </div>

      {/* ── الجدول الشبكي المشبك ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="hidden md:block w-full  dark:bg-slate-900  dark:border-slate-800 overflow-hidden">
          <table className="w-full text-right border-collapse table-fixed">
            
            {/* الترويسة الملونة بداخلها الشارات والمشبوكة بخطوط عمودية وأفقية */}
            <thead>
              <tr className="border-b border-indigo-200/80 dark:border-slate-800 text-xs sm:text-sm font-black divide-x divide-x-reverse divide-indigo-200/60 dark:divide-slate-800">
                
                {/* 1. اسم المخبري */}
                <th className="py-3 px-4 text-center w-[35%] border-l border-indigo-200/80 dark:border-slate-800">
                  <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50 shadow-2xs">
                    اسم المخبري
                  </div>
                </th>

                {/* 2. مكان العمل */}
                <th className="py-3 px-4 text-center w-[25%] border-l border-indigo-200/80 dark:border-slate-800">
                  <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/50 shadow-2xs">
                    مكان العمل
                  </div>
                </th>

                {/* 3. المدينة والعنوان */}
                <th className="py-3 px-4 text-center w-[25%] border-l border-indigo-200/80 dark:border-slate-800">
                  <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/50 shadow-2xs">
                    المدينة والعنوان
                  </div>
                </th>

                {/* 4. الحالة */}
                <th className="py-3 px-4 text-center w-[15%]">
                  <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50 shadow-2xs">
                    الحالة
                  </div>
                </th>

              </tr>
            </thead>

            {/* جسم الجدول بخطوط شبكية متقاطعة */}
            <tbody className="divide-y divide-indigo-100 dark:divide-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse divide-x divide-x-reverse divide-indigo-100 dark:divide-slate-800">
                    <td className="py-4 px-6"><div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div></td>
                    <td className="py-4 px-6"><div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3"></div></td>
                    <td className="py-4 px-6"><div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2"></div></td>
                    <td className="py-4 px-6"><div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-16 mx-auto"></div></td>
                  </tr>
                ))
              ) : technicians.length > 0 ? (
                technicians.map((tech) => {
                  const techName = tech.name || 'بدون اسم';
                  const placeName = tech.namePlace || 'غير محدد';
                  const locationInfo = [tech.cityPlace, tech.countryPlace].filter(Boolean).join('، ') || 'غير محددة';

                  return (
                    <tr 
                      key={tech.id} 
                      className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/40 transition-colors duration-150 divide-x divide-x-reverse divide-indigo-100/80 dark:divide-slate-800/80"
                    >
                      
                      {/* 1. اسم المخبري والصورة والشارة */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-start gap-3 min-w-0">
                          <div className="relative shrink-0 pt-1 pl-1">
                            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center overflow-hidden font-extrabold shadow-sm border border-indigo-200/50 dark:border-indigo-900/30">
                              {tech.profilePictureUrl ? (
                                <img src={tech.profilePictureUrl} alt={techName} className="w-full h-full object-cover" />
                              ) : (
                                <User size={20} />
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleShowDetails(tech.id)}
                              title={t('common.details') || 'عرض التفاصيل'}
                              className="absolute -top-1 -left-1 z-10 w-6 h-6 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md border-2 border-white dark:border-slate-900 flex items-center justify-center transition-all duration-300 hover:scale-125 cursor-pointer animate-eye-attract"
                            >
                              <Eye size={12} />
                            </button>
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-slate-800 dark:text-gray-100 text-sm sm:text-base truncate" title={techName}>
                              {techName}
                            </span>
                            <span className="text-[11px] text-gray-400 font-semibold dir-ltr text-right">
                              #{tech.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. مكان العمل */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 min-w-0">
                          <Building2 size={16} className="text-indigo-500 shrink-0" />
                          <span className="truncate">{placeName}</span>
                        </div>
                      </td>

                      {/* 3. العنوان والمدينة */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 min-w-0">
                          <MapPin size={16} className="text-rose-500 shrink-0" />
                          <span className="truncate">{locationInfo}</span>
                        </div>
                      </td>

                      {/* 4. الحالة */}
                      <td className="py-4 px-6 text-center">
                        <StatusBadgeButton 
                          tech={tech} 
                          updatingTechId={updatingTechId} 
                          onOpenModal={openStatusModal} 
                        />
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-500 dark:text-slate-400 font-bold text-base">
                    لا يوجد مخبرين طابقوا شروط البحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── العرض في الشاشات الصغيرة (Responsive Cards) ── */}
        <div className="block md:hidden space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-28 bg-white dark:bg-slate-900 rounded-3xl animate-pulse p-4 border border-indigo-100 dark:border-slate-800" />
            ))
          ) : technicians.length > 0 ? (
            technicians.map((tech) => {
              const techName = tech.name || 'بدون اسم';
              const placeName = tech.namePlace || 'غير محدد';
              const locationInfo = [tech.cityPlace, tech.countryPlace].filter(Boolean).join('، ') || 'غير محددة';

              return (
                <div 
                  key={tech.id} 
                  className="bg-white dark:bg-slate-900 border border-indigo-100/80 dark:border-indigo-950/60 rounded-3xl p-4 shadow-2xs flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0 pt-1 pl-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center overflow-hidden font-extrabold shadow-sm">
                          {tech.profilePictureUrl ? (
                            <img src={tech.profilePictureUrl} alt={techName} className="w-full h-full object-cover" />
                          ) : (
                            <User size={22} />
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleShowDetails(tech.id)}
                          className="absolute -top-1 -left-1 z-10 w-6 h-6 rounded-full bg-indigo-600 text-white shadow-md border-2 border-white dark:border-slate-900 flex items-center justify-center animate-eye-attract"
                        >
                          <Eye size={12} />
                        </button>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="font-extrabold text-slate-800 dark:text-gray-100 text-sm truncate">
                          {techName}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold dir-ltr text-right">
                          #{tech.id}
                        </span>
                      </div>
                    </div>

                    <StatusBadgeButton 
                      tech={tech} 
                      updatingTechId={updatingTechId} 
                      onOpenModal={openStatusModal} 
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Building2 size={14} className="text-indigo-500 shrink-0" />
                      <span className="truncate">{placeName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0 justify-end">
                      <MapPin size={14} className="text-rose-500 shrink-0" />
                      <span className="truncate">{locationInfo}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-gray-500 dark:text-slate-400 font-bold text-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
              لا يوجد مخبرين طابقوا شروط البحث
            </div>
          )}
        </div>
      </motion.div>

      {/* ── الترقيم (Pagination) ── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <MembershipPagination
            pagination={pagination}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* ── مودال تعديل الحالة ── */}
      <UserStatusModal
        isOpen={!!selectedTechForStatus}
        user={selectedTechForStatus}
        type="labTechnician"
        onClose={() => setSelectedTechForStatus(null)}
        tempStatus={tempStatus}
        setTempStatus={setTempStatus}
        onConfirm={handleConfirmStatusChange}
      />

      {/* ── مودال التفاصيل الكاملة ── */}
      <LabTechnicianDetailsModal
        tech={techDetails}
        isOpen={Boolean(techDetails)}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default LabTechniciansPage;