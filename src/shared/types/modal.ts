export interface RoadmapFormData {
  category?: string;
  folderId?: string;
  folderName?: string;
  teamId?: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface FormStepProps {
  onClose: () => void;
  onSubmit: (data: RoadmapFormData) => void;
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
