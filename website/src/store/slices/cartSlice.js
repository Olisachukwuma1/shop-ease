import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    totalItems: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0)
      state.totalAmount = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload)
      state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0)
      state.totalAmount = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item._id === id)
      if (item) {
        item.quantity = quantity
        if (item.quantity <= 0) {
          state.items = state.items.filter(item => item._id !== id)
        }
      }
      state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0)
      state.totalAmount = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    },
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalAmount = 0
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer 
