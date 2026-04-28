import { createSlice } from '@reduxjs/toolkit'
import { message } from 'antd'

const getInitialCompareItems = () => {
  if (typeof localStorage === 'undefined') return []

  try {
    const rawItems = localStorage.getItem('compareList')
    if (!rawItems) return []

    const parsedItems = JSON.parse(rawItems)
    return Array.isArray(parsedItems) ? parsedItems : []
  } catch {
    try {
      localStorage.removeItem('compareList')
    } catch {
      // Ignore storage cleanup errors
    }
    return []
  }
}

const compareSlice = createSlice({
  name: 'compare',
  initialState: {
    items: getInitialCompareItems()
  },
  reducers: {
    toggleCompareLocal: (state, action) => {
      const product = action.payload
      const index = state.items.findIndex(i => i.productId === product.productId)

      if (index >= 0) {
        state.items.splice(index, 1)
        message.info('Đã xóa khỏi danh sách so sánh')
      } else {
        if (state.items.length >= 4) {
          message.warning('Chỉ có thể so sánh tối đa 4 sản phẩm!')
          return
        }
        state.items.push(product)
        message.success('Đã thêm vào danh sách so sánh')
      }
      localStorage.setItem('compareList', JSON.stringify(state.items))
    },
    removeCompareLocal: (state, action) => {
      state.items = state.items.filter(i => i.productId !== action.payload)
      localStorage.setItem('compareList', JSON.stringify(state.items))
    },
    clearCompareLocal: (state) => {
      state.items = []
      localStorage.removeItem('compareList')
    }
  }
})

export const { toggleCompareLocal, removeCompareLocal, clearCompareLocal } = compareSlice.actions
export default compareSlice.reducer
