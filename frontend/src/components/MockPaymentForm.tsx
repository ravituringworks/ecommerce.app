'use client'

import { useState, useMemo } from 'react'
import { CreditCard, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useI18n } from '@/hooks/useI18n'

interface MockPaymentFormProps {
  orderId: number
  totalAmount: number
  onSuccess: (orderId: number) => void
  onError: (error: string) => void
}

export default function MockPaymentForm({ orderId, totalAmount, onSuccess, onError }: MockPaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const { locale } = useI18n()
  const currency = useMemo(() => (locale === 'ja' ? 'JPY' : locale === 'zh' ? 'CNY' : 'USD'), [locale])
  const fmt = useMemo(() => new Intl.NumberFormat(
    locale === 'es' ? 'es-ES' : locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US',
    { style: 'currency', currency }
  ), [locale, currency])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!cardNumber || !expiry || !cvc || !name) {
      toast.error('Please fill in all card details')
      return
    }

    setLoading(true)
    
    try {
      // Call the mock payment API
      const result = await api.mockPayment(orderId, cardNumber)
      
      if (result.status === 'succeeded') {
        onSuccess(orderId)
        toast.success(result.message)
      } else {
        onError(result.message)
        toast.error(result.message)
      }
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Payment failed'
      onError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Lock className="text-blue-500 mr-2" size={20} />
          <div>
            <h3 className="text-blue-800 font-semibold">Demo Payment Mode</h3>
            <p className="text-blue-600 text-sm">Use card number starting with 4 for successful payment</p>
            <p className="text-blue-600 text-sm">Example: 4242 4242 4242 4242</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CreditCard className="inline mr-1" size={16} />
            Card Number
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            className="input-field"
            maxLength={19}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              className="input-field"
              maxLength={5}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
              placeholder="123"
              className="input-field"
              maxLength={4}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="input-field"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Amount:</span>
            <span className="text-2xl font-bold text-primary-600">{fmt.format(totalAmount)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 py-3"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </div>
          ) : (
            `Pay ${fmt.format(totalAmount)}`
          )}
        </button>
      </form>
    </div>
  )
}
