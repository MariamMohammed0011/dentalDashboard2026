import React from 'react';
import { Eye, CheckCircle2, XCircle, Clock } from 'lucide-react';
import framerImg from '../../../assets/framer.png';

const statusConfig = {
  pending: {
    label: 'معلق',
    color: 'text-[#FFB800]',
    bgColor: 'bg-white',
    icon: null,
  },
  accepted: {
    label: 'مقبول',
    color: 'text-[#00A34D]',
    bgColor: 'bg-white',
    icon: null,
  },
  rejected: {
    label: 'مرفوض',
    color: 'text-[#E11D48]',
    bgColor: 'bg-white',
    icon: null,
  },
};

const MembershipCard = ({ request, onUpdateStatus }) => {
  const { id, name, type, status, documentUrl } = request;
  const config = statusConfig[status] || statusConfig.pending;

  const typeLabel = {
    doctor: 'الطبيب',
    lab: 'المخبر',
    delivery: 'شركة توصيل',
  }[type];

  return (
    <div className="w-full max-w-[323px] min-h-[135px] bg-white rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-md mx-auto sm:mx-0" dir="rtl">
      {/* الجزء العلوي (أبيض) */}
      <div className="flex-grow p-4 flex flex-col justify-center relative overflow-hidden">
        {/* النمط الجانبي الزخرفي (framer) */}
        <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none z-0">
          <img src={framerImg} alt="" className="w-full h-full object-cover" />
        </div>

        {/* الاسم والحالة في سطر واحد */}
        <div className="flex justify-between items-center mb-2 relative z-10">
          <div className="text-[13px] text-text-main font-medium">
            {typeLabel}: <span className="text-gray-600">{name}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[13px] text-text-main font-medium">الحالة:</span>
            <span className={`text-[13px] font-bold ${config.color}`}>{config.label}</span>
          </div>
        </div>

        {/* وثيقة الانتساب */}
        <div className="flex flex-row items-center justify-center gap-2 relative z-10 flex-grow py-2">
          <span className="text-[13px] font-medium text-text-main">وثيقة الانتساب:</span>
          <a 
            href={documentUrl} 
            className="flex items-center gap-1 text-primary text-[13px] font-bold hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            فتح
            <Eye size={16} className="stroke-[2.5]" />
          </a>
        </div>
      </div>

      {/* الجزء السفلي (أزرق فاتح جداً) مع أزرار مقسمة */}
      <div className="bg-[#E8F1FF] h-[35px] flex items-stretch border-t border-gray-100/50">
        {status === 'pending' ? (
          <>
            <button
              onClick={() => onUpdateStatus(id, 'rejected')}
              className="flex-1 flex items-center justify-center gap-1.5 text-[#E11D48] text-[13px] font-bold hover:bg-white/40 transition-colors"
            >
              <XCircle size={15} className="stroke-[2.5]" />
              رفض
            </button>
            <div className="w-[1px] bg-gray-300/40 self-stretch my-1"></div>
            <button
              onClick={() => onUpdateStatus(id, 'accepted')}
              className="flex-1 flex items-center justify-center gap-1.5 text-[#00A34D] text-[13px] font-bold hover:bg-white/40 transition-colors"
            >
              <CheckCircle2 size={15} className="stroke-[2.5]" />
              قبول
            </button>
          </>
        ) : (
          <div className={`w-full flex items-center justify-center gap-2 text-[13px] font-bold ${config.color}`}>
            {status === 'accepted' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {config.label}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipCard;
