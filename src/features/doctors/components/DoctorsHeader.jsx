import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, Check, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMembership } from '../../membership/hooks/useMembership';

const DoctorsHeader = ({ selectedStatus, onStatusChange }) => {
  const navigate = useNavigate();
  const { requests, isLoading } = useMembership();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useTranslation();
  
  const pendingDoctorRequests = requests?.filter(r => r.status === 'pending' && r.type === 'doctor') || [];
  const count = pendingDoctorRequests.length;

  const filters = [
    { id: 'all', label: t('doctors.filters.all') },
    { id: 'active', label: t('doctors.filters.active') },
    { id: 'suspended', label: t('doctors.filters.suspended') }, 
    { id: 'pendingadminapproval', label: t('doctors.filters.pending') }, 
  ];

  const currentLabel = filters.find(f => f.id === selectedStatus)?.label || t('doctors.filters.title');

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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 px-0 gap-3 sm:gap-4 w-full" dir="rtl">
      
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
     <h1 className="text-xl sm:text-3xl font-zain font-black text-text-main flex items-center gap-3 shrink-0">
  <Users size={28} className="text-primary" />
  {t('doctors.title')}
</h1>
        {!isLoading && count > 0 && (
          <div 
            onClick={() => navigate('/dashboard/membership-requests')}
            className="flex items-center justify-between gap-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl px-3.5 py-1.5 sm:py-2 hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 cursor-pointer group select-none shadow-sm"
          >
            <span className="text-xs font-black text-primary whitespace-nowrap">
              {t('doctors.pendingApprovalRequests')}
            </span>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white dark:border-slate-900 bg-primary text-[10px] text-white flex items-center justify-center font-black shadow-sm z-30 ring-1 ring-primary/10">
                  +{count}
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
      
    <div className="relative w-full sm:w-[240px] md:w-[260px]" ref={dropdownRef}>
  {/* زر القائمة المنسدلة الرئيسي */}
  <button
    type="button"
    onClick={() => setIsOpen(!isOpen)}
    className={`flex items-center justify-between w-full bg-bg-card text-text-main font-bold text-xs rounded-2xl px-4 py-2.5 sm:py-3 border shadow-sm transition-all duration-300 cursor-pointer ${
      isOpen
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

  {/* القائمة المنبثقة */}
  {isOpen && (
    <div className="absolute left-0 right-0 mt-3 w-full bg-bg-card border border-border-subtle rounded-2xl shadow-xl py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
      {filters.map((filter, index) => {
        const isSelected = selectedStatus === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => {
              onStatusChange(filter.id);
              setIsOpen(false);
            }}
            className={`flex items-center justify-between w-[calc(100%-16px)] mx-2 px-3.5 py-3 text-right text-xs font-bold transition-all duration-300 rounded-xl cursor-pointer group ${
              isSelected
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

    </div>
  );
};

export default DoctorsHeader;