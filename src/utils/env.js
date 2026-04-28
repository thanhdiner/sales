const env = import.meta.env || {}

export const API_URL = env.VITE_API_URL || env.REACT_APP_API_URL || 'http://localhost:3001/api/v1'
export const SOCKET_URL = env.VITE_SOCKET_URL || env.REACT_APP_SOCKET_URL || 'http://localhost:3001'
export const CLIENT_URL = env.VITE_CLIENT_URL || env.REACT_APP_CLIENT_URL || 'https://smartmall.site'
export const APP_NAME = env.VITE_NAME_APP || env.REACT_APP_NAME_APP || 'Sovereign'
