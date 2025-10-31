export interface RoadmapFormData {
  folderId?: string;
  folderName?: string; // For new folder creation
  teamId?: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface FormStepProps {
  data: Partial<RoadmapFormData>;
  onUpdate: (updates: Partial<RoadmapFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

export interface DropdownOption {
  id: string;
  label: string;
  value: string;
}

export interface ColorOption {
  id: string;
  label: string;
  value: string;
  color: string;
}

export interface IconOption {
  id: string;
  label: string;
  value: string;
  icon: string;
}
