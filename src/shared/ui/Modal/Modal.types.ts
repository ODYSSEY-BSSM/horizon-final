import type { ReactNode } from 'react';

export type ModalWidth = 'small' | 'medium' | 'large';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  width?: ModalWidth;
  showCloseButton?: boolean;
}
