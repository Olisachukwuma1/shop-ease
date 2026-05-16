'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { verifyOTP, resendOTP } from '../../store/slices/authSlice'
import { toast } from 'react-toastify'

export default function VerifyPage() {
  const [code, setCode] = useState('')
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading } = useSelector((state) => state.auth)

  const handleVerify = async (e) => {
    e.preventDefault()
    const result = await dispatch(verifyOTP({ code }))
    if (verifyOTP.fulfilled.match(result)) {
      toast.success('Verified successfully!')
      router.push('/')
    } else {
      toast.error(result.payload || 'Invalid or expired code')
    }
  }

  const handleResend = async () => {
    const result = await dispatch(resendOTP())
    if (resendOTP.fulfilled.match(result)) {
      toast.success('Code resent! Check your email.')
    } else {
      toast.error('Failed to resend code')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-10 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-2 text-gray-800">
          Verify Your Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Check your email and enter the code below
        </p>

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-center tracking-widest focus:outline-none focus:border-blue-500 text-gray-800"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <button
          onClick={handleResend}
          className="mt-4 w-full text-center text-sm text-gray-500 hover:text-blue-600 transition"
        >
          Resend Code
        </button>
      </div>
    </div>
  )
}