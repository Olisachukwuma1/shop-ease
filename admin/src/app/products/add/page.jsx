 
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct, updateProduct, getProduct } from '../../../store/slices/productSlice'
import { getCategories } from '../../../store/slices/categorySlice'
import Sidebar from '../../../components/Sidebar'
import ProtectedRoute from '../../../components/ProtectedRoute'
import { toast } from 'react-toastify'

function AddProductForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [discountPrice, setDiscountPrice] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [featured, setFeatured] = useState(false)
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])

  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const dispatch = useDispatch()
  const { categories } = useSelector((state) => state.categories)
  const { product, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(getCategories())
    if (editId) {
      dispatch(getProduct(editId))
    }
  }, [editId, dispatch])

  useEffect(() => {
    if (editId && product) {
      setName(product.name || '')
      setDescription(product.description || '')
      setPrice(product.price || '')
      setDiscountPrice(product.discountPrice || '')
      setCategory(product.category?._id || '')
      setStock(product.stock || '')
      setFeatured(product.featured || false)
      if (product.images) setPreviews(product.images)
    }
  }, [product, editId])

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    setPreviews(files.map((file) => URL.createObjectURL(file)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('discountPrice', discountPrice)
    formData.append('category', category)
    formData.append('stock', stock)
    formData.append('featured', featured)
    images.forEach((image) => formData.append('images', image))

    let result
    if (editId) {
      result = await dispatch(updateProduct({ id: editId, formData }))
    } else {
      result = await dispatch(createProduct(formData))
    }

    if (createProduct.fulfilled.match(result) || updateProduct.fulfilled.match(result)) {
      toast.success(editId ? 'Product updated successfully' : 'Product added successfully')
      router.push('/products')
    } else {
      toast.error(result.payload || 'Failed to save product')
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-gray-100 p-6">

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-800">
              {editId ? 'Edit Product' : 'Add Product'}
            </h1>
            <button
              onClick={() => router.push('/products')}
              className="text-sm text-blue-600 hover:underline"
            >
              Back to Products
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Price (₦)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Discount Price (₦) optional
                  </label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm text-gray-600">
                  Featured Product
                </label>
              </div>

              {/* Images */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Product Images (up to 5)
                </label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {previews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="imagesInput"
                  onChange={handleImagesChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('imagesInput').click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Upload Images
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
              </button>

            </form>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  )
}

export default function AddProduct() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddProductForm />
    </Suspense>
  )
}