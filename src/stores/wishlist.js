import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: []
  },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload || []
    },
    addToWishlistLocal: (state, action) => {
      const exists = state.items.some(i => i.productId === action.payload.productId)
      if (!exists) {
        state.items.unshift(action.payload)
      }
    },
    removeFromWishlistLocal: (state, action) => {
      state.items = state.items.filter(i => i.productId !== action.payload)
    },
    clearWishlistLocal: state => {
      state.items = []
    }
  }
})

export const { setWishlist, addToWishlistLocal, removeFromWishlistLocal, clearWishlistLocal } = wishlistSlice.actions
export default wishlistSlice.reducer
