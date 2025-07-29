import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cart'
import adminUserReducer from './adminUser'
import websiteConfigReducer from './websiteConfigSlice'
import userReducer from './user'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: adminUserReducer,
    websiteConfig: websiteConfigReducer,
    clientUser: userReducer
  }
})
