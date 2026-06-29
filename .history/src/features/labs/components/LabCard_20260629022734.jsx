import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, ChevronLeft, Star, ChevronDown, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { labsApi } from '../services/labsApi';
import framerImg from '../../../assets/framer.png';

const getStatusConfig = (status) => {
  const cleanStatus = typeof status === 'string' ? status.toLowerCase() : '';
  if (cleanStatus === 'active') {
    return {
      label: 'نشط',
      color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/50',
      dot: 'bg-emerald-500 animate-pulse'
    };
  }
  if (cleanStatus === 'pendingadminapproval' || cleanStatus === 'pending') {
    return {
      label: 'قيد المراجعة',
      color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/30 hover:bg-amber-100/50 dark:hover:bg-amber-950/50',
      dot: 'bg-amber-500 animate-pulse'
    };
  }
  if (cleanStatus === 'suspended') {
    return {
      label: 'معلق',
      color: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100/50 dark:border-rose-900/30 hover:bg-rose-100/50 dark:hover:bg-rose-950/50',
      dot: 'bg-rose-500'
    };
  }
  if (cleanStatus === 'rejected') {
    return {
      label: 'مرفوض',
      color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
      dot: 'bg-rose-500'
    };
  }
  return {
    label: status || 'غير محدد',
    color: 'bg-gray-50 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800',
    dot: 'bg-gray-400'
  };
};

const LabCard = ({ id, name, onShowDetails, onEditStatus, updatingLabId }) => {
  
  const { data: details, isLoading } = useQuery({
    queryKey: ['lab-card-details', id],
    queryFn: () => labsApi.getLabDetails(id),
    staleTime: 1000 * 60 * 5, 
  });

  const renderStars = (rating = 0) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2;
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<Star key={i} size={16} fill="#F59E0B" className="text-amber-500" />);
      } else if (i - 0.5 === roundedRating) {
        stars.push(
          <div key={i} className="relative inline-block" style={{ width: 16, height: 16 }}>
            <Star size={16} className="text-gray-200 dark:text-slate-700" />
            <div className="absolute top-0 right-0 left-0 bottom-0 overflow-hidden" style={{ width: '50%' }}>
              <Star size={16} fill="#F59E0B" className="text-amber-500" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-200 dark:text-slate-700" />);
      }
    }
    return stars;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white dark:bg-bg-card rounded-[2.5rem] p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden h-[230px] w-full border border-slate-100 dark:border-slate-800" 
      dir="rtl"
    >
      
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <img 
          src={framerImg} 
          alt="" 
          className="w-full h-full object-cover" 
        />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full flex-grow">
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-emerald-100 dark:shadow-none transition-transform group-hover:scale-110 duration-300 shrink-0">
              <FlaskConical size={26} />
            </div>
            
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black tracking-widest uppercase">مخبر تعويضات</span>
              <h3 className="font-bold text-text-main dark:text-gray-100 text-[15px] tracking-tight truncate leading-tight">
                {name}
              </h3>
            </div>
          </div>

         
          {!isLoading && details?.owner?.status && (() => {
            const isCurrentlyUpdating = updatingLabId === id;
            if (isCurrentlyUpdating) {
              return (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-850 animate-pulse select-none shrink-0">
                  <Loader2 size={10} className="animate-spin text-primary shrink-0" />
                  <span>جاري...</span>
                </div>
              );
            }

            const statusCfg = getStatusConfig(details.owner.status);
            return (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEditStatus) {
                    onEditStatus({
                      id,
                      name,
                      status: details.owner.status,
                      address: [details.owner.addressPlace, details.owner.cityPlace, details.owner.countryPlace].filter(Boolean).join('، ')
                    });
                  }
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${statusCfg.color}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusCfg.dot}`} />
                <span>{statusCfg.label}</span>
                <ChevronDown size={10} className="opacity-70 shrink-0" />
              </button>
            );
          })()}
        </div>

        {/* Middle: Rating Display (Matching Details modal style) */}
        <div className="flex flex-row gap-2 my-2 pr-1 text-right select-none mt-5">
           <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 shrink-0">
                          <Star size={20} className="text-amber-500" />
                        </div>
                        <div className='flex flex-col gap-1 '>
                           <span className="text-[10px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-wider">
            متوسط التقييم
          </span>
  <div className="flex items-center gap-1.5 mt-0.5">
            {isLoading ? (
              <div className="h-4 bg-slate-100 dark:bg-slate-800/80 rounded animate-pulse w-40 mt-1" />
            ) : (
              <>
                {/* Stars first: renders on the right in RTL */}
                <div className="flex gap-0.5">{renderStars(details?.averageRating)}</div>
                {/* Rating score second: renders on the left in RTL */}
                <span className="text-[13px] font-black text-slate-700 dark:text-gray-200 font-sans">
                  ({details?.averageRating?.toFixed(1) || '0.0'})
                </span>
              </>
            )}
          </div>
                        </div>
         
        
        </div>

        {/* Lower: Info & CTA */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">مخبر رقم: #{id}</span>
          
          <button 
            onClick={() => onShowDetails(id)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white dark:bg-emerald-950/40 dark:hover:bg-emerald-600 dark:text-emerald-400 dark:hover:text-white rounded-xl text-xs font-black transition-all active:scale-95 group/btn"
          >
            عرض التفاصيل
            <ChevronLeft size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LabCard;
