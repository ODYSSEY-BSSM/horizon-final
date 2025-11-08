import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Input label',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text',
    },
    error: {
      control: 'boolean',
      description: 'Error state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width',
    },
    icon: {
      control: 'text',
      description: 'Left icon name',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '텍스트를 입력하세요',
  },
};

export const WithLabel: Story = {
  args: {
    label: '이메일',
    placeholder: 'email@example.com',
  },
};

export const WithHelperText: Story = {
  args: {
    label: '사용자명',
    placeholder: '사용자명을 입력하세요',
    helperText: '4-20자의 영문, 숫자만 사용 가능합니다',
  },
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input icon="search" placeholder="검색..." />
      <Input icon="person" label="사용자명" placeholder="사용자명 입력" />
      <Input icon="mail" label="이메일" placeholder="email@example.com" />
      <Input icon="lock" label="비밀번호" type="password" placeholder="비밀번호 입력" />
    </div>
  ),
};

export const Password: Story = {
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
        helperText="8자 이상, 영문/숫자/특수문자 조합"
      />
      <Input
        label="비밀번호 (토글 가능)"
        type="password"
        placeholder="비밀번호를 입력하세요"
        showPasswordToggle
      />
    </div>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input
        label="이메일"
        placeholder="email@example.com"
        error
        errorMessage="올바른 이메일 형식이 아닙니다"
      />
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
        error
        errorMessage="비밀번호는 최소 8자 이상이어야 합니다"
      />
    </div>
  ),
};

export const DisabledState: Story = {
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input label="비활성화" placeholder="입력할 수 없습니다" disabled />
      <Input label="비활성화 (값 있음)" placeholder="placeholder" value="입력된 값" disabled />
    </div>
  ),
};

export const DifferentTypes: Story = {
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input label="텍스트" type="text" placeholder="텍스트 입력" />
      <Input label="이메일" type="email" placeholder="email@example.com" />
      <Input label="숫자" type="number" placeholder="숫자만 입력" />
      <Input label="전화번호" type="tel" placeholder="010-1234-5678" />
      <Input label="URL" type="url" placeholder="https://example.com" />
      <Input label="날짜" type="date" />
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <Input
        label="전체 너비 입력"
        placeholder="부모 요소의 전체 너비를 차지합니다"
        fullWidth
        helperText="fullWidth prop이 적용되었습니다"
      />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form
      style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}
      onSubmit={(e) => {
        e.preventDefault();
        alert('제출!');
      }}
    >
      <Input label="이름" placeholder="홍길동" required />
      <Input label="이메일" type="email" icon="mail" placeholder="email@example.com" required />
      <Input
        label="비밀번호"
        type="password"
        icon="lock"
        placeholder="비밀번호"
        showPasswordToggle
        helperText="8자 이상"
        required
      />
      <Input
        label="전화번호"
        type="tel"
        icon="phone"
        placeholder="010-1234-5678"
        helperText="선택사항"
      />
      <button
        type="submit"
        style={{
          padding: '12px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        제출
      </button>
    </form>
  ),
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Input label="정상 상태" placeholder="입력하세요" helperText="도움말 텍스트입니다" />
      <Input label="에러 상태" placeholder="입력하세요" error errorMessage="필수 입력 항목입니다" />
      <Input
        label="성공 상태 (커스텀)"
        placeholder="입력하세요"
        helperText="✓ 사용 가능한 이메일입니다"
      />
    </div>
  ),
};
