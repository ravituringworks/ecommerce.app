export const ja = {
  nav: {
    products: '商品',
    profile: 'プロフィール',
    orders: '注文',
    logout: 'ログアウト',
    login: 'ログイン',
    signUp: '新規登録',
  },
  meta: {
    siteTitle: 'ShopSmart',
    siteDescription: 'Next.js と Python で構築したモダンなECストア',
    productWord: '商品',
    productFallbackDescription: (name?: string) => name ? `${name} をお得に購入。` : '商品の詳細を見てオンラインで購入。'
  },
  common: {
    errorLoadingProducts: '商品の読み込み中にエラーが発生しました',
    pleaseTryAgainLater: '後でもう一度お試しください。',
    noProductsFound: '商品が見つかりません',
    checkBackLater: '後で新しい商品をチェックしてください！',
    addedToCart: 'カートに追加しました！',
    pleaseLoginToAddToCart: 'カートに追加するにはログインしてください',
    outOfStock: '在庫切れ',
    addToCart: 'カートに入れる',
    adding: '追加中...'
  },
  home: {
    welcomeTitle: '私たちのストアへようこそ',
    welcomeSubtitle: 'お得な価格で素晴らしい商品を見つけよう',
  },
  products: {
    allProductsTitle: 'すべての商品',
    browseAll: '全コレクションを見る',
  },
  pdp: {
    productNotFound: '商品が見つかりません',
    home: 'ホーム',
    products: '商品',
    relatedProducts: '関連商品',
    stock: '在庫',
    sku: 'SKU',
    returns: '返品',
    returnsPolicy: '30日間返品可能',
    decreaseQty: '数量を減らす',
    increaseQty: '数量を増やす'
  },
  login: {
    title: 'アカウントにサインイン',
    createAccountCta: '新しいアカウントを作成',
    signIn: 'サインイン',
    signingIn: 'サインイン中...',
    emailPlaceholder: 'メールアドレス',
    passwordPlaceholder: 'パスワード',
    or: 'または',
  },
  register: {
    title: 'アカウントを作成',
    signInCta: '既存のアカウントにサインイン',
    createAccount: 'アカウント作成',
    creatingAccount: 'アカウント作成中...',
    namePlaceholder: '氏名',
    emailPlaceholder: 'メールアドレス',
    passwordPlaceholder: 'パスワード',
    confirmPasswordPlaceholder: 'パスワード（確認）',
    errors: {
      nameRequired: '氏名は必須です',
      nameMin: '氏名は2文字以上で入力してください',
      emailRequired: 'メールは必須です',
      emailInvalid: '有効なメールアドレスを入力してください',
      passwordRequired: 'パスワードは必須です',
      passwordMin: 'パスワードは6文字以上で入力してください',
      confirmPasswordRequired: 'パスワードを確認してください',
      passwordsDontMatch: 'パスワードが一致しません'
    }
  },
  cart: {
    pleaseLoginToView: 'カートを見るにはログインしてください',
    login: 'ログイン',
    emptyTitle: 'カートは空です',
    emptySubtitle: '商品を追加してみましょう！',
    continueShopping: '買い物を続ける',
    orderSummary: '注文概要',
    subtotal: '小計',
    shipping: '配送',
    free: '無料',
    total: '合計',
    proceedToCheckout: 'レジに進む',
    itemRemoved: 'カートから削除しました',
    removeFailed: '削除に失敗しました',
    updateFailed: '数量の更新に失敗しました'
  },
  orders: {
    pleaseLoginToView: '注文を見るにはログインしてください',
    login: 'ログイン',
    noOrdersTitle: '注文はまだありません',
    noOrdersSubtitle: '注文すると、ここに表示されます。',
    startShopping: '買い物を始める',
    yourOrders: 'あなたの注文',
    viewDetails: '詳細を見る',
    shippingAddress: '配送先住所',
    items: '商品',
    status: {
      pending: '保留中',
      confirmed: '確認済み',
      shipped: '発送済み',
      delivered: '配達済み',
      cancelled: 'キャンセル'
    }
  }
} as const
