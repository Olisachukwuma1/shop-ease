 
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { createCategory, updateCategory } from '../../../store/slices/categorySlice'
import Sidebar from '../../../components/Sidebar'
import ProtectedRoute from '../../../components/ProtectedRoute'
import { toast } from 'react-toastify'
import axios from 'axios'

function AddCategoryForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.categories)

  useEffect(() => {
    if (editId) {
      const fetchCategory = async () => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${editId}`
          )
          setName(res.data.name || '')
          setDescription(res.data.description || '')
          if (res.data.image) setPreview(res.data.image)
        } catch (_err) {
          toast.error('Failed to load category')
        }
      }
      fetchCategory()
    }
  }, [editId])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    if (image) formData.append('image', image)

    let result
    if (editId) {
      result = await dispatch(updateCategory({ id: editId, formData }))
    } else {
      result = await dispatch(createCategory(formData))
    }

    if (createCategory.fulfilled.match(result) || updateCategory.fulfilled.match(result)) {
      toast.success(editId ? 'Category updated successfully' : 'Category added successfully')
      router.push('/categories')
    } else {
      toast.error(result.payload || 'Failed to save category')
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-gray-100 p-6">

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-800">
              {editId ? 'Edit Category' : 'Add Category'}
            </h1>
            <button
              onClick={() => router.push('/categories')}
              className="text-sm text-blue-600 hover:underline"
            >
              Back to Categories
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Category Image (optional)
                </label>
                <div className="border border-dashed border-gray-300 rounded-lg h-28 flex items-center justify-center overflow-hidden mb-2">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Image preview</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="imageInput"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('imageInput').click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Upload Image
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : editId ? 'Update Category' : 'Add Category'}
              </button>

            </form>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  )
}

export default function AddCategory() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddCategoryForm />
    </Suspense>
  )
}