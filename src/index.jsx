import React from 'react'
import ReactDOM from 'react-dom/client'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './index.scss'
import { queryClient, queryPersistOptions } from '@/lib/queryClient'
import { store } from './stores'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <HelmetProvider>
    <Provider store={store}>
      <PersistQueryClientProvider client={queryClient} persistOptions={queryPersistOptions}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </PersistQueryClientProvider>
    </Provider>
  </HelmetProvider>
)
