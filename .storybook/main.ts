import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: [
    '../src/stories/Introduction.mdx',
    '../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/stories/tokens/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {
      builder: {
        viteConfigPath: undefined,
      },
    },
  },
  viteFinal: async (config) => {
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [...(config.optimizeDeps?.include ?? []), '@emotion/react'],
    };

    return config;
  },
  typescript: {
    check: false,
    reactDocgen: false,
  },
};
export default config;
