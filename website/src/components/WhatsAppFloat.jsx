'use client'

import { useState } from 'react'



export default function WhatsAppFloat() {
  const [hover, setHover] = useState(false)

  const phoneNumber = '2349094500728' // remove "+"

  const message = encodeURIComponent(
    "Hi 👋 I'm interested in your products on Shop Ease"
  )

  const link = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <>
      {/* Pulse Animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6);
          }
          70% {
            transform: scale(1.08);
            box-shadow: 0 0 0 18px rgba(37, 211, 102, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }

        .whatsapp-btn {
          animation: pulse 2.2s infinite;
        }

        .whatsapp-btn:hover {
          animation: none;
          transform: scale(1.12);
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
        }}
      >
        {/* Tooltip */}
<div
  style={{
    position: 'absolute',
    right: '70px',
    top: '50%',
    transform: hover
      ? 'translateY(-50%) translateX(0)'
      : 'translateY(-50%) translateX(10px)',
    background: '#111',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '0.3px',
    whiteSpace: 'nowrap',
    opacity: hover ? 1 : 0,
    pointerEvents: 'none',
    transition: 'all 0.25s ease',
    boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
  }}
>
  Chat with us on WhatsApp 💬
</div>
        {/* Button */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="whatsapp-btn"
          style={{
            width: '55px',
            height: '55px',
            background: '#25D366',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            textDecoration: 'none',
            transition: 'transform 0.2s ease',
          }}
        >
          {/* WhatsApp Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M20.52 3.48A11.8 11.8 0 0012.06 0C5.46 0 .12 5.34.12 11.94c0 2.1.54 4.14 1.56 5.94L0 24l6.3-1.62a11.94 11.94 0 005.7 1.44h.01c6.6 0 11.94-5.34 11.94-11.94 0-3.18-1.26-6.18-3.42-8.4zM12.06 21.84a9.9 9.9 0 01-5.04-1.38l-.36-.2-3.72.96.99-3.63-.24-.37a9.9 9.9 0 01-1.56-5.28c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.1 1.02 6.96 2.88a9.78 9.78 0 012.88 6.96c0 5.46-4.44 9.9-9.81 9.9zm5.7-7.62c-.3-.15-1.8-.9-2.1-1.02-.27-.1-.48-.15-.69.15-.21.3-.81 1.02-.99 1.23-.18.21-.36.24-.66.09-.3-.15-1.26-.46-2.4-1.47-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.61.14-.14.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.36-.03-.51-.08-.15-.69-1.65-.95-2.26-.25-.6-.51-.52-.69-.53h-.59c-.2 0-.51.08-.78.36-.27.3-1.02 1-1.02 2.44s1.05 2.84 1.2 3.04c.15.2 2.07 3.15 5.01 4.42.7.3 1.25.48 1.68.61.71.23 1.35.2 1.86.12.57-.09 1.8-.74 2.05-1.46.25-.72.25-1.34.18-1.46-.08-.12-.27-.2-.57-.35z" />
          </svg>
        </a>
      </div>
    </>
  )
}