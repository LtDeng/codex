import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--color-bg) / <alpha-value>)',
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
        text: 'hsl(var(--color-text) / <alpha-value>)',
        muted: 'hsl(var(--color-muted) / <alpha-value>)',
        accent: 'hsl(var(--color-accent) / <alpha-value>)',
        danger: 'hsl(var(--color-danger) / <alpha-value>)',
        success: 'hsl(var(--color-success) / <alpha-value>)'
      }
    }
  },
  plugins: []
} satisfies Config;
