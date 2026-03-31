import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0369A1',
        'primary-light': '#0EA5E9',
        'primary-bg': '#E8F4FD',
        'primary-subtle': '#F0F7FF',
        coral: '#FB6F6F',
        'coral-light': '#FFE4E4',
        background: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2EDF7',
        'text-primary': '#0F172A',
        'text-secondary': '#64748B',
        'text-hint': '#94A3B8',
        sidebar: '#0F172A',
        success: '#22C55E',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1': ['clamp(28px,4vw,40px)', { fontWeight: '900' }],
        'h2': ['24px', { fontWeight: '800' }],
        body: ['15px', { lineHeight: '1.65' }],
        label: ['11px', { fontWeight: '600', letterSpacing: '0.5px' }],
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
        lg: '20px',
        full: '999px',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
}

export default config