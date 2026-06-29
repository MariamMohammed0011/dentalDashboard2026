import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, Check } from 'lucide-react';
import { useMembership } from '../../membership/hooks/useMembership';

const DoctorsHeader = ({ selectedStatus, onStatusChange }) => {
  const navigate = useNavigate();
  const { requests, isLoading } = useMembership();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const pendingDoctorRequests = requests?.filter(r => r.status === 'pending' && r.type === 'doctor') || [];
  const count = pendingDoctorRequests.length;

const filters = [
  { id: 'all', label: 'كل الأطباء' },
  { id: 'active', label: 'الأطباء النشطين' },
  { id: 'suspended', label: 'الأطباء المعلقين' }, 
  { id: 'pendingadminapproval', label: 'بانتظار موافقة المسؤول' }, 
];

  const currentLabel = filters.find(f => f.id === selectedStatus)?.label || 'تصفية حسب الحالة';

  
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
    <div className="flex flex-col md:flex-row justify-between items-center py-2 px-0 gap-4 w-full" dir="rtl">
      
      {/* اليمين: العنوان والويجيت التفاعلي للطلبات المعلقة */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
        <h1 className="text-[18px] sm:text-[20px] font-black text-gray-700 dark:text-gray-200">
          الاطباء
        </h1>  

        {!isLoading && count > 0 && (
          <div 
            onClick={() => navigate('/dashboard/membership-requests')}
            className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl px-4 py-2 hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 cursor-pointer group select-none shadow-sm"
          >
            <span className="text-xs font-black text-primary">
              طلبات بانتظار الموافقة
            </span>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full border border-white dark:border-slate-900 bg-primary text-[10px] text-white flex items-center justify-center font-black shadow-sm z-30 ring-1 ring-primary/10">
                  +{count}
                </div>
                <div className="w-7 h-7 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 -mr-3 shadow-sm z-20" />
                <div className="w-7 h-7 rounded-full border border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 -mr-3 shadow-sm z-10" />
              </div>

              <div className="w-7 h-7 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-350">
                <ChevronLeft size={16} className="group-hover:translate-x-[-2px] transition-transform" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="relative w-full sm:w-[280px]" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full bg-white dark:bg-slate-900 text-text-main dark:text-gray-200 font-bold text-xs rounded-2xl px-4 py-3 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:border-primary/20 dark:hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        >
          <span>{currentLabel}</span>
          <ChevronDown 
            size={16} 
            className={`text-text-muted dark:text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        
        {isOpen && (
          <div className="absolute left-0 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
            {filters.map((filter) => {
              const isSelected = selectedStatus === filter.id;
              return (
                <button
  key={filter.id}
  type="button"
  onClick={() => {
    onStatusChange(filter.id);
    setIsOpen(false);
  }}
  className={`flex items-center justify-between w-[calc(100%-8px)] mx-auto px-4 py-2.5 text-right text-xs font-bold transition-all duration-200 rounded-xl ${
    isSelected 
      ? 'bg-primary/10 text-primary dark:bg-primary/20' 
      : 'text-text-muted dark:text-slate-350 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-text-main dark:hover:text-white'
  }`}
>
  <span>{filter.label}</span>
  {isSelected && <Check size={14} className="text-primary" />}
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