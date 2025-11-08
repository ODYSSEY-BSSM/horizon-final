import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    variant: {
      control: 'radio',
      options: ['contained', 'outlined', 'text'],
      description: 'Button variant',
    },
    rounded: {
      control: 'boolean',
      description: 'Rounded corners',
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
      description: 'Icon name',
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right', 'only'],
      description: 'Icon position',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '버튼',
    size: 'medium',
    variant: 'contained',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button icon="add" iconPosition="left">
          왼쪽 아이콘
        </Button>
        <Button icon="arrow_forward" iconPosition="right">
          오른쪽 아이콘
        </Button>
        <Button icon="favorite" iconPosition="only" />
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button variant="outlined" icon="download" iconPosition="left">
          다운로드
        </Button>
        <Button variant="text" icon="share" iconPosition="left">
          공유하기
        </Button>
      </div>
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button icon="favorite" iconPosition="only" size="small" />
      <Button icon="star" iconPosition="only" size="medium" />
      <Button icon="settings" iconPosition="only" size="large" />
    </div>
  ),
};

export const Rounded: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button rounded>Rounded</Button>
      <Button rounded variant="outlined">
        Rounded Outlined
      </Button>
      <Button rounded icon="favorite" iconPosition="only" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button>Default</Button>
        <Button disabled>Disabled</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button variant="outlined">Default</Button>
        <Button variant="outlined" disabled>
          Disabled
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button variant="text">Default</Button>
        <Button variant="text" disabled>
          Disabled
        </Button>
      </div>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Button fullWidth>Full Width Button</Button>
      <Button fullWidth variant="outlined">
        Full Width Outlined
      </Button>
      <Button fullWidth variant="text">
        Full Width Text
      </Button>
    </div>
  ),
};

export const AllCombinations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ marginBottom: '12px' }}>Contained</h4>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '12px' }}>Outlined</h4>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button variant="outlined" size="small">
            Small
          </Button>
          <Button variant="outlined" size="medium">
            Medium
          </Button>
          <Button variant="outlined" size="large">
            Large
          </Button>
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '12px' }}>Text</h4>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button variant="text" size="small">
            Small
          </Button>
          <Button variant="text" size="medium">
            Medium
          </Button>
          <Button variant="text" size="large">
            Large
          </Button>
        </div>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button onClick={() => alert('클릭!')}>클릭하세요</Button>
      <Button
        variant="outlined"
        icon="thumb_up"
        iconPosition="left"
        onClick={() => alert('좋아요!')}
      >
        좋아요
      </Button>
      <Button variant="text" icon="share" iconPosition="left" onClick={() => alert('공유!')}>
        공유
      </Button>
    </div>
  ),
};
