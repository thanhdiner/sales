const tokenColor = variable => `rgb(var(${variable}) / <alpha-value>)`

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: tokenColor('--tw-color-white'),
        black: tokenColor('--tw-color-black'),
        gray: {
          50: tokenColor('--tw-color-gray-50'),
          100: tokenColor('--tw-color-gray-100'),
          200: tokenColor('--tw-color-gray-200'),
          300: tokenColor('--tw-color-gray-300'),
          400: tokenColor('--tw-color-gray-400'),
          500: tokenColor('--tw-color-gray-500'),
          600: tokenColor('--tw-color-gray-600'),
          700: tokenColor('--tw-color-gray-700'),
          800: tokenColor('--tw-color-gray-800'),
          900: tokenColor('--tw-color-gray-900')
        },
        primary: {
          DEFAULT: tokenColor('--tw-color-primary'),
          dark: tokenColor('--tw-color-primary-dark'),
          foreground: tokenColor('--tw-color-primary-foreground'),
          'on-dark': tokenColor('--tw-color-primary-on-dark')
        },
        secondary: {
          DEFAULT: tokenColor('--tw-color-secondary'),
          dark: tokenColor('--tw-color-secondary-dark'),
          light: tokenColor('--tw-color-secondary-light')
        },
        border: {
          DEFAULT: tokenColor('--tw-color-border'),
          dark: tokenColor('--tw-color-border-dark'),
          gray: tokenColor('--tw-color-border-gray')
        },
        success: {
          DEFAULT: tokenColor('--tw-color-success'),
          dark: tokenColor('--tw-color-success-dark')
        },
        error: {
          DEFAULT: tokenColor('--tw-color-error'),
          dark: tokenColor('--tw-color-error-dark')
        },
        warning: {
          DEFAULT: tokenColor('--tw-color-warning'),
          dark: tokenColor('--tw-color-warning-dark')
        },
        text: {
          DEFAULT: tokenColor('--tw-color-text'),
          dark: tokenColor('--tw-color-text-dark'),
          muted: tokenColor('--tw-color-text-muted')
        },
        background: {
          DEFAULT: tokenColor('--tw-color-background'),
          dark: tokenColor('--tw-color-background-dark'),
          'soft-dark': tokenColor('--tw-color-background-soft-dark'),
          card: tokenColor('--tw-color-background-card'),
          'card-dark': tokenColor('--tw-color-background-card-dark')
        }
      }
    }
  },
  plugins: []
}
