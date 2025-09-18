'use client'

import { useQuery } from 'react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Order } from '@/types'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import { Package, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { useI18n } from '@/hooks/useI18n'

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { isAuthenticated } = useAuthStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const { locale } = useI18n()
  const currency = useMemo(() => (locale === 'ja' ? 'JPY' : locale === 'zh' ? 'CNY' : 'USD'), [locale])
  const fmt = useMemo(() => new Intl.NumberFormat(
    locale === 'es' ? 'es-ES' : locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US',
    { style: 'currency', currency }
  ), [locale, currency])
  
  const orderId = parseInt(params.id)
  
  useEffect(() => {
    if (searchParams?.get('payment') === 'success') {
      setShowPaymentSuccess(true)
      // Remove the payment parameter from URL after 3 seconds
      setTimeout(() => {
        router.replace(`/orders/${orderId}`)
        setShowPaymentSuccess(false)
      }, 5000)
    }
  }, [searchParams, router, orderId])
  
  const { data: order, isLoading, error } = useQuery<Order>(
    ['order', orderId],
    () => api.getOrder(orderId),
    {
      enabled: isAuthenticated && !isNaN(orderId),
    }
  )

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view order details</h2>
        <Link href="/login" className="btn-primary">
          Login
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

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order not found</h2>
        <p className="text-gray-600 mb-8">The order you're looking for doesn't exist or you don't have access to it.</p>
        <Link href="/orders" className="btn-primary">
          View All Orders
        </Link>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />
      case 'confirmed':
        return <CheckCircle className="text-green-500" size={20} />
      case 'shipped':
        return <Package className="text-blue-500" size={20} />
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />
      default:
        return <Clock className="text-gray-500" size={20} />
    }
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'succeeded':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Paid</span>
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Pending</span>
      case 'failed':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">Failed</span>
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">Unknown</span>
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {showPaymentSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-3" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-green-800">Payment Successful!</h3>
              <p className="text-green-600">Your order has been confirmed and payment was processed successfully.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Order #{order.id}</h1>
        <Link href="/orders" className="text-primary-600 hover:text-primary-700">
          ← Back to Orders
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Order Information</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium text-2xl">{fmt.format(order.total_amount)}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <span className="font-medium capitalize">{order.status}</span>
              </div>
              {getPaymentStatusBadge(order.payment_status)}
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Shipping Address</p>
              <p className="whitespace-pre-line">{order.shipping_address}</p>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            
            <div className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">Price: {fmt.format(item.price)} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{fmt.format(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{fmt.format(order.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{fmt.format(0)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>{fmt.format(order.total_amount)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link href="/products" className="block w-full btn-primary text-center">
                Continue Shopping
              </Link>
              
              {order.payment_status === 'failed' && (
                <button className="w-full btn-secondary">
                  Retry Payment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
