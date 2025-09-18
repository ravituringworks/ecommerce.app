'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useI18n } from '@/hooks/useI18n'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { t } = useI18n()
  
  const { data: cartItems } = useQuery(
    'cart',
    api.getCart,
    {
      enabled: isAuthenticated,
    }
  )

  const cartItemsCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            ShopSmart
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/products" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400">
              {t('nav.products')}
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  href="/cart" 
                  className="relative text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <ShoppingCart size={24} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400">
                    <User size={20} />
                    <span>{user?.name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
>
                      {t('nav.profile')}
                    </Link>
                    <Link 
                      href="/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
>
                      {t('nav.orders')}
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-primary-600">
                  {t('nav.login')}
                </Link>
                <Link href="/register" className="btn-primary">
                  {t('nav.signUp')}
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 ml-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
