 
'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '../../store/slices/authSlice'
import { toast } from 'react-toastify'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'

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
      router.push('/verify')
    } else {
      toast.error(result.payload || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-10 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-2 text-gray-800">
          Welcome Back
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Login to your account
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}