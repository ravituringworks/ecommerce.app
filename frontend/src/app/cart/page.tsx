'use client'

import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api } from '@/lib/api'
import { CartItem } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/hooks/useI18n'

export default function CartPage() {
  const { isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { t, locale } = useI18n()
  
  const currency = locale === 'ja' ? 'JPY' : locale === 'zh' ? 'CNY' : 'USD'
  const fmt = new Intl.NumberFormat(
    locale === 'es' ? 'es-ES' : locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US',
    { style: 'currency', currency }
  )
  
  const { data: cartItems, isLoading } = useQuery<CartItem[]>(
    'cart',
    api.getCart,
    {
      enabled: isAuthenticated,
    }
  )

  const removeItemMutation = useMutation(api.removeFromCart, {
    onSuccess: () => {
      queryClient.invalidateQueries('cart')
      toast.success(t('cart.itemRemoved'))
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || t('cart.removeFailed'))
    },
  })

  const updateQuantityMutation = useMutation(
    ({ productId, quantity }: { productId: number; quantity: number }) =>
      api.addToCart(productId, quantity - (cartItems?.find(item => item.product_id === productId)?.quantity || 0)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cart')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || t('cart.updateFailed'))
      },
    }
  )

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('cart.pleaseLoginToView')}</h2>
        <Link href="/login" className="btn-primary">
          {t('cart.login')}
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

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('cart.emptyTitle')}</h2>
        <p className="text-gray-600 mb-8">{t('cart.emptySubtitle')}</p>
        <Link href="/products" className="btn-primary">
          {t('cart.continueShopping')}
        </Link>
      </div>
    )
  }

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantityMutation.mutate({ productId, quantity: newQuantity })
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="card flex items-center space-x-4">
              <div className="w-20 h-20 relative">
                <Image
                  src={item.product.image_url || '/placeholder-product.jpg'}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded"
                  sizes="80px"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                <p className="text-gray-600">{fmt.format(item.product.price)}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                
                <span className="w-12 text-center font-medium">{item.quantity}</span>
                
                <button
                  onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="text-right">
                <p className="font-semibold">
                  {fmt.format(item.product.price * item.quantity)}
                </p>
                
                <button
                  onClick={() => removeItemMutation.mutate(item.id)}
                  className="text-red-500 hover:text-red-700 mt-2"
                  disabled={removeItemMutation.isLoading}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h3 className="text-xl font-semibold mb-4">{t('cart.orderSummary')}</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}:</span>
                <span>{fmt.format(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.shipping')}:</span>
                <span>{t('cart.free')}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>{t('cart.total')}:</span>
                <span>{fmt.format(totalAmount)}</span>
              </div>
            </div>
            
            <button
              data-testid="proceed-to-checkout"
              onClick={handleCheckout}
              className="w-full btn-primary"
            >
              {t('cart.proceedToCheckout')}
            </button>
            
            <Link 
              href="/products"
              className="block text-center text-primary-600 hover:text-primary-700 mt-4"
            >
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
