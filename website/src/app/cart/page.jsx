 
'use client'

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

  const handleRemove = (id) => {
    dispatch(removeFromCart(id))
    toast.success('Item removed from cart')
  }

  const handleQuantityChange = (id, quantity) => {
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

      <div style={{ padding: '4rem 5rem', flex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
            Your Selection
          </div>
          <h1 className="font-playfair" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--black)' }}>
            Shopping Cart
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {totalItems} item(s) in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🛒</div>
            <h3 className="font-playfair" style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>Your cart is empty</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Add some products to get started</p>
            <button
              onClick={() => router.push('/shop')}
              style={{ background: 'var(--gold)', color: 'var(--white)', border: 'none', padding: '0.85rem 2.2rem', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>

            {/* Cart Items */}
            <div>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', gap: '1rem', padding: '0 0 1rem', borderBottom: '1px solid var(--border)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)' }}>
                <span>Product</span>
                <span style={{ textAlign: 'center' }}>Price</span>
                <span style={{ textAlign: 'center' }}>Quantity</span>
                <span style={{ textAlign: 'center' }}>Total</span>
              </div>

              {items.map((item) => (
                <div key={item._id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', gap: '1rem', padding: '1.5rem 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>

                  {/* Product */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', background: 'var(--cream)', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📦</div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                        {item.category?.name || 'Product'}
                      </div>
                      <div className="font-playfair" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--black)', marginBottom: '0.5rem' }}>
                        {item.name}
                      </div>
                      <button
                        onClick={() => handleRemove(item._id)}
                        style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: 'center', fontSize: '0.95rem', fontWeight: 600, color: 'var(--black)' }}>
                    ₦{(item.discountPrice || item.price).toLocaleString()}
                  </div>

                  {/* Quantity */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--border)', borderRadius: '2px', width: 'fit-content', margin: '0 auto' }}>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', fontSize: '1rem', cursor: 'pointer', color: 'var(--black)' }}
                    >
                      −
                    </button>
                    <span style={{ padding: '0 0.6rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--black)' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', fontSize: '1rem', cursor: 'pointer', color: 'var(--black)' }}
                    >
                      +
                    </button>
                  </div>

                  {/* Total */}
                  <div style={{ textAlign: 'center', fontSize: '0.95rem', fontWeight: 700, color: 'var(--black)' }}>
                    ₦{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                  </div>

                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  onClick={() => { dispatch(clearCart()); toast.success('Cart cleared') }}
                  style={{ background: 'none', border: '1.5px solid var(--border)', padding: '0.5rem 1.2rem', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--muted)', borderRadius: '2px' }}
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ background: 'var(--cream)', borderRadius: '4px', padding: '2rem', border: '1px solid var(--border)', position: 'sticky', top: '100px' }}>
              <h3 className="font-playfair" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--black)' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--muted)' }}>
                  <span>Subtotal ({totalItems} items)</span>
                  <span style={{ color: 'var(--black)', fontWeight: 500 }}>₦{totalAmount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--muted)' }}>
                  <span>Shipping</span>
                  <span style={{ color: totalAmount >= 20000 ? '#22c55e' : 'var(--black)', fontWeight: 500 }}>
                    {totalAmount >= 20000 ? 'Free' : '₦2,000'}
                  </span>
                </div>
                {totalAmount < 20000 && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>
                    Add ₦{(20000 - totalAmount).toLocaleString()} more for free shipping!
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.2rem 0', borderTop: '1.5px solid var(--border)', borderBottom: '1.5px solid var(--border)', marginBottom: '1.5rem' }}>
                <span className="font-playfair" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--black)' }}>Total</span>
                <span className="font-playfair" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--black)' }}>
                  ₦{(totalAmount + (totalAmount >= 20000 ? 0 : 2000)).toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                style={{ width: '100%', background: 'var(--gold)', color: 'var(--white)', border: 'none', padding: '1rem', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px', transition: 'all 0.25s', marginBottom: '0.8rem' }}
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