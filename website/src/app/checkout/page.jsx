'use client'

import { useState, useEffect } from 'react'
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
  const [couponData, setCouponData] = useState(null)

  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [stateSearch, setStateSearch] = useState('')
  const [showStateDropdown, setShowStateDropdown] = useState(false)
  const [country, setCountry] = useState('Nigeria')

  useEffect(() => {
    const savedCoupon = localStorage.getItem('appliedCoupon')
    if (savedCoupon) setCouponData(JSON.parse(savedCoupon))
  }, [])

  const discountAmount = couponData ? couponData.discountAmount : 0
  const shippingFee = totalAmount >= 20000 ? 0 : 2000
  const grandTotal = totalAmount + shippingFee - discountAmount

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

    if (!state) return toast.error('Please select a state')
    if (items.length === 0) return toast.error('Your cart is empty')

    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      const orderItems = items.map(item => ({
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
          couponCode: couponData ? couponData.code : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      localStorage.removeItem('appliedCoupon')
      window.location.href = res.data.authorization_url
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--white)' }}>
      <Navbar />

      {/* PAGE WRAPPER (RESPONSIVE FIX) */}
      <div
        style={{
          padding: 'clamp(1.5rem, 4vw, 4rem)',
          flex: 1
        }}
      >

        {/* HEADER */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)' }}>
            Almost There
          </div>

          <h1
            className="font-playfair"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--black)'
            }}
          >
            Checkout
          </h1>
        </div>

        <form onSubmit={handlePayment}>
          {/* MAIN GRID (RESPONSIVE FIX) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem'
            }}
          >

            {/* SHIPPING FORM */}
            <div>
              <h2 className="font-playfair" style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>
                Shipping Address
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                <div>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Street Address
                  </label>
                  <input
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    style={{ width: '100%', padding: '0.9rem', border: '1.5px solid var(--border)' }}
                  />
                </div>

                {/* RESPONSIVE GRID FIX */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      City
                    </label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{ width: '100%', padding: '0.9rem', border: '1.5px solid var(--border)' }}
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      State
                    </label>
                    <input
                      value={stateSearch}
                      onChange={(e) => {
                        setStateSearch(e.target.value)
                        setShowStateDropdown(true)
                      }}
                      style={{ width: '100%', padding: '0.9rem', border: '1.5px solid var(--border)' }}
                    />

                    {showStateDropdown && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: 'white',
                          border: '1px solid #ddd',
                          maxHeight: '200px',
                          overflowY: 'auto',
                          zIndex: 100
                        }}
                      >
                        {filteredStates.map(s => (
                          <div
                            key={s}
                            onClick={() => handleStateSelect(s)}
                            style={{ padding: '0.7rem', cursor: 'pointer' }}
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* ORDER SUMMARY (RESPONSIVE FIX) */}
            <div
              style={{
                background: 'var(--cream)',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid var(--border)',
                width: '100%'
              }}
            >
              <h3 className="font-playfair">Order Summary</h3>

              {items.map(item => (
                <div key={item._id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <img
                    src={item.images?.[0]}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div>{item.name}</div>
                    <small>Qty: {item.quantity}</small>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '1rem' }}>
                <div>Subtotal: ₦{totalAmount.toLocaleString()}</div>
                <div>Shipping: {shippingFee === 0 ? 'Free' : `₦${shippingFee}`}</div>
                <div style={{ fontWeight: 'bold', marginTop: '1rem' }}>
                  Total: ₦{grandTotal.toLocaleString()}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'var(--gold)',
                  color: 'white',
                  border: 'none'
                }}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>

          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}