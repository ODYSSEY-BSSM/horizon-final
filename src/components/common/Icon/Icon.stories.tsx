import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Icon from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Common/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: {
      control: 'text',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  args: {
    name: 'home',
  },
};

export const Search: Story = {
  args: {
    name: 'search',
  },
};
