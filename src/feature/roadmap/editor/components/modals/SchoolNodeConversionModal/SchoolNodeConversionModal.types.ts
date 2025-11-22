export interface SchoolNodeConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (curriculumId: string) => void;
  isConverting: boolean;
}

export interface CurriculumOption {
  id: string;
  name: string;
}
