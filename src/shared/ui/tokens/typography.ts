export const typography = {
  fontFamily: {
    suit: ['SUIT Variable', 'sans-serif'],
    icon: ['Material Symbols Rounded', 'monospace'],
  },

  textStyles: {
    header: {
      h1: {
        fontSize: '2rem',
        fontWeight: 900,
        lineHeight: 1.25,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '1.5rem',
        fontWeight: 800,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.25rem',
        fontWeight: 700,
        lineHeight: 1.35,
        letterSpacing: '0',
      },
    },
    subtitle: {
      st: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: '0',
      },
    },
    body: {
      b1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: '0',
      },
      b2: {
        fontSize: '0.875rem',
        fontWeight: 300,
        lineHeight: 1.5,
        letterSpacing: '0',
      },
    },
    caption: {
      c: {
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: 1.4,
        letterSpacing: '0.01em',
      },
    },
    overline: {
      o: {
        fontSize: '0.6875rem',
        fontWeight: 500,
        lineHeight: 1.4,
        letterSpacing: '0.05em',
      },
    },
    button: {
      sml: {
        fontSize: '0.8125rem',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '0',
      },
      med: {
        fontSize: '0.875rem',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '0',
      },
      lrg: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '0',
      },
    },
  },

  icon: {
    button: {
      sml: '1rem',
      med: '1.25rem',
      lrg: '1.5rem',
    },
    stroke: {
      xs: '1rem',
      sm: '1.25rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '2.5rem',
    },
    fill: {
      xs: '1rem',
      sm: '1.25rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '2.5rem',
    },
  },
} as const;

export type Typography = typeof typography;
