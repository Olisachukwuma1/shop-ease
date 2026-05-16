 
'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { getProducts, deleteProduct } from '../../store/slices/productSlice'
import Sidebar from '../../components/Sidebar'
import ProtectedRoute from '../../components/ProtectedRoute'
import { FaTrash, FaEdit } from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function Products() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { products, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    const result = await dispatch(deleteProduct(id))
    if (deleteProduct.fulfilled.match(result)) {
      toast.success('Product deleted successfully')
    } else {
      toast.error('Failed to delete product')
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-gray-100 p-6">

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-800">Products</h1>
            <button
              onClick={() => router.push('/products/add')}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              + Add Product
            </button>
          </div>

          <div className="mb-3">
            <span className="text-sm text-gray-600">
              Total Records: {products.length}
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Image</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-left px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-400">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-gray-600">
                        {product._id.toString().slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{product.name}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {product.category?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        ₦{product.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.stock > 0
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3 items-center">
                          <button
                            onClick={() => router.push(`/products/add?id=${product._id}`)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
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