import HomeClient from './HomeClient'

export default async function Home() {
  const { getServerLocale, getDictionary } = await import('@/i18n/server')
  const locale = getServerLocale()
  const dict = getDictionary(locale)

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {dict.home?.welcomeTitle || 'Welcome to Our Store'}
        </h1>
        <p className="text-xl text-gray-600">
          {dict.home?.welcomeSubtitle || 'Discover amazing products at great prices'}
        </p>
      </div>

      <HomeClient />
    </div>
  )
}
