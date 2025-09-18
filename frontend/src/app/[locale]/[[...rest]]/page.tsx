import { redirect } from 'next/navigation'

export default function LocaleRedirectPage({ params }: { params: { locale: string; rest?: string[] } }) {
  const rest = params.rest?.join('/') || ''
  const target = '/' + rest
  redirect(target)
}