import React from 'react';
import { Eye, CheckCircle2, XCircle, Clock, FileText, User, Microscope } from 'lucide-react';
import framerImg from '../../../assets/framer.png';

const statusConfig = {
  pending: {
    label: 'قيد المراجعة',
    color: 'text-[#FFB800]',
    bgColor: 'bg-[#FFFBEB]',
    borderColor: 'border-[#FFB800]/20',
    icon: <Clock size={14} />,
  },
  accepted: {
    label: 'مقبول',
    color: 'text-[#00A34D]',
    bgColor: 'bg-[#F0FDF4]',
    borderColor: 'border-[#00A34D]/20',
    icon: <CheckCircle2 size={14} />,
  },
  rejected: {
    label: 'مرفوض',
    color: 'text-[#E11D48]',
    bgColor: 'bg-[#FFF1F2]',
    borderColor: 'border-[#E11D48]/20',
    icon: <XCircle size={14} />,
  },
  suspended: {
    label: 'معلق',
    color: 'text-[#64748B]',
    bgColor: 'bg-[#F8FAFC]',
    borderColor: 'border-[#64748B]/20',
    icon: <Clock size={14} />,
  },
};

const MembershipCard = ({ request, onUpdateStatus, onShowDetails }) => {
  const { id, name, type, status } = request;
  const config = statusConfig[status] || statusConfig.pending;

  const typeLabel = {
    doctor: 'طبيب أسنان',
    lab: 'مخبر تعويضات',
  }[type];

  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col overflow-hidden group transition-all duration-500 hover:shadow-[0_20px_50px_rgba(54,122,255,0.12)] hover:-translate-y-2 relative" dir="rtl">
      {/* 1. صورة الـ Framer كخلفية (inset-0) */}
      <div className="absolute inset-0 opacity-40 pointer-events-none z-0">
        <img 
          src={framerImg} 
          alt="" 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* 2. خط التمييز عند الحوم (عمودي على اليسار) */}
      <div className="absolute right-0 top-0 w-1.5 h-0 bg-gradient-to-b from-primary to-blue-400 transition-all duration-500 group-hover:h-full z-20" />

      {/* الجزء العلوي - المعلومات المختصرة */}
      <div className="p-6 relative overflow-hidden flex-grow">
        {/* الترويسة: الأيقونة والاسم */}
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${type === 'doctor' ? 'bg-primary/5 text-primary' : 'bg-purple-50 text-purple-600'} group-hover:scale-110 transition-transform duration-500 shadow-sm bg-white/90 backdrop-blur-sm`}>
              {type === 'doctor' ? <User size={20} /> : <Microscope size={20} />}
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-gray-400 font-medium mb-0.5">{typeLabel}</span>
              <h3 className="text-[16px] text-text-main font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                {name}
              </h3>
            </div>
          </div>
          
          {/* زر العين للتفاصيل */}
          <button 
            onClick={() => onShowDetails(request)}
            className="p-2.5 bg-white/90 backdrop-blur-sm text-gray-400 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
            title="عرض التفاصيل"
          >
            <Eye size={20} className="stroke-[2.5]" />
          </button>
        </div>

        {/* الحالة */}
        <div className="mt-8 flex justify-end relative z-10">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${config.borderColor} ${config.bgColor} ${config.color} text-[12px] font-bold shadow-sm backdrop-blur-[2px]`}>
            {config.icon}
            {config.label}
          </div>
        </div>
      </div>

      {/* الجزء السفلي - الأزرار */}
      <div className="px-4 pb-4 mt-auto">
        <div className="bg-gray-50/80 backdrop-blur-sm p-1.5 rounded-[1.5rem] flex items-center gap-1 border border-gray-100">
          {status === 'pending' || status === 'suspended' ? (
            <>
              <button
                onClick={() => onUpdateStatus(id, 'rejected', type)}
                className="flex-1 flex flex-col items-center justify-center py-2 rounded-2xl text-red-500 hover:bg-white hover:shadow-md hover:text-red-600 transition-all duration-300 group/btn"
                title="رفض"
              >
                <XCircle size={18} className="mb-0.5 group-hover/btn:scale-110 transition-transform" />
                <span className="text-[11px] font-bold">رفض</span>
              </button>
              
              <button
                onClick={() => onUpdateStatus(id, 'suspended', type)}
                className={`flex-1 flex flex-col items-center justify-center py-2 rounded-2xl ${status === 'suspended' ? 'bg-white shadow-sm text-gray-400' : 'text-gray-500 hover:bg-white hover:shadow-md hover:text-gray-700'} transition-all duration-300 group/btn`}
                title="تعليق"
                disabled={status === 'suspended'}
              >
                <Clock size={18} className="mb-0.5 group-hover/btn:rotate-12 transition-transform" />
                <span className="text-[11px] font-bold">تعليق</span>
              </button>

              <button
                onClick={() => onUpdateStatus(id, 'accepted', type)}
                className="flex-[1.5] flex flex-col items-center justify-center py-2 rounded-2xl bg-primary text-white shadow-[0_4px_12px_rgba(54,122,255,0.25)] hover:bg-primary-hover hover:shadow-[0_6px_20px_rgba(54,122,255,0.35)] transition-all duration-300 group/btn"
                title="قبول"
              >
                <CheckCircle2 size={18} className="mb-0.5 group-hover/btn:scale-110 transition-transform" />
                <span className="text-[11px] font-bold">قبول الطلب</span>
              </button>
            </>
          ) : (
            <div className={`w-full flex items-center justify-center py-3 px-4 gap-2 text-[14px] font-bold rounded-2xl ${config.bgColor} ${config.color} border ${config.borderColor}`}>
              {config.icon}
              تم {config.label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;
