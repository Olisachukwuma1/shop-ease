 
'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../../store/slices/productSlice'
import { getOrders } from '../../store/slices/orderSlice'
import { getCategories } from '../../store/slices/categorySlice'
import Sidebar from '../../components/Sidebar'
import ProtectedRoute from '../../components/ProtectedRoute'
import getUser from '../../utils/getUser'

export default function Dashboard() {
  const dispatch = useDispatch()
  const { products } = useSelector((state) => state.products)
  const { orders } = useSelector((state) => state.orders)
  const { categories } = useSelector((state) => state.categories)
  const user = getUser()

  useEffect(() => {
    dispatch(getProducts())
    dispatch(getOrders())
    dispatch(getCategories())
  }, [dispatch])

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((acc, o) => acc + o.totalAmount, 0)

  const pendingOrders = orders.filter((o) => o.orderStatus === 'processing').length
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'delivered').length

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-gray-100 p-6">

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            <span className="text-sm text-blue-600">
              Welcome, {user?.name || 'Admin'}
            </span>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Total Products</p>
              <p className="text-3xl font-semibold text-blue-600">
                {products.length}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <p className="text-3xl font-semibold text-green-600">
                {orders.length}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <p className="text-3xl font-semibold text-purple-600">
                ₦{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Categories</p>
              <p className="text-3xl font-semibold text-orange-600">
                {categories.length}
              </p>
            </div>
          </div>

          {/* Orders summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Pending Orders</p>
              <p className="text-3xl font-semibold text-yellow-600">
                {pendingOrders}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Delivered Orders</p>
              <p className="text-3xl font-semibold text-green-600">
                {deliveredOrders}
              </p>
            </div>
          </div>

          {/* Recent orders */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-base font-semibold mb-4 text-gray-800">
              Recent Orders
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left px-4 py-3">Order ID</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Payment</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-gray-600">
                        {order._id.toString().slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {order.user?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        ₦{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.orderStatus === 'delivered'
                            ? 'bg-green-100 text-green-600'
                            : order.orderStatus === 'shipped'
                            ? 'bg-blue-100 text-blue-600'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-600'
                            : order.paymentStatus === 'failed'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {order.paymentStatus}
                        </span>
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