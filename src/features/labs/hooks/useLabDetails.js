import { useQuery } from '@tanstack/react-query';
import { labsApi } from '../services/labsApi';

export const useLabDetails = (id) => {
  return useQuery({
    queryKey: ['lab-details', id],
    queryFn: () => labsApi.getLabDetails(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
