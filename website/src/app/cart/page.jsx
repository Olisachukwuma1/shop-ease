'use client'

import { useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function Cart() {
  const dispatch = useDispatch()
  const router = useRouter()

  const { items, totalAmount, totalItems } = useSelector((state) => state.cart)

  const [couponCode, setCouponCode] = useState('')
  const [couponData, setCouponData] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)

  const shippingFee = totalAmount >= 20000 ? 0 : 2000
  const discountAmount = couponData ? couponData.discountAmount : 0
  const grandTotal = totalAmount + shippingFee - discountAmount

  const handleRemove = (id) => {
    dispatch(removeFromCart(id))
    toast.success('Item removed from cart')
  }

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return
    dispatch(updateQuantity({ id, quantity }))
  }

  const handleCheckout = () => {
    const token = localStorage.getItem('token')

    if (!token) {
      toast.error('Please login to checkout')
      router.push('/login')
      return
    }

    router.push('/checkout')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--white)' }}>
      <Navbar />

      {/* PAGE WRAPPER */}
      <div style={{ padding: 'clamp(1.2rem, 4vw, 4rem)', flex: 1 }}>

        {/* HEADER */}
        <div className="mb-8 md:mb-12">
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '0.5rem'
          }}>
            Your Selection
          </div>

          <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: 'var(--black)' }}>
            Shopping Cart
          </h1>

          <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {totalItems} item(s) in your cart
          </p>
        </div>

        {/* EMPTY CART */}
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🛒</div>
            <h3 className="font-playfair" style={{ fontSize: '1.5rem' }}>Your cart is empty</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Add some products to get started</p>
            <button
              onClick={() => router.push('/shop')}
              style={{
                background: 'var(--gold)',
                color: 'var(--white)',
                border: 'none',
                padding: '0.85rem 2rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: '2px'
              }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          /* CORE CART LAYOUT - STACKS ON MOBILE, SPLITS TO GRID ON DESKTOP */
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

            {/* CART ITEMS CONTAINER */}
            <div className="w-full lg:flex-1">

              {/* TABLE HEADER - COMFORTABLY HIDDEN ON MOBILE */}
              <div
                className="hidden md:grid grid-cols-5 gap-4 pb-4 border-b text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
              >
                <span className="col-span-2">Product</span>
                <span className="text-center">Price</span>
                <span className="text-center">Quantity</span>
                <span className="text-center">Total</span>
              </div>

              {/* ITEMS LOOP */}
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:grid md:grid-cols-5 gap-4 py-6 border-b items-center relative"
                  style={{ borderColor: 'var(--border)' }}
                >
                  
                  {/* COLUMN 1 & 2: PRODUCT BLOCK */}
                  <div className="flex gap-4 items-center w-full md:col-span-2">
                    <div className="w-20 h-20 bg-cream rounded shrink-0 overflow-hidden" style={{ background: 'var(--cream)' }}>
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">📦</div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div style={{ fontSize: '0.7rem', color: 'var(--gold)', textTransform: 'uppercase' }}>
                        {item.category?.name || 'Product'}
                      </div>
                      <div className="font-playfair text-base font-semibold pr-6 md:pr-0">
                        {item.name}
                      </div>
                      {/* Remove Button for Desktop */}
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="hidden md:inline-block text-red-500 text-xs mt-1 hover:underline"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* COLUMN 3: PRICE */}
                  <div className="flex md:justify-center justify-between items-center w-full md:w-auto text-sm">
                    <span className="md:hidden text-gray-400 text-xs uppercase font-semibold">Price</span>
                    <span className="font-medium">₦{(item.discountPrice || item.price).toLocaleString()}</span>
                  </div>

                  {/* COLUMN 4: QUANTITY ACTIONS */}
                  <div className="flex md:justify-center justify-between items-center w-full md:w-auto">
                    <span className="md:hidden text-gray-400 text-xs uppercase font-semibold">Quantity</span>
                    <div className="flex items-center gap-3 border rounded px-2 py-1 bg-white" style={{ borderColor: 'var(--border)' }}>
                      <button 
                        className="px-2 text-lg text-gray-500 hover:text-black"
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button 
                        className="px-2 text-lg text-gray-500 hover:text-black"
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* COLUMN 5: TOTAL */}
                  <div className="flex md:justify-center justify-between items-center w-full md:w-auto text-sm">
                    <span className="md:hidden text-gray-400 text-xs uppercase font-semibold">Total</span>
                    <span className="font-bold">₦{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</span>
                  </div>

                  {/* Mobile Floating Absolute Remove Button */}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="md:hidden absolute top-6 right-0 text-red-500 p-1"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ✕
                  </button>

                </div>
              ))}
            </div>

            {/* ORDER SUMMARY BLOCK */}
            <div 
              className="w-full lg:w-[380px] rounded p-6 sm:p-8"
              style={{ background: 'var(--cream)', height: 'fit-content' }}
            >
              <h3 className="font-playfair text-xl font-bold">Order Summary</h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₦{totalAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shippingFee === 0 ? 'Free' : `₦${shippingFee}`}</span>
                </div>

                <div className="flex justify-between font-bold text-base pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--black)' }}>₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 py-4 font-semibold text-sm tracking-wide uppercase transition-colors"
                style={{ background: 'var(--gold)', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => router.push('/shop')}
                className="w-full mt-3 py-3 font-semibold text-sm tracking-wide uppercase bg-transparent transition-colors"
                style={{ border: '1px solid var(--black)', cursor: 'pointer' }}
              >
                Continue Shopping
              </button>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}