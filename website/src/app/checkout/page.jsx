'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { clearCart } from '../../store/slices/cartSlice'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { toast } from 'react-toastify'

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
]

export default function Checkout() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { items, totalAmount } = useSelector((state) => state.cart)
  const [loading, setLoading] = useState(false)

  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [stateSearch, setStateSearch] = useState('')
  const [showStateDropdown, setShowStateDropdown] = useState(false)
  const [country, setCountry] = useState('Nigeria')

  const shippingFee = totalAmount >= 20000 ? 0 : 2000
  const grandTotal = totalAmount + shippingFee

  const filteredStates = NIGERIAN_STATES.filter(s =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  )

  const handleStateSelect = (selectedState) => {
    setState(selectedState)
    setStateSearch(selectedState)
    setShowStateDropdown(false)
  }

  const handlePayment = async (e) => {
    e.preventDefault()

    if (!state) {
      toast.error('Please select a state')
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      const orderItems = items.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.discountPrice || item.price,
        quantity: item.quantity,
        image: item.images?.[0] || null,
      }))

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/initialize`,
        {
          items: orderItems,
          shippingAddress: { street, city, state, country },
          totalAmount: grandTotal,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      window.location.href = res.data.authorization_url

    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initialization failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--white)' }}>
      <Navbar />

      <div style={{ padding: '4rem 5rem', flex: 1 }}>

        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
            Almost There
          </div>
          <h1 className="font-playfair" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--black)' }}>
            Checkout
          </h1>
        </div>

        <form onSubmit={handlePayment}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>

            {/* Shipping Form */}
            <div>
              <h2 className="font-playfair" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--black)' }}>
                Shipping Address
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                {/* Street */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    placeholder="123 Main Street"
                    style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: '8px', padding: '0.9rem 1rem', fontSize: '0.875rem', outline: 'none', color: 'var(--black)', background: 'var(--white)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                  {/* City */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="Lagos"
                      style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: '8px', padding: '0.9rem 1rem', fontSize: '0.875rem', outline: 'none', color: 'var(--black)', background: 'var(--white)' }}
                    />
                  </div>

                  {/* State - Searchable Dropdown */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>
                      State
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={stateSearch}
                        onChange={(e) => {
                          setStateSearch(e.target.value)
                          setState('')
                          setShowStateDropdown(true)
                        }}
                        onFocus={() => setShowStateDropdown(true)}
                        required
                        placeholder="Search state..."
                        style={{ width: '100%', border: `1.5px solid ${showStateDropdown ? 'var(--gold)' : 'var(--border)'}`, borderRadius: '8px', padding: '0.9rem 2.5rem 0.9rem 1rem', fontSize: '0.875rem', outline: 'none', color: 'var(--black)', background: 'var(--white)', cursor: 'pointer' }}
                      />
                      {/* Dropdown Arrow */}
                      <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: `translateY(-50%) rotate(${showStateDropdown ? '180deg' : '0deg'})`, transition: 'transform 0.2s', color: 'var(--muted)', pointerEvents: 'none', fontSize: '0.75rem' }}>
                        ▼
                      </span>
                    </div>

                    {/* Dropdown List */}
                    {showStateDropdown && (
                      <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'var(--white)', border: '1.5px solid var(--gold)', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                        {filteredStates.length === 0 ? (
                          <div style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--muted)', textAlign: 'center' }}>
                            No state found
                          </div>
                        ) : (
                          filteredStates.map((s) => (
                            <div
                              key={s}
                              onClick={() => handleStateSelect(s)}
                              style={{ padding: '0.7rem 1rem', fontSize: '0.875rem', color: 'var(--black)', cursor: 'pointer', transition: 'background 0.15s', background: state === s ? 'var(--cream)' : 'transparent', borderBottom: '1px solid var(--border)' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
                              onMouseLeave={e => e.currentTarget.style.background = state === s ? 'var(--cream)' : 'transparent'}
                            >
                              {state === s && <span style={{ color: 'var(--gold)', marginRight: '0.5rem' }}>✓</span>}
                              {s}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: '8px', padding: '0.9rem 1rem', fontSize: '0.875rem', outline: 'none', color: 'var(--black)', background: 'var(--white)' }}
                  />
                </div>

              </div>

              {/* Payment Info */}
              <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--cream)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🔒</span>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)' }}>Secure Payment via Paystack</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Your payment info is encrypted and secure</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                  You will be redirected to Paystack to complete your payment. After successful payment you will be redirected back to confirm your order.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ background: 'var(--cream)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--border)', position: 'sticky', top: '100px' }}>
              <h3 className="font-playfair" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--black)' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '250px', overflowY: 'auto' }}>
                {items.map((item) => (
                  <div key={item._id} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--white)', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                      {item.images?.[0] ? (
                        <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--black)', marginBottom: '0.2rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--black)' }}>
                      ₦{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--muted)' }}>
                  <span>Subtotal</span>
                  <span style={{ color: 'var(--black)', fontWeight: 500 }}>₦{totalAmount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--muted)' }}>
                  <span>Shipping</span>
                  <span style={{ color: shippingFee === 0 ? '#22c55e' : 'var(--black)', fontWeight: 500 }}>
                    {shippingFee === 0 ? 'Free' : `₦${shippingFee.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.2rem 0', borderTop: '1.5px solid var(--border)', marginBottom: '1.5rem' }}>
                <span className="font-playfair" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--black)' }}>Total</span>
                <span className="font-playfair" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--black)' }}>
                  ₦{grandTotal.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || items.length === 0}
                style={{ width: '100%', background: 'var(--gold)', color: 'var(--white)', border: 'none', padding: '1rem', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '8px', transition: 'all 0.25s', opacity: loading || items.length === 0 ? 0.7 : 1 }}
              >
                {loading ? 'Redirecting to Paystack...' : `Pay ₦${grandTotal.toLocaleString()}`}
              </button>
            </div>

          </div>
        </form>

        {/* Close dropdown when clicking outside */}
        {showStateDropdown && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
            onClick={() => setShowStateDropdown(false)}
          />
        )}

      </div>

      <Footer />
    </div>
  )
}