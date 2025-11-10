import type { ModalWidth } from './Modal.types';

export interface FormField {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  required?: boolean;
}

export interface FormModalProps<T = Record<string, string>> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void | Promise<void>;
  title: string;
  description?: string;
  fields: FormField[];
  submitText: string;
  initialData?: Partial<T>;
  width?: ModalWidth;
  mode?: 'create' | 'edit';
}
