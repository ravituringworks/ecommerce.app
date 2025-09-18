export interface User {
  id: number
  email: string
  name: string
  created_at: string
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  image_url?: string
  category?: string
  stock_quantity: number
  is_active: boolean
  created_at: string
}

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  product: Product
  created_at: string
}

export interface OrderItem {
  id: number
  product_id: number
  quantity: number
  price: number
  product: Product
}

export interface Order {
  id: number
  user_id: number
  total_amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'succeeded' | 'failed' | 'canceled'
  payment_intent_id?: string
  shipping_address: string
  order_items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}
