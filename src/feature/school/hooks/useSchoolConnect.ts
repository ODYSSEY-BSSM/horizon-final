import { useState } from 'react';
import {
  MOCK_SCHOOL_INFO,
  MOCK_SCHOOL_NODES,
} from '@/feature/school/constants/schoolConnect.constants';
import type { ModalState, SchoolConnectState } from '../types/schoolConnect.types';

export const useSchoolConnect = () => {
  // 초기 상태는 연동된 상태로 설정 (피그마 디자인에서 연동된 상태를 주로 표시)
  const [state, setState] = useState<SchoolConnectState>({
    status: 'connected',
    school: MOCK_SCHOOL_INFO,
    nodes: MOCK_SCHOOL_NODES,
  });

  const [modals, setModals] = useState<ModalState>({
    connectFail: false,
    disconnectConfirm: false,
  });

  const handleConnect = () => {
    setState((prev) => ({
      ...prev,
      status: 'connecting',
    }));

    // Mock: 연동 시도
    setTimeout(() => {
      // 실제로는 API 호출
      setState({
        status: 'connected',
        school: MOCK_SCHOOL_INFO,
        nodes: MOCK_SCHOOL_NODES,
      });
    }, 1000);
  };

  const handleConnectFail = () => {
    setModals((prev) => ({ ...prev, connectFail: true }));
  };

  const handleDisconnectClick = () => {
    setModals((prev) => ({ ...prev, disconnectConfirm: true }));
  };

  const handleDisconnect = () => {
    setState({
      status: 'disconnected',
      school: null,
      nodes: [],
    });
    setModals((prev) => ({ ...prev, disconnectConfirm: false }));
  };

  const closeModal = (modalName: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  return {
    state,
    modals,
    handleConnect,
    handleConnectFail,
    handleDisconnectClick,
    handleDisconnect,
    closeModal,
  };
};
