'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { api } from '@/lib/api'
import { CartItem } from '@/types'
import { useAuthStore } from '@/store/authStore'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import MockPaymentForm from '@/components/MockPaymentForm'
import StripePaymentForm from '@/components/StripePaymentForm'
import { useI18n } from '@/hooks/useI18n'

interface CheckoutForm {
  shipping_address: string
}

export default function CheckoutPage() {
  const { isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>('shipping')
  const [orderId, setOrderId] = useState<number | null>(null)
  const [clientSecret, setClientSecret] = useState<string>('')
  const paymentMode = process.env.NEXT_PUBLIC_PAYMENT_MODE || 'mock'
  // Keep a snapshot of the cart at the time the order is created, so
  // we can still show an accurate summary even after the cart is cleared.
  const [cartSnapshot, setCartSnapshot] = useState<CartItem[] | null>(null)
  
  const { data: cartItems, isLoading } = useQuery<CartItem[]>(
    'cart',
    api.getCart,
    {
      enabled: isAuthenticated,
    }
  )
  const { locale } = useI18n()
  const currency = useMemo(() => (locale === 'ja' ? 'JPY' : locale === 'zh' ? 'CNY' : 'USD'), [locale])
  const fmt = useMemo(() => new Intl.NumberFormat(
    locale === 'es' ? 'es-ES' : locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US',
    { style: 'currency', currency }
  ), [locale, currency])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>()


  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to checkout</h2>
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

  // Only redirect to cart if we're still on the shipping step and no items
  if ((!cartItems || cartItems.length === 0) && currentStep === 'shipping' && !orderId) {
    router.push('/cart')
    return null
  }

  const itemsForSummary = (cartSnapshot ?? cartItems ?? [])
  const totalAmount = itemsForSummary.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true)
    try {
      if (!cartItems || cartItems.length === 0) {
        toast.error('Your cart is empty')
        return
      }
      // First create the order
      // Snapshot the cart so summary remains stable even if cart is cleared after payment
      setCartSnapshot([...cartItems])

      const orderData = {
        total_amount: totalAmount,
        shipping_address: data.shipping_address,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      }
      
      const order = await api.createOrder(orderData)
      setOrderId(order.id)
      
      if (paymentMode === 'stripe') {
        // Create payment intent via backend
        const paymentIntent = await api.createPaymentIntent(order.id)
        setClientSecret(paymentIntent.client_secret)
        setCurrentStep('payment')
      } else {
        // Mock mode
        setCurrentStep('payment')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = (orderId: number) => {
    queryClient.invalidateQueries('cart')
    queryClient.invalidateQueries('orders')
    router.push(`/checkout/confirmation?orderId=${orderId}`)
  }

  const handlePaymentError = (error: string) => {
    toast.error(error)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        <div className={`flex items-center ${currentStep === 'shipping' ? 'text-primary-600' : 'text-green-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'shipping' ? 'bg-primary-600 text-white' : 'bg-green-600 text-white'}`}>
            {currentStep === 'payment' ? '✓' : '1'}
          </div>
          <span className="ml-2 font-medium">Shipping</span>
        </div>
        <div className="flex-1 h-1 mx-4 bg-gray-200">
          <div className={`h-full ${currentStep === 'payment' ? 'bg-green-600' : 'bg-gray-200'} transition-all duration-300`}></div>
        </div>
        <div className={`flex items-center ${currentStep === 'payment' ? 'text-primary-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
            2
          </div>
          <span className="ml-2 font-medium">Payment</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          {currentStep === 'shipping' ? (
            <>
              <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Address *
                  </label>
                  <textarea
                    {...register('shipping_address', {
                      required: 'Shipping address is required',
                      minLength: {
                        value: 10,
                        message: 'Please provide a complete address',
                      },
                    })}
                    rows={4}
                    className="input-field"
                    placeholder="Enter your complete shipping address"
                  />
                  {errors.shipping_address && (
                    <p className="text-red-500 text-sm mt-1">{errors.shipping_address.message}</p>
                  )}
                </div>
                
                <button
                  data-testid="continue-to-payment"
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
              
              {orderId && paymentMode === 'mock' && (
                <MockPaymentForm
                  orderId={orderId}
                  totalAmount={totalAmount}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}

              {orderId && paymentMode === 'stripe' && clientSecret && (
                <StripePaymentForm
                  clientSecret={clientSecret}
                  orderId={orderId}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}
              
              <button
                onClick={() => setCurrentStep('shipping')}
                className="w-full btn-secondary mt-4"
              >
                Back to Shipping
              </button>
            </>
          )}
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {itemsForSummary.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="w-16 h-16 relative">
                  <Image
                    src={item.product.image_url || '/placeholder-product.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded"
                    sizes="64px"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">
                    {fmt.format(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <hr className="my-4" />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{fmt.format(totalAmount)}</span>
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
              <span>{fmt.format(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
