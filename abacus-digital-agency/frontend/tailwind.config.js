/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-mode="dark"]'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '2rem',
        lg: '3rem',
        xl: '4rem',
        '2xl': '5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
        '3xl': '1800px', // ultra-wide support
      },
    },
    extend: {
      screens: {
        '3xl': '1800px',
        '4xl': '2200px',
      },
      // colors: {
        // Every value is sourced from CSS custom properties defined in
        // src/styles/themes.css, so switching data-theme/data-mode on
        // <html> instantly re-themes the entire app — no JS re-render needed.
      //   bg: {
      //     DEFAULT: 'rgb(var(--color-bg) / <alpha-value>)',
      //     surface: 'rgb(var(--color-surface) / <alpha-value>)',
      //     elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
      //   },
      //   border: {
      //     DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
      //     subtle: 'rgb(var(--color-border-subtle) / <alpha-value>)',
      //   },
      //   text: {
      //     DEFAULT: 'rgb(var(--color-text-primary) / <alpha-value>)',
      //     secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
      //     muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
      //   },
      //   accent: {
      //     DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
      //     secondary: 'rgb(var(--color-accent-secondary) / <alpha-value>)',
      //     foreground: 'rgb(var(--color-accent-foreground) / <alpha-value>)',
      //   },
      //   success: 'rgb(var(--color-success) / <alpha-value>)',
      //   warning: 'rgb(var(--color-warning) / <alpha-value>)',
      //   danger: 'rgb(var(--color-danger) / <alpha-value>)',
      // },
      colors: {
  bg: {
    DEFAULT: 'rgb(var(--color-bg) / <alpha-value>)',
    surface: 'rgb(var(--color-surface) / <alpha-value>)',
    elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
  },

  border: {
    DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
    subtle: 'rgb(var(--color-border-subtle) / <alpha-value>)',
  },

  text: {
    DEFAULT: 'rgb(var(--color-text-primary) / <alpha-value>)',
    secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
    muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
  },

  accent: {
    DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
    secondary: 'rgb(var(--color-accent-secondary) / <alpha-value>)',
    foreground: 'rgb(var(--color-accent-foreground) / <alpha-value>)',
  },

  success: 'rgb(var(--color-success) / <alpha-value>)',
  warning: 'rgb(var(--color-warning) / <alpha-value>)',
  danger: 'rgb(var(--color-danger) / <alpha-value>)',
},
      fontFamily: {
        display: ['"General Sans"', 'sans-serif'],
        body: ['"Switzer"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xs: '0.375rem',
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgb(var(--color-accent) / 0.45)',
        'glow-lg': '0 0 80px -12px rgb(var(--color-accent) / 0.5)',
        premium: '0 8px 30px rgb(0 0 0 / 0.35)',
        glass: 'inset 0 1px 0 0 rgb(255 255 255 / 0.06), 0 8px 32px rgb(0 0 0 / 0.28)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        marquee: 'marquee 28s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
