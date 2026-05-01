import { createSlice } from '@reduxjs/toolkit'
import { applyDocumentTheme, persistDarkMode, resolveInitialDarkMode } from '@/utils/themeMode'

const initialDarkMode = resolveInitialDarkMode()
applyDocumentTheme(initialDarkMode)

const initialState = {
  value: initialDarkMode
}

const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    setDarkMode: (state, action) => {
      const isDarkMode = !!action.payload
      state.value = isDarkMode
      persistDarkMode(isDarkMode)
      applyDocumentTheme(isDarkMode)
    }
  }
})

export const { setDarkMode } = darkModeSlice.actions
export default darkModeSlice.reducer
