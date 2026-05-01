import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from '@/utils/env'

const getCurrentLanguage = () => {
  try {
    return localStorage.getItem('language') === 'en' ? 'en' : 'vi'
  } catch {
    return 'vi'
  }
}

export const fetchWebsiteConfig = createAsyncThunk('websiteConfig/fetch', async () => {
  const res = await fetch(`${API_URL}/admin/website-config`, {
    method: 'GET',
    cache: 'no-store',
    credentials: 'include',
    headers: {
      'Accept-Language': getCurrentLanguage()
    }
  })

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(json?.error || json?.message || res.statusText)
  }

  return json
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
