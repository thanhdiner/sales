import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: localStorage.getItem('darkModeClient') === 'true'
}

const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    setDarkMode: (state, action) => {
      state.value = action.payload
      localStorage.setItem('darkModeClient', action.payload)
      if (action.payload) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    }
  }
})

export const { setDarkMode } = darkModeSlice.actions
export default darkModeSlice.reducer
