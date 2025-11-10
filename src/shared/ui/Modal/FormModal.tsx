'use client';

import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { tokens } from '@/shared/tokens';
import { Button, TextField } from '@/shared/ui';
import type { FormModalProps } from './FormModal.types';
import { Modal } from './Modal';

export const FormModal = <T extends Record<string, string>>({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  fields,
  submitText,
  initialData,
  width = 'medium',
  mode = 'create',
}: FormModalProps<T>) => {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      initial[field.name] = initialData?.[field.name] ?? '';
    });
    return initial;
  });

  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Reset form data when modal closes or when initialData changes
  useEffect(() => {
    if (isOpen && mode === 'edit' && initialData) {
      const updated: Record<string, string> = {};
      fields.forEach((field) => {
        updated[field.name] = initialData[field.name] ?? '';
      });
      setFormData(updated);
    } else if (!isOpen) {
      const reset: Record<string, string> = {};
      fields.forEach((field) => {
        reset[field.name] = '';
      });
      setFormData(reset);
    }
  }, [isOpen, initialData, mode, fields]);

  // Focus first field when modal opens
  useEffect(() => {
    if (isOpen) {
      firstFieldRef.current?.focus();
    }
  }, [isOpen]);

  const handleChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as T);
  };

  // Check if form is valid (all required fields filled)
  const isFormValid = fields
    .filter((field) => field.required)
    .every((field) => formData[field.name]?.trim());

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={description} width={width}>
      <StyledForm onSubmit={handleSubmit}>
        <StyledFormFields>
          {fields.map((field, index) => (
            <TextField
              key={field.name}
              ref={index === 0 ? firstFieldRef : undefined}
              label={field.label}
              type={field.type || 'text'}
              value={formData[field.name] || ''}
              onChange={handleChange(field.name)}
              placeholder={field.placeholder}
              required={field.required}
            />
          ))}
        </StyledFormFields>

        <StyledActions>
          <Button type="submit" variant="contained" size="medium" disabled={!isFormValid}>
            {submitText}
          </Button>
        </StyledActions>
      </StyledForm>
    </Modal>
  );
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xlarge};
`;

const StyledFormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;
