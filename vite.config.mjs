import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const jsxInJsPlugin = () => ({
  name: 'sales-jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    const normalizedId = id.split('?')[0].replace(/\\/g, '/')

    if (!normalizedId.includes('/src/') || !normalizedId.endsWith('.js')) {
      return null
    }

    return transformWithEsbuild(code, id, {
      loader: 'jsx',
      jsx: 'automatic'
    })
  }
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const readClientEnv = key => env[`VITE_${key}`] ?? env[`REACT_APP_${key}`] ?? ''

  return {
    plugins: [jsxInJsPlugin(), react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    define: {
      'process.env.REACT_APP_API_URL': JSON.stringify(readClientEnv('API_URL')),
      'process.env.REACT_APP_SOCKET_URL': JSON.stringify(readClientEnv('SOCKET_URL')),
      'process.env.REACT_APP_CLIENT_URL': JSON.stringify(readClientEnv('CLIENT_URL')),
      'process.env.REACT_APP_NAME_APP': JSON.stringify(readClientEnv('NAME_APP')),
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    server: {
      port: 3000
    }
  }
})
