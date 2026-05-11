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
   
  }[type];

  return (
    <div className="w-full min-h-[160px] bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1" dir="rtl">
      {/* ارلجزء العلوي (أبيض) */}
      <div className="flex-grow p-5 flex flex-col justify-center relative overflow-hidden">
        {/* النمط الجانبي الزخرفي (framer) */}
        <div className="absolute top-0 right-0 w-full h-full opacity-40 pointer-events-none z-0">
          <img src={framerImg} alt="" className="w-full h-full object-cover" />
        </div>

        {/* الاسم والحالة في سطر واحد */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-text-main font-bold truncate max-w-[180px]">
              {typeLabel}: <span className="text-gray-500 font-medium">{name}</span>
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${config.color} bg-white border border-current/10`}>
              {config.label}
            </span>
          </div>
        </div>

        {/* وثيقة الانتساب */}
        <div className="flex flex-row items-center justify-between mt-auto relative z-10 pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500">
            <span>وثيقة الانتساب:</span>
            <a 
              href={documentUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold hover:underline"
            >
              فتح
            </a>
          </div>
          <Eye size={15} className="text-primary stroke-[2.5]" />
        </div>
      </div>

      {/* الجزء السفلي (أزرار مقسمة) */}
      <div className="bg-[#F8FAFC] h-[40px] flex items-stretch border-t border-gray-100">
        {status === 'pending' ? (
          <>
            <button
              onClick={() => onUpdateStatus(id, 'rejected')}
              className="flex-1 flex items-center justify-center gap-1.5 text-red-500 text-[13px] font-bold hover:bg-red-50 transition-colors"
            >
              <XCircle size={15} className="stroke-[2.5]" />
              رفض
            </button>
            <div className="w-[1px] bg-gray-200/50 self-stretch my-2"></div>
            <button
              onClick={() => onUpdateStatus(id, 'accepted')}
              className="flex-1 flex items-center justify-center gap-1.5 text-green-600 text-[13px] font-bold hover:bg-green-50 transition-colors"
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
