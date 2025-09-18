'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { Minus, Plus, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { useEffect, useState, useMemo } from 'react'
import { useI18n } from '@/hooks/useI18n'
import { localizeProductName, localizeProductDescription } from '@/i18n/productContent'

export default function PDPClient() {
  const { t, locale } = useI18n()
  const params = useParams()
  const productId = Number(params?.id)
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()

  const { data: product, isLoading, error } = useQuery(
    ['product', productId],
    () => api.getProduct(productId),
    { enabled: !isNaN(productId) }
  )

  // Fetch more products to show related items
  const { data: allProducts } = useQuery(
    ['products', 0, 50],
    () => api.getProducts(0, 50),
    { enabled: true }
  )

  const relatedProducts = useMemo(() => {
    if (!product || !allProducts) return []
    return allProducts
      .filter(p => p.id !== product.id && p.category && p.category === product.category)
      .slice(0, 4)
  }, [product, allProducts])

  // Quantity selector
  const [quantity, setQuantity] = useState(1)
  useEffect(() => {
    setQuantity(1)
  }, [productId])

  const increment = () => setQuantity(q => Math.min(q + 1, product?.stock_quantity ?? 1))
  const decrement = () => setQuantity(q => Math.max(1, q - 1))

  const addToCartMutation = useMutation(
    ({ productId, quantity }: { productId: number; quantity: number }) =>
      api.addToCart(productId, quantity),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cart')
        toast.success(t('common.addedToCart'))
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'Failed to add to cart')
      },
    }
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pdp.productNotFound')}</h2>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error(t('common.pleaseLoginToAddToCart'))
      return
    }
    addToCartMutation.mutate({ productId: product.id, quantity })
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-primary-600 hover:text-primary-700">{t('pdp.home')}</Link>
          </li>
          <li><ChevronRight size={14} /></li>
          <li>
            <Link href="/products" className="text-primary-600 hover:text-primary-700">{t('pdp.products')}</Link>
          </li>
          {product.category && (
            <>
              <li><ChevronRight size={14} /></li>
              <li>
                <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="text-primary-600 hover:text-primary-700">
                  {product.category}
                </Link>
              </li>
            </>
          )}
          <li><ChevronRight size={14} /></li>
          <li className="text-gray-800 font-medium" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative w-full aspect-square">
          <Image
            src={product.image_url || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{localizeProductName(product, locale)}</h1>
          {product.category && (
            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-4">
              {product.category}
            </span>
          )}

          <p className="text-2xl text-primary-600 font-semibold mb-4">{new Intl.NumberFormat(locale === 'es' ? 'es-ES' : locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US', { style: 'currency', currency: (locale === 'ja' ? 'JPY' : locale === 'zh' ? 'CNY' : 'USD') }).format(product.price)}</p>

          <p className="text-gray-700 mb-6 whitespace-pre-line">{localizeProductDescription(product, locale)}</p>

          <div className="flex items-center space-x-4 mb-6">
            {/* Quantity selector */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={decrement}
                disabled={quantity <= 1}
                className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                aria-label={t('pdp.decreaseQty')}
              >
                <Minus size={16} />
              </button>
              <span className="px-4 select-none min-w-[2rem] text-center">{quantity}</span>
              <button
                onClick={increment}
                disabled={(product.stock_quantity ?? 0) <= quantity}
                className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                aria-label={t('pdp.increaseQty')}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              data-testid="pdp-add-to-cart"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isLoading || product.stock_quantity <= 0}
              className="btn-primary disabled:opacity-50"
            >
              {product.stock_quantity > 0 ? (addToCartMutation.isLoading ? t('common.adding') : t('common.addToCart')) : t('common.outOfStock')}
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <p>{t('pdp.stock')}: {product.stock_quantity}</p>
            <p>{t('pdp.sku')}: PROD-{product.id}</p>
            <p>{t('pdp.returns')}: {t('pdp.returnsPolicy')}</p>
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">{t('pdp.relatedProducts')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
