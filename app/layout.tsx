import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' })

export const metadata: Metadata = {
  title: 'rolecaller app',
  description: 'rolecaller app',
  generator: 'rolecaller app',
  icons: {
    icon: [
      {
        url: '/r. (2).png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/r. (2).png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/r. (2).png',
        type: 'image/png',
      },
    ],
    apple: '/r. (2).png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
