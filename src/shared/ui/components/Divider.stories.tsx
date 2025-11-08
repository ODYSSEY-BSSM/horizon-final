import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta = {
  title: 'UI/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Divider orientation',
    },
    spacing: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
      description: 'Spacing around divider',
    },
    color: {
      control: 'color',
      description: 'Divider color',
    },
    thickness: {
      control: 'number',
      description: 'Divider thickness in pixels',
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <div>컨텐츠 1</div>
      <Divider />
      <div>컨텐츠 2</div>
      <Divider />
      <div>컨텐츠 3</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', height: '100px', alignItems: 'center' }}>
      <div>컨텐츠 1</div>
      <Divider orientation="vertical" />
      <div>컨텐츠 2</div>
      <Divider orientation="vertical" />
      <div>컨텐츠 3</div>
    </div>
  ),
};

export const WithSpacing: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <div>작은 간격</div>
      <Divider spacing={2} />
      <div>중간 간격</div>
      <Divider spacing={4} />
      <div>큰 간격</div>
      <Divider spacing={8} />
      <div>아주 큰 간격</div>
    </div>
  ),
};

export const WithColors: Story = {
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Divider color="#E0E0E0" />
      <Divider color="#2196F3" />
      <Divider color="#F44336" />
      <Divider color="#4CAF50" />
      <Divider color="#FF9800" />
    </div>
  ),
};

export const WithThickness: Story = {
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Divider thickness={1} />
      <Divider thickness={2} />
      <Divider thickness={4} />
      <Divider thickness={8} />
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        padding: '24px',
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
      }}
    >
      <h3 style={{ margin: 0 }}>카드 제목</h3>
      <Divider spacing={3} />
      <p style={{ margin: 0 }}>카드 컨텐츠입니다. Divider를 사용하여 섹션을 구분할 수 있습니다.</p>
      <Divider spacing={3} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="button">취소</button>
        <button type="button">확인</button>
      </div>
    </div>
  ),
};
