export type Locale = 'en' | 'es' | 'zh' | 'ja'

// Localized product content by product ID
const productLocales: Record<Locale, Record<number, { name?: string; description?: string }>> = {
  en: {
    1: { name: 'Wireless Headphones', description: 'High-quality wireless headphones with noise cancellation' },
    2: { name: 'Smartphone', description: 'Latest model smartphone with advanced features' },
    3: { name: 'Coffee Maker', description: 'Premium coffee maker for the perfect brew' },
    4: { name: 'Laptop Backpack', description: 'Durable laptop backpack with multiple compartments' },
    5: { name: 'Fitness Tracker', description: 'Advanced fitness tracker with heart rate monitor' },
    6: { name: 'Desk Lamp', description: 'Modern LED desk lamp with adjustable brightness' },
  },
  es: {
    1: { name: 'Auriculares Inalámbricos', description: 'Auriculares inalámbricos de alta calidad con cancelación de ruido' },
    2: { name: 'Teléfono Inteligente', description: 'Último modelo de smartphone con funciones avanzadas' },
    3: { name: 'Cafetera', description: 'Cafetera premium para el café perfecto' },
    4: { name: 'Mochila para Portátil', description: 'Mochila duradera con múltiples compartimentos' },
    5: { name: 'Rastreador de Actividad', description: 'Pulsera avanzada con monitor de ritmo cardíaco' },
    6: { name: 'Lámpara de Escritorio', description: 'Lámpara LED moderna con brillo ajustable' },
  },
  zh: {
    1: { name: '无线耳机', description: '高品质无线耳机，支持降噪功能' },
    2: { name: '智能手机', description: '最新款智能手机，功能强大' },
    3: { name: '咖啡机', description: '高端咖啡机，打造完美咖啡' },
    4: { name: '笔记本电脑背包', description: '耐用多隔层笔记本电脑背包' },
    5: { name: '健身手环', description: '高级健身手环，支持心率监测' },
    6: { name: '台灯', description: '现代LED台灯，亮度可调' },
  },
  ja: {
    1: { name: 'ワイヤレスヘッドホン', description: '高品質のノイズキャンセリング搭載ワイヤレスヘッドホン' },
    2: { name: 'スマートフォン', description: '最新モデルの高機能スマートフォン' },
    3: { name: 'コーヒーメーカー', description: '理想の一杯を淹れるプレミアムコーヒーメーカー' },
    4: { name: 'ノートPC用バックパック', description: '丈夫で収納力の高いバックパック' },
    5: { name: 'フィットネストラッカー', description: '心拍数測定対応の高機能トラッカー' },
    6: { name: 'デスクランプ', description: '明るさ調整が可能なモダンLEDデスクランプ' },
  },
}

export function localizeProductName(product: { id?: number; name: string }, locale: Locale) {
  const id = product.id ?? 0
  const override = productLocales[locale]?.[id]?.name
  return override || product.name
}

export function localizeProductDescription(product: { id?: number; description?: string }, locale: Locale) {
  const id = product.id ?? 0
  const override = productLocales[locale]?.[id]?.description
  return override || product.description || ''
}