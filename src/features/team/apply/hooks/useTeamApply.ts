import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  applyToTeam as applyToTeamApi,
  approveApplication as approveApplicationApi,
  rejectApplication as rejectApplicationApi,
} from '../api/teamApplyApi';
import { useTeamApplyStore } from '../store/teamApplyStore';

export const useTeamApply = (_teamId: number) => {
  const queryClient = useQueryClient();
  const { updateApplication } = useTeamApplyStore();

  const useApplyToTeam = () => {
    return useMutation({
      mutationFn: (teamId: number) => applyToTeamApi(teamId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['applications'] });
      },
    });
  };

  const useApproveApplication = () => {
    return useMutation({
      mutationFn: (applyId: number) => approveApplicationApi(applyId),
      onSuccess: (response) => {
        updateApplication(response.data);
        queryClient.invalidateQueries({ queryKey: ['applications'] });
      },
    });
  };

  const useRejectApplication = () => {
    return useMutation({
      mutationFn: (applyId: number) => rejectApplicationApi(applyId),
      onSuccess: (_response, _applyId) => {
        // Assuming the app needs to be updated or removed from the list
        // This part might need adjustment based on actual UI/UX requirements
        queryClient.invalidateQueries({ queryKey: ['applications'] });
      },
    });
  };

  return {
    useApplyToTeam,
    useApproveApplication,
    useRejectApplication,
  };
};
