import React, { useState } from 'react';
import { MapPin, Phone, Mail, Calendar, Building2, Users, Loader2, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import UserStatusModal from '../../../components/shared/UserStatusModal';
import DoctorCard from './DoctorCard';

const STATUS_LOOKUP = {
  'pendingverification': 0,
  'pending_verification': 0,
  'pendingadminapproval': 1,
  'pending_admin_approval': 1,
  'pending': 1,
  'active': 2,
  'readonly': 3,
  'read_only': 3,
  'suspended': 4,
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4
};

const StatusBadge = ({ doc, updatingDoctorId, onOpenModal }) => {
  const { t } = useTranslation();
  const isCurrentlyUpdating = updatingDoctorId === doc.id;
  const currentStatus = String(doc.status ?? '').toLowerCase().trim();

  if (isCurrentlyUpdating) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black border bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-850 animate-pulse select-none">
        <Loader2 size={11} className="animate-spin text-primary shrink-0" />
        <span>{t('common.processing')}</span>
      </div>
    );
  }

  const getBadgeStyle = () => {
    if (currentStatus === 'active' || currentStatus === '2') {
      return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/50";
    }
    if (currentStatus === 'suspended' || currentStatus === '4') {
      return "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100/50 dark:border-rose-900/30 hover:bg-rose-100/50 dark:hover:bg-rose-950/50";
    }
    if (currentStatus === 'readonly' || currentStatus === 'read_only' || currentStatus === '3') {
      return "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-100/50 dark:border-indigo-900/30 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/50";
    }
    if (currentStatus === 'pendingadminapproval' || currentStatus === 'pending_admin_approval' || currentStatus === 'pending' || currentStatus === '1') {
      return "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/30 hover:bg-amber-100/50 dark:hover:bg-amber-950/50";
    }
    if (currentStatus === 'pendingverification' || currentStatus === 'pending_verification' || currentStatus === '0') {
      return "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border-orange-100/50 dark:border-orange-900/30 hover:bg-orange-100/50 dark:hover:bg-orange-950/50";
    }
    return "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-150 dark:border-slate-700 hover:bg-slate-100";
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

const DoctorsTable = ({ doctors = [], isLoading, onToggleStatus, updatingDoctorId }) => {
  const { t } = useTranslation();
  const [selectedDocForStatus, setSelectedDocForStatus] = useState(null);
  const [tempStatus, setTempStatus] = useState(null);

  const openStatusModal = (doc) => {
    if (updatingDoctorId === doc.id) return;

    setSelectedDocForStatus(doc);
    
    let initialNumericStatus;
    if (typeof doc.status === 'number') {
      initialNumericStatus = doc.status;
    } else {
      const cleanKey = String(doc.status ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
      initialNumericStatus = STATUS_LOOKUP[cleanKey] ?? (isNaN(Number(doc.status)) ? 0 : Number(doc.status));
    }

    setTempStatus(Number(initialNumericStatus));
  };

  const handleConfirmStatusChange = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!selectedDocForStatus || tempStatus === null || tempStatus === undefined) return;

    const numericNextStatus = Number(tempStatus);

    if (onToggleStatus) {
      onToggleStatus(selectedDocForStatus.id, numericNextStatus);
    }
    setSelectedDocForStatus(null);
  };

  return (
    <div className="w-full flex flex-col gap-3" dir="rtl">
      {/* Header Table */}
      <div className="hidden md:flex items-center w-full px-6 py-2 text-slate-400 dark:text-slate-500 font-extrabold text-[12px] uppercase select-none">
        <div className="w-[26%] text-right">{t('doctors.doctor')}</div>
        <div className="w-[26%] text-right">{t('doctors.clinicAndAddress')}</div>
        <div className="w-[26%] text-right">{t('doctors.contact')}</div>
        <div className="w-[11%] text-right">{t('doctors.joinDate')}</div>
        <div className="w-[11%] text-center">{t('common.status')}</div>
      </div>

      {/* Desktop List */}
      <div className="hidden md:flex flex-col gap-3">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/60 dark:bg-slate-900/40 border border-slate-100/60 dark:border-slate-800/60 rounded-2xl h-[78px] w-full" />
          ))
        ) : doctors.length === 0 ? (
          <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-12 text-center text-text-muted dark:text-slate-500 font-bold w-full">
            <Users size={36} className="mx-auto mb-2 text-text-muted/40 dark:text-slate-600" />
            {t('doctors.noRegisteredDoctors')}
          </div>
        ) : (
          doctors.map((doc) => {
            const formattedDate = doc.createdAt
              ? new Date(doc.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
              : t('common.unknown');

            return (
              <div
                key={doc.id}
                className="flex items-center w-full bg-white dark:bg-slate-900 border border-slate-100/60 dark:border-slate-800/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-200 gap-2"
              >
                <div className="w-[26%] flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full border border-primary/20 shrink-0 overflow-hidden shadow-sm bg-sky-50 dark:bg-slate-850 flex items-center justify-center">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name || t('doctors.doctor'))}&background=e0f2fe&color=367AFF&bold=true&size=64`}
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
                    {doc.clinicName || t('common.unknown')}
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

                <div className="w-[11%] flex justify-center shrink-0">
                  <StatusBadge doc={doc} updatingDoctorId={updatingDoctorId} onOpenModal={openStatusModal} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Mobile Grid */}
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
            {t('doctors.noRegisteredDoctors')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Modal */}
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