 
'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../../store/slices/productSlice'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'

export default function Shop() {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.products)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('latest')
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  useEffect(() => {
    let result = [...products]
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') result.sort((a, b) => b.price - a.price)
    if (sort === 'latest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    setFiltered(result)
  }, [products, search, sort])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--white)' }}>
      <Navbar />

      {/* Page Header */}
      <div style={{ background: 'var(--black)', padding: '4rem 5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.1) 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
            Browse Our Collection
          </div>
          <h1 className="font-playfair" style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--white)', lineHeight: 1.1 }}>
            All Products
          </h1>
          <p style={{ color: '#888', marginTop: '0.8rem', fontSize: '0.95rem' }}>
            {filtered.length} products available
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: '1.5rem 5rem', background: 'var(--cream)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', border: '1.5px solid var(--border)', background: 'var(--white)', borderRadius: '2px', padding: '0.7rem 1rem 0.7rem 2.5rem', fontSize: '0.875rem', outline: 'none', color: 'var(--black)' }}
          />
          <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>🔍</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ border: '1.5px solid var(--border)', background: 'var(--white)', borderRadius: '2px', padding: '0.7rem 1rem', fontSize: '0.875rem', outline: 'none', color: 'var(--black)', cursor: 'pointer' }}
          >
            <option value="latest">Latest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products */}
      <div style={{ padding: '4rem 5rem', flex: 1 }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} style={{ background: 'var(--cream)', borderRadius: '4px', height: '360px' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3 className="font-playfair" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No products found</h3>
            <p style={{ color: 'var(--muted)' }}>Try a different search term</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {filtered.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}