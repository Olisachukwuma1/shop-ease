 
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import {
  MdDashboard,
  MdShoppingBag,
  MdCategory,
  MdShoppingCart,
  MdPeople,
  MdLogout,
} from 'react-icons/md'
import { MdLocalOffer } from 'react-icons/md'


export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-800 ${
      pathname === path ? 'bg-gray-800 text-white' : 'text-gray-400'
    }`

  return (
    <div className="w-52 min-h-screen bg-black text-white flex flex-col">
      <div className="px-4 py-5 border-b border-gray-700">
        <h1 className="text-base font-semibold">Shop Ease</h1>
        <p className="text-xs text-gray-400">Admin Panel</p>
      </div>
      <nav className="flex flex-col mt-2">
        <Link href="/dashboard" className={linkClass('/dashboard')}>
          <MdDashboard size={18} />
          Dashboard
        </Link>
        <Link href="/products" className={linkClass('/products')}>
          <MdShoppingBag size={18} />
          Products
        </Link>
        <Link href="/coupons" className={linkClass('/coupons')}>
  <MdLocalOffer size={18} />
  Coupons
</Link>
        <Link href="/categories" className={linkClass('/categories')}>
          <MdCategory size={18} />
          Categories
        </Link>
        <Link href="/orders" className={linkClass('/orders')}>
          <MdShoppingCart size={18} />
          Orders
        </Link>
        <Link href="/administrators" className={linkClass('/administrators')}>
          <MdPeople size={18} />
          Administrators
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm text-left text-gray-400 hover:bg-gray-800 hover:text-white transition mt-auto"
        >
          <MdLogout size={18} />
          Sign Out
        </button>
      </nav>
    </div>
  )
}