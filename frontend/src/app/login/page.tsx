'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/store/authStore'
import { useI18n } from '@/hooks/useI18n'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const { t } = useI18n()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      router.push('/')
    } catch (error) {
      // Error is handled in the store
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('login.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('login.or')}{' '}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
              {t('login.createAccountCta')}
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                {t('login.emailPlaceholder')}
              </label>
              <input
                {...register('email', {
                  required: t('register.errors.emailRequired'),
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: t('register.errors.emailInvalid'),
                  },
                })}
                type="email"
                className="input-field"
                placeholder={t('login.emailPlaceholder')}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{String(errors.email.message)}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">
                {t('login.passwordPlaceholder')}
              </label>
              <input
                {...register('password', {
                  required: t('register.errors.passwordRequired'),
                  minLength: {
                    value: 6,
                    message: t('register.errors.passwordMin'),
                  },
                })}
                type="password"
                className="input-field"
                placeholder={t('login.passwordPlaceholder')}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{String(errors.password.message)}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? t('login.signingIn') : t('login.signIn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
