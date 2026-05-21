 
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import Sidebar from '../../../components/Sidebar'
import ProtectedRoute from '../../../components/ProtectedRoute'
import { toast } from 'react-toastify'

function AddCouponForm() {
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState('percentage')
  const [discountValue, setDiscountValue] = useState('')
  const [minOrderAmount, setMinOrderAmount] = useState('')
  const [maxUses, setMaxUses] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')

  useEffect(() => {
    if (editId) {
      const fetchCoupon = async () => {
        try {
          const token = localStorage.getItem('token')
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/coupons`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          const coupon = res.data.find(c => c._id === editId)
          if (coupon) {
            setCode(coupon.code)
            setDiscountType(coupon.discountType)
            setDiscountValue(coupon.discountValue)
            setMinOrderAmount(coupon.minOrderAmount || '')
            setMaxUses(coupon.maxUses || '')
            setExpiresAt(coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '')
            setIsActive(coupon.isActive)
          }
        } catch (_err) {
          toast.error('Failed to load coupon')
        }
      }
      fetchCoupon()
    }
  }, [editId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const data = {
        code,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
        maxUses: maxUses ? Number(maxUses) : null,
        expiresAt: expiresAt || null,
        isActive,
      }

      if (editId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/coupons/${editId}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        toast.success('Coupon updated successfully')
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/coupons`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        toast.success('Coupon created successfully')
      }

      router.push('/coupons')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-gray-100 p-6">

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-800">
              {editId ? 'Edit Coupon' : 'Add Coupon'}
            </h1>
            <button
              onClick={() => router.push('/coupons')}
              className="text-sm text-blue-600 hover:underline"
            >
              Back to Coupons
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Code */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium uppercase tracking-wide">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  placeholder="e.g. SAVE20"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800 font-mono"
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium uppercase tracking-wide">
                  Discount Type
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₦)</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium uppercase tracking-wide">
                  Discount Value {discountType === 'percentage' ? '(%)' : '(₦)'}
                </label>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  required
                  min="1"
                  max={discountType === 'percentage' ? 100 : undefined}
                  placeholder={discountType === 'percentage' ? 'e.g. 20' : 'e.g. 5000'}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
                />
              </div>

              {/* Min Order Amount */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium uppercase tracking-wide">
                  Minimum Order Amount (₦) — optional
                </label>
                <input
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  min="0"
                  placeholder="e.g. 10000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
                />
              </div>

              {/* Max Uses */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium uppercase tracking-wide">
                  Maximum Uses — optional (leave empty for unlimited)
                </label>
                <input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  min="1"
                  placeholder="e.g. 100"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
                />
              </div>

              {/* Expires At */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium uppercase tracking-wide">
                  Expiry Date — optional
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
                />
              </div>

              {/* Is Active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm text-gray-600">
                  Active (users can apply this coupon)
                </label>
              </div>

              {/* Preview */}
              {discountValue && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-600 font-medium">Preview:</p>
                  <p className="text-sm text-blue-800 mt-1">
                    Code <strong>{code || 'COUPON'}</strong> gives{' '}
                    <strong>
                      {discountType === 'percentage'
                        ? `${discountValue}% off`
                        : `₦${Number(discountValue).toLocaleString()} off`}
                    </strong>
                    {minOrderAmount && ` on orders above ₦${Number(minOrderAmount).toLocaleString()}`}
                    {maxUses && ` (max ${maxUses} uses)`}
                    {expiresAt && ` — expires ${new Date(expiresAt).toLocaleDateString('en-GB')}`}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : editId ? 'Update Coupon' : 'Create Coupon'}
              </button>

            </form>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  )
}

export default function AddCoupon() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddCouponForm />
    </Suspense>
  )
}