import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Mail, Phone, MapPin, Clock, CreditCard, ChevronLeft
} from 'lucide-react';
import framerImg from '../../../assets/framer.png';

export default function PendingPaymentGrid({ accounts, isLoading, onActivate }) {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse bg-white/60 dark:bg-slate-900/40 border border-slate-100/60 dark:border-slate-800/60 rounded-[2.2rem] h-[300px] w-full" />
        ))}
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="bg-bg-card border border-border-main/60 rounded-[2.2rem] p-12 text-center text-text-muted font-bold w-full flex flex-col items-center justify-center gap-3">
        <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-2xl text-purple-500">
          <CreditCard size={36} />
        </div>
        <p className="text-text-main text-base font-extrabold">لا يوجد حسابات بانتظار الدفع</p>
        <p className="text-xs text-text-muted max-w-sm">كل المخابر المعتمدين إما فعّلوا اشتراكهم أو ما وصلوا لمرحلة الدفع بعد.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full" dir="rtl">
      <AnimatePresence mode="popLayout">
        {accounts.map((acc, index) => (
          <motion.div
            key={acc.labId || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            whileHover={{ y: -6 }}
            className="bg-bg-card border rounded-[2.2rem] p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group border-border-main/70 hover:border-purple-500/30 h-[300px] w-full"
          >
            {/* Background Frame Texture */}
            <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04] pointer-events-none z-0">
              <img src={framerImg} alt="" className="w-full h-full object-cover" />
            </div>

            {/* Ambient Glow */}
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none bg-purple-500" />

            <div className="relative z-10 flex flex-col justify-between h-full w-full">

              {/* 1. Header */}
              <div className="flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-fuchsia-600 text-white shadow-lg shadow-purple-500/20 flex items-center justify-center shrink-0 group-hover:rotate-[6deg] transition-transform duration-300">
                    <Building2 size={22} />
                  </div>
                  <div className="flex flex-col text-right min-w-0 flex-1">
                    <span className="text-[10px] text-text-muted font-black tracking-wider uppercase">
                      المخبر #{acc.labId}
                    </span>
                    <h3 className="font-black text-text-main text-sm sm:text-base truncate leading-snug" title={acc.labName}>
                      {acc.labName}
                    </h3>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border shrink-0 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200/60 dark:border-purple-900/40">
                  <span className="w-2 h-2 rounded-full shrink-0 bg-purple-500 animate-pulse" />
                  بانتظار الدفع
                </span>
              </div>

              {/* 2. Details */}
              <div className="flex flex-col justify-between gap-2.5 py-3 shrink-0">
                <div className="flex items-center gap-2.5 text-xs text-text-muted h-5">
                  <Mail size={14} className="text-sky-500 shrink-0" />
                  <span className="truncate font-semibold dir-ltr text-right flex-1" title={acc.email}>{acc.email || 'غير متوفر'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-text-muted h-5">
                  <Phone size={14} className="text-emerald-500 shrink-0" />
                  <span className="truncate font-semibold dir-ltr text-right flex-1">{acc.phone || 'غير متوفر'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-text-muted h-5">
                  <MapPin size={14} className="text-rose-500 shrink-0" />
                  <span className="truncate font-semibold flex-1">
                    {[acc.cityPlace, acc.countryPlace].filter(Boolean).join('، ') || 'غير محدد'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-text-muted h-5">
                  <Clock size={14} className="text-amber-500 shrink-0" />
                  <span className="truncate font-semibold">بانتظار الدفع منذ {formatDate(acc.createdAt)}</span>
                </div>
              </div>

              {/* 3. Action */}
              {/* <div className="flex items-center justify-end h-[46px] shrink-0">
                <button
                  onClick={() => onActivate(acc)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-br from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-purple-500/20 transition-all active:scale-95 cursor-pointer group/btn"
                >
                  <CreditCard size={14} />
                  <span>تفعيل الاشتراك</span>
                  <ChevronLeft size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
                </button>
              </div> */}

            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
