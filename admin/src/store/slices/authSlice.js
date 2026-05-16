 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/api/auth/login`, { email, password })
    localStorage.setItem('token', res.data.token)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to get user')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer