'use client'

import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'
import { useI18n } from '@/hooks/useI18n'

export default function HomeClient() {
  const { t } = useI18n()
  const { data: products, isLoading, error } = useQuery<Product[]>(
    'products',
    () => api.getProducts()
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('common.errorLoadingProducts')}</h2>
        <p className="text-gray-600">{t('common.pleaseTryAgainLater')}</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products?.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('common.noProductsFound')}</h2>
          <p className="text-gray-600">{t('common.checkBackLater')}</p>
        </div>
      )}
    </>
  )
}