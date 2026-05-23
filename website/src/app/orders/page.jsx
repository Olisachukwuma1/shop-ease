'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/my-orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setOrders(res.data)
      } catch (_err) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [router])

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return { bg: '#f0fdf4', color: '#22c55e' }
      case 'shipped': return { bg: '#eff6ff', color: '#3b82f6' }
      case 'cancelled': return { bg: '#fef2f2', color: '#ef4444' }
      default: return { bg: '#fefce8', color: '#eab308' }
    }
  }

  const getPaymentColor = (status) => {
    switch (status) {
      case 'paid': return { bg: '#f0fdf4', color: '#22c55e' }
      case 'failed': return { bg: '#fef2f2', color: '#ef4444' }
      default: return { bg: '#fefce8', color: '#eab308' }
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--white)' }}>
      <Navbar />

      {/* PAGE WRAPPER */}
      <div
        style={{
          padding: 'clamp(1.5rem, 4vw, 4rem)',
          flex: 1
        }}
      >

        {/* HEADER */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '0.5rem'
          }}>
            Your Purchases
          </div>

          <h1 className="font-playfair" style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--black)'
          }}>
            My Orders
          </h1>

          <p style={{
            color: 'var(--muted)',
            marginTop: '0.5rem',
            fontSize: '0.9rem'
          }}>
            {orders.length} order(s) found
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                background: 'var(--cream)',
                borderRadius: '4px',
                height: '120px'
              }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h3 className="font-playfair" style={{ fontSize: '1.5rem' }}>
              No orders yet
            </h3>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
              Start shopping to see your orders here
            </p>
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
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: 'clamp(1rem, 3vw, 1.5rem)'
                }}
              >

                {/* ORDER HEADER */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    marginBottom: '1.2rem',
                    paddingBottom: '1.2rem',
                    borderBottom: '1px solid var(--border)'
                  }}
                >

                  {/* ID */}
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                      Order ID
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      wordBreak: 'break-word'
                    }}>
                      #{order._id.toString().slice(-8).toUpperCase()}
                    </div>
                  </div>

                  {/* DATE */}
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                      Date
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* STATUS */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                      background: getStatusColor(order.orderStatus).bg,
                      color: getStatusColor(order.orderStatus).color,
                      fontSize: '0.7rem',
                      padding: '0.3rem 0.7rem',
                      borderRadius: '999px'
                    }}>
                      {order.orderStatus}
                    </span>

                    <span style={{
                      background: getPaymentColor(order.paymentStatus).bg,
                      color: getPaymentColor(order.paymentStatus).color,
                      fontSize: '0.7rem',
                      padding: '0.3rem 0.7rem',
                      borderRadius: '999px'
                    }}>
                      {order.paymentStatus}
                    </span>
                  </div>

                  {/* TOTAL */}
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                  }}>
                    ₦{order.totalAmount.toLocaleString()}
                  </div>
                </div>

                {/* ITEMS */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '0.8rem'
                  }}
                >
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        gap: '0.8rem',
                        alignItems: 'center',
                        background: 'var(--cream)',
                        padding: '0.8rem',
                        borderRadius: '4px'
                      }}
                    >
                      <div style={{
                        width: '48px',
                        height: '48px',
                        flexShrink: 0,
                        background: 'var(--white)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            📦
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ADDRESS */}
                <div style={{
                  marginTop: '1rem',
                  fontSize: '0.75rem',
                  color: 'var(--muted)',
                  wordBreak: 'break-word'
                }}>
                  📍 {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}
                </div>

              </div>
            ))}

          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}