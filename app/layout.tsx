import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'BearOps - Revenue Infrastructure in 12 Weeks',
  description: 'Scale Revenue Infrastructure - Clarity that Scales, Structure that Performs',
  // Security: Prevent indexing in development
  robots: process.env.NODE_ENV === 'production' ? 'index, follow' : 'noindex, nofollow',
  // Security: Referrer policy
  referrer: 'strict-origin-when-cross-origin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Security: Prevent MIME type sniffing */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        {/* Security: Prevent clickjacking */}
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
