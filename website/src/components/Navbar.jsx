'use client'

import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { logout } from '../store/slices/authSlice'
import { MdShoppingCart, MdLogout, MdLogin } from 'react-icons/md'
import getUser from '../utils/getUser'

export default function Navbar() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { totalItems } = useSelector((state) => state.cart)

  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setMounted(true)
    setUser(getUser())
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  if (!mounted) return null

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '1.3rem',
            fontWeight: 700,
            color: 'var(--black)',
            textDecoration: 'none',
          }}
        >
          Shop<span style={{ color: '#c9a84c' }}>Ease</span>
        </Link>

        <div className="flex items-center gap-5">

          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition">
            Home
          </Link>

          <Link href="/shop" className="text-sm text-gray-600 hover:text-blue-600 transition">
            Shop
          </Link>

          {user && (
            <Link href="/orders" className="text-sm text-gray-600 hover:text-blue-600 transition">
              My Orders
            </Link>
          )}

          <Link href="/cart" className="relative">
            <MdShoppingCart
              size={24}
              className="text-gray-600 hover:text-blue-600 transition"
            />

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden md:block">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 transition"
              >
                <MdLogout size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
            >
              <MdLogin size={18} />
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  )
}