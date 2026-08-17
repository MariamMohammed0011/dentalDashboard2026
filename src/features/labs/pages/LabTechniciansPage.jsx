import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  Eye,
  User,
  Building2,
  MapPin,
  ChevronDown,
  ChevronLeft,
  Loader2,
  Check
} from 'lucide-react';

import LabTechnicianDetailsModal from '../components/LabTechnicianDetailsModal';
import UserStatusModal from '../../../components/shared/UserStatusModal';
import { useLabTechnicians } from '../hooks/useLabTechnicians';
import Search from '../../../components/shared/Search/Search';
import MembershipPagination from '../../membership/components/MembershipPagination';
import { useMembership } from '../../membership/hooks/useMembership';

// 🎨 مكون شارة الحالة
const StatusBadgeButton = ({ tech, updatingTechId, onOpenModal }) => {
  const { t } = useTranslation();
  const isCurrentlyUpdating = updatingTechId === tech.id;
  const currentStatus = String(tech.status ?? '').toLowerCase().trim();

  if (isCurrentlyUpdating) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-light-gray/40 text-text-muted animate-pulse select-none border border-border-subtle">
        <Loader2 size={11} className="animate-spin text-primary shrink-0" />
        <span>{t('common.processing')}</span>
      </div>
    );
  }

  const getBadgeStyle = () => {
    if (currentStatus === 'active' || currentStatus === '2') {
      return "bg-success-bg text-success border-success/20 hover:bg-success-bg/80";
    }
    if (currentStatus === 'suspended' || currentStatus === '4') {
      return "bg-danger-bg text-danger border-danger/20 hover:bg-danger-bg/80";
    }
    if (currentStatus === 'readonly' || currentStatus === 'read_only' || currentStatus === '3') {
      return "bg-accent-indigo/10 text-accent-indigo border-accent-indigo/20 hover:bg-accent-indigo/20";
    }
    if (currentStatus === 'pendingadminapproval' || currentStatus === 'pending_admin_approval' || currentStatus === 'pending' || currentStatus === '1') {
      return "bg-warning-bg text-warning border-warning/20 hover:bg-warning-bg/80";
    }
    if (currentStatus === 'pendingverification' || currentStatus === 'pending_verification' || currentStatus === '0') {
      return "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20";
    }
    return "bg-neutral-light-gray text-text-muted border-border-subtle hover:bg-neutral-light-gray/80";
  };

  const getStatusLabel = () => {
    if (currentStatus === 'active' || currentStatus === '2') return t('common.active') || 'نشط';
    if (currentStatus === 'suspended' || currentStatus === '4') return t('common.suspended') || 'معلق';
    if (currentStatus === 'readonly' || currentStatus === 'read_only' || currentStatus === '3') return t('common.readOnly') || 'قراءة فقط';
    if (currentStatus === 'pendingadminapproval' || currentStatus === 'pending_admin_approval' || currentStatus === 'pending' || currentStatus === '1') return t('common.pending') || 'قيد الانتظار';
    if (currentStatus === 'pendingverification' || currentStatus === 'pending_verification' || currentStatus === '0') return t('common.pendingVerification') || 'قيد التثبت';
    return tech.status || t('common.unknown');
  };

  const getDotColor = () => {
    if (currentStatus === 'active' || currentStatus === '2') return "bg-success animate-pulse";
    if (currentStatus === 'suspended' || currentStatus === '4') return "bg-danger";
    if (currentStatus === 'readonly' || currentStatus === 'read_only' || currentStatus === '3') return "bg-accent-indigo";
    if (currentStatus === 'pendingadminapproval' || currentStatus === 'pending_admin_approval' || currentStatus === 'pending' || currentStatus === '1') return "bg-warning animate-pulse";
    if (currentStatus === 'pendingverification' || currentStatus === 'pending_verification' || currentStatus === '0') return "bg-orange-500 animate-pulse";
    return "bg-text-muted";
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpenModal(tech);
      }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-black border transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${getBadgeStyle()}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${getDotColor()}`} />
      <span>{getStatusLabel()}</span>
      <ChevronDown size={11} className="opacity-70 shrink-0" />
    </button>
  );
};

// 🎨 قائمة تصفية الفنيين حسب الحالة
const StatusFilterDropdown = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filters = [
    { id: 'all', label: t('common.all') },
    { id: 'active', label: t('common.active') },
    { id: 'suspended', label: t('common.suspended') },
    { id: 'readonly', label: t('common.readOnly') },
    { id: 'pendingadminapproval', label: t('common.pendingAdminApproval') },
  ];

  const currentLabel = filters.find((f) => f.id === value)?.label || t('technicians.filters.title');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full bg-bg-card text-text-main font-bold text-xs rounded-2xl px-4 py-2.5 sm:py-3 border shadow-sm transition-all duration-300 cursor-pointer ${isOpen
            ? 'border-primary/40 shadow-md ring-1 ring-primary/20'
            : 'border-border-subtle hover:border-border-main hover:shadow-md'
          } focus:outline-none focus:ring-2 focus:ring-primary/20`}
      >
        <span className="truncate">{currentLabel}</span>
        <ChevronDown
          size={16}
          className={`text-text-muted transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-3 w-full bg-bg-card border border-border-subtle rounded-2xl shadow-xl py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          {filters.map((filter, index) => {
            const isSelected = value === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => {
                  onChange(filter.id);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-[calc(100%-16px)] mx-2 px-3.5 py-3 text-right text-xs font-bold transition-all duration-300 rounded-xl cursor-pointer group ${isSelected
                    ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm border border-primary/20'
                    : 'text-text-muted hover:bg-neutral-light-gray/40 hover:text-text-main'
                  } ${index !== filters.length - 1 ? 'border-b border-transparent group-hover:border-border-subtle' : ''}`}
              >
                <span className="truncate">{filter.label}</span>
                {isSelected && (
                  <div className="ml-2 flex-shrink-0">
                    <Check size={16} className="text-primary animate-in scale-in-95 duration-200" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const LabTechniciansPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { requests, isLoading: isLoadingRequests } = useMembership();
  const pendingLabRequests = requests?.filter(r => r.status === 'pending' && r.type === 'lab') || [];
  const pendingCount = pendingLabRequests.length;

  const {
    technicians,
    pagination,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
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

  // فتح ملف صاحب المخبر تلقائياً عند الوصول من صفحة تفاصيل المخبر عبر ?ownerId=
  useEffect(() => {
    const ownerId = searchParams.get('ownerId');
    if (ownerId) {
      handleShowDetails(ownerId);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-6 px-0 sm:px-0 w-full lg:px-1 pb-10 min-h-full" dir="rtl">

      {/* ── الهيدر العلوي ── */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center py-2 px-0 gap-4 w-full">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <h1 className="text-xl sm:text-3xl font-zain font-black text-text-main flex items-center gap-3 shrink-0">
            <FlaskConical size={28} className="text-accent-indigo shrink-0" />
            {t('technicians.title') || 'فنيي المخابر'}
          </h1>
          {!isLoadingRequests && pendingCount > 0 && (
            <div
              onClick={() => navigate('/dashboard/membership-requests?tab=lab')}
              className="flex items-center justify-between gap-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl px-3.5 py-1.5 sm:py-2 hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 cursor-pointer group select-none shadow-sm"
            >
              <span className="text-xs font-black text-primary whitespace-nowrap">
                {t('doctors.pendingApprovalRequests') || 'طلبات بانتظار الموافقة'}
              </span>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white dark:border-slate-900 bg-primary text-[10px] text-white flex items-center justify-center font-black shadow-sm z-30 ring-1 ring-primary/10">
                    +{pendingCount}
                  </div>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 -mr-2.5 shadow-sm z-20" />
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 -mr-2.5 shadow-sm z-10" />
                </div>

                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-350 shrink-0">
                  <ChevronLeft size={15} className="group-hover:translate-x-[-2px] transition-transform" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
         

          <div className="w-full sm:w-52 shrink-0">
            <StatusFilterDropdown value={statusFilter} onChange={setStatusFilter} />
          </div>
        </div>
      </div>
       <div className="w-full  shrink-0">
            <Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t('technicians.searchPlaceholder') || 'ابحث باسم المخبري، البريد أو المدينة...'}
              width="100%"
              className="w-full"
              onClear={() => setSearchQuery('')}
            />
          </div>

      {/* ── الجدول الشبكي ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="hidden md:block w-full bg-white dark:bg-slate-800/60 rounded-xl border border-slate-100/60 dark:border-slate-700/40 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
  <table className="w-full text-right border-collapse table-fixed">

    {/* الترويسة الملونة متطابقة مع جدول الأطباء في الدارك */}
    <thead>
      <tr className="border-b border-slate-200/60 dark:border-slate-700/40 text-xs sm:text-sm font-black divide-x divide-x-reverse divide-slate-200/60 dark:divide-slate-700/40 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/40 dark:to-slate-800/40">

        {/* 1. اسم المخبري */}
        <th className="py-4 px-6 text-center w-[35%] border-l border-slate-200/60 dark:border-slate-700/40">
          <div className="inline-flex font-zain items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50 shadow-sm">
            <User size={14} />
            {t('technicians.table.name') || 'اسم المخبري'}
          </div>
        </th>

        {/* 2. مكان العمل */}
        <th className="py-4 px-6 text-center w-[25%] border-l border-slate-200/60 dark:border-slate-700/40">
          <div className="inline-flex font-zain items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50 shadow-sm">
            <Building2 size={14} />
            {t('technicians.table.workplace') || 'مكان العمل'}
          </div>
        </th>

        {/* 3. المدينة والعنوان */}
        <th className="py-4 px-6 text-center w-[25%] border-l border-slate-200/60 dark:border-slate-700/40">
          <div className="inline-flex font-zain items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/50 shadow-sm">
            <MapPin size={14} />
            {t('technicians.table.location') || 'المدينة والعنوان'}
          </div>
        </th>

        {/* 4. الحالة */}
        <th className="py-4 px-6 text-center w-[15%]">
          <div className="inline-flex font-zain items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50 shadow-sm">
            <ChevronDown size={14} />
            {t('technicians.table.status') || 'الحالة'}
          </div>
        </th>

      </tr>
    </thead>

    {/* جسم الجدول */}
    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/40 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
      {isLoading ? (
        Array(5).fill(0).map((_, i) => (
          <tr key={i} className="animate-pulse divide-x divide-x-reverse divide-slate-200/60 dark:divide-slate-700/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <td className="py-5 px-6"><div className="h-10 bg-slate-200/50 dark:bg-slate-700/40 rounded-lg w-3/4"></div></td>
            <td className="py-5 px-6"><div className="h-5 bg-slate-200/50 dark:bg-slate-700/40 rounded-lg w-2/3"></div></td>
            <td className="py-5 px-6"><div className="h-5 bg-slate-200/50 dark:bg-slate-700/40 rounded-lg w-1/2"></div></td>
            <td className="py-5 px-6"><div className="h-5 bg-slate-200/50 dark:bg-slate-700/40 rounded-lg w-16 mx-auto"></div></td>
          </tr>
        ))
      ) : technicians.length > 0 ? (
        technicians.map((tech) => {
          const techName = tech.name || t('technicians.noName') || 'بدون اسم';
          const placeName = tech.namePlace || t('technicians.unspecified') || 'غير محدد';
          const locationInfo = [tech.cityPlace, tech.countryPlace].filter(Boolean).join('، ') || t('technicians.unspecifiedLocation') || 'غير محددة';

          return (
            <tr
              key={tech.id}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-all duration-200 divide-x divide-x-reverse divide-slate-200/60 dark:divide-slate-700/40 border-b border-slate-200/60 dark:border-slate-700/40"
            >

              {/* 1. اسم المخبري والصورة والشارة */}
              <td className="py-5 px-6">
                <div className="flex items-center justify-start gap-3 min-w-0">
                  <div className="relative shrink-0 pt-1 pl-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center overflow-hidden font-extrabold shadow-md border-2 border-indigo-300/30 dark:border-indigo-800/50">
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
                      className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:shadow-lg shadow-md border-2 border-white dark:border-slate-800 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
                    >
                      <Eye size={14} />
                    </button>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="font-zain font-extrabold text-slate-900 dark:text-gray-100 text-sm sm:text-base truncate" title={techName}>
                      {techName}
                    </span>
                    <span className="font-zain text-[10px] text-slate-500 dark:text-slate-400 font-medium dir-ltr text-right">
                      ID: #{tech.id}
                    </span>
                  </div>
                </div>
              </td>

              {/* 2. مكان العمل */}
              <td className="py-5 px-6">
                <div className="flex items-center justify-center gap-2.5 text-slate-600 dark:text-slate-300 min-w-0">
                  <Building2 size={16} className="text-blue-500 dark:text-sky-400 shrink-0" />
                  <span className="truncate font-zain text-slate-800 dark:text-gray-200 font-semibold">{placeName}</span>
                </div>
              </td>

              {/* 3. العنوان والمدينة */}
              <td className="py-5 px-6">
                <div className="flex items-center justify-center gap-2.5 text-slate-600 dark:text-slate-300 min-w-0">
                  <MapPin size={16} className="text-rose-500 dark:text-rose-400 shrink-0" />
                  <span className="truncate font-zain text-slate-800 dark:text-slate-300 font-semibold">{locationInfo}</span>
                </div>
              </td>

              {/* 4. الحالة */}
              <td className="py-5 px-6 text-center font-zain">
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
          <td colSpan="4" className="py-16 text-center font-zain">
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                <FlaskConical size={28} className="text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-500 dark:text-slate-300 font-bold text-base">
                {t('technicians.noTechniciansFound') || 'لا يوجد مخبرين طابقوا شروط البحث'}
              </p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
<div className="block md:hidden space-y-3.5">
  {isLoading ? (
    Array(3).fill(0).map((_, i) => (
      <div key={i} className="h-36 bg-bg-card rounded-2xl animate-pulse p-4 border border-border-subtle" />
    ))
  ) : technicians.length > 0 ? (
    technicians.map((tech) => {
      const techName = tech.name || t('technicians.noName') || 'بدون اسم';
      const placeName = tech.namePlace || t('technicians.unspecified') || 'غير محدد';
      const locationInfo = [tech.cityPlace, tech.countryPlace].filter(Boolean).join('، ') || t('technicians.unspecifiedLocation') || 'غير محددة';

      return (
        <div
          key={tech.id}
          className="bg-bg-card border border-border-subtle rounded-2xl p-4 shadow-xs flex flex-col gap-3 transition-all hover:shadow-md"
        >
          {/* 1. الصف العلوي: الصورة + الاسم الكامل والـ ID (يأخذ العرض كاملاً) */}
          <div className="flex items-center gap-3 w-full">
            <div className="relative shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl flex items-center justify-center overflow-hidden font-extrabold shadow-xs">
                {tech.profilePictureUrl ? (
                  <img src={tech.profilePictureUrl} alt={techName} className="w-full h-full object-cover" />
                ) : (
                  <User size={22} />
                )}
              </div>

              {/* زر العين للتفاصيل */}
              <button
                type="button"
                onClick={() => handleShowDetails(tech.id)}
                title={t('common.details') || 'عرض التفاصيل'}
                className="absolute -top-1.5 -left-1.5 z-10 w-5 h-5 rounded-full bg-accent-indigo text-white shadow-md border-2 border-bg-card flex items-center justify-center animate-eye-attract"
              >
                <Eye size={11} />
              </button>
            </div>

            {/* الاسم يظهر بوضوح وبحجم مريح */}
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className="font-zain font-black text-text-main dark:text-slate-100 text-base sm:text-lg leading-snug break-words" title={techName}>
                {techName}
              </h3>
              <span className="font-zain text-xs text-text-muted font-bold mt-0.5 dir-ltr text-right">
                #{tech.id}
              </span>
            </div>
          </div>

          {/* 2. الصف الأوسط: تفاصيل مكان العمل والموقع */}
          <div className="p-2.5 rounded-xl bg-neutral-light-gray/30 border border-border-subtle/40 flex flex-col gap-2">
            {/* مكان العمل */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-accent-indigo/10 flex items-center justify-center shrink-0">
                <Building2 size={13} className="text-accent-indigo" />
              </div>
              <span className="font-zain text-xs sm:text-sm font-bold text-text-main dark:text-slate-200 truncate">
                {placeName}
              </span>
            </div>

            {/* المدينة / الموقع */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
                <MapPin size={13} className="text-danger" />
              </div>
              <span className="font-zain text-xs sm:text-sm font-bold text-text-muted truncate">
                {locationInfo}
              </span>
            </div>
          </div>

          {/* 3. الصف السفلي: زر تغيير الحالة في مساحة مريحة ومرتبة */}
          <div className="pt-2 border-t border-border-subtle/60 flex items-center justify-between">
            <span className="font-zain text-xs font-bold text-text-muted">
              {t('technicians.table.status') || 'حالة الحساب'}:
            </span>
            <StatusBadgeButton
              tech={tech}
              updatingTechId={updatingTechId}
              onOpenModal={openStatusModal}
            />
          </div>
        </div>
      );
    })
  ) : (
    <div className="py-12 text-center text-text-muted font-zain font-bold text-sm bg-bg-card rounded-2xl border border-border-subtle">
      {t('technicians.noTechniciansFound') || 'لا يوجد مخبرين طابقوا شروط البحث'}
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