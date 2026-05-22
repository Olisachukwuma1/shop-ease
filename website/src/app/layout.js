import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ReduxProvider from '../components/ReduxProvider'
import ToastProvider from '../components/ToastProvider'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import WhatsAppFloat from '../components/WhatsAppFloat'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '900'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Shop Ease',
  description: 'Shop the best products online',
  manifest: '/manifest.json',
  themeColor: '#0a0a0a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Shop Ease',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Shop Ease" />
      </head>
      <body>
        <ReduxProvider>
          {children}
          <ToastProvider />
           <WhatsAppFloat />
        </ReduxProvider>
      </body>
    </html>
  )
}