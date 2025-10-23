import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Divider from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Common/Divider',
  component: Divider,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    orientation: 'horizontal',
  },
};
