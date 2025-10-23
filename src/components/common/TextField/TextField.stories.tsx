import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import TextField from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Common/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
  },
};
