import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { authApi } from '@/feature/auth';
import { nodeApi, roadmapApi } from '@/feature/roadmap/api';
import type { NodeResponse, RoadmapResponse } from '@/feature/roadmap/types';
import { schoolApi } from '@/feature/school/api/schoolApi';
import type { ModalState, SchoolConnectState, SchoolInfo, SchoolNode } from '../types';

export const useSchoolConnect = () => {
  const queryClient = useQueryClient();

  const [modals, setModals] = useState<ModalState>({
    connectFail: false,
    disconnectConfirm: false,
  });

  const { data: userInfo, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: authApi.getProfile,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // 모든 로드맵 조회
  const { data: roadmaps, isLoading: isLoadingRoadmaps } = useQuery<RoadmapResponse[]>({
    queryKey: ['roadmaps'],
    queryFn: roadmapApi.getRoadmaps,
    enabled: userInfo?.isConnectedSchool === true,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // 각 로드맵의 노드 조회
  const roadmapNodesQueries = useQuery<NodeResponse[]>({
    queryKey: ['roadmaps', 'all-nodes', roadmaps?.map((r) => r.uuid)],
    queryFn: async () => {
      if (!roadmaps || roadmaps.length === 0) {
        return [];
      }

      const allNodesPromises = roadmaps.map((roadmap) => nodeApi.getNodes(roadmap.uuid));
      const allNodesArrays = await Promise.all(allNodesPromises);

      // 모든 노드를 하나의 배열로 합치고, 교육 노드만 필터링
      const allNodes = allNodesArrays.flatMap((response) => response.nodes);
      return allNodes.filter((node) => node.isEducation);
    },
    enabled: !!roadmaps && roadmaps.length > 0,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const { mutateAsync: connectSchool, isPending: isConnecting } = useMutation({
    mutationFn: schoolApi.connectSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
    onError: () => {
      setModals((prev) => ({ ...prev, connectFail: true }));
    },
  });

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

    if (isLoadingUser || isLoadingRoadmaps || roadmapNodesQueries.isLoading) {
      return;
    }

    // /users API의 isConnectedSchool과 school 정보 사용
    if (userInfo?.isConnectedSchool && userInfo?.school) {
      const educationNodes = roadmapNodesQueries.data || [];

      const schoolInfo: SchoolInfo = {
        id: '1',
        name: userInfo.school,
        logoUrl: '',
        nodeCount: educationNodes.length,
      };

      const nodes: SchoolNode[] = educationNodes.map((node) => ({
        id: String(node.id),
        name: node.title,
        teacher: node.subject || '과목 미지정',
        usageCount: 0,
      }));

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
  }, [
    userInfo,
    isLoadingUser,
    isLoadingRoadmaps,
    roadmapNodesQueries.data,
    roadmapNodesQueries.isLoading,
    isConnecting,
  ]);

  const handleConnect = async () => {
    try {
      // PUT /users/school는 빈 본문으로 호출 (Swagger 명세)
      await connectSchool();
    } catch (_error) {
      // 에러는 useMutation의 onError에서 처리됩니다.
    }
  };

  const handleConnectFail = () => {
    setModals((prev) => ({ ...prev, connectFail: true }));
  };

  const handleDisconnectClick = () => {
    setModals((prev) => ({ ...prev, disconnectConfirm: true }));
  };

  const handleDisconnect = async () => {
    // 연동 해제 기능은 Swagger에 없으므로 클라이언트 상태만 변경
    queryClient.setQueryData(['user', 'profile'], (old: any) =>
      old
        ? {
            ...old,
            isConnectedSchool: false,
            school: null,
          }
        : old,
    );
    setModals((prev) => ({ ...prev, disconnectConfirm: false }));
  };

  const closeModal = (modalName: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  return {
    state,
    modals,
    isLoading: isLoadingUser || isLoadingRoadmaps || roadmapNodesQueries.isLoading,
    handleConnect,
    handleConnectFail,
    handleDisconnectClick,
    handleDisconnect,
    closeModal,
  };
};
