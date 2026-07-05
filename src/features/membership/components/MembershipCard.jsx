import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, CheckCircle2, XCircle, Clock, User, Microscope } from 'lucide-react';

const statusConfig = {
  pending: { labelKey: 'common.pending', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: <Clock size={14} className="animate-spin-slow" />, border: 'border-amber-100' },
  accepted: { labelKey: 'common.active', color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: <CheckCircle2 size={14} />, border: 'border-emerald-100' },
  rejected: { labelKey: 'common.rejected', color: 'text-rose-600', bgColor: 'bg-rose-50', icon: <XCircle size={14} />, border: 'border-rose-100' },
  suspended: { labelKey: 'common.suspended', color: 'text-slate-500', bgColor: 'bg-slate-50', icon: <Clock size={14} />, border: 'border-slate-100' },
};

const MembershipCard = ({ request, onUpdateStatus, onShowDetails }) => {
  const { t } = useTranslation();

  if (!request) return null;

  const { id, name, type, status } = request;
  const config = statusConfig[status] || statusConfig.pending;
  const isDoctor = type === 'doctor';

  return (
    <div dir="rtl" className=" card group relative w-full h-[220px] bg-white rounded-[2.5rem] border border-slate-100 p-3 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-2 overflow-hidden flex flex-col">
      <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-0 group-hover:h-32 transition-all duration-700 rounded-l-full z-30 ${isDoctor ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`} />
    
      <div className="relative z-10 flex flex-col h-full">
        
        <div className="p-4 flex items-center gap-4">
          <div className={`relative w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:shadow-2xl ${isDoctor ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-100' : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-100'}`}>
            {isDoctor ? <User size={30} /> : <Microscope size={30} />}
            <button 
              onClick={() => onShowDetails(request)} 
              className={`absolute -bottom-1 -left-1 w-7 h-7 rounded-full shadow-md flex items-center justify-center transition-all animate-eye-attract ${isDoctor ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
            >
              <Eye size={14} />
            </button>
          </div>

          <div className="flex flex-col">
            <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDoctor ? 'text-blue-600' : 'text-emerald-600'}`}>
              {isDoctor ? t('doctors.doctor') : t('labs.labType')}
            </span>
            <h4 className="text-lg font-bold text-slate-800 leading-tight">{name}</h4>
          </div>
        </div>

        <div className="mt-auto pb-0 px-4">
          <div className="bg-slate-50/80 backdrop-blur-md p-1 rounded-[2rem] border border-slate-200/50 flex items-center gap-2 shadow-inner">
            {status === 'pending' || status === 'suspended' ? (
              <>
               
                <button
                  onClick={() => onUpdateStatus(id, 'rejected', type)}
                  className={`group/btn w-12 h-10 flex items-center justify-center rounded-full transition-all duration-500 ${status === 'rejected' ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'bg-white/50 text-rose-400 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100'}`}
                  title={t('membership.reject')}
                >
                  <XCircle size={18} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                </button>
                
               
                <button
                  onClick={() => onUpdateStatus(id, 'suspended', type)}
                  className={`group/btn w-12 h-10 flex items-center justify-center rounded-full transition-all duration-500 ${status === 'suspended' ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'bg-white/50 text-amber-500 hover:bg-amber-50 hover:text-amber-600 border border-transparent hover:border-amber-100'}`}
                  title={t('membership.suspend')}
                >
                  <Clock size={18} className="group-hover/btn:rotate-12 transition-transform" />
                </button>

               
                <button
                  onClick={() => onUpdateStatus(id, 'accepted', type)}
                  className={`flex-1 h-10 flex items-center justify-center gap-3 rounded-[1.5rem] font-black text-xs text-white transition-all active:scale-95 shadow-lg group/accept overflow-hidden relative ${isDoctor ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'}`}
                >
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/accept:translate-x-0 transition-transform duration-500 ease-out" />
                  <CheckCircle2 size={18} strokeWidth={3} className="relative z-10 group-hover/accept:scale-110 transition-transform" />
                  <span className="relative z-10 uppercase tracking-tighter"> {t('membership.approve')} </span>
                </button>
              </>
            ) : (
              <div className={`w-full flex items-center justify-center h-10 gap-3 text-[13px] font-black rounded-full bg-white shadow-sm border border-slate-100 ${config.color}`}>
                <div className={`p-1.5 rounded-full ${config.bgColor}`}>{config.icon}</div>
                {t('membership.fileStatus', { status: t(config.labelKey) })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;