import axios, { AxiosResponse } from 'axios'
import { Product, User, CartItem, Order } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`
    }
    // Attach locale as Accept-Language from cookie if available
    if (typeof document !== 'undefined') {
      const m = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/)
      const locale = m?.[1]
      if (locale && ['en','es','zh','ja'].includes(locale)) {
        (config.headers as any)['Accept-Language'] = locale
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response: AxiosResponse = await apiClient.post('/api/auth/login', {
      email,
      password,
    })
    return response.data
  },

  register: async (name: string, email: string, password: string) => {
    const response: AxiosResponse<User> = await apiClient.post('/api/auth/register', {
      name,
      email,
      password,
    })
    return response.data
  },

  // Products
  getProducts: async (skip = 0, limit = 20): Promise<Product[]> => {
    const response: AxiosResponse<Product[]> = await apiClient.get(
      `/api/products?skip=${skip}&limit=${limit}`
    )
    return response.data
  },

  getProduct: async (id: number): Promise<Product> => {
    const response: AxiosResponse<Product> = await apiClient.get(`/api/products/${id}`)
    return response.data
  },

  createProduct: async (product: Omit<Product, 'id' | 'created_at' | 'is_active'>): Promise<Product> => {
    const response: AxiosResponse<Product> = await apiClient.post('/api/products', product)
    return response.data
  },

  // Cart
  getCart: async (): Promise<CartItem[]> => {
    const response: AxiosResponse<CartItem[]> = await apiClient.get('/api/cart')
    return response.data
  },

  addToCart: async (productId: number, quantity: number): Promise<CartItem> => {
    const response: AxiosResponse<CartItem> = await apiClient.post('/api/cart', {
      product_id: productId,
      quantity,
    })
    return response.data
  },

  removeFromCart: async (itemId: number): Promise<void> => {
    await apiClient.delete(`/api/cart/${itemId}`)
  },

  // Orders
  createOrder: async (orderData: {
    total_amount: number
    shipping_address: string
    items: Array<{
      product_id: number
      quantity: number
      price: number
    }>
  }): Promise<Order> => {
    const response: AxiosResponse<Order> = await apiClient.post('/api/orders', orderData)
    return response.data
  },

  getOrders: async (): Promise<Order[]> => {
    const response: AxiosResponse<Order[]> = await apiClient.get('/api/orders')
    return response.data
  },

  getOrder: async (id: number): Promise<Order> => {
    const response: AxiosResponse<Order> = await apiClient.get(`/api/orders/${id}`)
    return response.data
  },

  // Payment methods
  createPaymentIntent: async (orderId: number): Promise<{client_secret: string, payment_intent_id: string}> => {
    const response: AxiosResponse<{client_secret: string, payment_intent_id: string}> = await apiClient.post('/api/create-payment-intent', {
      order_id: orderId
    })
    return response.data
  },

  confirmPayment: async (paymentIntentId: string): Promise<{order_id: number, payment_status: string, order_status: string}> => {
    const response: AxiosResponse<{order_id: number, payment_status: string, order_status: string}> = await apiClient.post('/api/confirm-payment', {
      payment_intent_id: paymentIntentId
    })
    return response.data
  },

  // Mock payment for demo
  mockPayment: async (orderId: number, cardNumber: string): Promise<{status: string, order_id?: number, message: string}> => {
    const response: AxiosResponse<{status: string, order_id?: number, message: string}> = await apiClient.post('/api/mock-payment', {
      order_id: orderId,
      card_number: cardNumber
    })
    return response.data
  },
}
