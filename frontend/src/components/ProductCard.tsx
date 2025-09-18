'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { ShoppingCart } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { useI18n } from '@/hooks/useI18n'
import { localizeProductName, localizeProductDescription } from '@/i18n/productContent'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()
  const { t, locale } = useI18n()
  const name = localizeProductName(product, locale)
  const desc = localizeProductDescription(product, locale)

  const currency = locale === 'ja' ? 'JPY' : locale === 'zh' ? 'CNY' : 'USD'
  const fmt = new Intl.NumberFormat(
    locale === 'es' ? 'es-ES' : locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US',
    { style: 'currency', currency }
  )

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

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error(t('common.pleaseLoginToAddToCart'))
      return
    }
    addToCartMutation.mutate({ productId: product.id, quantity: 1 })
  }

  return (
    <div className="card group cursor-pointer transition-all duration-300 hover:shadow-lg">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
          <Image
            src={product.image_url || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </Link>

      <div className="space-y-2">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg text-gray-800 group-hover:text-primary-600 transition-colors">
            {name}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {desc}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            {fmt.format(product.price)}
          </span>
          
          {product.stock_quantity > 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={addToCartMutation.isLoading}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <ShoppingCart size={16} />
              <span>
                {addToCartMutation.isLoading ? t('common.adding') : t('common.addToCart')}
              </span>
            </button>
          ) : (
            <span className="text-red-500 font-medium">{t('common.outOfStock')}</span>
          )}
        </div>
        
        {product.category && (
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        )}
      </div>
    </div>
  )
}
