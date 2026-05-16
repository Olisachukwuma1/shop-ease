'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/slices/authSlice'
import { toast } from 'react-toastify'
import { Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const router = useRouter()
  const { loading } = useSelector((state) => state.auth)

  const handleLogin = async (e) => {
    e.preventDefault()

    const result = await dispatch(login({ email, password }))

    if (login.fulfilled.match(result)) {
      toast.success('Login successful!')
      router.push('/dashboard')
    } else {
      toast.error(result.payload || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-10 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-2 text-gray-800">
          Shop Ease
        </h2>

        <p className="text-sm text-center text-gray-500 mb-6">
          Admin Panel
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}