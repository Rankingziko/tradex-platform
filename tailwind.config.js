/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          50: '#f0f3ff',
          100: '#e6ebff',
          200: '#cdd7ff',
          300: '#b4c3ff',
          400: '#2948ff',
          500: '#2940f5',
          600: '#2230e0',
          700: '#1b26c0',
          800: '#151c99',
          900: '#0f1266',
        },
        // Secondary Colors
        secondary: {
          50: '#f0fdf4',
          100: '#dbeafe',
          200: '#00ff84',
          300: '#00e877',
          400: '#00d47c',
          500: '#00c071',
          600: '#00a85c',
          700: '#009052',
          800: '#007848',
          900: '#00603e',
        },
        // Accent Colors
        accent: {
          blue: '#2948ff',
          cyan: '#00d4ff',
          green: '#00ff84',
          purple: '#4f46e5',
        },
        // Dark Theme
        dark: {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#c0c0c0',
          300: '#a0a0a0',
          400: '#808080',
          500: '#606060',
          600: '#404040',
          700: '#2d2d2d',
          800: '#1a1a1a',
          900: '#0a0e27',
          950: '#050814',
        },
        // Text Colors
        text: {
          primary: '#ffffff',
          secondary: '#a8adc6',
          tertiary: '#7a7d9a',
        },
        // Background Colors
        bg: {
          primary: '#0a0e27',
          secondary: '#1a1f3a',
          tertiary: '#252d48',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2d1b4e 100%)',
        'gradient-card': 'linear-gradient(to br, rgba(26, 31, 58, 0.4), rgba(41, 72, 255, 0.05))',
        'gradient-glow': 'linear-gradient(135deg, #2948ff, #4f46e5)',
        'gradient-success': 'linear-gradient(135deg, #00ff84, #00d4aa)',
      },
      backdropFilter: {
        'blur-xl': 'blur(20px)',
        'blur-lg': 'blur(16px)',
        'blur-md': 'blur(12px)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(41, 72, 255, 0.3)',
        'glow-lg': '0 0 30px rgba(41, 72, 255, 0.5)',
        'glow-green': '0 0 20px rgba(0, 255, 132, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.3)',
        'card': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      borderColor: {
        'glow': 'rgba(73, 72, 255, 0.2)',
        'glow-hover': 'rgba(73, 72, 255, 0.4)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'bounce-subtle': 'bounce-subtle 0.6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-right': 'env(safe-area-inset-right)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'mono': ['Fira Code', 'monospace'],
      },
      screens: {
        'xs': '320px',
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function({ addBase, theme }) {
      addBase({
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: theme('colors.dark.900'),
        },
        '::-webkit-scrollbar-thumb': {
          background: theme('colors.accent.blue'),
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: theme('colors.accent.cyan'),
        },
      });
    },
  ],
}
