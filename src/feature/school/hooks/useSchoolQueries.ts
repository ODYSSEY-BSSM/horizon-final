import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { schoolApi } from '../api';

export const schoolKeys = {
  all: ['school'] as const,
  connect: () => [...schoolKeys.all, 'connect'] as const,
  educationNodes: () => [...schoolKeys.all, 'education-nodes'] as const,
  educationNode: (id: number) => [...schoolKeys.educationNodes(), id] as const,
};

export function useConnectedSchool() {
  return useQuery({
    queryKey: schoolKeys.connect(),
    queryFn: () => schoolApi.getConnectedSchool(),
    retry: false,
  });
}

export function useEducationNodes() {
  return useQuery({
    queryKey: schoolKeys.educationNodes(),
    queryFn: () => schoolApi.getEducationNodes(),
  });
}

export function useEducationNode(educationUuid: number) {
  return useQuery({
    queryKey: schoolKeys.educationNode(educationUuid),
    queryFn: () => schoolApi.getEducationNode(educationUuid),
    enabled: !!educationUuid,
  });
}

export function useConnectSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: schoolApi.connectSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolKeys.connect() });
      queryClient.invalidateQueries({ queryKey: schoolKeys.educationNodes() });
    },
  });
}

export function useDisconnectSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => schoolApi.disconnectSchool(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolKeys.connect() });
      queryClient.invalidateQueries({ queryKey: schoolKeys.educationNodes() });
    },
  });
}
