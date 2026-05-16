 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const getOrders = createAsyncThunk('orders/getAll', async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${API_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to get orders')
  }
})

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, orderStatus }, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.put(
      `${API_URL}/api/orders/${id}/status`,
      { orderStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update order')
  }
})

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
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
      .addCase(getOrders.pending, (state) => {
        state.loading = true
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id)
        if (index !== -1) state.orders[index] = action.payload
      })
  },
})

export const { clearError } = orderSlice.actions
export default orderSlice.reducer