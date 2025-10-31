import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRoadmapFormFlow } from '@/lib/stores/roadmapFormFlow';
import {
  type FolderStepFormData,
  folderStepSchema,
  type InfoStepFormData,
  infoStepSchema,
  type RoadmapFormData,
  roadmapFormSchema,
  type StyleStepFormData,
  styleStepSchema,
  type TeamStepFormData,
  teamStepSchema,
} from '@/lib/validations/roadmap';

export const useRoadmapForm = () => {
  const { formData, saveStepData, goToStep, closeModal } = useRoadmapFormFlow();

  const form = useForm<RoadmapFormData>({
    resolver: zodResolver(roadmapFormSchema),
    mode: 'onChange',
    defaultValues: formData,
    values: formData as RoadmapFormData,
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

// Individual step hooks for better type safety and validation
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

  return {
    ...form,
    onNext: form.handleSubmit(handleNext),
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
  const { formData, saveStepData, goToStep } = useRoadmapFormFlow();

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
      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close modal after successful submission
      const { closeModal } = useRoadmapFormFlow.getState();
      closeModal();
    } catch (_error) {
      // Error handled silently for now
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
