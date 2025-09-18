import { NextRequest, NextResponse } from 'next/server'

const locales = ['en','es','zh','ja'] as const

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // If the path starts with a supported locale, ensure cookie NEXT_LOCALE matches
  const seg = pathname.split('/')[1]
  if (locales.includes(seg as any)) {
    const url = req.nextUrl.clone()
    // strip the locale prefix from the pathname so app routes resolve
    url.pathname = pathname.replace(/^\/(en|es|zh|ja)(?=\/|$)/, '') || '/'

    const res = NextResponse.redirect(url)
    res.headers.set('x-locale-mw', seg)
    const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value
    if (cookieLocale !== seg) {
      res.cookies.set('NEXT_LOCALE', seg, { path: '/' })
    }
    return res
  }

  // Otherwise, continue
  const res = NextResponse.next()
  res.headers.set('x-locale-mw', 'none')
  return res
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|api).*)'],
}
