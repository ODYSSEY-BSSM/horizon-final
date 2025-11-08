import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Select, { type SelectOption } from './Select';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    label: {
      control: 'text',
      description: 'Select label',
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
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions: SelectOption[] = [
  { value: '1', label: '옵션 1' },
  { value: '2', label: '옵션 2' },
  { value: '3', label: '옵션 3' },
];

export const Default: Story = {
  args: {
    options: basicOptions,
  },
  render: (args) => {
    const [value, setValue] = useState<string>();
    return <Select {...args} value={value} onChange={setValue} />;
  },
};

export const WithLabel: Story = {
  args: {
    label: '카테고리 선택',
    options: basicOptions,
    placeholder: '카테고리를 선택하세요',
  },
  render: (args) => {
    const [value, setValue] = useState<string>();
    return <Select {...args} value={value} onChange={setValue} />;
  },
};

export const WithHelperText: Story = {
  args: {
    label: '프로그래밍 언어',
    options: [
      { value: 'js', label: 'JavaScript' },
      { value: 'ts', label: 'TypeScript' },
      { value: 'py', label: 'Python' },
      { value: 'java', label: 'Java' },
    ],
    helperText: '가장 선호하는 언어를 선택하세요',
  },
  render: (args) => {
    const [value, setValue] = useState<string>();
    return <Select {...args} value={value} onChange={setValue} />;
  },
};

export const WithNewBadge: Story = {
  args: {
    label: '요금제 선택',
    options: [
      { value: 'basic', label: '기본 플랜' },
      { value: 'pro', label: '프로 플랜', isNew: true },
      { value: 'enterprise', label: '엔터프라이즈 플랜', isNew: true },
    ],
    placeholder: '요금제를 선택하세요',
  },
  render: (args) => {
    const [value, setValue] = useState<string>();
    return <Select {...args} value={value} onChange={setValue} />;
  },
};

export const ErrorState: Story = {
  args: {
    label: '필수 선택',
    options: basicOptions,
    error: true,
    errorMessage: '항목을 선택해주세요',
  },
  render: (args) => {
    const [value, setValue] = useState<string>();
    return (
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const DisabledState: Story = {
  args: {
    label: '비활성화',
    options: basicOptions,
    placeholder: '선택할 수 없습니다',
    disabled: true,
  },
  render: (args) => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Select {...args} />
      <Select {...args} label="비활성화 (값 있음)" value="1" />
    </div>
  ),
};

export const RealWorldExamples: any = {
  render: () => {
    const [country, setCountry] = useState<string>();
    const [difficulty, setDifficulty] = useState<string>();
    const [status, setStatus] = useState<string>();

    return (
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Select
          label="국가"
          options={[
            { value: 'kr', label: '대한민국' },
            { value: 'us', label: '미국' },
            { value: 'jp', label: '일본' },
            { value: 'cn', label: '중국' },
          ]}
          value={country}
          onChange={setCountry}
          placeholder="국가를 선택하세요"
        />

        <Select
          label="난이도"
          options={[
            { value: 'easy', label: '쉬움' },
            { value: 'medium', label: '보통' },
            { value: 'hard', label: '어려움' },
          ]}
          value={difficulty}
          onChange={setDifficulty}
          placeholder="난이도를 선택하세요"
        />

        <Select
          label="상태"
          options={[
            { value: 'todo', label: '할 일' },
            { value: 'progress', label: '진행 중' },
            { value: 'done', label: '완료' },
          ]}
          value={status}
          onChange={setStatus}
          placeholder="상태를 선택하세요"
        />
      </div>
    );
  },
};

export const ManyOptions: Story = {
  args: {
    label: '많은 옵션',
    options: Array.from({ length: 20 }, (_, i) => ({
      value: `${i + 1}`,
      label: `옵션 ${i + 1}`,
    })),
    placeholder: '스크롤 가능한 목록',
  },
  render: (args) => {
    const [value, setValue] = useState<string>();
    return <Select {...args} value={value} onChange={setValue} />;
  },
};

export const RoadmapCategories: Story = {
  args: {
    label: '로드맵 카테고리',
    options: [
      { value: 'frontend', label: '프론트엔드' },
      { value: 'backend', label: '백엔드' },
      { value: 'devops', label: 'DevOps', isNew: true },
      { value: 'mobile', label: '모바일' },
      { value: 'ai', label: 'AI/ML', isNew: true },
      { value: 'design', label: '디자인' },
    ],
    placeholder: '학습하고 싶은 분야를 선택하세요',
    helperText: 'NEW 태그가 있는 카테고리는 최근 추가된 항목입니다',
  },
  render: (args) => {
    const [value, setValue] = useState<string>();
    return <Select {...args} value={value} onChange={setValue} />;
  },
};

export const FullWidth: Story = {
  args: {
    label: '전체 너비 선택',
    options: basicOptions,
    fullWidth: true,
    helperText: '부모 요소의 전체 너비를 차지합니다',
  },
  render: (args) => {
    const [value, setValue] = useState<string>();
    return (
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const FormIntegration: any = {
  render: () => {
    const [category, setCategory] = useState<string>();
    const [level, setLevel] = useState<string>();
    const [duration, setDuration] = useState<string>();

    return (
      <form
        style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}
        onSubmit={(e) => {
          e.preventDefault();
          alert(`선택: ${category}, ${level}, ${duration}`);
        }}
      >
        <Select
          label="카테고리"
          options={[
            { value: 'web', label: '웹 개발' },
            { value: 'app', label: '앱 개발' },
            { value: 'data', label: '데이터 사이언스' },
          ]}
          value={category}
          onChange={setCategory}
          placeholder="카테고리 선택"
        />

        <Select
          label="레벨"
          options={[
            { value: 'beginner', label: '입문자' },
            { value: 'intermediate', label: '중급자' },
            { value: 'advanced', label: '고급자' },
          ]}
          value={level}
          onChange={setLevel}
          placeholder="레벨 선택"
        />

        <Select
          label="기간"
          options={[
            { value: '1month', label: '1개월' },
            { value: '3months', label: '3개월' },
            { value: '6months', label: '6개월' },
            { value: '1year', label: '1년' },
          ]}
          value={duration}
          onChange={setDuration}
          placeholder="기간 선택"
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
          로드맵 시작하기
        </button>
      </form>
    );
  },
};
