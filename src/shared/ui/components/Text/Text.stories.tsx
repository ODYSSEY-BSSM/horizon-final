import type { Meta, StoryObj } from '@storybook/react';
import Text from './Text';

const meta = {
  title: 'UI/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['H1', 'H2', 'H3', 'ST', 'B1', 'B2', 'C', 'O', 'BTN_SML', 'BTN_MED', 'BTN_LRG'],
      description: 'Text variant',
    },
    color: {
      control: 'color',
      description: 'Text color',
    },
    as: {
      control: 'select',
      options: ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'],
      description: 'HTML element',
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '텍스트 예시',
    variant: 'B1',
  },
};

export const Headers: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text variant="H1">H1 - 메인 헤더 (32px, Heavy)</Text>
      <Text variant="H2">H2 - 서브 헤더 (24px, ExtraBold)</Text>
      <Text variant="H3">H3 - 섹션 헤더 (20px, Bold)</Text>
    </div>
  ),
};

export const BodyText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text variant="ST">ST - 서브타이틀 (18px, SemiBold)</Text>
      <Text variant="B1">B1 - 본문 텍스트 (16px, Regular)</Text>
      <Text variant="B2">B2 - 작은 본문 (14px, Light)</Text>
    </div>
  ),
};

export const SmallText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text variant="C">C - 캡션 텍스트 (12px, Medium)</Text>
      <Text variant="O">O - 오버라인 텍스트 (11px, Medium)</Text>
    </div>
  ),
};

export const ButtonText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text variant="BTN_LRG">버튼 텍스트 Large (16px)</Text>
      <Text variant="BTN_MED">버튼 텍스트 Medium (14px)</Text>
      <Text variant="BTN_SML">버튼 텍스트 Small (13px)</Text>
    </div>
  ),
};

export const WithColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text variant="H3" color="#2196F3">
        Primary Color
      </Text>
      <Text variant="B1" color="#F44336">
        Error Color
      </Text>
      <Text variant="B1" color="#4CAF50">
        Success Color
      </Text>
      <Text variant="B1" color="rgba(0, 0, 0, 0.60)">
        Secondary Color
      </Text>
    </div>
  ),
};

export const WithDifferentTags: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text variant="H1" as="h1">
        H1 태그로 렌더링
      </Text>
      <Text variant="B1" as="p">
        P 태그로 렌더링
      </Text>
      <Text variant="C" as="div">
        Div 태그로 렌더링
      </Text>
    </div>
  ),
};
