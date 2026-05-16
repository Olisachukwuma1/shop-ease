 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const getProducts = createAsyncThunk('products/getAll', async (params, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${API_URL}/api/products`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to get products')
  }
})

export const getProduct = createAsyncThunk('products/getOne', async (id, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${API_URL}/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to get product')
  }
})

export const createProduct = createAsyncThunk('products/create', async (formData, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.post(`${API_URL}/api/products`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create product')
  }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, formData }, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.put(`${API_URL}/api/products/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update product')
  }
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`${API_URL}/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete product')
  }
})

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
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
      .addCase(getProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.product = action.payload
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload)
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload._id)
        if (index !== -1) state.products[index] = action.payload
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload)
      })
  },
})

export const { clearError } = productSlice.actions
export default productSlice.reducer