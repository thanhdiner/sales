import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './stores'
import { HelmetProvider } from 'react-helmet-async'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tùy chọn mặc định chống gọi lại API khi switch tab
      retry: 1, // Tùy chọn thử lại 1 lần nếu lỗi
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <HelmetProvider>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </Provider>
  </HelmetProvider>
)

