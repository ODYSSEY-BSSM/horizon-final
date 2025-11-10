import { useMutation } from '@tanstack/react-query';
import type { RegisterRequest } from '@/lib/api';
import { userApi } from '@/lib/api';

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => userApi.register(data),
  });
};
