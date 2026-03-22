import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './stores'
import { HelmetProvider } from 'react-helmet-async'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <HelmetProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </HelmetProvider>
)

