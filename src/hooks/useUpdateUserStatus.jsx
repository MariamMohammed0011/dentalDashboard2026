import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { membershipApi } from '../features/membership/services/membershipApi';
import { doctorsApi } from '../features/doctors/services/doctorsApi';
import { labsApi } from '../features/labs/services/labsApi';

export const useUpdateUserStatus = (queryKeysToInvalidate = []) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, status, type = 'doctor' }) => {
      const targetId = typeof id === 'object' ? (id.id || id.userId) : id;
      
     
      const numericStatus = (status !== null && status !== undefined && !isNaN(Number(status))) 
        ? Number(status) 
        : 0;

      console.log('📡 Payload Being Sent To API:', { id: targetId, status: numericStatus, type });

      if (type === 'doctor' || type === 'dentist') {
        return await doctorsApi.updateStatus({ id: targetId, status: numericStatus });
      }

      if (type === 'lab') {
        return await labsApi.updateStatus({ id: targetId, status: numericStatus });
      }

      return await membershipApi.updateRequestStatus(targetId, numericStatus, type);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors-list'] });
      queryClient.invalidateQueries({ queryKey: ['labs-list'] });
      queryClient.invalidateQueries({ queryKey: ['all-lab-details'] });
      queryKeysToInvalidate.forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      toast.success('تم تحديث حالة الحساب بنجاح');
    },
    onError: (error) => {
      console.error('Update status error:', error);
      toast.error('حدث خطأ أثناء تحديث حالة الحساب');
    },
  });

  return {
    updateStatus: mutation.mutate,
    isPending: mutation.isPending,
    updatingId: mutation.isPending ? mutation.variables?.id : null,
  };
};