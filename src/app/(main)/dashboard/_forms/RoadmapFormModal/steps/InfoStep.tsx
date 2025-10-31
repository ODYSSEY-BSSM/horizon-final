'use client';

import type { ChangeEvent } from 'react';
import TextField from '@/components/common/TextField/TextField';
import type { FormStepProps } from '@/lib/types/modal';
import { tokens } from '@/shared/tokens';

const InfoStep: React.FC<FormStepProps> = ({ data, onUpdate }) => {
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdate({ name: e.target.value });
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdate({ description: e.target.value });
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.large,
  };

  return (
    <div style={containerStyle}>
      <TextField
        label="이름"
        value={data.name || ''}
        onChange={handleNameChange}
        placeholder="이름을 입력해주세요"
        aria-label="로드맵 이름"
      />

      <TextField
        label="설명"
        value={data.description || ''}
        onChange={handleDescriptionChange}
        placeholder="설명을 입력해주세요"
        aria-label="로드맵 설명"
      />
    </div>
  );
};

export default InfoStep;
