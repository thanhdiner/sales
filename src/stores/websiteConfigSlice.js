import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAdminWebsiteConfig } from '@/services/adminWebsiteConfigService'

export const fetchWebsiteConfig = createAsyncThunk('websiteConfig/fetch', async () => {
  const res = await getAdminWebsiteConfig()
  return res
})

const websiteConfigSlice = createSlice({
  name: 'websiteConfig',
  initialState: { data: null, status: 'idle', error: null },
  reducers: {
    setWebsiteConfig(state, action) {
      state.data = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWebsiteConfig.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchWebsiteConfig.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchWebsiteConfig.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error
      })
  }
})

export const { setWebsiteConfig } = websiteConfigSlice.actions
export default websiteConfigSlice.reducer
