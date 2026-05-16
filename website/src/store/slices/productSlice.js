 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const getProducts = createAsyncThunk('products/getAll', async (params, thunkAPI) => {
  try {
    const res = await axios.get(`${API_URL}/api/products`, { params })
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to get products')
  }
})

export const getProduct = createAsyncThunk('products/getOne', async (id, thunkAPI) => {
  try {
    const res = await axios.get(`${API_URL}/api/products/${id}`)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to get product')
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
  },
})

export const { clearError } = productSlice.actions
export default productSlice.reducer