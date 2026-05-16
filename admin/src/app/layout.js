import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ReduxProvider from '../components/ReduxProvider'
import ToastProvider from '../components/ToastProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Shop Ease Admin',
  description: 'Shop Ease Admin Panel',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ReduxProvider>
          {children}
          <ToastProvider />
        </ReduxProvider>
      </body>
    </html>
  )
}