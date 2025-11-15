import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { schoolApi } from '@/feature/school/api/schoolApi';

export const useSchoolConnect = () => {
  const queryClient = useQueryClient();

  const [connectFailModal, setConnectFailModal] = useState(false);

  const { mutateAsync: connectSchool, isPending: isConnecting } = useMutation({
    mutationFn: schoolApi.connectSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school'] });
    },
    onError: () => {
      setConnectFailModal(true);
    },
  });

  const handleConnect = async (schoolCode: string) => {
    try {
      await connectSchool({ schoolCode });
    } catch (_error) {
      // 에러는 useMutation의 onError에서 처리됩니다.
    }
  };

  const closeConnectFailModal = () => {
    setConnectFailModal(false);
  };

  return {
    isConnecting,
    connectFailModal,
    handleConnect,
    closeConnectFailModal,
  };
};
