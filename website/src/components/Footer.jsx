import Link from 'next/link'
import { FaFacebook, FaInstagram, FaXTwitter, FaWhatsapp, FaTiktok, FaYoutube } from 'react-icons/fa6'

export default function Footer() {
  // Update these links to your actual social media pages
  const socials = [
    { icon: <FaInstagram size={16} />, href: 'https://instagram.com/yourpage', label: 'Instagram' },
    { icon: <FaFacebook size={16} />, href: 'https://facebook.com/yourpage', label: 'Facebook' },
    { icon: <FaXTwitter size={16} />, href: 'https://x.com/yourpage', label: 'X (Twitter)' },
    { icon: <FaWhatsapp size={16} />, href: 'https://wa.me/2348012345678', label: 'WhatsApp' },
    { icon: <FaTiktok size={16} />, href: 'https://tiktok.com/@yourpage', label: 'TikTok' },
    { icon: <FaYoutube size={16} />, href: 'https://youtube.com/@yourpage', label: 'YouTube' },
  ]

  return (
    <footer style={{ background: 'var(--black)', color: '#888', padding: '4rem 5rem 2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid #222' }}>
        
        {/* Brand */}
        <div>
          <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
            Shop<span style={{ color: 'var(--gold)' }}>Ease</span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#666', maxWidth: '260px', marginBottom: '1.5rem' }}>
            Your premium destination for quality products. Delivered with care, designed for you.
          </p>
          {/* Social Media Icons */}
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                title={social.label}
                style={{
                  width: '38px',
                  height: '38px',
                  border: '1px solid #333',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--gold)'
                  e.currentTarget.style.color = 'var(--gold)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#333'
                  e.currentTarget.style.color = '#666'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'white', marginBottom: '1.2rem' }}>Shop</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {['All Products', 'New Arrivals', 'Best Sellers', 'Sale Items'].map(link => (
              <li key={link}>
                <Link href="/shop" style={{ textDecoration: 'none', color: '#666', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = '#666'}
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'white', marginBottom: '1.2rem' }}>Support</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {['FAQ', 'Shipping Info', 'Returns', 'Contact Us'].map(link => (
              <li key={link}>
                <a href="#" style={{ textDecoration: 'none', color: '#666', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = '#666'}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'white', marginBottom: '1.2rem' }}>Company</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'].map(link => (
              <li key={link}>
                <a href="#" style={{ textDecoration: 'none', color: '#666', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = '#666'}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#444', flexWrap: 'wrap', gap: '1rem' }}>
        <span>© {new Date().getFullYear()} ShopEase. All rights reserved.</span>
        <span style={{ fontSize: '0.75rem' }}>
          Secure payments by <span style={{ color: 'var(--gold)' }}>Paystack</span>
        </span>
      </div>
    </footer>
  )
}