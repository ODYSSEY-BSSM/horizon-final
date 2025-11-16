import { useMutation, useQueryClient } from '@tanstack/react-query';
import { schoolApi } from '../api';

export const schoolKeys = {
  all: ['school'] as const,
  connect: () => [...schoolKeys.all, 'connect'] as const,
};

export function useConnectSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: schoolApi.connectSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
}
