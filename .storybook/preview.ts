import type { Preview } from '@storybook/nextjs-vite';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: {
        type: 'code',
      },
    },
    options: {
      storySort: {
        order: ['Introduction', 'Design Tokens', 'Common', '*'],
      },
    },
  },
};

export default preview;
