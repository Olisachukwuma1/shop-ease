 
'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrders, updateOrderStatus } from '../../store/slices/orderSlice'
import Sidebar from '../../components/Sidebar'
import ProtectedRoute from '../../components/ProtectedRoute'
import { toast } from 'react-toastify'

export default function Orders() {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(getOrders())
  }, [dispatch])

  const handleStatusChange = async (id, orderStatus) => {
    const result = await dispatch(updateOrderStatus({ id, orderStatus }))
    if (updateOrderStatus.fulfilled.match(result)) {
      toast.success('Order status updated')
    } else {
      toast.error('Failed to update order status')
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-gray-100 p-6">

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-800">Orders</h1>
            <span className="text-sm text-gray-600">
              Total Records: {orders.length}
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Items</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Payment</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-gray-600">
                        {order._id.toString().slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <p>{order.user?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {order.items.length} item(s)
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        ₦{order.totalAmount.toLocaleString()}
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
                      <td className="px-4 py-3">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${
                            order.orderStatus === 'delivered'
                              ? 'bg-green-100 text-green-600'
                              : order.orderStatus === 'shipped'
                              ? 'bg-blue-100 text-blue-600'
                              : order.orderStatus === 'cancelled'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-yellow-100 text-yellow-600'
                          }`}
                        >
                          <option value="processing">processing</option>
                          <option value="shipped">shipped</option>
                          <option value="delivered">delivered</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-GB')}
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