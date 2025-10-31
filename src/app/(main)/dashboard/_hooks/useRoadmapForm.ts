import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRoadmapFormFlow } from '@/lib/stores/roadmapFormFlow';
import type { RoadmapFormData } from '@/lib/types/modal';
import {
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
} from '@/lib/validations/roadmap';

export const useRoadmapForm = () => {
  const { formData } = useRoadmapFormFlow();

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

  const handleSubmit = async (_data: RoadmapFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      closeModal();
    } catch (_error) {
      // Error handled silently for now
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(handleSubmit),
    formData,
    saveStepData,
    goToStep,
  };
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
      if (form.formState.isValid) {
        saveStepData(form.getValues());
        // TODO: 서버에 폼 데이터 전송 로직 추가
        console.log('최종 폼 데이터:', { ...formData, ...form.getValues() });
        closeModal();
      }
    } catch (error) {
      console.error('폼 제출 오류:', error);
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
