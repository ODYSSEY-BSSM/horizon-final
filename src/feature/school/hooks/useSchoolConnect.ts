import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { schoolApi } from '@/feature/school/api/schoolApi';
import type { ModalState, SchoolConnectState, SchoolInfo, SchoolNode } from '../types';

export const useSchoolConnect = () => {
  const queryClient = useQueryClient();

  const [modals, setModals] = useState<ModalState>({
    connectFail: false,
    disconnectConfirm: false,
  });

  // 학교 연동 정보 조회
  const { data: schoolData, isLoading: isLoadingSchool } = useQuery({
    queryKey: ['school', 'connected'],
    queryFn: schoolApi.getConnectedSchool,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 교육과정 노드 목록 조회
  const { data: nodesData, isLoading: isLoadingNodes } = useQuery({
    queryKey: ['school', 'education-nodes'],
    queryFn: schoolApi.getEducationNodes,
    enabled: !!schoolData, // 학교 연동이 있을 때만 조회
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 학교 연동
  const { mutateAsync: connectSchool, isPending: isConnecting } = useMutation({
    mutationFn: () => schoolApi.connectSchool(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school'] });
    },
    onError: () => {
      setModals((prev) => ({ ...prev, connectFail: true }));
    },
  });

  // 학교 연동 해제
  const { mutateAsync: disconnectSchool } = useMutation({
    mutationFn: schoolApi.disconnectSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school'] });
      setModals((prev) => ({ ...prev, disconnectConfirm: false }));
    },
  });

  // UI 상태 계산
  const [state, setState] = useState<SchoolConnectState>({
    status: 'disconnected',
    school: null,
    nodes: [],
  });

  useEffect(() => {
    if (isConnecting) {
      setState((prev) => ({ ...prev, status: 'connecting' }));
      return;
    }

    if (isLoadingSchool || isLoadingNodes) {
      return; // 로딩 중에는 상태 변경 안 함
    }

    if (schoolData) {
      // API 응답을 UI 타입으로 변환
      const schoolInfo: SchoolInfo = {
        id: String(schoolData.uuid),
        name: schoolData.name,
        logoUrl: schoolData.logoUrl || '',
        nodeCount: nodesData?.nodes.length || 0,
      };

      const nodes: SchoolNode[] =
        nodesData?.nodes.map((node) => ({
          id: String(node.uuid),
          name: node.name,
          teacher: node.teacher || '담당자 미지정',
          usageCount: 0, // TODO: 실제 사용 횟수는 별도 API에서 조회 필요
        })) || [];

      setState({
        status: 'connected',
        school: schoolInfo,
        nodes,
      });
    } else {
      setState({
        status: 'disconnected',
        school: null,
        nodes: [],
      });
    }
  }, [schoolData, nodesData, isLoadingSchool, isLoadingNodes, isConnecting]);

  const handleConnect = async () => {
    try {
      await connectSchool();
    } catch (_error) {
      // 에러를 의도적으로 무시합니다.
    }
  };

  const handleConnectFail = () => {
    setModals((prev) => ({ ...prev, connectFail: true }));
  };

  const handleDisconnectClick = () => {
    setModals((prev) => ({ ...prev, disconnectConfirm: true }));
  };

  const handleDisconnect = async () => {
    try {
      await disconnectSchool();
    } catch (_error) {
      // 에러를 의도적으로 무시합니다.
    }
  };

  const closeModal = (modalName: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  return {
    state,
    modals,
    isLoading: isLoadingSchool || isLoadingNodes,
    handleConnect,
    handleConnectFail,
    handleDisconnectClick,
    handleDisconnect,
    closeModal,
  };
};
