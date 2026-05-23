
 
'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct } from '../../../store/slices/productSlice'
import { addToCart } from '../../../store/slices/cartSlice'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { toast } from 'react-toastify'
import { useParams, useRouter } from 'next/navigation'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const router = useRouter()
  const { product, loading } = useSelector((state) => state.products)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (id) dispatch(getProduct(id))
  }, [id, dispatch])

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product))
    }
    toast.success(`${quantity} item(s) added to cart!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--white)' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--muted)' }}>Loading...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--white)' }}>
      <Navbar />

      <div style={{ padding: '4rem 5rem', flex: 1 }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
          <span onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>Home</span>
          <span>/</span>
          <span onClick={() => router.push('/shop')} style={{ cursor: 'pointer' }}>Shop</span>
          <span>/</span>
          <span style={{ color: 'var(--black)', fontWeight: 500 }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>

          {/* Images */}
          <div>
            <div style={{ background: 'var(--cream)', borderRadius: '4px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '1rem' }}>
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ fontSize: '8rem' }}>📦</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    style={{ width: '72px', height: '72px', background: 'var(--cream)', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', border: selectedImage === index ? '2px solid var(--gold)' : '2px solid transparent', transition: 'border 0.2s' }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
              {product.category?.name || 'Uncategorized'}
            </div>
            <h1 className="font-playfair" style={{ fontSize: '2.2rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem', color: 'var(--black)' }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              {product.discountPrice ? (
                <>
                  <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--black)' }}>
                    ₦{product.discountPrice.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--muted)', textDecoration: 'line-through' }}>
                    ₦{product.price.toLocaleString()}
                  </span>
                  <span style={{ background: '#fdf0ee', color: '#d4462a', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '2px' }}>
                    -{Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--black)' }}>
                  ₦{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: product.stock > 0 ? '#22c55e' : '#ef4444' }} />
              <span style={{ fontSize: '0.85rem', color: product.stock > 0 ? '#22c55e' : '#ef4444', fontWeight: 500 }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.7, marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
              {product.description}
            </p>

            {/* Quantity */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.8rem' }}>
                Quantity
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: '2px', width: 'fit-content' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '40px', height: '40px', border: 'none', background: 'transparent', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--black)' }}
                >
                  −
                </button>
                <span style={{ padding: '0 1rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--black)', minWidth: '40px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  style={{ width: '40px', height: '40px', border: 'none', background: 'transparent', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--black)' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{ flex: 1, background: 'var(--gold)', color: 'var(--white)', border: 'none', padding: '1rem 2rem', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px', transition: 'all 0.25s', opacity: product.stock === 0 ? 0.5 : 1 }}
              >
                Add to Cart
              </button>
              <button
                onClick={() => { handleAddToCart(); router.push('/cart') }}
                disabled={product.stock === 0}
                style={{ flex: 1, background: 'var(--black)', color: 'var(--white)', border: 'none', padding: '1rem 2rem', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px', transition: 'all 0.25s', opacity: product.stock === 0 ? 0.5 : 1 }}
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[['🚚', 'Free delivery on orders over ₦20,000'], ['🔒', 'Secure Paystack payment'], ['↩️', '7-day return policy']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}