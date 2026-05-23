'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../store/slices/productSlice'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Link from 'next/link'

export default function Home() {
  const dispatch = useDispatch()

  const { products = [], loading } = useSelector(
    (state) => state.products || {}
  )

  useEffect(() => {
    dispatch(getProducts({ featured: true }))
  }, [dispatch])

  return (
    <div className="min-h-screen flex flex-col bg-[var(--white)]">

      <Navbar />

      {/* HERO SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-72px)]">

        {/* LEFT */}
        <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 lg:py-20 bg-[var(--cream)]">

          <span className="inline-flex items-center gap-2 bg-[var(--gold-light)] text-[#8a6c28] text-xs font-semibold uppercase tracking-widest px-4 py-1 rounded-full mb-6 w-fit">
            ✦ New Collection 2026
          </span>

          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Discover <em className="italic text-[var(--gold)]">Premium</em> Products Online
          </h1>

          <p className="text-[var(--muted)] max-w-md leading-relaxed mb-8">
            Curated luxury goods delivered to your doorstep. Experience shopping redefined with elegance and ease.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="bg-[var(--gold)] text-white px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-widest text-center hover:scale-105 transition"
            >
              Shop Now
            </Link>

            <Link
              href="/shop"
              className="border border-black text-black px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-widest text-center hover:bg-black hover:text-white transition"
            >
              View All
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-[var(--border)]">
            {[
              ['12K+', 'Happy Customers'],
              ['850+', 'Products'],
              ['4.9★', 'Average Rating'],
            ].map(([num, label]) => (
              <div key={label} className="min-w-[100px]">
                <div className="font-playfair text-2xl font-bold">{num}</div>
                <div className="text-xs text-[var(--muted)] uppercase tracking-wider mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex items-center justify-center bg-black overflow-hidden py-16 md:py-0">

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(201,168,76,0.15),transparent_60%)]" />

          <div className="relative z-10 text-center animate-float-up">

            <div className="w-[240px] h-[300px] sm:w-[280px] sm:h-[340px] bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-lg flex items-center justify-center text-6xl mx-auto mb-6 shadow-2xl border border-[rgba(201,168,76,0.2)]">
              👜
            </div>

            <div className="font-playfair text-white text-lg">
              Luxury Collection
            </div>

            <div className="text-[var(--gold)] text-xl font-semibold">
              ₦45,000
            </div>
          </div>

          <div className="absolute top-10 right-8 bg-[var(--gold)] text-white text-xs font-bold px-3 py-1 rounded-full animate-float">
            -30% OFF
          </div>

          <div className="absolute bottom-16 left-6 bg-[var(--gold)] text-white text-xs font-bold px-3 py-1 rounded-full animate-float delay-700">
            NEW IN
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-black text-[var(--gold)] py-3 overflow-hidden border-y border-[#222]">
        <div className="flex gap-10 whitespace-nowrap animate-marquee">
          {Array(2)
            .fill([
              'Free Shipping Over ₦20,000',
              'New Arrivals Every Week',
              'Secure Paystack Payments',
              '7-Day Returns Policy',
              'Exclusive Deals',
            ])
            .flat()
            .map((text, i) => (
              <span key={i} className="text-xs uppercase tracking-widest flex items-center gap-4">
                {text}
                <span className="w-1 h-1 bg-[var(--gold)] rounded-full" />
              </span>
            ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="px-6 sm:px-12 lg:px-20 py-20">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">

          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--gold)] mb-2">
              Browse By
            </p>
            <h2 className="font-playfair text-3xl font-bold">
              Shop Categories
            </h2>
          </div>

          <Link href="/shop" className="text-sm text-[var(--muted)]">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">

          {[
            ['👗', 'Fashion', '142 Products'],
            ['📱', 'Electronics', '89 Products'],
            ['🏠', 'Home & Living', '203 Products'],
            ['💄', 'Beauty', '167 Products'],
          ].map(([icon, name, count]) => (
            <Link
              key={name}
              href="/shop"
              className="bg-[var(--cream)] rounded-2xl p-6 text-center transition-all hover:-translate-y-1 hover:bg-black hover:text-white"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <div className="font-playfair font-semibold">{name}</div>
              <div className="text-xs text-[var(--muted)]">{count}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="px-6 sm:px-12 lg:px-20 pb-24">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">

          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--gold)] mb-2">
              Handpicked For You
            </p>
            <h2 className="font-playfair text-3xl font-bold">
              Featured Products
            </h2>
          </div>

          <Link href="/shop" className="text-sm text-[var(--muted)]">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[320px] bg-[var(--cream)] rounded animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-[var(--muted)]">
            No featured products yet
            <Link href="/shop" className="block text-[var(--gold)] mt-2">
              Browse all products →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}