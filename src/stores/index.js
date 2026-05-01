import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './client/cart'
import adminUserReducer from './admin/adminUser'
import websiteConfigReducer from './app/websiteConfigSlice'
import userReducer from './client/user'
import darkModeReducer from './app/darkModeSlice'
import wishlistReducer from './client/wishlist'
import compareReducer from './client/compare'
import languageReducer from './app/languageSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    adminUser: adminUserReducer,
    websiteConfig: websiteConfigReducer,
    clientUser: userReducer,
    darkMode: darkModeReducer,
    wishlist: wishlistReducer,
    compare: compareReducer,
    language: languageReducer
  }
})
