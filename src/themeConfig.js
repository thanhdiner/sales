export const lightTheme = {
  colors: {
    primary: '#1890ff',
    primaryHover: '#40a9ff',
    primaryActive: '#096dd9',

    accent: '#52c41a',
    accentHover: '#73d13d',
    accentActive: '#389e0d',

    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff',

    text: {
      primary: '#1890ff',
      secondary: '#595959',
      disabled: '#bfbfbf',
      inverse: '#ffffff',
      defaultText: '#000000'
    },

    background: {
      primary: '#ffffff',
      secondary: '#fafafa',
      tertiary: '#f5f5f5',
      disabled: '#f5f5f5',
      overlay: 'rgba(0, 0, 0, 0.45)'
    },

    border: {
      primary: '#d9d9d9',
      secondary: '#f0f0f0',
      active: '#1890ff'
    },

    shadow: {
      card: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      popup: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    }
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },

  borderRadius: {
    sm: '2px',
    md: '6px',
    lg: '8px',
    xl: '12px'
  },

  typography: {
    fontFamily: {
      system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      inter: 'Inter, sans-serif',
      roboto: 'Roboto, sans-serif',
      openSans: '"Open Sans", sans-serif',
      nunito: 'Nunito, sans-serif',
      arial: 'Arial, sans-serif'
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
      loose: 2.0
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },

  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out'
  },

  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
  }
}

export const darkTheme = {
  colors: {
    primary: '#1890ff',
    primaryHover: '#40a9ff',
    primaryActive: '#096dd9',

    accent: '#52c41a',
    accentHover: '#73d13d',
    accentActive: '#389e0d',

    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff',

    text: {
      primary: '#ffffff',
      secondary: '#a6a6a6',
      disabled: '#595959',
      inverse: '#262626',
      defaultText: '#fff'
    },

    background: {
      primary: '#141414',
      secondary: '#18191a',
      tertiary: '#262626',
      disabled: '#262626',
      overlay: 'rgba(0, 0, 0, 0.65)'
    },

    border: {
      primary: '#424242',
      secondary: '#303030',
      active: '#1890ff'
    },

    shadow: {
      card: '0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      popup: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
    }
  },

  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  typography: lightTheme.typography,
  transitions: lightTheme.transitions,
  zIndex: lightTheme.zIndex
}

export const applyTheme = (themeName, customColors = {}) => {
  const theme = themeName === 'dark' ? darkTheme : lightTheme

  const mergedTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      ...customColors
    }
  }

  const root = document.documentElement

  root.setAttribute('data-theme', themeName)

  return mergedTheme
}

export const useAutoTheme = () => {
  const getAutoTheme = () => {
    const hour = new Date().getHours()
    return hour >= 18 || hour < 6 ? 'dark' : 'light'
  }

  return getAutoTheme()
}

export const colorPresets = {
  blue: {
    primary: '#1890ff',
    accent: '#52c41a'
  },
  purple: {
    primary: '#722ed1',
    accent: '#eb2f96'
  },
  green: {
    primary: '#52c41a',
    accent: '#13c2c2'
  },
  red: {
    primary: '#f5222d',
    accent: '#fa8c16'
  },
  orange: {
    primary: '#fa8c16',
    accent: '#fadb14'
  },
  cyan: {
    primary: '#13c2c2',
    accent: '#1890ff'
  },
  magenta: {
    primary: '#eb2f96',
    accent: '#722ed1'
  },
  gold: {
    primary: '#fadb14',
    accent: '#fa8c16'
  }
}

export const defaultThemeSettings = {
  theme: 'light',
  autoTheme: false,
  primaryColor: '#1890ff',
  accentColor: '#52c41a',
  fontSize: 14,
  fontFamily: 'system',
  lineHeight: 1.5,
  layout: 'default',
  sidebar: 'expanded',
  density: 'default',
  borderRadius: 6,
  animations: true,
  shadows: true,
  transparentBg: false,
  fullWidth: false
}

export default {
  lightTheme,
  darkTheme,
  applyTheme,
  useAutoTheme,
  colorPresets,
  defaultThemeSettings
}
