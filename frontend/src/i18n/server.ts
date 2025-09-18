import { cookies } from 'next/headers'
import { en } from '@/i18n/locales/en'
import { es } from '@/i18n/locales/es'
import { zh } from '@/i18n/locales/zh'
import { ja } from '@/i18n/locales/ja'

export type Locale = 'en' | 'es' | 'zh' | 'ja'

const dict = { en, es, zh, ja }

export function getServerLocale(): Locale {
  const c = cookies()
  const cookieLocale = c.get('NEXT_LOCALE')?.value as Locale | undefined
  if (cookieLocale && (['en','es','zh','ja'] as const).includes(cookieLocale)) return cookieLocale
  return 'en'
}

export function getDictionary(locale: Locale) {
  return dict[locale]
}
