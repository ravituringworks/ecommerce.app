import { usePathname } from 'next/navigation'
import { en } from '@/i18n/locales/en'
import { es } from '@/i18n/locales/es'
import { zh } from '@/i18n/locales/zh'
import { ja } from '@/i18n/locales/ja'

const dict = { en, es, zh, ja }

export function useI18n() {
  const pathname = usePathname()
  const locale = (() => {
    const seg = pathname?.split('/')?.[1]
    if (seg && ['en','es','zh','ja'].includes(seg)) return seg as 'en' | 'es' | 'zh' | 'ja'
    if (typeof document !== 'undefined') {
      const m = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/)
      const c = m?.[1]
      if (c && ['en','es','zh','ja'].includes(c)) return c as 'en' | 'es' | 'zh' | 'ja'
    }
    return 'en'
  })()

  const t = <K extends keyof typeof en>(key: K | `${string}.${string}`): any => {
    const parts = String(key).split('.')
    let curr: any = dict[locale]
    for (const p of parts) {
      curr = curr?.[p]
      if (curr === undefined) return key
    }
    return curr
  }

  return { t, locale }
}
