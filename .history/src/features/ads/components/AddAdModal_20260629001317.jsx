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
  FileText
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 relative"
          >
            
           
            <div className="bg-[#E8F1FF] p-5 sm:p-6 text-right flex items-center justify-between border-b border-[#D2E4FF]/50 flex-shrink-0">
              <div className="flex items-center gap-3 text-[#367AFF]">
                <Megaphone size={22} strokeWidth={2.5} />
                <h3 className="text-lg font-black">إضافة إعلان جديد</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/50 rounded-xl text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                disabled={isSubmitting}
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
              
              
              <div className="p-5 sm:p-7 flex flex-col gap-4 text-right overflow-y-auto flex-grow custom-scrollbar">
                
                
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">
                    مستخدم الإعلانات (العميل) <span className="text-red-500">*</span>
                  </label>
                  
                  {selectedUser ? (
                    <div className="flex items-center justify-between bg-blue-50/50 border border-blue-200 rounded-2xl p-3.5 transition-all">
                      <div className="flex items-center gap-3 text-right">
                        <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800">{selectedUser.name}</div>
                          <div className="text-xs text-gray-500 font-medium">
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
                        className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
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
                        className="bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-10 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full text-right"
                      />
                      <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        disabled={isLoadingUsers || isSubmitting}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                        <ChevronDown size={18} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                     
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
                              className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-[9999] max-h-60 overflow-y-auto custom-scrollbar"
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
                                    className="w-full text-right px-4 py-3 hover:bg-blue-50/50 flex flex-col gap-0.5 border-b border-gray-50 last:border-0 transition-colors cursor-pointer"
                                  >
                                    <span className="text-sm font-bold text-gray-800">{user.name}</span>
                                    <span className="text-xs text-gray-500 font-medium">
                                      {user.phone} {user.namePlace ? `- ${user.namePlace}` : ''}
                                    </span>
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-6 text-center text-gray-400 text-sm">
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

                
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">
                    عنوان الإعلان <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="مثال: خصم 50% على أجهزة التعقيم"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full"
                      disabled={isSubmitting}
                    />
                    <Megaphone className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">محتوى / تفاصيل الإعلان</label>
                  <div className="relative">
                    <textarea
                      placeholder="اكتب تفاصيل الإعلان هنا..."
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className="bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-gray-700 font-medium text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full min-h-[80px] resize-none"
                      disabled={isSubmitting}
                    />
                    <FileText className="absolute right-3.5 top-5 text-gray-400" size={18} />
                  </div>
                </div>

               
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">الجمهور المستهدف</label>
                    <div className="relative">
                      <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-gray-700 font-bold text-sm focus:outline-none focus:border-[#367AFF] transition-colors w-full cursor-pointer appearance-none text-right"
                        disabled={isSubmitting}
                      >
                        <option value="dentists">أطباء الأسنان فقط</option>
                        <option value="labs">مخابر الأسنان فقط</option>
                        <option value="both">الأطباء والمخابر معاً</option>
                      </select>
                      <Layers className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">تاريخ الانتهاء</label>
                    <div className="relative">
                      <CalendarPicker
                        value={form.expiresAt}
                        onChange={(val) => setForm({ ...form, expiresAt: val })}
                        disabled={isSubmitting}
                        placeholder="اختر تاريخ الانتهاء"
                      />
                      <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>

                
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 font-bold text-xs sm:text-sm mr-1">صورة الإعلان <span className="text-red-500">*</span></label>
                  <div className="flex flex-col items-center gap-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-5 hover:border-[#367AFF] transition-colors relative cursor-pointer group">
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
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isSubmitting}
                    />
                    {form.image ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-100">
                        <img 
                          src={URL.createObjectURL(form.image)} 
                          alt="Ad Preview" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-sm">
                          تغيير الصورة
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <ImageIcon size={36} className="text-gray-300 group-hover:text-[#367AFF] transition-colors" />
                        <span className="text-xs font-semibold group-hover:text-[#367AFF] transition-colors">اضغط هنا لاختيار صورة من جهازك</span>
                        <span className="text-[10px] text-gray-400">تدعم صيغ PNG, JPG, JPEG</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Submit Actions Footer */}
              <div className="flex gap-3 justify-end items-center p-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border border-[#DBEAFE] bg-white text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#367AFF] text-white hover:bg-[#2563EB] font-bold rounded-2xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الإضافة...' : 'إضافة الإعلان'}
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
