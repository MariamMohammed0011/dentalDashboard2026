import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Megaphone, 
  X, 
  Image as ImageIcon,
  User,
  Search,
  ChevronDown,
  Calendar,
  Layers,
  FileText,
  Sparkles,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import CalendarPicker from '../../../components/ui/CalendarPicker';
import { usersApi } from '../services/usersApi';

const AddAdModal = ({ isOpen, onClose, onCreateAd, isSubmitting }) => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'dentists',
    expiresAt: '',
    image: null
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setForm({
        title: '',
        content: '',
        type: 'dentists',
        expiresAt: '',
        image: null
      });
      setSelectedUser(null);
      setUserSearch('');
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['ads-users-list'],
    queryFn: () => usersApi.getUsers(),
    enabled: isOpen,
  });

  const filteredUsers = users.filter(user => {
    const q = userSearch.toLowerCase();
    return (
      (user.name || '').toLowerCase().includes(q) ||
      (user.phone || '').includes(q) ||
      (user.namePlace || '').toLowerCase().includes(q)
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error('يرجى اختيار مستخدم الإعلان');
      return;
    }
    if (!form.title.trim()) {
      toast.error('يرجى كتابة عنوان الإعلان');
      return;
    }
    if (!form.image) {
      toast.error('يرجى اختيار صورة الإعلان من الجهاز');
      return;
    }

    onCreateAd({ 
      userId: selectedUser.id, 
      adData: form 
    }, {
      onSuccess: () => {
        toast.success('تمت إضافة الإعلان بنجاح');
        onClose();
      },
      onError: (error) => {
        console.error("Failed to create ad:", error);
        const serverMessage = error.response?.data?.message || 'حدث خطأ أثناء إضافة الإعلان';
        toast.error(serverMessage);
      }
    });
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md" dir="rtl">
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-bg-card rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-border-main/80 relative"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-primary/10 dark:from-slate-800 dark:to-slate-900 p-5 sm:p-6 text-right flex items-center justify-between border-b border-border-main/60 flex-shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-gradient-to-br from-primary/20 via-blue-500/20 to-indigo-500/20 text-primary rounded-2xl border border-primary/20 shadow-sm shrink-0">
                  <Megaphone size={22} className="text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-text-main">إضافة إعلان جديد</h3>
                  <p className="text-xs text-text-muted font-medium mt-0.5">أدخل بيانات الحملة الإعلانية وصورة العرض</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-2xl text-text-muted hover:text-text-main transition-colors cursor-pointer"
                disabled={isSubmitting}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
              <div className="p-5 sm:p-6 flex flex-col gap-4.5 text-right overflow-y-auto flex-grow custom-scrollbar">
                
                {/* 1. Client User Field */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-text-main font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                    <span className="p-1 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      <User size={14} />
                    </span>
                    مستخدم الإعلانات (العميل) <span className="text-rose-500">*</span>
                  </label>
                  
                  {selectedUser ? (
                    <div className="flex items-center justify-between bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl p-3.5 transition-all">
                      <div className="flex items-center gap-3 text-right">
                        <div className="p-2.5 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/30 shrink-0">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-black text-text-main">{selectedUser.name}</div>
                          <div className="text-xs text-text-muted font-medium mt-0.5">
                            {selectedUser.phone} {selectedUser.namePlace ? `| ${selectedUser.namePlace}` : ''}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(null);
                          setUserSearch('');
                        }}
                        className="p-2 hover:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
                        disabled={isSubmitting}
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={isLoadingUsers ? "جاري تحميل العملاء..." : "ابحث عن اسم العميل، رقم الهاتف..."}
                        value={userSearch}
                        onChange={(e) => {
                          setUserSearch(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        disabled={isLoadingUsers || isSubmitting}
                        className="bg-gray-50 dark:bg-slate-900 border-2 border-border-main/70 focus:border-primary rounded-2xl pr-11 pl-10 py-3 text-text-main font-medium text-sm focus:outline-none transition-colors w-full text-right"
                      />
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-blue-500/10 text-blue-500 pointer-events-none">
                        <Search size={16} />
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        disabled={isLoadingUsers || isSubmitting}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors cursor-pointer"
                      >
                        <ChevronDown size={18} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-[9998]" 
                              onClick={() => setIsDropdownOpen(false)} 
                            />
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-border-main rounded-2xl shadow-xl z-[9999] max-h-60 overflow-y-auto custom-scrollbar"
                            >
                              {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                  <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setIsDropdownOpen(false);
                                      setUserSearch('');
                                    }}
                                    className="w-full text-right px-4 py-3 hover:bg-blue-500/10 flex items-center justify-between border-b border-border-main/50 last:border-0 transition-colors cursor-pointer"
                                  >
                                    <div>
                                      <div className="text-sm font-bold text-text-main">{user.name}</div>
                                      <div className="text-xs text-text-muted font-medium mt-0.5">
                                        {user.phone} {user.namePlace ? `- ${user.namePlace}` : ''}
                                      </div>
                                    </div>
                                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                                      <User size={14} />
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-6 text-center text-text-muted text-sm font-bold">
                                  لا يوجد مستخدمين مطابقين
                                </div>
                              )}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* 2. Ad Title Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-text-main font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                    <span className="p-1 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <Megaphone size={14} />
                    </span>
                    عنوان الإعلان <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: خصم 50% على أجهزة التعقيم"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="bg-gray-50 dark:bg-slate-900 border-2 border-border-main/70 focus:border-amber-500 rounded-2xl px-4 py-3 text-text-main font-medium text-sm focus:outline-none transition-colors w-full"
                    disabled={isSubmitting}
                  />
                </div>

                {/* 3. Ad Content Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-text-main font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                    <span className="p-1 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
                      <FileText size={14} />
                    </span>
                    محتوى / تفاصيل الإعلان
                  </label>
                  <textarea
                    placeholder="اكتب تفاصيل الإعلان هنا..."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="bg-gray-50 dark:bg-slate-900 border-2 border-border-main/70 focus:border-purple-500 rounded-2xl px-4 py-3 text-text-main font-medium text-sm focus:outline-none transition-colors w-full min-h-[85px] resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                {/* 4. Target Audience & Expiration Date (Dual Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-text-main font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                      <span className="p-1 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                        <Layers size={14} />
                      </span>
                      الجمهور المستهدف
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="bg-gray-50 dark:bg-slate-900 border-2 border-border-main/70 focus:border-indigo-500 rounded-2xl px-4 py-3 text-text-main font-bold text-sm focus:outline-none transition-colors w-full cursor-pointer appearance-none text-right"
                      disabled={isSubmitting}
                    >
                      <option value="dentists">أطباء الأسنان فقط</option>
                      <option value="labs">مخابر الأسنان فقط</option>
                      <option value="both">الأطباء والمخابر معاً</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-text-main font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                      <span className="p-1 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400">
                        <Calendar size={14} />
                      </span>
                      تاريخ الانتهاء
                    </label>
                    <div className="relative">
                      <CalendarPicker
                        value={form.expiresAt}
                        onChange={(val) => setForm({ ...form, expiresAt: val })}
                        disabled={isSubmitting}
                        placeholder="اختر تاريخ الانتهاء"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Image Uploader Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-text-main font-bold text-xs sm:text-sm flex items-center gap-1.5 mr-1">
                    <span className="p-1 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400">
                      <ImageIcon size={14} />
                    </span>
                    صورة الإعلان <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-col items-center gap-3 bg-slate-50 dark:bg-slate-900/60 border-2 border-dashed border-teal-500/30 hover:border-teal-500 rounded-3xl p-5 transition-colors relative cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setForm({ ...form, image: file });
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      disabled={isSubmitting}
                    />
                    {form.image ? (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border-main/80 shadow-sm">
                        <img 
                          src={URL.createObjectURL(form.image)} 
                          alt="Ad Preview" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-sm gap-2">
                          <UploadCloud size={20} />
                          <span>تغيير الصورة</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-text-muted py-2">
                        <div className="p-3.5 rounded-2xl bg-teal-500/10 text-teal-500 group-hover:scale-110 transition-transform">
                          <UploadCloud size={32} />
                        </div>
                        <span className="text-xs font-bold text-text-main group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          اضغط هنا أو اسحب صورة الإعلان إلى هنا
                        </span>
                        <span className="text-[11px] text-text-muted font-medium">تدعم صيغ PNG, JPG, JPEG</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end items-center p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-border-main/60 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border-2 border-border-main bg-white dark:bg-bg-card text-text-muted font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl shadow-lg shadow-primary/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 text-xs sm:text-sm"
                >
                  <CheckCircle2 size={18} />
                  <span>{isSubmitting ? 'جاري الإضافة...' : 'إضافة الإعلان'}</span>
                </button>
              </div>

            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AddAdModal;

