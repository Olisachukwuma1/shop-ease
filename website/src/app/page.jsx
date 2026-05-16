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
  const { products, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(getProducts({ featured: true }))
  }, [dispatch])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--white)' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 72px)' }}>
        <div style={{ background: 'var(--cream)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '5rem 4rem 5rem 5rem' }}>
          <span className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--gold-light)', color: '#8a6c28', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '0.4rem 1rem', borderRadius: '100px', width: 'fit-content', marginBottom: '1.5rem' }}>
            ✦ New Collection 2026
          </span>
          <h1 className="font-playfair animate-fade-up" style={{ fontSize: 'clamp(2.8rem, 4vw, 4.2rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '1.5rem' }}>
            Discover <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Premium</em> Products Online
          </h1>
          <p className="animate-fade-up" style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '420px', marginBottom: '2.5rem' }}>
            Curated luxury goods delivered to your doorstep. Experience shopping redefined with elegance and ease.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/shop" style={{ background: 'var(--gold)', color: 'var(--white)', border: 'none', padding: '0.85rem 2.2rem', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', borderRadius: '999px', textDecoration: 'none', transition: 'all 0.25s' }}>
              Shop Now
            </Link>
            <Link href="/shop" style={{ background: 'transparent', color: 'var(--black)', border: '1.5px solid var(--black)', padding: '0.85rem 2.2rem', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', borderRadius: '999px', textDecoration: 'none', transition: 'all 0.25s' }}>
              View All
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
            {[['12K+', 'Happy Customers'], ['850+', 'Products'], ['4.9★', 'Average Rating']].map(([num, label]) => (
              <div key={label}>
                <div className="font-playfair" style={{ fontSize: '1.8rem', fontWeight: 700 }}>{num}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.5px', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.15) 0%, transparent 60%)' }} />
          <div className="animate-float-up" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <div style={{ width: '280px', height: '340px', background: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem', margin: '0 auto 1.5rem', boxShadow: '0 32px 64px rgba(0,0,0,0.5)', border: '1px solid rgba(201,168,76,0.2)' }}>
              👜
            </div>
            <div className="font-playfair" style={{ color: 'var(--white)', fontSize: '1.1rem', marginBottom: '0.3rem' }}>Luxury Collection</div>
            <div style={{ color: 'var(--gold)', fontSize: '1.3rem', fontWeight: 600 }}>₦45,000</div>
          </div>
          <div className="animate-float" style={{ position: 'absolute', top: '20%', right: '8%', background: 'var(--gold)', color: 'var(--white)', fontSize: '0.7rem', fontWeight: 700, padding: '0.4rem 0.8rem', borderRadius: '100px' }}>-30% OFF</div>
          <div className="animate-float" style={{ position: 'absolute', bottom: '30%', left: '5%', background: 'var(--gold)', color: 'var(--white)', fontSize: '0.7rem', fontWeight: 700, padding: '0.4rem 0.8rem', borderRadius: '100px', animationDelay: '0.8s' }}>NEW IN</div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: 'var(--black)', color: 'var(--gold)', padding: '0.9rem 0', overflow: 'hidden', borderTop: '1px solid #222', borderBottom: '1px solid #222' }}>
        <div className="animate-marquee" style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap' }}>
          {['Free Shipping Over ₦20,000', 'New Arrivals Every Week', 'Secure Paystack Payments', '7-Day Returns Policy', 'Exclusive Members Deals',
            'Free Shipping Over ₦20,000', 'New Arrivals Every Week', 'Secure Paystack Payments', '7-Day Returns Policy', 'Exclusive Members Deals'].map((text, i) => (
            <span key={i} style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
              {text} <span style={{ width: '4px', height: '4px', background: 'var(--gold)', borderRadius: '50%', display: 'inline-block' }} />
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section style={{ padding: '6rem 5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Browse By</div>
            <h2 className="font-playfair" style={{ fontSize: '2.2rem', fontWeight: 700 }}>Shop Categories</h2>
          </div>
          <Link href="/shop" style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none' }}>View All →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {[['👗', 'Fashion', '142 Products'], ['📱', 'Electronics', '89 Products'], ['🏠', 'Home & Living', '203 Products'], ['💄', 'Beauty', '167 Products']].map(([icon, name, count]) => (
            <Link href="/shop" key={name} style={{ background: 'var(--cream)', borderRadius: '999px', padding: '2rem 1.5rem', textAlign: 'center', cursor: 'pointer', textDecoration: 'none', display: 'block', transition: 'transform 0.3s, box-shadow 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'var(--black)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'var(--cream)'; e.currentTarget.style.boxShadow = 'none' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>{icon}</span>
              <div className="font-playfair" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--black)', marginBottom: '0.3rem' }}>{name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{count}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <div style={{ padding: '2rem 5rem 6rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Handpicked For You</div>
            <h2 className="font-playfair" style={{ fontSize: '2.2rem', fontWeight: 700 }}>Featured Products</h2>
          </div>
          <Link href="/shop" style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none' }}>View All →</Link>
        </div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {[1,2,3,4].map(i => <div key={i} style={{ background: 'var(--cream)', borderRadius: '4px', height: '320px', animation: 'pulse 1.5s ease-in-out infinite' }} />)}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'var(--muted)' }}>No featured products yet</p>
            <Link href="/shop" style={{ color: 'var(--gold)', textDecoration: 'none', display: 'block', marginTop: '0.5rem' }}>Browse all products</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {products.slice(0, 8).map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        )}
      </div>

      {/* PROMO BANNER */}
      <div style={{ margin: '0 5rem 6rem', background: 'var(--black)', borderRadius: '6px', padding: '4rem 5rem', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '3rem', position: 'relative', overflow: 'hidden' }}>
        <div>
          <span style={{ display: 'inline-block', background: 'rgba(201,168,76,0.2)', color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '0.3rem 0.8rem', borderRadius: '2px', marginBottom: '1rem' }}>Limited Time Offer</span>
          <h2 className="font-playfair" style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--white)', lineHeight: 1.15, marginBottom: '1rem' }}>
            Get <span style={{ color: 'var(--gold)' }}>30% Off</span> Your<br />First Order Today
          </h2>
          <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '480px' }}>
            Use code <strong style={{ color: 'var(--gold)' }}>SHOPEASE30</strong> at checkout.
          </p>
          <div style={{ marginTop: '1.8rem' }}>
            <Link href="/shop" style={{ background: 'var(--gold)', color: 'var(--white)', padding: '0.85rem 2.2rem', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', borderRadius: '2px', textDecoration: 'none' }}>
              Claim Offer Now
            </Link>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <p style={{ color: '#666', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Offer Ends In</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {[['02', 'Days'], ['14', 'Hours'], ['38', 'Mins'], ['55', 'Secs']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.2)', padding: '0.8rem 1.2rem', borderRadius: '4px', minWidth: '64px' }}>
                <div className="font-playfair" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: '0.65rem', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <section style={{ padding: '6rem 5rem', background: 'var(--cream)' }}>
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>What They Say</div>
          <h2 className="font-playfair" style={{ fontSize: '2.2rem', fontWeight: 700 }}>Customer Reviews</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { stars: '★★★★★', text: '"Absolutely love the quality of products. The delivery was fast and everything was packaged beautifully!"', name: 'Amaka Okafor', location: 'Lagos, Nigeria', initial: 'A' },
            { stars: '★★★★★', text: '"The Paystack checkout was seamless and I received my order within 2 days. The leather bag is even more beautiful in person!"', name: 'Chidi Eze', location: 'Abuja, Nigeria', initial: 'C' },
            { stars: '★★★★☆', text: '"Great selection and competitive prices. Customer service was very helpful. ShopEase is my go-to now!"', name: 'Fatima Bello', location: 'Kaduna, Nigeria', initial: 'F' },
          ].map((t) => (
            <div key={t.name} style={{ background: 'var(--white)', padding: '2rem', borderRadius: '4px', border: '1px solid var(--border)', transition: 'transform 0.3s, box-shadow 0.3s' }}>
              <div style={{ color: 'var(--gold)', fontSize: '0.9rem', marginBottom: '1rem', letterSpacing: '2px' }}>{t.stars}</div>
              <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.5rem' }}>{t.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)', fontSize: '1rem', fontWeight: 600, flexShrink: 0 }}>{t.initial}</div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding: '6rem 5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <h2 className="font-playfair" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.8rem' }}>Stay in the Loop</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Subscribe to get exclusive deals and new arrivals.</p>
          <div style={{ display: 'flex', border: '1.5px solid var(--black)', borderRadius: '2px', overflow: 'hidden' }}>
            <input type="email" placeholder="Enter your email address" style={{ flex: 1, border: 'none', outline: 'none', padding: '0.9rem 1.2rem', fontSize: '0.875rem', background: 'transparent', color: 'var(--black)' }} />
            <button style={{ background: 'var(--black)', color: 'var(--white)', border: 'none', padding: '0.9rem 1.8rem', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px', cursor: 'pointer' }}>Subscribe</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}