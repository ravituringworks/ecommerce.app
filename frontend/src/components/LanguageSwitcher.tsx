"use client"

import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const switchTo = (locale: string) => {
    // Cookie-based locale switch; strip any existing prefix
    document.cookie = `NEXT_LOCALE=${locale}; path=/`;
    const locales = ['en','es','zh','ja']
    const segments = (pathname || '/').split('/')
    if (segments.length > 1 && locales.includes(segments[1])) {
      segments.splice(1, 1) // remove existing prefix
    }
    const nextPath = segments.join('/') || '/'
    // Full refresh to ensure SSR and currency/UI update immediately
    window.location.assign(nextPath)
  }

  return (
    <div className="relative">
      <details className="group">
        <summary className="list-none px-3 py-2 rounded-md text-sm font-medium bg-primary-50 dark:bg-gray-800 text-primary-700 dark:text-gray-100 hover:bg-primary-100 dark:hover:bg-gray-700 cursor-pointer">
          Language
        </summary>
        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 z-20">
          {['en','es','zh','ja'].map(code => (
            <button
              key={code}
              type="button"
              onClick={() => switchTo(code)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-primary-50 dark:hover:bg-gray-700"
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </details>
    </div>
  )
}
