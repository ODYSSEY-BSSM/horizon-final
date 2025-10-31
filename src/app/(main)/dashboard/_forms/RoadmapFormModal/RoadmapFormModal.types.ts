import type { RoadmapFormData } from '@/lib/validations/roadmap';

export interface RoadmapFormModalProps {
  onSubmit: (data: RoadmapFormData) => void;
}

export interface ModalBackdropProps {
  onClose: () => void;
  children: React.ReactNode;
}

export interface FormHeaderProps {
  title: string;
  description: string;
  onClose: () => void;
}

export interface FormFooterProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  isLastStep?: boolean;
}
