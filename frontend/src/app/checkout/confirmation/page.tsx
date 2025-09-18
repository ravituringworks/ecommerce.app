'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import { Order } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { CheckCircle, Package, Home } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuthStore()
  const { locale } = useI18n()
  const currency = (locale === 'ja' ? 'JPY' : locale === 'zh' ? 'CNY' : 'USD')
  const fmt = new Intl.NumberFormat(
    locale === 'es' ? 'es-ES' : locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US',
    { style: 'currency', currency }
  )

  const orderIdParam = searchParams?.get('orderId')
  const orderId = orderIdParam ? parseInt(orderIdParam, 10) : NaN

  const { data: order, isLoading, error } = useQuery<Order>(
    ['order', orderId],
    () => api.getOrder(orderId),
    { enabled: isAuthenticated && !isNaN(orderId) }
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your order confirmation</h2>
        <Link href="/login" className="btn-primary">Login</Link>
      </div>
    )
  }

  if (!orderIdParam || isNaN(orderId)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-2">Missing order information</h2>
        <p className="text-gray-600 mb-6">We couldn't find an order to confirm.</p>
        <Link href="/" className="btn-primary">Go Home</Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-2">Order not found</h2>
        <p className="text-gray-600 mb-6">Please check your orders list.</p>
        <Link href="/orders" className="btn-primary">View My Orders</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <div className="flex items-start md:items-center md:space-x-4">
          <CheckCircle className="text-green-500 flex-shrink-0" size={40} />
          <div className="mt-2 md:mt-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payment Successful!</h1>
            <p className="text-gray-600 mt-1">Thank you for your purchase. Your order has been confirmed.</p>
            <p className="text-gray-800 font-medium mt-2">Order #{order.id}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div data-testid="order-summary">
            <h2 className="font-semibold mb-2">Order Summary</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Items</span><span>{order.order_items?.length || 0}</span></div>
              <div className="flex justify-between"><span>Total</span><span className="font-semibold">{fmt.format(order.total_amount)}</span></div>
              <div className="flex justify-between"><span>Status</span><span className="capitalize">{order.status}</span></div>
              <div className="flex justify-between"><span>Payment</span><span className="capitalize">{order.payment_status}</span></div>
            </div>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Shipping Address</h2>
            <p className="text-sm whitespace-pre-line text-gray-700">{order.shipping_address}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href={`/orders/${order.id}`} className="btn-primary flex items-center justify-center">
            <Package size={16} className="mr-2" /> View Order Details
          </Link>
          <Link href="/orders" className="btn-secondary flex items-center justify-center">
            My Orders
          </Link>
          <Link href="/" className="btn-secondary flex items-center justify-center">
            <Home size={16} className="mr-2" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
