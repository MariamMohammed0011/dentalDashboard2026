import React from 'react';
import { User, Eye, Building2, MapPin, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🎨 زر شارة الحالة بتصميم شريط علوي بارز (Floating Status Pill)
const StatusBadgeButton = ({ tech, updatingTechId, onOpenModal }) => {
  const { t } = useTranslation();
  const isCurrentlyUpdating = updatingTechId === tech.id;
  const currentStatus = String(tech.status ?? '').toLowerCase().trim();

  if (isCurrentlyUpdating) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 animate-pulse">
        <Loader2 size={13} className="animate-spin text-indigo-600 shrink-0" />
        <span>{t('common.processing') || 'جاري التحديث...'}</span>
      </div>
    );
  }

  const getBadgeConfig = () => {
    if (currentStatus === 'active' || currentStatus === '2') {
      return {
        label: 'نشط',
        style: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
        dot: 'bg-emerald-500 animate-pulse'
      };
    }
    if (currentStatus === 'suspended' || currentStatus === '4') {
      return {
        label: 'معلق',
        style: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20',
        dot: 'bg-rose-500'
      };
    }
    if (currentStatus === 'readonly' || currentStatus === '3') {
      return {
        label: 'قراءة فقط',
        style: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20',
        dot: 'bg-indigo-500'
      };
    }
    if (currentStatus === 'pendingadminapproval' || currentStatus === 'pending' || currentStatus === '1') {
      return {
        label: 'قيد المراجعة',
        style: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
        dot: 'bg-amber-500 animate-pulse'
      };
    }
    return {
      label: tech.status || 'غير محدد',
      style: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20 hover:bg-slate-500/20',
      dot: 'bg-slate-400'
    };
  };

  const badge = getBadgeConfig();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpenModal(tech);
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${badge.style}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${badge.dot}`} />
      <span>{badge.label}</span>
      <ChevronDown size={12} className="opacity-60 shrink-0" />
    </button>
  );
};

// 💳 الكارد بالتصميم الجديد المتطور (New Sleek & Modern Design)
const LabTechnicianCard = ({ tech, updatingTechId, onOpenStatusModal, onShowDetails }) => {
  return (
    <div 
      className="group relative bg-white dark:bg-slate-900/90 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
      dir="rtl"
    >
      {/* لمسة ديكورية خلفية (Accent Glow) */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all pointer-events-none" />

      <div className="p-6 relative z-10">
        
        {/* الترويسة: شارة الحالة + اسم ووظيفة الفني */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-3.5 min-w-0">
            
            {/* الصورة الشخصية مع إطار متدرج */}
            <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 shrink-0 shadow-xs">
              <div className="w-13 h-13 sm:w-14 sm:h-14 bg-white dark:bg-slate-900 rounded-[0.9rem] flex items-center justify-center overflow-hidden">
                {tech.profilePictureUrl ? (
                  <img src={tech.profilePictureUrl} alt={tech.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={24} className="text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
            </div>

            {/* الاسم وتصنيف الحساب */}
            <div className="flex flex-col min-w-0">
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-gray-100 truncate leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={tech.name}>
                {tech.name || 'بدون اسم'}
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-500 dark:text-indigo-400 mt-0.5">
                <Sparkles size={12} />
                <span>فني مخبري</span>
              </div>
            </div>
          </div>

          {/* زر تعديل الحالة */}
          <StatusBadgeButton 
            tech={tech} 
            updatingTechId={updatingTechId} 
            onOpenModal={onOpenStatusModal} 
          />
        </div>

        {/* كبسولات المعلومات (Info Badges Grid) */}
        <div className="grid grid-cols-1 gap-2.5">
          
          {/* اسم مكان العمل */}
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            <div className="p-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
              <Building2 size={16} />
            </div>
            <span className="truncate">{tech.namePlace || 'مكان العمل غير محدد'}</span>
          </div>

          {/* العنوان / المدينة */}
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            <div className="p-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg shrink-0">
              <MapPin size={16} />
            </div>
            <span className="truncate">{tech.cityPlace ? `${tech.cityPlace}، ${tech.countryPlace || ''}` : 'المدينة غير محددة'}</span>
          </div>

        </div>
      </div>

      {/* زر عرض التفاصيل الفاخر بتأثير الماوس */}
      <button
        onClick={() => onShowDetails(tech.id)}
        className="w-full py-3.5 px-6 bg-slate-50 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 text-slate-700 hover:text-white dark:bg-slate-800/50 dark:hover:from-indigo-600 dark:hover:to-purple-600 dark:text-slate-200 dark:hover:text-white font-black text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border-t border-slate-100 dark:border-slate-800/60"
      >
        <Eye size={18} className="transition-transform group-hover:scale-110" />
        <span>عرض التفاصيل الكلية</span>
      </button>

    </div>
  );
};

export default LabTechnicianCard;