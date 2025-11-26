import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/hooks/useToast';
import { teamApi } from '../api';
import type { TeamCreateRequest } from '../types';

export const teamKeys = {
  all: ['teams'] as const,
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (teamId: number) => [...teamKeys.details(), teamId] as const,
  members: (teamId: number) => [...teamKeys.detail(teamId), 'members'] as const,
};

export function useTeam(teamId: number) {
  return useQuery({
    queryKey: teamKeys.detail(teamId),
    queryFn: () => teamApi.getTeam(teamId),
    enabled: !!teamId,
  });
}

export function useTeamMembers(teamId: number) {
  return useQuery({
    queryKey: teamKeys.members(teamId),
    queryFn: async () => {
      const team = await teamApi.getTeam(teamId);
      return team.members;
    },
    enabled: !!teamId,
  });
}

export function useTeams() {
  return useQuery({
    queryKey: teamKeys.all,
    queryFn: async () => {
      const response = await teamApi.getTeams();
      return response.teams;
    },
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: TeamCreateRequest) => teamApi.createTeam(data),
    onSuccess: (data) => {
      // 모든 팀 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: teamKeys.all });
      toast({
        variant: 'success',
        title: '팀 생성 완료',
        description: `"${data.name}" 팀이 성공적으로 생성되었습니다.`,
      });
    },
    onError: (error) => {
      toast({
        variant: 'failed',
        title: '팀 생성 실패',
        description: error.message || '알 수 없는 오류가 발생했습니다.',
      });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (teamId: number) => teamApi.deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.all });
      toast({
        variant: 'success',
        title: '팀 삭제 완료',
        description: '팀이 성공적으로 삭제되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'failed',
        title: '팀 삭제 실패',
        description: error.message || '팀 삭제 중 오류가 발생했습니다.',
      });
    },
  });
}

export function useApplyToTeam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ inviteCode }: { inviteCode: string }) => teamApi.joinTeam({ inviteCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.all });
      toast({
        variant: 'success',
        title: '팀 가입 완료',
        description: '팀에 성공적으로 가입되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'failed',
        title: '팀 가입 실패',
        description: error.message || '팀 가입 중 오류가 발생했습니다.',
      });
    },
  });
}
