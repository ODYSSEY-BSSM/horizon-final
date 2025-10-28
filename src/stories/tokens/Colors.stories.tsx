import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { colors } from '@/shared/tokens/color/color';

const ColorsDemo = () => null;

const meta = {
  title: 'Design Tokens/Colors',
  component: ColorsDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Design system color palette and usage guidelines.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColorPalette: Story = {
  render: () => (
    <div style={{ padding: '40px' }}>
      <h1 style={{ marginBottom: '32px', fontSize: '32px', fontWeight: 'bold' }}>Color Palette</h1>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>
          Primary Colors
        </h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(colors.primary).map(([shade, color]) => (
            <div key={shade} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: color,
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}
              />
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{shade}</div>
              <div style={{ fontSize: '10px', color: '#666' }}>{color}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>
          Neutral Colors
        </h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(colors.neutral).map(([shade, color]) => (
            <div key={shade} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: color,
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}
              />
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{shade}</div>
              <div style={{ fontSize: '10px', color: '#666' }}>{color}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
