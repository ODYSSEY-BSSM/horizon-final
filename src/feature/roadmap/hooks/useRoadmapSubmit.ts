import { useCreateFolder } from '@/feature/folder/hooks/useFolderQueries';
import { useCreateRoadmap, useCreateTeamRoadmap } from '@/feature/roadmap/hooks/useRoadmapQueries';
import { useRoadmapFormStore } from '@/feature/roadmap/stores/roadmapFormStore';
import type { Color, Icon } from '@/shared/api/types';

export function useRoadmapSubmit() {
  const createRoadmapMutation = useCreateRoadmap();
  const createFolderMutation = useCreateFolder();

  const { formData, closeModal, getSubmitData } = useRoadmapFormStore();

  const submitRoadmap = async () => {
    const submitData = await getSubmitData();

    let directoryId = formData.folderId ? Number(formData.folderId) : undefined;

    if (formData.folderName && !formData.folderId) {
      const newFolder = await createFolderMutation.mutateAsync({
        name: formData.folderName,
      });
      directoryId = newFolder.id;
    }

    const roadmapData = {
      title: submitData.title,
      description: submitData.description,
      categories: submitData.categories,
      color: submitData.color as Color,
      icon: submitData.icon as Icon,
      directoryId: directoryId || 1,
    };

    await createRoadmapMutation.mutateAsync(roadmapData);

    closeModal();
  };

  return {
    submitRoadmap,
    isLoading: createRoadmapMutation.isPending || createFolderMutation.isPending,
  };
}

export function useTeamRoadmapSubmit(teamId: number) {
  const createTeamRoadmapMutation = useCreateTeamRoadmap(teamId);
  const createFolderMutation = useCreateFolder();

  const { formData, closeModal, getSubmitData } = useRoadmapFormStore();

  const submitTeamRoadmap = async () => {
    const submitData = await getSubmitData();

    let directoryId = formData.folderId ? Number(formData.folderId) : undefined;

    if (formData.folderName && !formData.folderId) {
      const newFolder = await createFolderMutation.mutateAsync({
        name: formData.folderName,
      });
      directoryId = newFolder.id;
    }

    const roadmapData = {
      title: submitData.title,
      description: submitData.description,
      categories: submitData.categories,
      color: submitData.color as Color,
      icon: submitData.icon as Icon,
      directoryId: directoryId || 1,
    };

    await createTeamRoadmapMutation.mutateAsync(roadmapData);

    closeModal();
  };

  return {
    submitTeamRoadmap,
    isLoading: createTeamRoadmapMutation.isPending || createFolderMutation.isPending,
  };
}
