'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../../store/slices/productSlice'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'

export default function Shop() {
  const dispatch = useDispatch()
  const { products = [], loading } = useSelector((state) => state.products || {})

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('latest')
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  useEffect(() => {
    let result = [...products]

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') result.sort((a, b) => b.price - a.price)
    if (sort === 'latest')
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    setFiltered(result)
  }, [products, search, sort])

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <Navbar />

      {/* HEADER */}
      <div className="relative bg-black px-6 sm:px-10 lg:px-20 py-12 lg:py-20 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(201,168,76,0.1),transparent_60%)]" />

        <div className="relative z-10">

          <p className="text-xs uppercase tracking-widest text-[var(--gold)] mb-2">
            Browse Our Collection
          </p>

          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            All Products
          </h1>

          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            {filtered.length} products available
          </p>

        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-[var(--cream)] border-b border-[var(--border)] px-6 sm:px-10 lg:px-20 py-4">

        <div className="flex flex-col md:flex-row gap-3 md:gap-6 md:items-center md:justify-between">

          {/* SEARCH */}
          <div className="relative w-full md:max-w-md">

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 bg-white rounded px-10 py-2 text-sm outline-none"
            />

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

          </div>

          {/* SORT */}
          <div className="flex items-center gap-2">

            <span className="text-xs text-gray-500 whitespace-nowrap">
              Sort:
            </span>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-300 bg-white rounded px-3 py-2 text-sm cursor-pointer"
            >
              <option value="latest">Latest</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>

          </div>

        </div>
      </div>

      {/* PRODUCTS */}
      <div className="px-6 sm:px-10 lg:px-20 py-10 flex-1">

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-[320px] bg-[var(--cream)] animate-pulse rounded"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-playfair text-xl mb-2">
              No products found
            </h3>
            <p className="text-gray-500 text-sm">
              Try a different search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>

      <Footer />
    </div>
  )
}