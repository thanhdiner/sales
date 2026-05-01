import { createSlice } from '@reduxjs/toolkit'

const initialState = { user: null, token: null }

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    logout: state => {
      state.user = null
      state.token = null
    },
    updateProfile: (state, action) => {
      if (state.user) Object.assign(state.user, action.payload)
    }
  }
})

export const { setUser, logout, updateProfile } = userSlice.actions
export default userSlice.reducer
