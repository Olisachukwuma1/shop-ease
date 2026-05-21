'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'
import ProtectedRoute from '../../components/ProtectedRoute'
import { FaTrash, FaEdit } from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function Coupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/coupons`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCoupons(res.data)
    } catch (_err) {
      toast.error('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/coupons/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Coupon deleted successfully')
      fetchCoupons()
    } catch (_err) {
      toast.error('Failed to delete coupon')
    }
  }

  const handleToggle = async (id, isActive) => {
    try {
      const token = localStorage.getItem('token')
      const coupon = coupons.find(c => c._id === id)
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/coupons/${id}`,
        { ...coupon, isActive: !isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(`Coupon ${!isActive ? 'activated' : 'deactivated'}`)
      fetchCoupons()
    } catch (_err) {
      toast.error('Failed to update coupon')
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-gray-100 p-6">

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-800">Coupons</h1>
            <button
              onClick={() => router.push('/coupons/add')}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              + Add Coupon
            </button>
          </div>

          <div className="mb-3">
            <span className="text-sm text-gray-600">
              Total Records: {coupons.length}
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left px-4 py-3">Code</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Value</th>
                  <th className="text-left px-4 py-3">Min Order</th>
                  <th className="text-left px-4 py-3">Uses</th>
                  <th className="text-left px-4 py-3">Expires</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : coupons.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-400">
                      No coupons found
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr key={coupon._id} className="border-t border-gray-100">
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-blue-600">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 capitalize">
                        {coupon.discountType}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : `₦${coupon.discountValue.toLocaleString()}`}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {coupon.minOrderAmount > 0
                          ? `₦${coupon.minOrderAmount.toLocaleString()}`
                          : 'None'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {coupon.usedCount}
                        {coupon.maxUses ? ` / ${coupon.maxUses}` : ' / ∞'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {coupon.expiresAt ? (
                          <span className={new Date(coupon.expiresAt) < new Date() ? 'text-red-500' : 'text-gray-600'}>
                            {new Date(coupon.expiresAt).toLocaleDateString('en-GB')}
                          </span>
                        ) : (
                          <span className="text-gray-400">No expiry</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(coupon._id, coupon.isActive)}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            coupon.isActive
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-500'
                          }`}
                        >
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3 items-center">
                          <button
                            onClick={() => router.push(`/coupons/add?id=${coupon._id}`)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon._id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  )
} 
