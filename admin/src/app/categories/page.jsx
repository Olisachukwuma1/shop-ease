 
'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { getCategories, deleteCategory } from '../../store/slices/categorySlice'
import Sidebar from '../../components/Sidebar'
import ProtectedRoute from '../../components/ProtectedRoute'
import { FaTrash, FaEdit } from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function Categories() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { categories, loading } = useSelector((state) => state.categories)

  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    const result = await dispatch(deleteCategory(id))
    if (deleteCategory.fulfilled.match(result)) {
      toast.success('Category deleted successfully')
    } else {
      toast.error('Failed to delete category')
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-gray-100 p-6">

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-800">Categories</h1>
            <button
              onClick={() => router.push('/categories/add')}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              + Add Category
            </button>
          </div>

          <div className="mb-3">
            <span className="text-sm text-gray-600">
              Total Records: {categories.length}
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Image</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Description</th>
                  <th className="text-left px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-400">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category._id} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-gray-600">
                        {category._id.toString().slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{category.name}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {category.description || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3 items-center">
                          <button
                            onClick={() => router.push(`/categories/add?id=${category._id}`)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
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