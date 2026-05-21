'use client'

import { useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice'
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
    dispatch(updateQuantity({ id, quantity }))
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) return

    setCouponLoading(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        toast.error('Please login to apply coupon')
        router.push('/login')
        return
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/coupons/apply`,
        {
          code: couponCode,
          orderAmount: totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setCouponData(res.data)
      toast.success(res.data.message)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon')
      setCouponData(null)
    } finally {
      setCouponLoading(false)
    }
  }

  const handleCheckout = () => {
    const token = localStorage.getItem('token')

    if (!token) {
      toast.error('Please login to checkout')
      router.push('/login')
      return
    }

    if (couponData) {
      localStorage.setItem(
        'appliedCoupon',
        JSON.stringify({
          ...couponData,
          grandTotal,
        })
      )
    } else {
      localStorage.removeItem('appliedCoupon')
    }

    router.push('/checkout')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--white)' }}>
      <Navbar />

      <div style={{ padding: '4rem 5rem', flex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
            Your Selection
          </div>

          <h1
            className="font-playfair"
            style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--black)' }}
          >
            Shopping Cart
          </h1>

          <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {totalItems} item(s) in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🛒</div>

            <h3
              className="font-playfair"
              style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}
            >
              Your cart is empty
            </h3>

            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
              Add some products to get started
            </p>

            <button
              onClick={() => router.push('/shop')}
              style={{
                background: 'var(--gold)',
                color: 'var(--white)',
                border: 'none',
                padding: '0.85rem 2.2rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: '2px',
              }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 380px',
              gap: '3rem',
              alignItems: 'start',
            }}
          >

            {/* Cart Items */}
            <div>
              {/* Header row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 1fr 1fr 1fr',
                  gap: '1rem',
                  padding: '0 0 1rem',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                <span>Product</span>
                <span style={{ textAlign: 'center' }}>Price</span>
                <span style={{ textAlign: 'center' }}>Quantity</span>
                <span style={{ textAlign: 'center' }}>Total</span>
              </div>

              {items.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '3fr 1fr 1fr 1fr',
                    gap: '1rem',
                    padding: '1.5rem 0',
                    borderBottom: '1px solid var(--border)',
                    alignItems: 'center',
                  }}
                >
                  {/* Product */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        background: 'var(--cream)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                          }}
                        >
                          📦
                        </div>
                      )}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--gold)',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          marginBottom: '0.3rem',
                        }}
                      >
                        {item.category?.name || 'Product'}
                      </div>

                      <div
                        className="font-playfair"
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: 'var(--black)',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {item.name}
                      </div>

                      <button
                        onClick={() => handleRemove(item._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '0.75rem',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: 'var(--black)',
                    }}
                  >
                    ₦{(item.discountPrice || item.price).toLocaleString()}
                  </div>

                  {/* Quantity */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1.5px solid var(--border)',
                      borderRadius: '2px',
                      width: 'fit-content',
                      margin: '0 auto',
                    }}
                  >
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    >
                      −
                    </button>

                    <span style={{ padding: '0 0.6rem' }}>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  {/* Total */}
                  <div style={{ textAlign: 'center', fontWeight: 700 }}>
                    ₦{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div
              style={{
                background: 'var(--cream)',
                borderRadius: '4px',
                padding: '2rem',
              }}
            >
              <h3 className="font-playfair">Order Summary</h3>

              {/* Coupon */}
              <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      border: '1px solid #ddd',
                      padding: '0.7rem',
                    }}
                  />

                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>

                {couponData && (
                  <div style={{ marginTop: '0.5rem' }}>
                    🎉 {couponData.message}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span>₦{totalAmount.toLocaleString()}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Shipping</span>
                  <span>
                    {shippingFee === 0
                      ? 'Free'
                      : `₦${shippingFee.toLocaleString()}`}
                  </span>
                </div>

                {couponData && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#22c55e',
                    }}
                  >
                    <span>Discount ({couponData.code})</span>
                    <span>-₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '1rem',
                    fontWeight: 700,
                  }}
                >
                  <span>Total</span>
                  <span>₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  background: 'var(--gold)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  cursor: 'pointer',
                }}
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={() => router.push('/shop')}
                style={{ width: '100%', background: 'transparent', color: 'var(--black)', border: '1.5px solid var(--black)', padding: '0.8rem', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px', transition: 'all 0.25s' }}
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