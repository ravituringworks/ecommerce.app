'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/store/authStore'
import { useI18n } from '@/hooks/useI18n'

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const register_user = useAuthStore((state) => state.register)
  const { t } = useI18n()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>()

  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    try {
      await register_user(data.name, data.email, data.password)
      router.push('/login')
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
            {t('register.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('login.or')}{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
              {t('register.signInCta')}
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                {t('register.namePlaceholder')}
              </label>
              <input
                {...register('name', {
                  required: t('register.errors.nameRequired'),
                  minLength: {
                    value: 2,
                    message: t('register.errors.nameMin'),
                  },
                })}
                type="text"
                className="input-field"
                placeholder={t('register.namePlaceholder')}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{String(errors.name.message)}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                {t('register.emailPlaceholder')}
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
                placeholder={t('register.emailPlaceholder')}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{String(errors.email.message)}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">
                {t('register.passwordPlaceholder')}
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
                placeholder={t('register.passwordPlaceholder')}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{String(errors.password.message)}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                {t('register.confirmPasswordPlaceholder')}
              </label>
              <input
                {...register('confirmPassword', {
                  required: t('register.errors.confirmPasswordRequired'),
                  validate: (value) =>
                    value === password || t('register.errors.passwordsDontMatch'),
                })}
                type="password"
                className="input-field"
                placeholder={t('register.confirmPasswordPlaceholder')}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{String(errors.confirmPassword.message)}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? t('register.creatingAccount') : t('register.createAccount')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
