import { useState } from 'react';
import { toast } from 'sonner';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const INITIAL_FORM_STATE = {
  name: '',
  phone: '',
  namePlace: '',
  addressPlace: '',
  cityPlace: '',
  countryPlace: 'سوريا'
};

export const useAddAdClient = ({ onCreateClient, onClose, isSubmitting }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);

  const handleChange = (field, value) => {
    if (field === 'phone') {
      // فقط أرقام
      const onlyNumbers = value.replace(/\D/g, '');

      // إذا تجاوز 10 أرقام، عرض toast تنبيه
      if (onlyNumbers.length > 10) {
        toast.error('رقم الهاتف يجب أن يكون 10 أرقام فقط (09 + 8 أرقام)');
        return;
      }

      // إذا كان الطول أكتر من 2 وما بيبدأ ب 09، عطيه تنبيه
      if (onlyNumbers.length > 2 && !onlyNumbers.startsWith('09')) {
        toast.error('رقم الهاتف يجب أن يبدأ بـ 09');
        return;
      }

      setForm((prev) => ({ ...prev, [field]: onlyNumbers }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const resetForm = () => setForm(INITIAL_FORM_STATE);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('يرجى ملء الحقول الإجبارية (الاسم ورقم الهاتف)');
      return;
    }

    // التحقق من صيغة الهاتف: يجب أن يبدأ بـ 09 وعدد الأرقام الكلي 10
    const phoneDigits = form.phone.trim();
    if (!/^09\d{8}$/.test(phoneDigits)) {
      toast.error('رقم الهاتف يجب أن يكون 10 أرقام فقط (09 + 8 أرقام)');
      return;
    }

    const cleanedForm = Object.fromEntries(
      Object.entries({
        ...form,
        phone: phoneDigits
      })
      .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
      .filter(([_, value]) => value !== '')
    );

    
    try {
      await onCreateClient(cleanedForm);
      toast.success('تم إنشاء حساب عميل الإعلانات بنجاح');
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to create client:", error);
      
      const serverMessage = error.response?.data?.message || 'حدث خطأ أثناء إنشاء حساب العميل';
      toast.error(serverMessage);
    }
  };

  return {
    form,
    handleChange,
    handleSubmit,
    resetForm
  };
};