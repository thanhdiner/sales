import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: []
}
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { productId, quantity } = action.payload
      const existingItem = state.items.find(item => item.productId === productId)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({ productId, quantity })
      }
    }
  }
})

export const { addToCart } = cartSlice.actions
export default cartSlice.reducer
