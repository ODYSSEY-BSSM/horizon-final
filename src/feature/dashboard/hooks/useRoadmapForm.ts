import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreateFolder } from '@/feature/folder';
import {
  useCreateRoadmap,
  useCreateTeamRoadmap,
  useRoadmapFormFlow,
  toColorEnum,
  toIconEnum,
  type CategoryStepFormData,
  categoryStepSchema,
  type FolderStepFormData,
  folderStepSchema,
  type InfoStepFormData,
  infoStepSchema,
  roadmapFormSchema,
  type StyleStepFormData,
  styleStepSchema,
  type TeamStepFormData,
  teamStepSchema,
} from '@/feature/roadmap';
import { Color, Icon } from '@/shared/api/types';
import type { RoadmapFormData } from '@/shared/types/modal';

export const useRoadmapForm = () => {
  const { formData, saveStepData, goToStep, closeModal } = useRoadmapFormFlow();

  const normalizedValues: RoadmapFormData = {
    category: formData.category ?? '',
    folderId: formData.folderId,
    folderName: formData.folderName ?? '',
    teamId: formData.teamId ?? '',
    name: formData.name ?? '',
    description: formData.description ?? '',
    color: formData.color ?? 'red',
    icon: formData.icon ?? 'language',
  };

  const form = useForm<RoadmapFormData>({
    resolver: zodResolver(roadmapFormSchema),
    mode: 'onChange',
    values: normalizedValues,
  });

  const _handleSubmit = async (_data: RoadmapFormData) => {
    try {
      closeModal();
    } catch (_error) {
      // Error handled silently for now
    }
  };

  return { form, formData, saveStepData, goToStep, closeModal };
};

export const useCategoryStepForm = () => {
  const { formData, saveStepData, goToStep } = useRoadmapFormFlow();

  const form = useForm<CategoryStepFormData>({
    resolver: zodResolver(categoryStepSchema),
    mode: 'onChange',
    defaultValues: {
      category: formData.category || '',
    },
  });

  const handleNext = (data: CategoryStepFormData) => {
    saveStepData(data);
    goToStep('folder');
  };

  return {
    ...form,
    onNext: form.handleSubmit(handleNext),
  };
};

export const useFolderStepForm = () => {
  const { formData, saveStepData, goToStep } = useRoadmapFormFlow();

  const form = useForm<FolderStepFormData>({
    resolver: zodResolver(folderStepSchema),
    mode: 'onChange',
    defaultValues: {
      folderId: formData.folderId,
      folderName: formData.folderName,
    },
  });

  const handleNext = (data: FolderStepFormData) => {
    saveStepData(data);
    goToStep('team');
  };

  const handlePrevious = () => {
    goToStep('category');
  };

  return {
    ...form,
    onNext: form.handleSubmit(handleNext),
    onPrevious: handlePrevious,
  };
};

export const useTeamStepForm = () => {
  const { formData, saveStepData, goToStep } = useRoadmapFormFlow();

  const form = useForm<TeamStepFormData>({
    resolver: zodResolver(teamStepSchema),
    mode: 'onChange',
    defaultValues: {
      teamId: formData.teamId || '',
    },
  });

  const handleNext = (data: TeamStepFormData) => {
    saveStepData(data);
    goToStep('info');
  };

  const handlePrevious = () => {
    goToStep('folder');
  };

  return {
    ...form,
    onNext: form.handleSubmit(handleNext),
    onPrevious: handlePrevious,
  };
};

export const useInfoStepForm = () => {
  const { formData, saveStepData, goToStep } = useRoadmapFormFlow();

  const form = useForm<InfoStepFormData>({
    resolver: zodResolver(infoStepSchema),
    mode: 'onChange',
    defaultValues: {
      name: formData.name || '',
      description: formData.description || '',
    },
  });

  const handleNext = (data: InfoStepFormData) => {
    saveStepData(data);
    goToStep('style');
  };

  const handlePrevious = () => {
    goToStep('team');
  };

  return {
    ...form,
    onNext: form.handleSubmit(handleNext),
    onPrevious: handlePrevious,
  };
};

export const useStyleStepForm = () => {
  const { formData, saveStepData, goToStep, closeModal } = useRoadmapFormFlow();

  const createRoadmapMutation = useCreateRoadmap();
  const createTeamRoadmapMutation = useCreateTeamRoadmap(
    formData.teamId ? Number(formData.teamId) : 0,
  );
  const createFolderMutation = useCreateFolder();

  const form = useForm<StyleStepFormData>({
    resolver: zodResolver(styleStepSchema),
    mode: 'onChange',
    defaultValues: {
      color: formData.color || 'red',
      icon: formData.icon || 'language',
    },
  });

  const handleComplete = async (data: StyleStepFormData) => {
    saveStepData(data);

    try {
      await form.trigger();
      if (!form.formState.isValid) {
        return;
      }

      const styleData = form.getValues();
      saveStepData(styleData);

      // 새 폴더를 생성해야 하는 경우
      let directoryId = formData.folderId ? Number(formData.folderId) : undefined;

      if (formData.folderName && !formData.folderId) {
        const newFolder = await createFolderMutation.mutateAsync({
          name: formData.folderName,
          color: Color.BLUE,
          icon: Icon.FOLDER,
        });
        directoryId = newFolder.uuid;
      }

      // 로드맵 생성
      const roadmapData = {
        name: formData.name || '',
        color: toColorEnum(styleData.color),
        icon: toIconEnum(styleData.icon),
        directoryUuid: directoryId,
      };

      if (formData.category === 'team' && formData.teamId) {
        await createTeamRoadmapMutation.mutateAsync(roadmapData);
      } else {
        await createRoadmapMutation.mutateAsync(roadmapData);
      }

      closeModal();
    } catch (_error) {
      // Deliberately empty to prevent console errors on validation failure
    }
  };

  const handlePrevious = () => {
    goToStep('info');
  };

  return {
    ...form,
    onComplete: form.handleSubmit(handleComplete),
    onPrevious: handlePrevious,
  };
};
