/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  // Special version of the config that doesn't rely on external plugins
  // This helps avoid build errors in Netlify
  plugins: [
    function({ addBase, addComponents }) {
      // Basic form styling to replace @tailwindcss/forms
      addBase({
        '[type="text"]': {
          borderRadius: '0.375rem',
          borderWidth: '1px',
        },
        '[type="email"]': {
          borderRadius: '0.375rem',
          borderWidth: '1px',
        },
        '[type="password"]': {
          borderRadius: '0.375rem',
          borderWidth: '1px',
        },
        '[type="number"]': {
          borderRadius: '0.375rem',
          borderWidth: '1px',
        },
        '[type="checkbox"]': {
          borderRadius: '0.25rem',
          borderWidth: '1px',
        },
        '[type="radio"]': {
          borderRadius: '9999px',
          borderWidth: '1px',
        }
      });

      // Basic typography styles to replace @tailwindcss/typography
      addComponents({
        '.prose': {
          maxWidth: '65ch',
          fontSize: '1rem',
          lineHeight: '1.75',
          'h1, h2, h3, h4, h5, h6': {
            color: 'inherit',
            fontWeight: '600',
          },
          'h1': {
            fontSize: '2.25rem',
            lineHeight: '2.5rem',
            marginTop: '0',
            marginBottom: '0.8888889em',
          },
          'h2': {
            fontSize: '1.5rem',
            lineHeight: '2rem',
            marginTop: '2em',
            marginBottom: '1em',
          },
          'p': {
            marginTop: '1.25em',
            marginBottom: '1.25em',
          },
          'ul': {
            listStyleType: 'disc',
            paddingLeft: '1.625em',
          },
          'ol': {
            listStyleType: 'decimal',
            paddingLeft: '1.625em',
          },
        }
      });
    }
  ],
}
