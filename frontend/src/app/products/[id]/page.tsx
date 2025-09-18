import type { Metadata } from 'next'
import PDPClient from './PDPClient'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id
  const locale = typeof params?.id === 'string' ? undefined : undefined
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const res = await fetch(`${base}/api/products/${id}`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error('Not found')
    const product = await res.json()
    const name = product.name as string
    const { getServerLocale, getDictionary } = await import('@/i18n/server')
    const locale = getServerLocale()
    const dict = getDictionary(locale)
    const title = `${name} | ${dict.meta?.siteTitle || 'ShopSmart'}`
    const description = (product.description?.slice(0, 160)) || (typeof dict.meta?.productFallbackDescription === 'function' ? dict.meta.productFallbackDescription(name) : `Buy ${name} at the best price.`)
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: product.image_url ? [{ url: product.image_url } as any] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    }
  } catch (_) {
    const { getServerLocale, getDictionary } = await import('@/i18n/server')
    const locale = getServerLocale()
    const dict = getDictionary(locale)
    return {
      title: `${dict.meta?.productWord || 'Product'} | ${dict.meta?.siteTitle || 'ShopSmart'}`,
      description: typeof dict.meta?.productFallbackDescription === 'function' ? dict.meta.productFallbackDescription(undefined) : 'View product details and buy online.'
    }
  }
}

export default function Page() {
  return <PDPClient />
}

