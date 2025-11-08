import type { Meta, StoryObj } from '@storybook/react';
import Icon from './Icon';

const meta = {
  title: 'UI/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Material Symbols icon name',
    },
    size: {
      control: 'select',
      options: ['XS', 'SM', 'MD', 'LG', 'XL'],
      description: 'Icon size',
    },
    fill: {
      control: 'boolean',
      description: 'Fill icon or stroke',
    },
    color: {
      control: 'color',
      description: 'Icon color',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'home',
    size: 'MD',
    fill: false,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <Icon name="star" size="XS" />
        <div style={{ fontSize: '12px', marginTop: '4px' }}>XS (16px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="star" size="SM" />
        <div style={{ fontSize: '12px', marginTop: '4px' }}>SM (20px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="star" size="MD" />
        <div style={{ fontSize: '12px', marginTop: '4px' }}>MD (24px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="star" size="LG" />
        <div style={{ fontSize: '12px', marginTop: '4px' }}>LG (32px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="star" size="XL" />
        <div style={{ fontSize: '12px', marginTop: '4px' }}>XL (40px)</div>
      </div>
    </div>
  ),
};

export const StrokeVsFill: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '40px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>Stroke</div>
        <Icon name="favorite" size="LG" fill={false} />
        <Icon name="star" size="LG" fill={false} />
        <Icon name="home" size="LG" fill={false} />
        <Icon name="settings" size="LG" fill={false} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>Fill</div>
        <Icon name="favorite" size="LG" fill />
        <Icon name="star" size="LG" fill />
        <Icon name="home" size="LG" fill />
        <Icon name="settings" size="LG" fill />
      </div>
    </div>
  ),
};

export const CommonIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px' }}>
      {[
        'home',
        'search',
        'menu',
        'close',
        'check',
        'arrow_back',
        'arrow_forward',
        'arrow_upward',
        'arrow_downward',
        'expand_more',
        'expand_less',
        'add',
        'remove',
        'delete',
        'edit',
        'favorite',
        'star',
        'settings',
        'person',
        'notifications',
        'mail',
        'share',
        'visibility',
        'visibility_off',
        'more_vert',
      ].map((iconName) => (
        <div key={iconName} style={{ textAlign: 'center' }}>
          <Icon name={iconName} size="MD" />
          <div style={{ fontSize: '11px', marginTop: '4px' }}>{iconName}</div>
        </div>
      ))}
    </div>
  ),
};

export const WithColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <Icon name="favorite" size="LG" fill color="#F44336" />
      <Icon name="star" size="LG" fill color="#FFC107" />
      <Icon name="check_circle" size="LG" fill color="#4CAF50" />
      <Icon name="info" size="LG" fill color="#2196F3" />
      <Icon name="warning" size="LG" fill color="#FF9800" />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Icon name="thumb_up" size="MD" onClick={() => alert('좋아요!')} />
      <Icon name="favorite" size="MD" fill onClick={() => alert('즐겨찾기!')} />
      <Icon name="share" size="MD" onClick={() => alert('공유하기!')} />
    </div>
  ),
};
