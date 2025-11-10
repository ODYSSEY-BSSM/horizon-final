import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Text from './Text';

const meta: Meta<typeof Text> = {
  title: 'Common/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['H1', 'H2', 'H3', 'ST', 'B1', 'B2', 'C', 'O'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading1: Story = {
  args: {
    variant: 'H1',
    children: 'Main Heading',
  },
};

export const Body1: Story = {
  args: {
    variant: 'B1',
    children: 'Primary body text for main content.',
  },
};

export const Caption: Story = {
  args: {
    variant: 'C',
    children: 'Caption text for metadata',
  },
};
