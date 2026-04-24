import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cart'
import adminUserReducer from './adminUser'
import websiteConfigReducer from './websiteConfigSlice'
import userReducer from './user'
import darkModeReducer from './darkModeSlice'
import wishlistReducer from './wishlist'
import compareReducer from './compare'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    adminUser: adminUserReducer,
    websiteConfig: websiteConfigReducer,
    clientUser: userReducer,
    darkMode: darkModeReducer,
    wishlist: wishlistReducer,
    compare: compareReducer
  }
})
