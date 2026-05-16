'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register } from '../../store/slices/authSlice'
import { toast } from 'react-toastify'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading } = useSelector((state) => state.auth)

  const handleRegister = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    const result = await dispatch(register({ name, email, password }))
    if (register.fulfilled.match(result)) {
      toast.success('Account created successfully!')
      router.push('/login')
    } else {
      toast.error(result.payload || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-10 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-2 text-gray-800">
          Create Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Sign up to get started
        </p>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>

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

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
} 
