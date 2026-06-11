/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-deep': 'rgb(var(--bg-deep) / <alpha-value>)',
        'bg-panel': 'rgb(var(--bg-panel) / <alpha-value>)',
        'bg-elevated': 'rgb(var(--bg-elevated) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',
        // accent (sky-blue) — token kept as `gold` so existing utility classes adopt the new hue
        gold: 'rgb(var(--gold) / <alpha-value>)',
        'gold-soft': 'rgb(var(--gold-soft) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-soft': 'rgb(var(--accent-soft) / <alpha-value>)',
        teal: 'rgb(var(--teal) / <alpha-value>)',
        rose: 'rgb(var(--rose) / <alpha-value>)',
        violet: 'rgb(var(--violet) / <alpha-value>)',
      },
      fontFamily: {
        // San Francisco on Apple, Segoe UI on Windows — native iOS-style system stack
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono: ['"SF Mono"', 'ui-monospace', 'SFMono-Regular', '"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['32px', { lineHeight: '38px', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-l': ['24px', { lineHeight: '30px', fontWeight: '700', letterSpacing: '-0.02em' }],
        title: ['18px', { lineHeight: '24px', fontWeight: '600', letterSpacing: '-0.01em' }],
        body: ['15px', { lineHeight: '22px', fontWeight: '400' }],
        caption: ['13px', { lineHeight: '18px', fontWeight: '500' }],
        micro: ['11px', { lineHeight: '14px', fontWeight: '600', letterSpacing: '0.06em' }],
      },
      borderRadius: {
        card: '22px',
        btn: '14px',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        'gold-glow': 'var(--shadow-accent)',
        'mic-glow': 'var(--shadow-mic)',
        glass: 'var(--shadow-glass)',
      },
      keyframes: {
        'pulse-node': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(1.35)' },
        },
        'thread-draw': {
          from: { transform: 'scaleY(0)' },
          to: { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'pulse-node': 'pulse-node 2s ease-in-out infinite',
        'thread-draw': 'thread-draw 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};
