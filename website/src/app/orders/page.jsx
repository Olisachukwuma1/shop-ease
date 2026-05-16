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

      <div style={{ padding: '4rem 5rem', flex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
            Your Purchases
          </div>
          <h1 className="font-playfair" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--black)' }}>
            My Orders
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {orders.length} order(s) found
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: 'var(--cream)', borderRadius: '4px', height: '120px' }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📦</div>
            <h3 className="font-playfair" style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>No orders yet</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Start shopping to see your orders here</p>
            <button
              onClick={() => router.push('/shop')}
              style={{ background: 'var(--gold)', color: 'var(--white)', border: 'none', padding: '0.85rem 2.2rem', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div key={order._id} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1.5rem 2rem' }}>

                {/* Order Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', paddingBottom: '1.2rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                      Order ID
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--black)', fontFamily: 'monospace' }}>
                      #{order._id.toString().slice(-8).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                      Date
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--black)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <span style={{ background: getStatusColor(order.orderStatus).bg, color: getStatusColor(order.orderStatus).color, fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.8rem', borderRadius: '100px', textTransform: 'capitalize' }}>
                      {order.orderStatus}
                    </span>
                    <span style={{ background: getPaymentColor(order.paymentStatus).bg, color: getPaymentColor(order.paymentStatus).color, fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.8rem', borderRadius: '100px', textTransform: 'capitalize' }}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="font-playfair" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--black)' }}>
                    ₦{order.totalAmount.toLocaleString()}
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {order.items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', background: 'var(--cream)', padding: '0.8rem', borderRadius: '4px' }}>
                      <div style={{ width: '48px', height: '48px', background: 'var(--white)', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📦</div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--black)' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                          Qty: {item.quantity} × ₦{item.price?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div style={{ marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--muted)' }}>
                  📍 {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}
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
