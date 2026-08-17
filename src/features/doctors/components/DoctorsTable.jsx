import React, { useState } from 'react';
import { MapPin, Phone, Mail, Calendar, Building2, Users, Loader2, ChevronDown, User, PhoneCall, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import UserStatusModal from '../../../components/shared/UserStatusModal';
import DoctorCard from './DoctorCard';

const StatusBadge = ({ doc, updatingDoctorId, onOpenModal }) => {
  const { t } = useTranslation();
  const isCurrentlyUpdating = updatingDoctorId === doc.id;
  const currentStatus = String(doc.status ?? '').toLowerCase().trim();

  if (isCurrentlyUpdating) {
    return (
      <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black border bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700 animate-pulse select-none whitespace-nowrap">
        <Loader2 size={12} className="animate-spin text-primary shrink-0" />
        <span>{t('common.processing')}</span>
      </div>
    );
  }

  const getBadgeStyle = () => {
    if (currentStatus === 'active' || currentStatus === '2') {
      return "bg-emerald-50 text-emerald-600 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60";
    }
    if (currentStatus === 'suspended' || currentStatus === '4') {
      return "bg-rose-50 text-rose-600 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50 hover:bg-rose-100/80 dark:hover:bg-rose-900/60";
    }
    if (currentStatus === 'readonly' || currentStatus === 'read_only' || currentStatus === '3') {
      return "bg-indigo-50 text-indigo-600 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/50 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/60";
    }
    if (currentStatus === 'pendingadminapproval' || currentStatus === 'pending_admin_approval' || currentStatus === 'pending' || currentStatus === '1') {
      return "bg-amber-50 text-amber-600 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50 hover:bg-amber-100/80 dark:hover:bg-amber-900/60";
    }
    if (currentStatus === 'pendingverification' || currentStatus === 'pending_verification' || currentStatus === '0') {
      return "bg-orange-50 text-orange-600 border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800/50 hover:bg-orange-100/80 dark:hover:bg-orange-900/60";
    }
    return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:bg-slate-200";
  };

  const getStatusLabel = () => {
    if (currentStatus === 'active' || currentStatus === '2') return t('common.active') || 'نشط';
    if (currentStatus === 'suspended' || currentStatus === '4') return t('common.suspended') || 'معلق';
    if (currentStatus === 'readonly' || currentStatus === 'read_only' || currentStatus === '3') return t('common.readOnly') || 'قراءة فقط';
    if (currentStatus === 'pendingadminapproval' || currentStatus === 'pending_admin_approval' || currentStatus === 'pending' || currentStatus === '1') return t('common.pending') || 'قيد الانتظار';
    if (currentStatus === 'pendingverification' || currentStatus === 'pending_verification' || currentStatus === '0') return t('common.pendingVerification') || 'قيد التثبت';
    return doc.status || t('common.unknown');
  };

  const getDotColor = () => {
    if (currentStatus === 'active' || currentStatus === '2') return "bg-emerald-500 animate-pulse";
    if (currentStatus === 'suspended' || currentStatus === '4') return "bg-rose-500";
    if (currentStatus === 'readonly' || currentStatus === 'read_only' || currentStatus === '3') return "bg-indigo-500";
    if (currentStatus === 'pendingadminapproval' || currentStatus === 'pending_admin_approval' || currentStatus === 'pending' || currentStatus === '1') return "bg-amber-500 animate-pulse";
    if (currentStatus === 'pendingverification' || currentStatus === 'pending_verification' || currentStatus === '0') return "bg-orange-500 animate-pulse";
    return "bg-slate-400";
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpenModal(doc);
      }}
      className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-zain font-black border transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs whitespace-nowrap ${getBadgeStyle()}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${getDotColor()}`} />
      <span>{getStatusLabel()}</span>
      <ChevronDown size={13} className="opacity-70 shrink-0" />
    </button>
  );
};

const DoctorsTable = ({ doctors = [], isLoading, onToggleStatus, updatingDoctorId, searchQuery = '' }) => {
  const { t } = useTranslation();
  const [selectedDocForStatus, setSelectedDocForStatus] = useState(null);
  const [tempStatus, setTempStatus] = useState(null);

  const openStatusModal = (doc) => {
    if (updatingDoctorId === doc.id) return;

    setSelectedDocForStatus(doc);
    setTempStatus(doc.status);
  };

  const handleConfirmStatusChange = (statusFromModal) => {
    if (!selectedDocForStatus) return;
    onToggleStatus(selectedDocForStatus.id, Number(statusFromModal));
    setSelectedDocForStatus(null);
  };

  const emptyMessage = searchQuery 
    ? (t('doctors.noMatchingSearch') || 'لا يوجد أطباء طابقوا شروط البحث')
    : (t('doctors.noRegisteredDoctors') || 'لا يوجد أطباء مسجلون حالياً');

  return (
    <div className="w-full font-zain" dir="rtl">
      {/* ── Table view for medium and large screens ── */}
      <div className="hidden md:flex flex-col gap-3 w-full overflow-x-auto pb-2">
        <div className="min-w-[820px] flex flex-col gap-3">
          {/* Header Row */}
          <div className="grid grid-cols-[1.3fr_1.4fr_1.2fr_0.9fr_1.1fr] items-center w-full px-6 py-3.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-xs font-black text-slate-600 dark:text-slate-300 gap-4 select-none">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <User size={15} className="shrink-0" />
              <span>{t('doctors.doctor')}</span>
            </div>

            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Building2 size={15} className="shrink-0" />
              <span>{t('doctors.clinicAndAddress')}</span>
            </div>

            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <PhoneCall size={15} className="shrink-0" />
              <span>{t('doctors.contact')}</span>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-purple-600 dark:text-purple-400 whitespace-nowrap">
              <Calendar size={15} className="shrink-0" />
              <span>{t('doctors.joinDate')}</span>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-rose-600 dark:text-rose-400 whitespace-nowrap">
              <ShieldCheck size={15} className="shrink-0" />
              <span>{t('common.status')}</span>
            </div>
          </div>

          {/* Rows */}
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl h-[82px] w-full" />
            ))
          ) : doctors.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 font-bold w-full">
              <Users size={40} className="mx-auto mb-2 opacity-30 text-slate-400" />
              <span>{emptyMessage}</span>
            </div>
          ) : (
            doctors.map((doc) => {
              const formattedDate = doc.createdAt
                ? new Date(doc.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
                : t('common.unknown');

              return (
                <div
                  key={doc.id}
                  className="grid grid-cols-[1.3fr_1.4fr_1.2fr_0.9fr_1.1fr] items-center w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-6 py-4 shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-200 gap-4"
                >
                  {/* 1. الطبيب */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black text-xs border border-sky-500/20 shrink-0 overflow-hidden shadow-xs">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name || t('doctors.doctor'))}&background=e0f2fe&color=367AFF&bold=true&size=64`}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-snug truncate" title={doc.name}>
                        {doc.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 font-semibold mt-0.5 dir-ltr text-right">
                        #{doc.id}
                      </span>
                    </div>
                  </div>

                  {/* 2. العيادة والعنوان */}
                  <div className="flex flex-col min-w-0 gap-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm truncate flex items-center gap-1.5" title={doc.clinicName}>
                      <Building2 size={14} className="text-blue-500 shrink-0" />
                      {doc.clinicName || t('common.unknown')}
                    </span>
                    {(doc.city || doc.country || doc.clinicAddress) && (
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium truncate" title={[doc.clinicAddress, doc.city, doc.country].filter(Boolean).join('، ')}>
                        <MapPin size={13} className="text-rose-500 shrink-0" />
                        <span className="truncate">
                          {[doc.clinicAddress, doc.city, doc.country].filter(Boolean).join('، ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 3. التواصل */}
                  <div className="flex flex-col gap-1 min-w-0">
                    {doc.phone && (
                      <span className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-mono font-bold">
                        <Phone size={13} className="text-emerald-500 shrink-0" />
                        <span dir="ltr" className="truncate">{doc.phone}</span>
                      </span>
                    )}
                    {doc.email && (
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <Mail size={13} className="text-indigo-500 shrink-0" />
                        <span dir="ltr" className="truncate max-w-[190px]">{doc.email}</span>
                      </span>
                    )}
                  </div>

                  {/* 4. تاريخ الانضمام */}
                  <div className="flex justify-center">
                    <div className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 whitespace-nowrap">
                      <Calendar size={13} className="text-purple-500 shrink-0" />
                      <span className="truncate">{formattedDate}</span>
                    </div>
                  </div>

                  {/* 5. الحالة */}
                  <div className="flex justify-center">
                    <StatusBadge doc={doc} updatingDoctorId={updatingDoctorId} onOpenModal={openStatusModal} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Mobile view ── */}
      <div className="block md:hidden space-y-3">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white/60 dark:bg-slate-800/50 border border-slate-100/60 dark:border-slate-700/40 p-5 rounded-2xl animate-pulse h-[320px]" />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-bold bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <Users size={32} className="mx-auto mb-3 opacity-40 text-slate-400" />
            <p className="text-sm font-zain">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 auto-rows-max">
            {doctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                id={doc.id}
                name={doc.name}
                email={doc.email}
                phone={doc.phone}
                clinicName={doc.clinicName}
                clinicAddress={doc.clinicAddress}
                city={doc.city}
                country={doc.country}
                status={doc.status}
                createdAt={doc.createdAt}
                statusBadge={
                  <StatusBadge doc={doc} updatingDoctorId={updatingDoctorId} onOpenModal={openStatusModal} />
                }
              />
            ))}
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