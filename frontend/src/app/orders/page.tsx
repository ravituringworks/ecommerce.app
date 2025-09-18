'use client'

import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import { Order } from '@/types'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import { Package, Calendar } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore()
  const { t } = useI18n()
  
  const { data: orders, isLoading, error } = useQuery<Order[]>(
    'orders',
    api.getOrders,
    {
      enabled: isAuthenticated,
    }
  )

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('orders.pleaseLoginToView')}</h2>
        <Link href="/login" className="btn-primary">
          {t('orders.login')}
        </Link>
      </div>
    )
  }

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

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('orders.noOrdersTitle')}</h2>
        <p className="text-gray-600 mb-8">{t('orders.noOrdersSubtitle')}</p>
        <Link href="/products" className="btn-primary">
          {t('orders.startShopping')}
        </Link>
      </div>
    )
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const { locale } = useI18n()
  const currency = locale === 'ja' ? 'JPY' : locale === 'zh' ? 'CNY' : 'USD'
  const fmt = new Intl.NumberFormat(locale === 'es' ? 'es-ES' : locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US', { style: 'currency', currency })

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('orders.yourOrders')}</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <Calendar size={16} className="mr-1" />
                  {new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(order.created_at))}
                </div>
              </div>
              
              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                    order.status
                  )}`}
                >
                  {t(`orders.status.${order.status}` as any)}
                </span>
                <div className="text-lg font-semibold mt-1">
                  {fmt.format(order.total_amount)}
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-gray-600 text-sm mb-3">
                <strong>{t('orders.shippingAddress')}:</strong> {order.shipping_address}
              </p>
              
              {order.order_items && order.order_items.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">{t('orders.items')}:</h4>
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.product.name} x {item.quantity}
                        </span>
                        <span>{fmt.format(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-4">
                <Link 
                  href={`/orders/${order.id}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  {t('orders.viewDetails')}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
