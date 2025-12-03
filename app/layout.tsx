import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
