import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { membershipApi } from '../features/membership/services/membershipApi';
import { doctorsApi } from '../features/doctors/services/doctorsApi';

// ⚠️ تأكدي من وجود كلمة export const هنا بنفس الاسم بالضبط
export const useUpdateUserStatus = (queryKeysToInvalidate = []) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, status, type = 'doctor' }) => {
      const targetId = typeof id === 'object' ? (id.id || id.userId) : id;
      const numericStatus = Number(status);

      if (type === 'doctor' || type === 'dentist') {
        return await doctorsApi.updateStatus({ id: targetId, status: numericStatus });
      }

      return await membershipApi.updateRequestStatus(targetId, numericStatus, type);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors-list'] });
      
      if (queryKeysToInvalidate.length > 0) {
        queryKeysToInvalidate.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
        });
      }
      toast.success('تم تحديث حالة الحساب بنجاح');
    },
    onError: (error) => {
      console.error('Update status error:', error);
      const errorMsg = error.response?.data?.message || 'حدث خطأ أثناء تحديث حالة الحساب';
      toast.error(errorMsg);
    },
  });

  const rawId = mutation.variables?.id;
  const currentUpdatingId = mutation.isPending
    ? (typeof rawId === 'object' ? (rawId.id || rawId.userId) : rawId)
    : null;

  return {
    updateStatus: mutation.mutate,
    updateStatusAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    updatingId: currentUpdatingId,
  };
};