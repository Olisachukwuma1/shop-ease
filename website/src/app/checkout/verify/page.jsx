 
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { clearCart } from '../../../store/slices/cartSlice'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const [status, setStatus] = useState('verifying')
  const reference = searchParams.get('reference')

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem('token')
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/verify`,
          { reference },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        dispatch(clearCart())
        setStatus('success')
        setTimeout(() => router.push('/orders'), 3000)
      } catch (_err) {
        setStatus('failed')
        setTimeout(() => router.push('/cart'), 3000)
      }
    }
    if (reference) verifyPayment()
  }, [reference, dispatch, router])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--white)' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          {status === 'verifying' && (
            <>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⏳</div>
              <h2 className="font-playfair" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.8rem' }}>
                Verifying Payment...
              </h2>
              <p style={{ color: 'var(--muted)' }}>Please wait while we confirm your payment.</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎉</div>
              <h2 className="font-playfair" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.8rem', color: '#22c55e' }}>
                Payment Successful!
              </h2>
              <p style={{ color: 'var(--muted)' }}>Your order has been placed. Redirecting to your orders...</p>
            </>
          )}
          {status === 'failed' && (
            <>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>❌</div>
              <h2 className="font-playfair" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.8rem', color: '#ef4444' }}>
                Payment Failed
              </h2>
              <p style={{ color: 'var(--muted)' }}>Something went wrong. Redirecting back to cart...</p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function Verify() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  )
}