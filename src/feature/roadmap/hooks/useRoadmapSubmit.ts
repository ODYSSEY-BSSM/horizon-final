import { useCreateFolder } from '@/feature/folder/hooks/useFolderQueries';
import { useCreateRoadmap, useCreateTeamRoadmap } from '@/feature/roadmap/hooks/useRoadmapQueries';
import { useRoadmapFormStore } from '@/feature/roadmap/stores/roadmapFormStore';

/**
 * Hook for handling roadmap submission with mutations.
 * This needs to be a hook because it uses TanStack Query mutations.
 */
export function useRoadmapSubmit() {
  const createRoadmapMutation = useCreateRoadmap();
  const createFolderMutation = useCreateFolder();

  const { formData, closeModal, getSubmitData } = useRoadmapFormStore();

  const submitRoadmap = async () => {
    const submitData = await getSubmitData();

    // Step 1: Create folder if needed
    let directoryId = formData.folderId ? Number(formData.folderId) : undefined;

    if (formData.folderName && !formData.folderId) {
      const newFolder = await createFolderMutation.mutateAsync({
        name: formData.folderName,
      });
      directoryId = newFolder.id;
    }

    // Step 2: Create roadmap
    const roadmapData = {
      title: submitData.title,
      description: submitData.description,
      categories: submitData.categories,
      color: submitData.color as any,
      icon: submitData.icon as any,
      directoryId: directoryId || 1, // Default directory
    };

    await createRoadmapMutation.mutateAsync(roadmapData);

    closeModal();
  };

  return {
    submitRoadmap,
    isLoading: createRoadmapMutation.isPending || createFolderMutation.isPending,
  };
}

/**
 * Hook for handling team roadmap submission with mutations.
 */
export function useTeamRoadmapSubmit(teamId: number) {
  const createTeamRoadmapMutation = useCreateTeamRoadmap(teamId);
  const createFolderMutation = useCreateFolder();

  const { formData, closeModal, getSubmitData } = useRoadmapFormStore();

  const submitTeamRoadmap = async () => {
    const submitData = await getSubmitData();

    // Step 1: Create folder if needed
    let directoryId = formData.folderId ? Number(formData.folderId) : undefined;

    if (formData.folderName && !formData.folderId) {
      const newFolder = await createFolderMutation.mutateAsync({
        name: formData.folderName,
      });
      directoryId = newFolder.id;
    }

    // Step 2: Create team roadmap
    const roadmapData = {
      title: submitData.title,
      description: submitData.description,
      categories: submitData.categories,
      color: submitData.color as any,
      icon: submitData.icon as any,
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
