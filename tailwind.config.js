module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        black: '#000000',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#303E4C',
          800: '#1E2939',
          900: '#111827'
        },
        primary: {
          DEFAULT: '#4F8CFF',
          dark: '#275dab',
          foreground: '#1a263b',
          'on-dark': '#cfe2ff'
        },
        secondary: {
          DEFAULT: '#00C896',
          dark: '#089176',
          light: '#7afcd3'
        },
        border: {
          DEFAULT: '#ffffff',
          dark: '#22232B',
          gray: '#e5e7eb'
        },
        success: {
          DEFAULT: '#28C76F',
          dark: '#009659'
        },
        error: {
          DEFAULT: '#EA5455',
          dark: '#A61B1B'
        },
        warning: {
          DEFAULT: '#FF9F43',
          dark: '#C77700'
        },
        text: {
          DEFAULT: '#1a263b',
          dark: '#f1f5f9',
          muted: '#64748b'
        },
        background: {
          DEFAULT: '#F5F7FB',
          dark: '#181A20',
          'soft-dark': '#23283a',
          card: '#fff',
          'card-dark': '#23283a'
        }
      }
    }
  },
  plugins: []
}
