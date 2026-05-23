import Link from 'next/link'
import { FaFacebook, FaInstagram, FaXTwitter, FaWhatsapp, FaTiktok, FaYoutube } from 'react-icons/fa6'

export default function Footer() {
  const socials = [
    { icon: <FaInstagram size={16} />, href: 'https://instagram.com/yourpage', label: 'Instagram' },
    { icon: <FaFacebook size={16} />, href: 'https://facebook.com/yourpage', label: 'Facebook' },
    { icon: <FaXTwitter size={16} />, href: 'https://x.com/yourpage', label: 'X (Twitter)' },
    { icon: <FaWhatsapp size={16} />, href: 'https://wa.me/2348012345678', label: 'WhatsApp' },
    { icon: <FaTiktok size={16} />, href: 'https://tiktok.com/@yourpage', label: 'TikTok' },
    { icon: <FaYoutube size={16} />, href: 'https://youtube.com/@yourpage', label: 'YouTube' },
  ]

  return (
    <footer
      style={{ background: 'var(--black)', color: '#888' }}
      className="px-4 sm:px-8 lg:px-20 pt-16 pb-8"
    >
      {/* TOP GRID */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 mb-10 border-b border-[#222]"
      >

        {/* Brand */}
        <div>
          <div style={{ fontFamily: 'var(--font-playfair)' }} className="text-xl font-bold text-white mb-4">
            Shop<span style={{ color: 'var(--gold)' }}>Ease</span>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-[#666] max-w-xs mb-6">
            Your premium destination for quality products. Delivered with care, designed for you.
          </p>

          {/* Social Icons */}
          <div className="flex flex-wrap gap-3">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                title={social.label}
                className="w-9 h-9 sm:w-10 sm:h-10 border border-[#333] rounded-full flex items-center justify-center text-[#666] transition"
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

        {/* Shop */}
        <div>
          <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4">
            Shop
          </h4>
          <ul className="flex flex-col gap-2 text-sm">
            {['All Products', 'New Arrivals', 'Best Sellers', 'Sale Items'].map(link => (
              <li key={link}>
                <Link
                  href="/shop"
                  className="text-[#666] hover:text-[var(--gold)] transition"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4">
            Support
          </h4>
          <ul className="flex flex-col gap-2 text-sm">
            {['FAQ', 'Shipping Info', 'Returns', 'Contact Us'].map(link => (
              <li key={link}>
                <a
                  href="#"
                  className="text-[#666] hover:text-[var(--gold)] transition"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4">
            Company
          </h4>
          <ul className="flex flex-col gap-2 text-sm">
            {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'].map(link => (
              <li key={link}>
                <a
                  href="#"
                  className="text-[#666] hover:text-[var(--gold)] transition"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between text-xs text-[#444]">
        <span>© {new Date().getFullYear()} ShopEase. All rights reserved.</span>
        <span>
          Secure payments by <span className="text-[var(--gold)]">Paystack</span>
        </span>
      </div>
    </footer>
  )
}