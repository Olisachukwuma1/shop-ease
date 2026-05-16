 
'use client'

import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { MdShoppingCart } from 'react-icons/md'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleAddToCart = (e) => {
    e.stopPropagation()
    dispatch(addToCart(product))
    toast.success('Added to cart!')
  }

  return (
    <div
      onClick={() => router.push(`/shop/${product._id}`)}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
    >
      {/* Product Image */}
      {product.images && product.images.length > 0 ? (
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500" />
      )}

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          {product.category?.name || 'Uncategorized'}
        </p>

        <div className="flex items-center justify-between">
          <div>
            {product.discountPrice ? (
              <div>
                <p className="text-sm font-bold text-blue-600">
                  ₦{product.discountPrice.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 line-through">
                  ₦{product.price.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-sm font-bold text-blue-600">
                ₦{product.price.toLocaleString()}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdShoppingCart size={14} />
            {product.stock === 0 ? 'Out of stock' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}