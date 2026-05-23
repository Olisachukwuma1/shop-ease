'use client'

import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { logout } from '../store/slices/authSlice'
import {
  MdShoppingCart,
  MdLogout,
  MdLogin,
  MdMenu,
  MdClose,
} from 'react-icons/md'
import getUser from '../utils/getUser'

export default function Navbar() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { totalItems } = useSelector((state) => state.cart)

  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState(null)
  const [mobileMenu, setMobileMenu] = useState(false)

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
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold"
          style={{
            fontFamily: 'var(--font-playfair)',
            color: 'var(--black)',
          }}
        >
          Shop<span className="text-[#c9a84c]">Ease</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">

          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-[#b8922e] transition"
          >
            Home
          </Link>

          <Link
            href="/shop"
            className="text-sm text-gray-600 hover:text-[#b8922e] transition"
          >
            Shop
          </Link>

          {user && (
            <Link
              href="/orders"
              className="text-sm text-gray-600 hover:text-[#b8922e] transition"
            >
              My Orders
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative">
            <MdShoppingCart
              size={24}
              className="text-gray-600 hover:text-[#b8922e] transition"
            />

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#c9a84c] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-[#b8922e] transition"
              >
                <MdLogout size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 text-sm text-[#b8922e] hover:text-[#a07c22] transition"
            >
              <MdLogin size={18} />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="flex md:hidden items-center gap-4">

          {/* Cart */}
          <Link href="/cart" className="relative">
            <MdShoppingCart size={24} className="text-gray-700" />

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#c9a84c] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Hamburger */}
          <button onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? (
              <MdClose size={28} />
            ) : (
              <MdMenu size={28} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 flex flex-col gap-4">

          <Link
            href="/"
            onClick={() => setMobileMenu(false)}
            className="text-gray-700 hover:text-[#b8922e]"
          >
            Home
          </Link>

          <Link
            href="/shop"
            onClick={() => setMobileMenu(false)}
            className="text-gray-700 hover:text-[#b8922e]"
          >
            Shop
          </Link>

          {user && (
            <Link
              href="/orders"
              onClick={() => setMobileMenu(false)}
              className="text-gray-700 hover:text-[#b8922e]"
            >
              My Orders
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500"
            >
              <MdLogout />
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 text-[#b8922e]"
            >
              <MdLogin />
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}