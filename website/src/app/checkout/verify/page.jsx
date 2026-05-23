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
    if (!reference) return

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
      } catch (err) {
        setStatus('failed')
        setTimeout(() => router.push('/cart'), 3000)
      }
    }

    verifyPayment()
  }, [reference, dispatch, router])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--white)' }}>
      <Navbar />

      {/* RESPONSIVE WRAPPER */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(1.5rem, 5vw, 4rem)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            maxWidth: '480px',
            width: '100%',
          }}
        >

          {/* VERIFYING */}
          {status === 'verifying' && (
            <>
              <div style={{ fontSize: 'clamp(3rem, 8vw, 4rem)', marginBottom: '1.5rem' }}>
                ⏳
              </div>

              <h2
                className="font-playfair"
                style={{
                  fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                  fontWeight: 700,
                  marginBottom: '0.8rem',
                }}
              >
                Verifying Payment...
              </h2>

              <p style={{ color: 'var(--muted)' }}>
                Please wait while we confirm your payment.
              </p>
            </>
          )}

          {/* SUCCESS */}
          {status === 'success' && (
            <>
              <div style={{ fontSize: 'clamp(3rem, 8vw, 4rem)', marginBottom: '1.5rem' }}>
                🎉
              </div>

              <h2
                className="font-playfair"
                style={{
                  fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                  fontWeight: 700,
                  marginBottom: '0.8rem',
                  color: '#22c55e',
                }}
              >
                Payment Successful!
              </h2>

              <p style={{ color: 'var(--muted)' }}>
                Your order has been placed. Redirecting to your orders...
              </p>
            </>
          )}

          {/* FAILED */}
          {status === 'failed' && (
            <>
              <div style={{ fontSize: 'clamp(3rem, 8vw, 4rem)', marginBottom: '1.5rem' }}>
                ❌
              </div>

              <h2
                className="font-playfair"
                style={{
                  fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                  fontWeight: 700,
                  marginBottom: '0.8rem',
                  color: '#ef4444',
                }}
              >
                Payment Failed
              </h2>

              <p style={{ color: 'var(--muted)' }}>
                Something went wrong. Redirecting back to cart...
              </p>
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