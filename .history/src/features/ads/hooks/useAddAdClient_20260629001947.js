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
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => setForm(INITIAL_FORM_STATE);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('يرجى ملء الحقول الإجبارية (الاسم ورقم الهاتف)');
      return;
    }

    const phoneNumber = parsePhoneNumberFromString(form.phone.trim());

    if (!phoneNumber || !phoneNumber.isValid()) {
      toast.error('رقم الهاتف غير صحيح! يجب أن يبدأ برمز الدولة (مثال: +9639XXXXXXXX)');
      return;
    }

    const cleanedForm = Object.fromEntries(
      Object.entries({
        ...form,
        phone: phoneNumber.number 
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