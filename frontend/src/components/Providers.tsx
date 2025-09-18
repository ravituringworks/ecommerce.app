'use client'

import { QueryClient, QueryClientProvider } from 'react-query'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useI18n } from '@/hooks/useI18n'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const { locale } = useI18n()

  useEffect(() => {
    initializeAuth()
    setMounted(true)
  }, [initializeAuth])

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('lang', locale)
    }
  }, [mounted, locale])

  if (!mounted) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}
