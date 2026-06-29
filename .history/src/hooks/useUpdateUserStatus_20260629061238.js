import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { membershipApi } from '../features/membership/services/membershipApi';

/**
 * هوك مخصص موحد لتغيير حالة الحسابات (أطباء، مخابر، طلبات انتساب)
 * يمنع تكرار الكود ويقوم بالتحقق والتطبيع التلقائي للحالة وتحديث الكاش الخاص بـ React Query.
 * 
 * @param {Array} queryKeysToInvalidate - مفاتيح الاستعلام التي يجب تحديث كاشها بعد النجاح
 */
export const useUpdateUserStatus = (queryKeysToInvalidate = []) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, status, type }) => {
      // 1. تطبيع الحالة لتتناسب مع الخريطة المتوقعة في السيرفر
      let apiActionStatus;
      const normalizedStatus = status?.toLowerCase();

      if (normalizedStatus === 'active' || normalizedStatus === 'accepted') {
        apiActionStatus = 'accepted';
      } else if (normalizedStatus === 'suspended') {
        apiActionStatus = 'suspended';
      } else if (normalizedStatus === 'pendingadminapproval' || normalizedStatus === 'pending') {
        apiActionStatus = 'pending';
      } else if (normalizedStatus === 'rejected') {
        apiActionStatus = 'rejected';
      } else {
        apiActionStatus = status;
      }

       const apiType = (type === 'doctor' || type === 'dentist') ? 'doctor' : 'lab';

      return await membershipApi.updateRequestStatus(id, apiActionStatus, apiType);
    },
    onSuccess: (data, variables) => {
      if (queryKeysToInvalidate && queryKeysToInvalidate.length > 0) {
        queryKeysToInvalidate.forEach(key => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      } else {
         queryClient.invalidateQueries({ queryKey: ['doctors-list'] });
        queryClient.invalidateQueries({ queryKey: ['membership-requests'] });
        queryClient.invalidateQueries({ queryKey: ['labs-list'] });
      }

      const successMessages = {
        accepted: 'تم تفعيل الحساب وقبول العضوية بنجاح',
        active: 'تم تفعيل الحساب بنجاح',
        rejected: 'تم رفض العضوية بنجاح',
        suspended: 'تم تعليق الحساب بنجاح',
        pending: 'تم نقل الحساب لقيد المراجعة بنجاح'
      };

      const normalizedInputStatus = variables.status?.toLowerCase();
      const statusKey = normalizedInputStatus === 'active' ? 'active' : normalizedInputStatus;
      
      toast.success(successMessages[statusKey] || 'تم تحديث حالة الحساب بنجاح');
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || 'حدث خطأ أثناء تحديث حالة الحساب';
      toast.error(errorMsg);
    }
  });

  return {
    updateStatus: mutation.mutate,
    updateStatusAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    updatingId: mutation.isPending ? mutation.variables?.id : null
  };
};
