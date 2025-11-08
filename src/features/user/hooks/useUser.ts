import { useMutation, useQuery } from '@tanstack/react-query';
import {
  confirmVerificationCode as confirmVerificationCodeApi,
  getUserInfo as getUserInfoApi,
  requestVerificationCode as requestVerificationCodeApi,
  signUp as signUpApi,
  updatePassword as updatePasswordApi,
} from '../api/userApi';
import { useUserStore } from '../store/userStore';
import type { SignUpRequest } from '../types';

export const useUser = () => {
  const { setUser } = useUserStore();

  const useUserInfo = () =>
    useQuery({
      queryKey: ['userInfo'],
      queryFn: async () => {
        const response = await getUserInfoApi();
        setUser(response.data);
        return response.data;
      },
      enabled: false,
    });

  const useRequestVerificationCode = () => {
    return useMutation({
      mutationFn: requestVerificationCodeApi,
    });
  };

  const useConfirmVerificationCode = () => {
    return useMutation({
      mutationFn: confirmVerificationCodeApi,
    });
  };

  const useSignUp = () => {
    return useMutation({
      mutationFn: (data: SignUpRequest) => signUpApi(data),
    });
  };

  const useUpdatePassword = () => {
    return useMutation({
      mutationFn: updatePasswordApi,
    });
  };

  return {
    useUserInfo,
    useRequestVerificationCode,
    useConfirmVerificationCode,
    useSignUp,
    useUpdatePassword,
  };
};
