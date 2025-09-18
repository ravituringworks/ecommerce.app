import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'

// Force dynamic rendering to avoid build-time prerender of client-only components
export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const { getServerLocale, getDictionary } = await import('@/i18n/server')
  const locale = getServerLocale()
  const dict = getDictionary(locale)
  return {
    title: dict.meta?.siteTitle || 'ShopSmart',
    description: dict.meta?.siteDescription || 'Modern ecommerce store built with Next.js and Python',
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { getServerLocale } = await import('@/i18n/server')
  const locale = getServerLocale()
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
