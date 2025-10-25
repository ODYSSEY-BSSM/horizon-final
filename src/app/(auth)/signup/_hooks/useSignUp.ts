'use client';

import { useMutation } from '@tanstack/react-query';
import type { RegisterRequest } from '@/apis/index';
import { userApi } from '@/apis/index';

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => userApi.register(data),
  });
};
