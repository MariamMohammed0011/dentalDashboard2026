import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  User, 
  ShieldAlert, 
  Truck, 
  Megaphone, 
  Save, 
  Lock, 
  Mail, 
  Phone, 
  DollarSign, 
  Clock, 
  Eye, 
  EyeOff, 
  Camera, 
  Loader2,
  Undo2,
  Info,
  CheckCircle2,
  Percent
} from 'lucide-react';
import { toast } from 'sonner';
import { useProfile } from '../../../features/auth/hooks/useProfile';


const defaultSettings = {
  
  systemName: "منصة سنّي للأسنان",
  supportEmail: "support@sanidash.com",
  supportPhone: "+963 930 111 222",
  currency: "USD",
  maintenanceMode: false,
  allowNewRegistrations: true,

  
  autoVerifyDoctors: false,
  requireSyndicateCard: true,
  annualLabFee: 250,
  freeTrialDays: 30,
  maxActiveOrdersUnsubscribed: 3,

  
  dailyRentalFee: 50,
  lateFeePerDay: 15,
  maxRentalDays: 7,
  platformTransactionFee: 5,
  defaultDeliveryFee: 10,

  
  dailyAdCost: 20,
  maxActiveAds: 10,
  autoApproveBlogs: false,
  maxBlogAttachments: 3
};

const SettingsPage = () => {
  
  const { data: userProfile, refetch: refetchProfile } = useProfile();
  
  
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('dental_dashboard_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  });

  
  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phoneNumber || '',
        avatar: userProfile.avatarUrl || ''
      });
    }
  }, [userProfile]);

  
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  
  const tabs = [
    { id: 'general', label: 'إعدادات النظام', icon: Settings },
    { id: 'profile', label: 'الحساب الشخصي', icon: User },
    { id: 'membership', label: 'العضوية والاشتراكات', icon: ShieldAlert },
    { id: 'orders', label: 'الطلبات والماسحات', icon: Truck },
    { id: 'marketing', label: 'التسويق والمدونات', icon: Megaphone }
  ];

  
  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('حجم الصورة يجب ألا يتجاوز 2 ميغابايت');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({
          ...prev,
          avatar: reader.result
        }));
        toast.success('تم تحميل الصورة بنجاح (سيتم الحفظ عند ضغط زر الحفظ)');
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    
    setTimeout(() => {
      localStorage.setItem('dental_dashboard_settings', JSON.stringify(settings));
      setIsSaving(false);
      toast.success('تم حفظ إعدادات المنصة بنجاح', {
        icon: <CheckCircle2 className="text-green-500 w-5 h-5" />
      });
    }, 800);
  };

  
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    if (!profileForm.name.trim()) {
      toast.error('الاسم الكامل مطلوب');
      return;
    }

    setIsSaving(true);
    
    
    setTimeout(() => {
      
      localStorage.setItem('admin_profile_edit', JSON.stringify(profileForm));
      
      
      if (passwords.currentPassword || passwords.newPassword || passwords.confirmPassword) {
        if (!passwords.currentPassword) {
          toast.error('يرجى إدخال كلمة المرور الحالية لتحديثها');
          setIsSaving(false);
          return;
        }
        if (passwords.newPassword.length < 6) {
          toast.error('يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل');
          setIsSaving(false);
          return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
          toast.error('كلمة المرور الجديدة غير متطابقة مع تأكيدها');
          setIsSaving(false);
          return;
        }
        
        toast.success('تم تحديث كلمة المرور بنجاح');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }

      setIsSaving(false);
      toast.success('تم تحديث بيانات الملف الشخصي بنجاح');
      if (refetchProfile) refetchProfile();
    }, 1000);
  };

  
  const handleResetSettings = () => {
    if (window.confirm('هل أنت متأكد من إعادة ضبط كافة إعدادات المنصة إلى القيم الافتراضية؟')) {
      setSettings(defaultSettings);
      localStorage.setItem('dental_dashboard_settings', JSON.stringify(defaultSettings));
      toast.info('تمت إعادة تعيين إعدادات المنصة للقيم الافتراضية');
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-10 lg:px-12 pb-10 min-h-full" dir="rtl">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-main/50 pb-5">
        <div className="text-right">
          <h1 className="text-2xl font-black text-text-main flex items-center gap-2.5">
            <Settings className="text-primary w-7 h-7" />
            إعدادات النظام والمنصة
          </h1>
          <p className="text-sm text-text-muted mt-1">تخصيص قيم ومعايير تشغيل نظام العيادات والمخابر والتحكم في الخيارات العامة</p>
        </div>
        {activeTab !== 'profile' && (
          <button
            type="button"
            onClick={handleResetSettings}
            className="flex items-center gap-2 bg-transparent text-text-muted hover:text-danger border border-border-main hover:border-danger/30 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 active:scale-95 self-start md:self-auto cursor-pointer"
          >
            <Undo2 size={15} />
            <span>إعادة ضبط المصنع</span>
          </button>
        )}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        
        <div className="lg:col-span-1 flex flex-col gap-2 bg-bg-card border border-border-main/60 rounded-[2rem] p-3 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.01]'
                    : 'text-text-muted hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-text-muted/70'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

         <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-bg-card border border-border-main rounded-[2rem] p-6 sm:p-8 shadow-sm relative overflow-hidden"
            >
              {activeTab === 'general' && (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <h3 className="text-lg font-black text-text-main border-b border-border-main/50 pb-3 mb-4">إعدادات المنصة الأساسية</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-text-muted">اسم المنصة</label>
                      <input 
                        type="text"
                        value={settings.systemName}
                        onChange={(e) => handleInputChange('systemName', e.target.value)}
                        className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold"
                        placeholder="أدخل اسم المنصة"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-text-muted">العملة الافتراضية للنظام</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold cursor-pointer"
                      >
                        <option value="USD">الدولار الأمريكي ($)</option>
                        <option value="SAR">الريال السعودي (ر.س)</option>
                        <option value="AED">الدرهم الإماراتي (د.إ)</option>
                        <option value="EGP">الجنيه المصري (ج.م)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-text-muted">البريد الإلكتروني للدعم الفني</label>
                      <div className="relative flex items-center">
                        <Mail className="absolute right-3.5 text-text-muted/60" size={16} />
                        <input 
                          type="email"
                          value={settings.supportEmail}
                          onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                          className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl pr-10 pl-4 py-3 w-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                          placeholder="support@domain.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-text-muted">رقم هاتف الدعم الفني</label>
                      <div className="relative flex items-center">
                        <Phone className="absolute right-3.5 text-text-muted/60" size={16} />
                        <input 
                          type="text"
                          value={settings.supportPhone}
                          onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                          className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl pr-10 pl-4 py-3 w-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                          placeholder="+963 930..."
                          required
                        />
                      </div>
                    </div>
                  </div>

                   <div className="bg-bg-main/30 border border-border-main/40 rounded-2xl p-4 space-y-4 mt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col text-right">
                        <span className="text-sm font-black text-text-main">وضع الصيانة (Maintenance Mode)</span>
                        <span className="text-xs text-text-muted">تعطيل الواجهات وتوجيه المستخدمين لصفحة الصيانة المؤقتة</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInputChange('maintenanceMode', !settings.maintenanceMode)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          settings.maintenanceMode ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            settings.maintenanceMode ? '-translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <hr className="border-border-main/40" />

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col text-right">
                        <span className="text-sm font-black text-text-main">السماح بتسجيل الحسابات الجديدة</span>
                        <span className="text-xs text-text-muted">تمكين خيار إنشاء حسابات جديدة للأطباء والمخابر عبر التطبيق</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInputChange('allowNewRegistrations', !settings.allowNewRegistrations)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          settings.allowNewRegistrations ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            settings.allowNewRegistrations ? '-translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-md shadow-primary/10 transition-all active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      <span>حفظ التعديلات</span>
                    </button>
                  </div>
                </form>
              )}

              {/* تبويب الحساب الشخصي والبروفايل */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <h3 className="text-lg font-black text-text-main border-b border-border-main/50 pb-3 mb-4">الملف الشخصي وكلمة المرور</h3>
                  
                  {/* تغيير الصورة الشخصية */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 bg-bg-main/20 p-4 rounded-2xl border border-border-main/30">
                    <div className="relative group w-20 h-20 rounded-full border-2 border-white dark:border-gray-800 shadow-md bg-primary/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {profileForm.avatar ? (
                        <img src={profileForm.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name || 'Admin')}&background=367AFF&color=fff&size=128`} 
                          alt="Avatar" 
                          className="w-full h-full object-cover" 
                        />
                      )}
                      <label className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                        <Camera className="text-white" size={20} />
                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                      </label>
                    </div>
                    <div className="text-right flex-grow">
                      <span className="block text-sm font-black text-text-main">{profileForm.name || 'مسؤول النظام'}</span>
                      <span className="block text-xs text-text-muted mt-0.5">الصلاحية: {userProfile?.role || 'SuperAdmin'}</span>
                      <label className="mt-2.5 inline-block text-xs text-primary font-bold hover:underline cursor-pointer">
                        تحميل صورة جديدة
                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* الحقول الأساسية للبروفايل */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-text-muted">الاسم الكامل</label>
                      <input 
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                        className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-text-muted">البريد الإلكتروني للقروب</label>
                      <input 
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                        className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-text-muted">رقم الهاتف الجوال</label>
                      <input 
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                        className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                      />
                    </div>
                  </div>

                  <hr className="border-border-main/50 my-6" />

                  {/* تغيير كلمة المرور */}
                  <div>
                    <h4 className="text-sm font-black text-text-main mb-4 flex items-center gap-2">
                      <Lock size={15} className="text-primary" />
                      تغيير كلمة المرور (اختياري)
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* كلمة المرور الحالية */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted">كلمة المرور الحالية</label>
                        <div className="relative flex items-center">
                          <input 
                            type={showPassword.current ? "text" : "password"}
                            value={passwords.currentPassword}
                            onChange={(e) => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
                            className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl pr-4 pl-10 py-3 w-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                            placeholder="••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(p => ({ ...p, current: !p.current }))}
                            className="absolute left-3 text-text-muted/60 hover:text-primary transition-colors cursor-pointer"
                          >
                            {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* كلمة المرور الجديدة */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted">كلمة المرور الجديدة</label>
                        <div className="relative flex items-center">
                          <input 
                            type={showPassword.new ? "text" : "password"}
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                            className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl pr-4 pl-10 py-3 w-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                            placeholder="••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(p => ({ ...p, new: !p.new }))}
                            className="absolute left-3 text-text-muted/60 hover:text-primary transition-colors cursor-pointer"
                          >
                            {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* تأكيد كلمة المرور الجديدة */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted">تأكيد الكلمة الجديدة</label>
                        <div className="relative flex items-center">
                          <input 
                            type={showPassword.confirm ? "text" : "password"}
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
                            className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl pr-4 pl-10 py-3 w-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                            placeholder="••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(p => ({ ...p, confirm: !p.confirm }))}
                            className="absolute left-3 text-text-muted/60 hover:text-primary transition-colors cursor-pointer"
                          >
                            {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-md shadow-primary/10 transition-all active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      <span>حفظ ملف التعريف</span>
                    </button>
                  </div>
                </form>
              )}

              {/* تبويب العضوية واشتراكات الأطباء والمخابر */}
              {activeTab === 'membership' && (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border-main/50 pb-3 mb-4">
                    <h3 className="text-lg font-black text-text-main">إعدادات العضوية والتحقق</h3>
                    <div className="text-xs text-primary font-black bg-primary/10 px-2.5 py-1 rounded-lg">لوجيك طلبات الانتساب</div>
                  </div>

                  {/* إعدادات أطباء الأسنان */}
                  <div>
                    <h4 className="text-sm font-black text-text-main mb-3.5">بوابات أطباء الأسنان (Dentists)</h4>
                    <div className="bg-bg-main/20 border border-border-main/30 rounded-2xl p-4 space-y-4">
                      
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col text-right">
                          <span className="text-sm font-bold text-text-main">التحقق التلقائي من الأطباء</span>
                          <span className="text-xs text-text-muted">تفعيل الحساب فور التسجيل دون الحاجة لموافقة يدوية من المسؤول</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleInputChange('autoVerifyDoctors', !settings.autoVerifyDoctors)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            settings.autoVerifyDoctors ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              settings.autoVerifyDoctors ? '-translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <hr className="border-border-main/30" />

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col text-right">
                          <span className="text-sm font-bold text-text-main">طلب صورة بطاقة النقابة السنية</span>
                          <span className="text-xs text-text-muted">إلزام الأطباء برفع وثيقة إثبات النقابة للتأكيد والتحقق</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleInputChange('requireSyndicateCard', !settings.requireSyndicateCard)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            settings.requireSyndicateCard ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              settings.requireSyndicateCard ? '-translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* إعدادات المخابر السنية */}
                  <div>
                    <h4 className="text-sm font-black text-text-main mb-3.5">رسوم واشتراكات المخابر (Labs)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted">الاشتراك السنوي للمخبر</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number"
                            min="0"
                            value={settings.annualLabFee}
                            onChange={(e) => handleInputChange('annualLabFee', parseFloat(e.target.value) || 0)}
                            className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl pr-4 pl-12 py-3 w-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                          />
                          <span className="absolute left-3 text-xs font-black text-text-muted">{settings.currency}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted">فترة التجربة المجانية (يوم)</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number"
                            min="0"
                            value={settings.freeTrialDays}
                            onChange={(e) => handleInputChange('freeTrialDays', parseInt(e.target.value) || 0)}
                            className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl pr-4 pl-14 py-3 w-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                          />
                          <span className="absolute left-3 text-xs font-black text-text-muted">أيام</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted">أقصى طلبات معلقة (لغير المشترك)</label>
                        <input 
                          type="number"
                          min="1"
                          value={settings.maxActiveOrdersUnsubscribed}
                          onChange={(e) => handleInputChange('maxActiveOrdersUnsubscribed', parseInt(e.target.value) || 1)}
                          className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-md shadow-primary/10 transition-all active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      <span>حفظ إعدادات العضوية</span>
                    </button>
                  </div>
                </form>
              )}

              {/* تبويب الطلبات والماسح الضوئي وعمولات الشحن */}
              {activeTab === 'orders' && (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border-main/50 pb-3 mb-4">
                    <h3 className="text-lg font-black text-text-main">إعدادات الطلبات والماسح الضوئي (Scanner)</h3>
                    <div className="text-xs text-primary font-black bg-primary/10 px-2.5 py-1 rounded-lg">إدارة لوجستيات الحالات</div>
                  </div>

                  <div className="bg-blue-500/5 text-primary border border-blue-500/10 rounded-2xl p-4 flex gap-3 text-right">
                    <Info size={20} className="flex-shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed font-bold">
                      تنطبق رسوم الماسح الضوئي المستأجر عند إرسال الأطباء لطلبات تصنيع الحالات السنية للمخابر مع طلب استعارة ماسح ضوئي ثلاثي الأبعاد من المنصة.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-text-main mb-3">حجز واستعارة الماسحات الضوئية</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted">تكلفة الإيجار اليومي</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number"
                            min="0"
                            value={settings.dailyRentalFee}
                            onChange={(e) => handleInputChange('dailyRentalFee', parseFloat(e.target.value) || 0)}
                            className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl pr-4 pl-12 py-3 w-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                          />
                          <span className="absolute left-3 text-xs font-black text-text-muted">{settings.currency}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted">أقصى مدة إيجار مسموحة</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number"
                            min="1"
                            value={settings.maxRentalDays}
                            onChange={(e) => handleInputChange('maxRentalDays', parseInt(e.target.value) || 0)}
                            className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl pr-4 pl-14 py-3 w-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                          />
                          <span className="absolute left-3 text-xs font-black text-text-muted">يوم</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted">غرامة التأخير اليومية</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number"
                            min="0"
                            value={settings.lateFeePerDay}
                            onChange={(e) => handleInputChange('lateFeePerDay', parseFloat(e.target.value) || 0)}
                            className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl pr-4 pl-12 py-3 w-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                          />
                          <span className="absolute left-3 text-xs font-black text-text-muted">{settings.currency}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-text-main mb-3">عمولات المنصة والتوصيل الافتراضية</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted">عمولة المنصة من المعاملات (نسبة %)</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number"
                            min="0"
                            max="100"
                            value={settings.platformTransactionFee}
                            onChange={(e) => handleInputChange('platformTransactionFee', parseFloat(e.target.value) || 0)}
                            className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl pr-4 pl-10 py-3 w-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                          />
                          <Percent className="absolute left-3 text-text-muted/60" size={16} />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted">سعر التوصيل الافتراضي للحالات</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number"
                            min="0"
                            value={settings.defaultDeliveryFee}
                            onChange={(e) => handleInputChange('defaultDeliveryFee', parseFloat(e.target.value) || 0)}
                            className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl pr-4 pl-12 py-3 w-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                          />
                          <span className="absolute left-3 text-xs font-black text-text-muted">{settings.currency}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-md shadow-primary/10 transition-all active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      <span>حفظ المعايير اللوجستية</span>
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'marketing' && (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border-main/50 pb-3 mb-4">
                    <h3 className="text-lg font-black text-text-main">إعدادات التسويق والإعلانات والمدونة</h3>
                    <div className="text-xs text-primary font-black bg-primary/10 px-2.5 py-1 rounded-lg">السياسات والأسعار</div>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-text-main mb-3.5">سوق المساحات الإعلانية (Ads Settings)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted">تكلفة نشر الإعلان يومياً</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number"
                            min="0"
                            value={settings.dailyAdCost}
                            onChange={(e) => handleInputChange('dailyAdCost', parseFloat(e.target.value) || 0)}
                            className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl pr-4 pl-12 py-3 w-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                          />
                          <span className="absolute left-3 text-xs font-black text-text-muted">{settings.currency}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted">الحد الأقصى للإعلانات النشطة معاً</label>
                        <input 
                          type="number"
                          min="1"
                          value={settings.maxActiveAds}
                          onChange={(e) => handleInputChange('maxActiveAds', parseInt(e.target.value) || 1)}
                          className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                        />
                      </div>
                    </div>
                  </div>

                  {/* إعدادات المدونات */}
                  <div>
                    <h4 className="text-sm font-black text-text-main mb-3.5">مقالات أطباء الأسنان (Blogs)</h4>
                    <div className="bg-bg-main/20 border border-border-main/30 rounded-2xl p-4 space-y-4 mb-4">
                      
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col text-right">
                          <span className="text-sm font-bold text-text-main">الموافقة التلقائية على المقالات</span>
                          <span className="text-xs text-text-muted">نشر المقال المكتوب بواسطة الطبيب فوراً دون مراجعة إدارية</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleInputChange('autoApproveBlogs', !settings.autoApproveBlogs)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            settings.autoApproveBlogs ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              settings.autoApproveBlogs ? '-translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-text-muted">الحد الأقصى للمرفقات والصور بكل منشور</label>
                      <input 
                        type="number"
                        min="1"
                        max="10"
                        value={settings.maxBlogAttachments}
                        onChange={(e) => handleInputChange('maxBlogAttachments', parseInt(e.target.value) || 1)}
                        className="bg-bg-main/50 text-text-main border border-border-main/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-left"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-md shadow-primary/10 transition-all active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      <span>حفظ خيارات التسويق</span>
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
