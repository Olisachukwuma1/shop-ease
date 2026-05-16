 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const getCategories = createAsyncThunk('categories/getAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${API_URL}/api/categories`)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to get categories')
  }
})

export const createCategory = createAsyncThunk('categories/create', async (formData, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.post(`${API_URL}/api/categories`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create category')
  }
})

export const updateCategory = createAsyncThunk('categories/update', async ({ id, formData }, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.put(`${API_URL}/api/categories/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update category')
  }
})

export const deleteCategory = createAsyncThunk('categories/delete', async (id, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`${API_URL}/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete category')
  }
})

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload)
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c._id === action.payload._id)
        if (index !== -1) state.categories[index] = action.payload
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c._id !== action.payload)
      })
  },
})

export const { clearError } = categorySlice.actions
export default categorySlice.reducer